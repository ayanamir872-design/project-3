'use client';

import React from 'react';
import ServiceCard, { ServiceItem } from './ServiceCard';
import { RevealSection } from '@/hooks/useScrollReveal';

export const featuredServicesData: ServiceItem[] = [
  {
    id: 'hydrafacial',
    number: '01',
    title: 'HYDRAFACIAL',
    category: 'Skincare & Rejuvenation',
    description: 'Deep cleansing, hydration and rejuvenation designed to reveal a fresh, luminous complexion.',
    image: '/images/services/hydrafacial.png',
    ctaText: 'Explore Treatment',
    price: 'Starting from —',
    isHero: true,
  },
  {
    id: 'nail-art',
    number: '02',
    title: 'NAIL ART',
    category: 'Nail Artistry & Care',
    description: 'Refined nail artistry designed around your personal style, from understated elegance to statement details.',
    image: '/images/services/nail-art.jpg',
    ctaText: 'Explore Nail Art',
    price: 'Starting from —',
    isHero: false,
  },
  {
    id: 'eyelashes-art',
    number: '03',
    title: 'EYELASHES ART',
    category: 'Lash & Brow Studio',
    description: 'Beautifully defined lashes designed to enhance your natural features with an elegant, effortless finish.',
    image: '/images/services/eyelashes-art.jpg',
    ctaText: 'Explore Lashes',
    price: 'Starting from —',
    isHero: false,
  },
  {
    id: 'hairstyling',
    number: '04',
    title: 'HAIRSTYLING',
    category: 'Hair Studio',
    description: 'Bespoke blowouts, couture updos, and hair health rituals tailored to your texture, occasion and personal flair.',
    image: '/images/services/hairstyling.png',
    ctaText: 'Explore Hairstyling',
    price: 'Starting from —',
    isHero: true,
  },
  {
    id: 'makeup',
    number: '05',
    title: 'MAKE UP',
    category: 'Makeup Artistry',
    description: 'Editorial glam, soft romantic looks and evening makeup designed to enhance your natural beauty and confidence.',
    image: '/images/services/makeup.png',
    ctaText: 'Explore Make Up',
    price: 'Starting from —',
    isHero: false,
  },
  {
    id: 'bridal-makeup',
    number: '06',
    title: 'BRIDAL MAKE-UP',
    category: 'Bridal Studio',
    description: 'Exclusive luxury bridal packages — from engagement to the big day — for a flawless, timeless bridal look.',
    image: '/images/services/bridal-makeup.png',
    ctaText: 'Explore Bridal',
    price: 'Price on request',
    isHero: false,
  },
];

export default function ServiceGrid() {
  return (
    <section style={styles.section}>
      <div className="container">
        {/* Editorial Section Header */}
        <RevealSection>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <span style={styles.sectionBadge}>THE AIMA EXPERIENCE</span>
              <h2 style={styles.sectionTitle}>
                Thoughtfully curated beauty services <br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-burgundy)' }}>
                  for the moments that matter.
                </span>
              </h2>
            </div>
            <div style={styles.headerRight}>
              <p style={styles.sectionIntro}>
                Every treatment at Aima Glow Studio is tailored to your unique skin profile, aesthetic preference, and lifestyle. Discover our signature offerings below.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* Asymmetric Editorial Grid */}
        <div style={styles.grid}>
          {featuredServicesData.map((service, i) => (
            <RevealSection key={service.id} className="reveal" delay={Math.min(i + 1, 4)}>
              <ServiceCard service={service} />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: '6rem',
    paddingBottom: '6rem',
    backgroundColor: 'var(--color-warm-white)',
  },
  header: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem',
    alignItems: 'end',
    marginBottom: '4rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--color-rose)',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sectionBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
  },
  sectionTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
    lineHeight: 1.15,
    color: 'var(--color-espresso)',
  },
  headerRight: {
    maxWidth: '480px',
  },
  sectionIntro: {
    fontSize: '1.0625rem',
    lineHeight: 1.7,
    color: 'var(--color-espresso-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2.25rem',
  },
};
