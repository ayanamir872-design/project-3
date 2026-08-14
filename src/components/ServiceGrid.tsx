'use client';

import React from 'react';
import Link from 'next/link';
import ServiceCard from './ServiceCard';
import { useBooking } from './BookingProvider';

export default function ServiceGrid() {
  const { services, servicesLoading, servicesError, refreshServices } = useBooking();
  const featured = services.slice(0, 6);

  return (
    <section className="live-services-section" aria-labelledby="experience-title">
      <div className="container">
        <div className="live-services-header">
          <div>
            <span className="live-section-eyebrow">The Aima experience</span>
            <h2 id="experience-title">A considered menu for your next chapter.</h2>
          </div>
          <div className="live-services-header-copy">
            <p>Every ritual is selected from the studio&apos;s live service menu, so the details you see stay aligned with what is currently available to book.</p>
            <Link href="/services" className="live-text-link">View all services <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        {servicesLoading ? (
          <div className="live-services-grid" aria-busy="true" aria-label="Loading services">
            {Array.from({ length: 3 }).map((_, index) => <div className="live-service-skeleton" key={index} />)}
          </div>
        ) : servicesError ? (
          <div className="live-inline-state" role="alert">
            <strong>Services are temporarily unavailable.</strong>
            <span>We couldn&apos;t load the studio menu right now.</span>
            <button type="button" className="btn btn-secondary" onClick={refreshServices}>Try again</button>
          </div>
        ) : featured.length === 0 ? (
          <div className="live-inline-state"><strong>The menu is being refreshed.</strong><span>Please check back shortly for available services.</span></div>
        ) : (
          <div className="live-services-grid">
            {featured.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
          </div>
        )}
      </div>
    </section>
  );
}
