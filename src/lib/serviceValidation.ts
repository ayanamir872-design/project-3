export const SERVICE_IMAGE_BUCKET = 'service-images';
export const SERVICE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const SERVICE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type ServiceRecord = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string | null;
  price: number | null;
  currency: string;
  duration_minutes: number;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ServiceMutation = Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at'>;

export type ServiceValidationResult =
  | { ok: true; value: ServiceMutation }
  | { ok: false; details: string };

export function slugifyServiceName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function textValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function nullableTextValue(value: unknown, fallback: string | null = null) {
  if (value === null) return null;
  const text = textValue(value);
  return text || fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return fallback;
}

function numberValue(value: unknown, fallback: number | null) {
  if (value === null || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function integerValue(value: unknown, fallback: number) {
  const parsed = numberValue(value, fallback);
  return parsed === null ? fallback : Math.round(parsed);
}

export function validateServiceMutation(
  input: Record<string, unknown>,
  existing?: Partial<ServiceMutation>,
): ServiceValidationResult {
  const name = textValue(input.name ?? input.title, existing?.name ?? '');
  const slug = textValue(input.slug, existing?.slug ?? slugifyServiceName(name));
  const shortDescription = textValue(input.short_description, existing?.short_description ?? '');
  const description = textValue(input.description, existing?.description ?? '');
  const imageUrl = input.image_url === undefined
    ? (existing?.image_url ?? null)
    : nullableTextValue(input.image_url);
  const price = input.price === undefined ? (existing?.price ?? null) : numberValue(input.price, Number.NaN);
  const currency = textValue(input.currency, existing?.currency ?? 'PKR').toUpperCase();
  const durationMinutes = integerValue(input.duration_minutes ?? input.duration, existing?.duration_minutes ?? 60);
  const category = input.category === undefined
    ? (existing?.category ?? null)
    : nullableTextValue(input.category);
  const sortOrder = integerValue(input.sort_order, existing?.sort_order ?? 0);
  const isActive = booleanValue(input.is_active ?? input.active, existing?.is_active ?? true);

  if (name.length < 2 || name.length > 160) return { ok: false, details: 'Name must be between 2 and 160 characters.' };
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { ok: false, details: 'Slug must contain lowercase letters, numbers, and hyphens only.' };
  if (shortDescription.length > 280) return { ok: false, details: 'Short description must be 280 characters or fewer.' };
  if (description.length > 5000) return { ok: false, details: 'Description must be 5,000 characters or fewer.' };
  if (imageUrl && imageUrl.length > 2048) return { ok: false, details: 'Image reference is too long.' };
  if (Number.isNaN(price) || (price !== null && (price < 0 || price > 99999999.99))) return { ok: false, details: 'Price must be a non-negative amount.' };
  if (!/^[A-Z]{3}$/.test(currency)) return { ok: false, details: 'Currency must be a three-letter code.' };
  if (durationMinutes < 1 || durationMinutes > 1440) return { ok: false, details: 'Duration must be between 1 and 1,440 minutes.' };
  if (sortOrder < 0 || sortOrder > 100000) return { ok: false, details: 'Sort order must be a non-negative integer.' };
  if (category && category.length > 120) return { ok: false, details: 'Category must be 120 characters or fewer.' };

  return {
    ok: true,
    value: {
      name,
      slug,
      short_description: shortDescription,
      description,
      image_url: imageUrl,
      price,
      currency,
      duration_minutes: durationMinutes,
      category,
      is_active: isActive,
      sort_order: sortOrder,
    },
  };
}

export function validateServiceImage(file: File) {
  if (!SERVICE_IMAGE_TYPES.includes(file.type as (typeof SERVICE_IMAGE_TYPES)[number])) {
    return 'Only JPEG, PNG, and WebP images are supported.';
  }
  if (!file.size || file.size > SERVICE_IMAGE_MAX_BYTES) {
    return 'Service images must be smaller than 5 MB.';
  }
  return null;
}

export function getServiceImagePath(imageUrl: string | null) {
  if (!imageUrl) return null;
  const marker = `/storage/v1/object/public/${SERVICE_IMAGE_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);
  return markerIndex === -1 ? null : decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
}
