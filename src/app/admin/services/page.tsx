'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Check, Plus, RefreshCw, Search, ToggleLeft, Trash2 } from 'lucide-react';
import AdminServiceForm from '@/components/AdminServiceForm';
import type { PublicService } from '@/lib/services';
import { formatServicePrice, serviceDescription } from '@/lib/services';

/* eslint-disable @next/next/no-img-element */

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function serviceStatusLabel(service: PublicService) {
  return service.is_active ? 'Active' : 'Inactive';
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [count, setCount] = useState(0);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [formService, setFormService] = useState<PublicService | null | undefined>(undefined);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadServices = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (activeFilter !== 'all') params.set('active', activeFilter);
      const response = await fetch(`/api/admin/services?${params.toString()}`, { credentials: 'same-origin', cache: 'no-store' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Unable to load services.');
      setServices(body.data ?? []);
      setCount(body.count ?? 0);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load services.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter, query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => loadServices(), query ? 250 : 0);
    return () => window.clearTimeout(timeout);
  }, [loadServices, query]);

  const handleSaved = (message: string) => {
    setFormService(undefined);
    setFlash(message);
    loadServices(true);
  };

  const handleToggle = async (service: PublicService) => {
    setProcessingId(service.id);
    setFlash(null);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Unable to update service.');
      setFlash(`${service.name} is now ${!service.is_active ? 'active' : 'inactive'}.`);
      await loadServices(true);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to update service.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (service: PublicService) => {
    if (!window.confirm(`Delete ${service.name}? If it has appointment history, the backend will safely deactivate it instead.`)) return;
    setProcessingId(service.id);
    setFlash(null);
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, { method: 'DELETE', credentials: 'same-origin' });
      const body = await response.json().catch(() => ({}));
      if (response.status === 409 && body.deactivated) {
        setFlash(`${service.name} has appointment history, so it was deactivated instead of deleted.`);
      } else if (!response.ok) {
        throw new Error(body.error || 'Unable to delete service.');
      } else {
        setFlash(`${service.name} was deleted.`);
      }
      await loadServices(true);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete service.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section className="admin-page services-cms-page" aria-labelledby="services-cms-title">
      <header className="admin-page-header services-cms-header">
        <div>
          <p className="admin-eyebrow">Content & catalogue</p>
          <h1 className="admin-heading" id="services-cms-title">Services</h1>
          <p className="admin-lead">Keep the live studio menu polished, accurate, and ready to book.</p>
        </div>
        <div className="admin-header-actions">
          <div className="admin-stat-card"><span>Total services</span><strong>{count}</strong></div>
          <button type="button" className="btn btn-secondary" onClick={() => loadServices(true)} disabled={loading || refreshing}><RefreshCw size={15} className={refreshing ? 'cms-spin' : undefined} /> {refreshing ? 'Refreshing' : 'Refresh'}</button>
          <button type="button" className="btn btn-primary" onClick={() => setFormService(null)}><Plus size={16} /> Add service</button>
        </div>
      </header>

      <div className="cms-insight-strip">
        <div><span className="cms-insight-icon"><Check size={15} /></span><span><strong>One source of truth</strong><small>Changes here flow to public browsing and booking.</small></span></div>
        <div><span className="cms-insight-icon"><ToggleLeft size={15} /></span><span><strong>Safe status controls</strong><small>Inactive services stay out of new bookings.</small></span></div>
      </div>

      <div className="admin-toolbar-card services-cms-toolbar">
        <label className="admin-field admin-search-field"><span>Search services</span><div className="cms-search-input"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, description or category" /></div></label>
        <label className="admin-field"><span>Status</span><select className="admin-select" value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}><option value="all">All services</option><option value="true">Active only</option><option value="false">Inactive only</option></select></label>
        <div className="cms-toolbar-result"><strong>{count}</strong><span>records</span></div>
      </div>

      {flash ? <div className="admin-success-alert" role="status"><Check size={16} /> {flash}<button type="button" onClick={() => setFlash(null)} aria-label="Dismiss notification">Dismiss</button></div> : null}
      {error ? <div className="admin-alert" role="alert"><div><strong>We couldn&apos;t load the service catalogue.</strong><span>{error}</span></div><button type="button" className="btn btn-secondary" onClick={() => loadServices(true)}>Try again</button></div> : null}

      <div className="cms-service-list-heading"><div><h2>Service catalogue</h2><p>{loading ? 'Checking the latest records...' : 'Live records from Supabase Services.'}</p></div><span>{activeFilter === 'all' ? 'All statuses' : activeFilter === 'true' ? 'Active only' : 'Inactive only'}</span></div>

      <div className="admin-panel cms-service-panel" aria-busy={loading}>
        {loading ? <div className="cms-table-skeleton">{Array.from({ length: 5 }).map((_, index) => <div key={index} />)}</div> : services.length === 0 ? (
          <div className="admin-empty-state cms-empty-services"><span className="cms-empty-mark"><Plus size={20} /></span><h3>No services yet</h3><p>Create the first service and it will become available across the live studio experience.</p><button type="button" className="btn btn-primary" onClick={() => setFormService(null)}>Add your first service</button></div>
        ) : (
          <>
            <div className="cms-service-table-wrap">
              <table className="admin-table cms-service-table"><caption className="sr-only">Service catalogue</caption><thead><tr><th>Service</th><th>Details</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{services.map((service) => (
                <tr key={service.id}>
                  <td><div className="cms-service-name-cell">{service.image_url ? <img src={service.image_url} alt="" loading="lazy" /> : <span className="cms-service-thumb-placeholder">AG</span>}<div><strong>{service.name}</strong><small>{service.category || 'Uncategorised'}</small></div></div></td>
                  <td><div className="cms-service-details"><strong>{formatServicePrice(service)}</strong><span>{service.duration_minutes} minutes</span><small>{serviceDescription(service)}</small></div></td>
                  <td><span className={`cms-status-badge ${service.is_active ? 'is-active' : 'is-inactive'}`}><span aria-hidden="true" />{serviceStatusLabel(service)}</span></td>
                  <td className="cms-updated-date">{formatUpdatedAt(service.updated_at)}</td>
                  <td><div className="cms-row-actions"><button type="button" className="btn btn-ghost" onClick={() => setFormService(service)} disabled={processingId === service.id}>Edit</button><button type="button" className="cms-more-button" aria-label={`${service.is_active ? 'Deactivate' : 'Activate'} ${service.name}`} onClick={() => handleToggle(service)} disabled={processingId === service.id}><ToggleLeft size={18} /></button><button type="button" className="cms-delete-button" aria-label={`Delete ${service.name}`} onClick={() => handleDelete(service)} disabled={processingId === service.id}><Trash2 size={16} /></button></div></td>
                </tr>
              ))}</tbody></table>
            </div>
            <div className="cms-service-mobile-list">{services.map((service) => <article className="cms-service-mobile-card" key={service.id}><div className="cms-service-mobile-top">{service.image_url ? <img src={service.image_url} alt="" loading="lazy" /> : <span className="cms-service-thumb-placeholder">AG</span>}<div><h3>{service.name}</h3><span>{service.category || 'Uncategorised'}</span></div><span className={`cms-status-badge ${service.is_active ? 'is-active' : 'is-inactive'}`}><span aria-hidden="true" />{serviceStatusLabel(service)}</span></div><p>{serviceDescription(service)}</p><div className="cms-service-mobile-meta"><strong>{formatServicePrice(service)}</strong><span>{service.duration_minutes} min</span><span>Updated {formatUpdatedAt(service.updated_at)}</span></div><div className="cms-row-actions"><button type="button" className="btn btn-secondary" onClick={() => setFormService(service)}>Edit</button><button type="button" className="btn btn-ghost" onClick={() => handleToggle(service)}>{service.is_active ? 'Deactivate' : 'Activate'}</button><button type="button" className="cms-delete-button" onClick={() => handleDelete(service)} aria-label={`Delete ${service.name}`}><Trash2 size={16} /></button></div></article>)}</div>
          </>
        )}
      </div>

      {formService !== undefined ? <AdminServiceForm service={formService} onClose={() => setFormService(undefined)} onSaved={handleSaved} /> : null}
    </section>
  );
}
