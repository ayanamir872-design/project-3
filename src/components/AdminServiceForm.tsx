'use client';

import React, { useEffect, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import type { PublicService } from '@/lib/services';

/* eslint-disable @next/next/no-img-element */

interface AdminServiceFormProps {
  service: PublicService | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AdminServiceForm({ service, onClose, onSaved }: AdminServiceFormProps) {
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [category, setCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(service?.name ?? '');
    setShortDescription(service?.short_description ?? '');
    setDescription(service?.description ?? '');
    setPrice(service?.price === null || service?.price === undefined ? '' : String(service.price));
    setDuration(String(service?.duration_minutes ?? 60));
    setCategory(service?.category ?? '');
    setSortOrder(String(service?.sort_order ?? 0));
    setIsActive(service?.is_active ?? true);
    setImage(null);
    setPreviewUrl(service?.image_url ?? null);
    setError(null);
  }, [service]);

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Choose an image smaller than 5 MB.');
      return;
    }
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const fields = {
      name,
      short_description: shortDescription,
      description,
      price: price === '' ? null : Number(price),
      duration_minutes: Number(duration),
      category: category || null,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };

    try {
      const endpoint = service ? `/api/admin/services/${service.id}` : '/api/admin/services';
      const body = image ? new FormData() : JSON.stringify(fields);
      if (image && body instanceof FormData) {
        Object.entries(fields).forEach(([key, value]) => body.append(key, value === null ? '' : String(value)));
        body.append('image', image);
      }

      const response = await fetch(endpoint, {
        method: service ? 'PATCH' : 'POST',
        credentials: 'same-origin',
        headers: image ? undefined : { 'Content-Type': 'application/json' },
        body,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.details || result.error || "We couldn't save this service. Please try again.");

      onSaved(service ? 'Service updated successfully.' : 'Service created successfully.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We couldn't save this service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cms-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target && !saving) onClose(); }}>
      <section className="cms-dialog" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
        <div className="cms-dialog-header">
          <div>
            <span className="admin-eyebrow">Services CMS</span>
            <h2 id="service-form-title">{service ? 'Edit service' : 'Add service'}</h2>
            <p>{service ? 'Update the live service record without creating a duplicate.' : 'Create a service that will be available across the studio experience.'}</p>
          </div>
          <button type="button" className="cms-icon-button" onClick={onClose} disabled={saving} aria-label="Close service form"><X size={18} /></button>
        </div>

        <form className="cms-form" onSubmit={handleSubmit}>
          <div className="cms-form-layout">
            <div className="cms-image-field">
              <label htmlFor="service-image">Service image</label>
              <div className="cms-image-preview">
                {previewUrl ? <img src={previewUrl} alt="Selected service preview" /> : <div><ImagePlus size={22} /><span>Upload a studio image</span><small>JPEG, PNG or WebP · max 5 MB</small></div>}
              </div>
              <label className="cms-upload-button" htmlFor="service-image">{image ? 'Replace image' : 'Choose image'}</label>
              <input id="service-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
            </div>

            <div className="cms-form-fields">
              <div className="cms-field">
                <label htmlFor="service-name">Service title <span>*</span></label>
                <input id="service-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Tattoo Art" />
              </div>
              <div className="cms-field">
                <label htmlFor="service-short-description">Short description</label>
                <input id="service-short-description" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="A concise description for cards" maxLength={280} />
              </div>
              <div className="cms-field cms-field-full">
                <label htmlFor="service-description">Full description</label>
                <textarea id="service-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the service experience" rows={4} maxLength={5000} />
              </div>
              <div className="cms-field-row">
                <div className="cms-field"><label htmlFor="service-price">Price <small>PKR</small></label><input id="service-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="5000" /></div>
                <div className="cms-field"><label htmlFor="service-duration">Duration <small>minutes</small></label><input id="service-duration" type="number" min="1" max="1440" value={duration} onChange={(event) => setDuration(event.target.value)} /></div>
              </div>
              <div className="cms-field-row">
                <div className="cms-field"><label htmlFor="service-category">Category</label><input id="service-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Body Art" /></div>
                <div className="cms-field"><label htmlFor="service-sort-order">Sort order</label><input id="service-sort-order" type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /></div>
              </div>
              <label className="cms-toggle-row"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /><span><strong>{isActive ? 'Active service' : 'Inactive service'}</strong><small>{isActive ? 'Visible in public browsing and new bookings.' : 'Hidden from public browsing and new bookings.'}</small></span></label>
            </div>
          </div>

          {error ? <div className="cms-form-error" role="alert">{error}</div> : null}
          <div className="cms-dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <><Loader2 size={16} className="cms-spin" /> Saving service...</> : service ? 'Save changes' : 'Create service'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
