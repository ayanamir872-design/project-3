import type { ServiceRecord } from './serviceValidation';

export type PublicService = ServiceRecord;

export async function fetchActiveServices() {
  const response = await fetch('/api/services', { cache: 'no-store' });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error('Services are temporarily unavailable. Please try again.');
  }

  return (body.data ?? []) as PublicService[];
}

export function formatServicePrice(service: Pick<PublicService, 'price' | 'currency'>) {
  if (service.price === null || service.price === undefined) return 'Price on request';

  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: service.currency || 'PKR',
    maximumFractionDigits: 0,
  }).format(service.price);
}

export function serviceDescription(service: Pick<PublicService, 'short_description' | 'description'>) {
  return service.short_description || service.description || 'A considered studio ritual, tailored to you.';
}
