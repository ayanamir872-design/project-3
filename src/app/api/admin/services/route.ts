import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { authorizeAdmin, isAuthorizedAdmin } from '@/lib/adminAuth';
import {
  SERVICE_IMAGE_BUCKET,
  slugifyServiceName,
  validateServiceImage,
  validateServiceMutation,
} from '@/lib/serviceValidation';

const SERVICE_FIELDS = 'id,name,slug,short_description,description,image_url,price,currency,duration_minutes,category,is_active,sort_order,created_at,updated_at';

function errorMessage(error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && error.code === '23505') return 'A service with this slug already exists.';
  return 'Unable to save service.';
}

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

export async function GET(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  const url = new URL(request.url);
  const search = (url.searchParams.get('q') ?? '').trim().replace(/[%,()]/g, ' ').slice(0, 80);
  const active = url.searchParams.get('active');
  let query = auth.supabase.from('services').select(SERVICE_FIELDS, { count: 'exact' }).order('sort_order').order('created_at');

  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
  if (active === 'true' || active === 'false') query = query.eq('is_active', active === 'true');

  const { data, count, error } = await query;
  if (error) {
    console.error('Admin services lookup failed', error.message);
    return NextResponse.json({ error: 'Unable to load services.' }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], count: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const auth = await authorizeAdmin(request);
  if (!isAuthorizedAdmin(auth)) return auth;

  let uploadedPath: string | null = null;
  let insertedId: string | null = null;
  try {
    const { fields, image } = await readServiceRequest(request);
    if (!fields.slug && fields.name) fields.slug = slugifyServiceName(String(fields.name));
    const parsed = validateServiceMutation(fields);
    if (!parsed.ok) return NextResponse.json({ error: 'Invalid service.', details: parsed.details }, { status: 400 });

    const { data: inserted, error: insertError } = await auth.supabase.from('services').insert(parsed.value).select(SERVICE_FIELDS).single();
    if (insertError || !inserted) {
      if (insertError) console.error('Admin service insert failed', insertError.message);
      return NextResponse.json({ error: errorMessage(insertError) }, { status: insertError?.code === '23505' ? 409 : 500 });
    }

    insertedId = inserted.id;
    let service = inserted;
    if (image) {
      const uploaded = await uploadImage(auth.supabase, inserted.id, inserted.slug, image);
      uploadedPath = uploaded.path;
      const { data: updated, error: imageUpdateError } = await auth.supabase.from('services').update({ image_url: uploaded.url }).eq('id', inserted.id).select(SERVICE_FIELDS).single();
      if (imageUpdateError || !updated) throw new Error('Service image reference could not be saved.');
      service = updated;
    }

    await auth.supabase.from('audit_logs').insert({ actor_user_id: auth.user.id, action: 'create_service', entity: 'services', entity_id: service.id, metadata: { slug: service.slug } });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    if (uploadedPath) await auth.supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([uploadedPath]);
    if (insertedId) await auth.supabase.from('services').delete().eq('id', insertedId);
    console.error('Admin service create failed', error);
    const message = error instanceof Error ? error.message : '';
    const safeMessage = /^(Only JPEG, PNG, and WebP images are supported\.|Service images must be smaller than 5 MB\.|Service image upload failed\.|Service image reference could not be saved\.)$/.test(message)
      ? message
      : 'Unable to save service.';
    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
