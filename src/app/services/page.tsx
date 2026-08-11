'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Calendar } from 'lucide-react';
import ServiceCard, { ServiceItem } from '@/components/ServiceCard';
import { useBooking } from '@/components/BookingProvider';
import { RevealSection } from '@/hooks/useScrollReveal';

const allServicesData: ServiceItem[] = [
  {
    id: 'hydrafacial',
    number: '01',
    title: 'HYDRAFACIAL',
    category: 'Skincare & Facials',
    description: 'Deep cleansing, gentle exfoliation, pore extraction, and intense peptide hydration designed to reveal a fresh, luminous complexion.',
    image: '/images/services/hydrafacial.png',
    ctaText: 'Explore Treatment',
    price: 'Starting from —',
    isHero: true,
  },
  {
    id: 'nail-art',
    number: '02',
    title: 'NAIL ART',
    category: 'Nail Artistry',
    description: 'Refined nail artistry designed around your personal style, from understated minimalist elegance to intricate statement details.',
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
    description: 'Beautifully defined lashes designed to enhance your natural features with an elegant, weightless, effortless finish.',
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
  {
    id: 'glowing-facial',
    number: '07',
    title: 'SIGNATURE GLOWING FACIAL',
    category: 'Skincare & Facials',
    description: 'Custom botanical facial infusion engineered to restore skin elasticity, tone, and deep natural radiance.',
    image: '/images/about-philosophy.png',
    ctaText: 'Explore Treatment',
    price: 'Price on request',
    isHero: false,
  },
  {
    id: 'luxe-manicure',
    number: '08',
    title: 'LUXE MANICURE & PEDICURE SPA',
    category: 'Nail Artistry',
    description: 'Nourishing cuticle care, organic exfoliation scrub, and precision shaping with gel or classic finish.',
    image: '/images/services/nail-art.jpg',
    ctaText: 'Explore Spa Manicure',
    price: 'Starting from —',
    isHero: false,
  },
  {
    id: 'brow-sculpting',
    number: '09',
    title: 'BROW SCULPTING & LAMINATION',
    category: 'Lash & Brow Studio',
    description: 'Custom architectural brow mapping, gentle lamination, and bespoke tinting for fuller, polished brows.',
    image: '/images/services/eyelashes-art.jpg',
    ctaText: 'Explore Brows',
    price: 'Starting from —',
    isHero: false,
  },
];

const categories = ['All Services', 'Skincare & Facials', 'Nail Artistry', 'Lash & Brow Studio', 'Hair Studio', 'Makeup Artistry', 'Bridal Studio'];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const { openBooking } = useBooking();

  const filteredServices = activeCategory === 'All Services'
    ? allServicesData
    : allServicesData.filter(s => s.category === activeCategory);

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Header */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <span className="badge-tag">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            THE AIMA MENU
          </span>
          <h1 style={styles.heroTitle}>OUR SERVICES</h1>
          <p style={styles.heroSub}>
            Beauty rituals, thoughtfully tailored to you.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section style={styles.filterSection}>
        <div className="container">
          <RevealSection>
            <div style={styles.filterTabs}>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={isActive ? 'btn btn-primary' : 'btn'}
                    style={{
                      padding: '0.625rem 1.5rem',
                      fontSize: '0.8125rem',
                      borderColor: isActive ? 'transparent' : 'var(--color-rose)',
                      backgroundColor: isActive ? undefined : 'var(--color-warm-white)',
                      color: isActive ? undefined : 'var(--color-espresso)',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </RevealSection>

          {/* Service Cards Grid */}
          <div style={styles.grid}>
            {filteredServices.map((service, i) => (
              <RevealSection key={service.id} className="reveal" delay={Math.min(i + 1, 4)}>
                <ServiceCard service={service} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Spotlights */}
      <section style={styles.spotlightSection}>
        <div className="container">
          <RevealSection>
            <div style={styles.spotlightHeader}>
              <span style={styles.badge}>SIGNATURE HIGHLIGHTS</span>
              <h2 style={styles.spotlightTitle}>Mastery In Every Ritual</h2>
            </div>
          </RevealSection>

          {/* Spotlight 1: Hydrafacial */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={styles.spotlightCard}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/hydrafacial.png"
                  alt="Hydrafacial Treatment at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>01 / SKINCARE REVOLUTION</span>
                <h3 style={styles.spotlightName}>Hydrafacial Rejuvenation</h3>
                <p style={styles.spotlightDesc}>
                  Our non-invasive multi-step treatment combines vortex-suction cleansing, gentle glycolic peel, automated pore extractions, and intense hyaluronic antioxidant hydration.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Instant glass-skin luminosity without downtime.</li>
                  <li>Deep pore decongestion and sebum balancing.</li>
                  <li>Custom serum booster infusions targeted for your skin goals.</li>
                </ul>
                <button
                  onClick={() => openBooking('Hydrafacial')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Hydrafacial
                </button>
              </div>
            </div>
          </RevealSection>

          {/* Spotlight 2: Hairstyling */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={{ ...styles.spotlightCard, flexDirection: 'row-reverse' }}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/hairstyling.png"
                  alt="Luxury Hairstyling at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>02 / HAIR STUDIO</span>
                <h3 style={styles.spotlightName}>Luxury Hairstyling</h3>
                <p style={styles.spotlightDesc}>
                  From silky blowouts and voluminous curls to sophisticated updos and couture braiding, our stylists sculpt your hair to complement your face, outfit and occasion.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Heat-protective keratin and argan oil pre-treatment.</li>
                  <li>Custom styling for events, parties and daily elegance.</li>
                  <li>Hair health consultation and scalp analysis included.</li>
                </ul>
                <button
                  onClick={() => openBooking('Hairstyling')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Hairstyling
                </button>
              </div>
            </div>
          </RevealSection>

          {/* Spotlight 3: Make Up */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={styles.spotlightCard}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/makeup.png"
                  alt="Glam Makeup Artistry at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>03 / MAKEUP ARTISTRY</span>
                <h3 style={styles.spotlightName}>Editorial & Glam Make Up</h3>
                <p style={styles.spotlightDesc}>
                  Whether it is a soft romantic day look, a dramatic smokey eye for an evening event, or editorial-grade glam, our makeup artists create flawless, long-lasting artistry.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Skin-type matched foundation blending for a seamless finish.</li>
                  <li>High-definition setting for photography and events.</li>
                  <li>Premium non-comedogenic, luxury brand products exclusively.</li>
                </ul>
                <button
                  onClick={() => openBooking('Make Up')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Make Up
                </button>
              </div>
            </div>
          </RevealSection>

          {/* Spotlight 4: Bridal Make-Up */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={{ ...styles.spotlightCard, flexDirection: 'row-reverse' }}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/bridal-makeup.png"
                  alt="Bridal Makeup at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>04 / BRIDAL STUDIO</span>
                <h3 style={styles.spotlightName}>Bespoke Royal Bridal Make-Up</h3>
                <p style={styles.spotlightDesc}>
                  Your most important day deserves the most extraordinary attention. Our exclusive bridal packages encompass engagement, mehndi, nikkah, valima and reception looks.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Complimentary pre-wedding skin consultation and trial session.</li>
                  <li>Waterproof, camera-ready formulas that last 12+ hours.</li>
                  <li>On-location bridal styling service available upon request.</li>
                </ul>
                <button
                  onClick={() => openBooking('Bridal Make-Up')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Bridal Package
                </button>
              </div>
            </div>
          </RevealSection>

          {/* Spotlight 5: Nail Art */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={styles.spotlightCard}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/nail-art.jpg"
                  alt="Nail Art at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>05 / NAIL ARTISTRY</span>
                <h3 style={styles.spotlightName}>Couture Nail Art</h3>
                <p style={styles.spotlightDesc}>
                  Whether you desire subtle chrome accents, delicate hand-painted motifs, or clean French elegance, our nail artists deliver unmatched precision.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Long-lasting gel and builder gel (BIAB) strength.</li>
                  <li>Hygienic, single-use file and tool sterilization.</li>
                  <li>Custom color mixing to complement your skin undertone.</li>
                </ul>
                <button
                  onClick={() => openBooking('Nail Art')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Nail Art
                </button>
              </div>
            </div>
          </RevealSection>

          {/* Spotlight 6: Eyelashes Art */}
          <RevealSection className="reveal-scale" delay={1}>
            <div style={{ ...styles.spotlightCard, flexDirection: 'row-reverse' }}>
              <div style={styles.spotlightImageWrapper}>
                <Image
                  src="/images/services/eyelashes-art.jpg"
                  alt="Eyelashes Art at Aima Glow Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.spotlightContent}>
                <span style={styles.spotlightBadge}>06 / LASH STUDIO</span>
                <h3 style={styles.spotlightName}>Defined Eyelashes Art</h3>
                <p style={styles.spotlightDesc}>
                  Enhance your natural gaze with feather-light lash extensions applied lash-by-lash. From natural classic sets to soft hybrid volume, experience effortless everyday beauty.
                </p>
                <ul style={styles.spotlightList}>
                  <li>Weightless silk and cashmere fibers.</li>
                  <li>Hypoallergenic, medical-grade adhesive formulation.</li>
                  <li>Custom curl mapping tailored to your eye shape.</li>
                </ul>
                <button
                  onClick={() => openBooking('Eyelashes Art')}
                  className="btn btn-primary"
                  style={styles.spotlightBtn}
                >
                  <Calendar size={15} /> Book Eyelashes Art
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundColor: 'var(--color-warm-white)',
  },
  heroSection: {
    backgroundColor: 'var(--color-ivory)',
    paddingTop: '4.5rem',
    paddingBottom: '4.5rem',
    borderBottom: '1px solid var(--color-rose)',
    textAlign: 'center',
  },
  heroContainer: {
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
    letterSpacing: '0.02em',
    color: 'var(--color-espresso)',
  },
  heroSub: {
    fontSize: '1.25rem',
    fontStyle: 'italic',
    color: 'var(--color-burgundy)',
    fontFamily: 'var(--font-serif)',
  },
  filterSection: {
    paddingTop: '3.5rem',
    paddingBottom: '5rem',
  },
  filterTabs: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '3.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '2.5rem',
  },
  spotlightSection: {
    backgroundColor: 'var(--color-ivory)',
    paddingTop: '6rem',
    paddingBottom: '6rem',
    borderTop: '1px solid var(--color-rose)',
  },
  spotlightHeader: {
    textAlign: 'center',
    marginBottom: '4.5rem',
  },
  badge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.5rem',
  },
  spotlightTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.75rem',
    color: 'var(--color-espresso)',
  },
  spotlightCard: {
    backgroundColor: 'var(--color-warm-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(201, 168, 106, 0.25)',
    boxShadow: 'var(--shadow-editorial)',
    padding: '3rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '3.5rem',
    alignItems: 'center',
    marginBottom: '3.5rem',
  },
  spotlightImageWrapper: {
    position: 'relative',
    flex: '1 1 340px',
    height: '380px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-subtle)',
  },
  spotlightContent: {
    flex: '1 1 400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  spotlightBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--color-gold)',
    fontWeight: 600,
  },
  spotlightName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.25rem',
    color: 'var(--color-espresso)',
  },
  spotlightDesc: {
    fontSize: '1rem',
    lineHeight: 1.65,
    color: 'var(--color-espresso-muted)',
  },
  spotlightList: {
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    fontSize: '0.9375rem',
    color: 'var(--color-espresso-muted)',
  },
  spotlightBtn: {
    width: 'fit-content',
    marginTop: '0.5rem',
  },
};
