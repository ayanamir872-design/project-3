'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { useBooking } from '@/components/BookingProvider';

export default function ServicesPage() {
  const { services, servicesLoading, servicesError, refreshServices } = useBooking();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All services');

  const categories = useMemo(() => ['All services', ...Array.from(new Set(services.map((service) => service.category).filter(Boolean) as string[]))], [services]);
  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = category === 'All services' || service.category === category;
      const searchable = `${service.name} ${service.short_description} ${service.description} ${service.category ?? ''}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query, services]);

  return (
    <main className="services-page-live">
      <section className="services-hero-live">
        <div className="container services-hero-grid">
          <div>
            <span className="live-section-eyebrow">The Aima menu / {services.length.toString().padStart(2, '0')} rituals</span>
            <h1>A little more intention in every appointment.</h1>
          </div>
          <div className="services-hero-aside">
            <p>Browse the studio&apos;s current offerings, from considered skin rituals to detail-led artistry. Every service is kept live from our studio menu.</p>
            <button type="button" className="live-outline-link" onClick={() => document.getElementById('service-catalogue')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the menu <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="services-catalogue-live" id="service-catalogue" aria-labelledby="catalogue-title">
        <div className="container">
          <div className="services-catalogue-toolbar">
            <div>
              <span className="live-section-eyebrow">Available now</span>
              <h2 id="catalogue-title">Find your ritual</h2>
            </div>
            <div className="services-catalogue-controls">
              <label className="live-search-control">
                <Search size={16} aria-hidden="true" />
                <span className="sr-only">Search services</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the menu" />
              </label>
              <label className="live-filter-control">
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span className="sr-only">Filter by category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </div>

          {servicesLoading ? (
            <div className="live-services-grid" aria-busy="true" aria-label="Loading services">
              {Array.from({ length: 6 }).map((_, index) => <div className="live-service-skeleton" key={index} />)}
            </div>
          ) : servicesError ? (
            <div className="live-empty-state" role="alert">
              <strong>Unable to load services.</strong>
              <p>Please try again in a moment.</p>
              <button type="button" className="btn btn-primary" onClick={refreshServices}>Try again</button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="live-empty-state">
              <strong>No services match that search.</strong>
              <p>Try another phrase or browse every category.</p>
              <button type="button" className="btn btn-secondary" onClick={() => { setQuery(''); setCategory('All services'); }}>Clear filters</button>
            </div>
          ) : (
            <div className="live-services-grid live-services-grid--catalogue">
              {filteredServices.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
