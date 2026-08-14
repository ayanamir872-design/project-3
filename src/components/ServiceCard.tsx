'use client';

import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { useBooking } from './BookingProvider';
import { formatServicePrice, serviceDescription, type PublicService } from '@/lib/services';

interface ServiceCardProps {
  service: PublicService;
  index?: number;
}

/* eslint-disable @next/next/no-img-element */
export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const { openBooking } = useBooking();

  return (
    <article className="live-service-card">
      <div className="live-service-card-media">
        {service.image_url ? (
          <img src={service.image_url} alt={service.name} loading="lazy" />
        ) : (
          <div className="live-service-card-placeholder" aria-hidden="true">AG</div>
        )}
        <span className="live-service-card-index">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="live-service-card-body">
        <div className="live-service-card-kicker">
          <span>{service.category || 'Studio ritual'}</span>
          <span className="live-service-card-status">Available</span>
        </div>
        <h3>{service.name}</h3>
        <p>{serviceDescription(service)}</p>
        <div className="live-service-card-meta">
          <span><Clock size={14} aria-hidden="true" /> {service.duration_minutes} min</span>
          <strong>{formatServicePrice(service)}</strong>
        </div>
        <button className="live-service-card-action" type="button" onClick={() => openBooking(service)}>
          Book service <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
