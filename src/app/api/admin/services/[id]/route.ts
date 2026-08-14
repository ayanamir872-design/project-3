import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';
import {
  SERVICE_IMAGE_BUCKET,
  getServiceImagePath,
  slugifyServiceName,
  validateServiceImage,
  validateServiceMutation,
} from '@/lib/serviceValidation';

const SERVICE_FIELDS = 'id,name,slug,short_description,description,image_url,price,currency,duration_minutes,category,is_active,sort_order,created_at,updated_at';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function readServiceRequest(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const fields: Record<string, unknown> = {};
    let image: File | null = null;
    form.forEach((value, key) => {
      if (key === 'image' && value instanceof File) image = value;
      else if (typeof value === 'string') fields[key] = value;
    });
    return { fields, image };
  }
  const body = await request.json().catch(() => null);
  return { fields: body && typeof body === 'object' ? body as Record<string, unknown> : {}, image: null };
}

async function uploadImage(supabase: SupabaseClient, serviceId: string, slug: string, image: File) {
  const imageError = validateServiceImage(image);
  if (imageError) throw new Error(imageError);
  const extension = image.type === 'image/jpeg' ? 'jpg' : image.type.split('/')[1];
  const path = `${serviceId}/${Date.now()}-${slug}.${extension}`;
  const { error } = await supabase.storage.from(SERVICE_IMAGE_BUCKET).upload(path, image, {
    contentType: image.type,
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error('Service image upload failed.');
  const { data } = supabase.storage.from(SERVICE_IMAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function databaseError(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return { error: 'A service with this slug already exists.', status: 409 };
  return { error: 'Unable to update service.', status: 500 };
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: 'Invalid service ID.' }, { status: 400 });

  const { data, error } = await auth.supabase.from('services').select(SERVICE_FIELDS).eq('id', id).maybeSingle();
  if (error) return NextResponse.json({ error: 'Unable to load service.' }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
  return NextResponse.json({ service: data });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateService(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return updateService(request, context);
}

async function updateService(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: 'Invalid service ID.' }, { status: 400 });

  let uploadedPath: string | null = null;
  try {
    const { data: existing, error: existingError } = await auth.supabase.from('services').select(SERVICE_FIELDS).eq('id', id).maybeSingle();
    if (existingError) throw existingError;
    if (!existing) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });

    const { fields, image } = await readServiceRequest(request);
    if (!fields.slug && fields.name) fields.slug = slugifyServiceName(String(fields.name));
    const parsed = validateServiceMutation(fields, existing);
    if (!parsed.ok) return NextResponse.json({ error: 'Invalid service.', details: parsed.details }, { status: 400 });

    let nextValue = parsed.value;
    if (image) {
      const uploaded = await uploadImage(auth.supabase, id, nextValue.slug, image);
      uploadedPath = uploaded.path;
      nextValue = { ...nextValue, image_url: uploaded.url };
    }

    const { data: updated, error: updateError } = await auth.supabase.from('services').update(nextValue).eq('id', id).select(SERVICE_FIELDS).single();
    if (updateError || !updated) {
      if (updateError) console.error('Admin service update failed', updateError.message);
      if (uploadedPath) await auth.supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([uploadedPath]);
      const response = databaseError(updateError);
      return NextResponse.json({ error: response.error }, { status: response.status });
    }

    const previousPath = getServiceImagePath(existing.image_url);
    if (previousPath && previousPath !== getServiceImagePath(updated.image_url)) {
      const { error: removeError } = await auth.supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([previousPath]);
      if (removeError) console.warn('Previous service image cleanup failed', removeError.message);
    }

    await auth.supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'update_service', entity: 'services', entity_id: id, metadata: { slug: updated.slug } });
    return NextResponse.json({ service: updated });
  } catch (error) {
    if (uploadedPath) await auth.supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([uploadedPath]);
    console.error('Admin service update failed', error);
    const message = error instanceof Error ? error.message : '';
    const safeMessage = /^(Only JPEG, PNG, and WebP images are supported\.|Service images must be smaller than 5 MB\.|Service image upload failed\.|Service image reference could not be saved\.)$/.test(message)
      ? message
      : 'Unable to update service.';
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: 'Invalid service ID.' }, { status: 400 });

  const { data: existing, error: existingError } = await auth.supabase.from('services').select(SERVICE_FIELDS).eq('id', id).maybeSingle();
  if (existingError) return NextResponse.json({ error: 'Unable to load service.' }, { status: 500 });
  if (!existing) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });

  const { count, error: appointmentError } = await auth.supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('service_id', id);
  if (appointmentError) return NextResponse.json({ error: 'Unable to verify service references.' }, { status: 500 });

  if ((count ?? 0) > 0) {
    const { data: deactivated, error: deactivateError } = await auth.supabase.from('services').update({ is_active: false }).eq('id', id).select(SERVICE_FIELDS).single();
    if (deactivateError || !deactivated) return NextResponse.json({ error: 'Unable to deactivate referenced service.' }, { status: 500 });
    await auth.supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'deactivate_referenced_service', entity: 'services', entity_id: id, metadata: { appointment_count: count } });
    return NextResponse.json({ service: deactivated, deactivated: true, reason: 'referenced_by_appointments' }, { status: 409 });
  }

  const { error: deleteError } = await auth.supabase.from('services').delete().eq('id', id);
  if (deleteError) {
    const response = databaseError(deleteError);
    return NextResponse.json({ error: response.error }, { status: response.status });
  }

  const imagePath = getServiceImagePath(existing.image_url);
  if (imagePath) {
    const { error: removeError } = await auth.supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([imagePath]);
    if (removeError) console.warn('Deleted service image cleanup failed', removeError.message);
  }
  await auth.supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'delete_service', entity: 'services', entity_id: id });
  return NextResponse.json({ deleted: true, id });
}
