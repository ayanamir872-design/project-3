'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useBooking } from './BookingProvider';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  image: string;
  ctaText: string;
  price?: string;
  isHero?: boolean;
}

interface ServiceCardProps {
  service: ServiceItem;
  variant?: 'editorial' | 'compact' | 'horizontal';
}

export default function ServiceCard({ service, variant = 'editorial' }: ServiceCardProps) {
  const { openBooking } = useBooking();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        gridColumn: service.isHero ? 'span 2' : 'span 1',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openBooking(service.title)}
      role="button"
      tabIndex={0}
      aria-label={`View details and book ${service.title}`}
    >
      {/* Image Container */}
      <div style={styles.imageContainer}>
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{
            ...styles.image,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <div style={styles.imageOverlay} />
        
        {/* Number Badge */}
        <span style={styles.numberBadge}>{service.number}</span>

        {/* Hover Arrow Icon */}
        <div 
          style={{
            ...styles.hoverArrow,
            transform: isHovered ? 'translate(0, 0) scale(1)' : 'translate(-5px, 5px) scale(0.9)',
            opacity: isHovered ? 1 : 0,
          }}
        >
          <ArrowUpRight size={20} color="var(--color-espresso)" />
        </div>
      </div>

      {/* Content Container */}
      <div style={styles.content}>
        <div style={styles.categoryRow}>
          <span style={styles.category}>{service.category}</span>
          <span style={styles.price}>{service.price || 'Starting from —'}</span>
        </div>

        <h3
          style={{
            ...styles.title,
            color: isHovered ? 'var(--color-burgundy)' : 'var(--color-espresso)',
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {service.title}
        </h3>

        {/* Animated Champagne Gold Accent Line */}
        <div
          style={{
            ...styles.goldLine,
            width: isHovered ? '60px' : '30px',
            backgroundColor: isHovered ? 'var(--color-gold)' : 'var(--color-rose)',
          }}
        />

        <p style={styles.description}>{service.description}</p>

        <div style={styles.ctaRow}>
          <span
            style={{
              ...styles.ctaText,
              color: isHovered ? 'var(--color-burgundy)' : 'var(--color-espresso-muted)',
            }}
          >
            {service.ctaText}
          </span>
          <ArrowUpRight
            size={16}
            style={{
              transition: 'transform 200ms ease',
              transform: isHovered ? 'translate(2px, -2px)' : 'none',
              color: isHovered ? 'var(--color-burgundy)' : 'var(--color-espresso-muted)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--color-warm-white)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    border: '1px solid rgba(201, 168, 106, 0.2)',
    boxShadow: 'var(--shadow-subtle)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 350ms cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '320px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-ivory)',
  },
  image: {
    objectFit: 'cover',
    transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(36,27,29,0) 50%, rgba(36,27,29,0.3) 100%)',
  },
  numberBadge: {
    position: 'absolute',
    top: '1.25rem',
    left: '1.25rem',
    fontFamily: 'var(--font-serif)',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-ivory)',
    backgroundColor: 'rgba(101, 31, 50, 0.75)',
    backdropFilter: 'blur(8px)',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(201, 168, 106, 0.4)',
  },
  hoverArrow: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-warm-white)',
    boxShadow: 'var(--shadow-editorial)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 300ms ease',
  },
  content: {
    padding: '2rem 1.75rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  category: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
  },
  price: {
    fontSize: '0.8125rem',
    color: 'var(--color-espresso-muted)',
    fontStyle: 'italic',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.75rem',
    lineHeight: 1.2,
    marginBottom: '0.75rem',
    transition: 'all 250ms ease',
  },
  goldLine: {
    height: '1px',
    marginBottom: '1rem',
    transition: 'all 300ms ease',
  },
  description: {
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    color: 'var(--color-espresso-muted)',
    marginBottom: '1.5rem',
    flex: 1,
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    marginTop: 'auto',
  },
  ctaText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'color 200ms ease',
  },
};
