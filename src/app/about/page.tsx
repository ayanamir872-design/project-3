'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Calendar, Heart, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import { useBooking } from '@/components/BookingProvider';

export default function AboutPage() {
  const { openBooking } = useBooking();

  return (
    <div style={styles.pageWrapper}>
      {/* Editorial Hero */}
      <section style={styles.heroSection}>
        <div className="container" style={styles.heroContainer}>
          <span className="badge-tag">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            ABOUT AIMA GLOW STUDIO
          </span>
          <h1 style={styles.heroTitle}>
            Crafted for the modern woman who values <br />
            <span style={{ fontStyle: 'italic', color: 'var(--color-burgundy)' }}>
              elegance, care, and natural luminosity.
            </span>
          </h1>
          <p style={styles.heroSub}>
            Welcome to Aima Glow Studio. We are a boutique beauty studio dedicated to enhancing your natural features through personal care, high-precision artistry, and serene rejuvenation.
          </p>
        </div>
      </section>

      {/* Our Story & Philosophy */}
      <section style={styles.storySection}>
        <div className="container">
          <div style={styles.storyGrid}>
            <div style={styles.storyImageWrapper}>
              <Image
                src="/images/about-philosophy.png"
                alt="Aima Glow Studio Experience"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
              <div style={styles.imageOverlay} />
            </div>

            <div style={styles.storyContent}>
              <span style={styles.sectionBadge}>OUR PHILOSOPHY</span>
              <h2 style={styles.storyTitle}>
                Beauty as an expression of self-assurance.
              </h2>
              <p style={styles.paragraph}>
                Aima Glow Studio was founded with a singular vision: to create a tranquil sanctuary where clients receive deeply personal, unhurried beauty treatments.
              </p>
              <p style={styles.paragraph}>
                We believe true beauty is not about dramatic transformation or artificial standards — it is about honoring your individuality. Whether it is a deep-cleansing Hydrafacial that restores your natural radiance, custom Nail Art, or weightless Lash extensions, every treatment is tailored precisely to you.
              </p>

              <div style={styles.accentBox}>
                <p style={styles.accentText}>
                  &quot;When you feel confident in your skin, your natural glow shines through effortlessly.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section style={styles.valuesSection}>
        <div className="container">
          <div style={styles.valuesHeader}>
            <span style={styles.sectionBadge}>OUR FOUNDATIONAL VALUES</span>
            <h2 style={styles.valuesTitle}>Guided By Purpose & Excellence</h2>
          </div>

          <div style={styles.valuesGrid}>
            {/* Value 1: PERSONAL */}
            <div style={styles.valueCard}>
              <div style={styles.valueIconWrapper}>
                <UserCheck size={28} color="var(--color-burgundy)" />
              </div>
              <span style={styles.valueNum}>01</span>
              <h3 style={styles.valueName}>PERSONAL</h3>
              <p style={styles.valueDesc}>
                Every client deserves individual attention. We take the time to analyze your skin type, style preferences, and comfort before beginning any treatment.
              </p>
            </div>

            {/* Value 2: REFINED */}
            <div style={styles.valueCard}>
              <div style={styles.valueIconWrapper}>
                <ShieldCheck size={28} color="var(--color-burgundy)" />
              </div>
              <span style={styles.valueNum}>02</span>
              <h3 style={styles.valueName}>REFINED</h3>
              <p style={styles.valueDesc}>
                Professional techniques paired with a premium studio experience. We utilize hygienic, top-tier products and meticulous attention to every single detail.
              </p>
            </div>

            {/* Value 3: CONFIDENT */}
            <div style={styles.valueCard}>
              <div style={styles.valueIconWrapper}>
                <Heart size={28} color="var(--color-burgundy)" />
              </div>
              <span style={styles.valueNum}>03</span>
              <h3 style={styles.valueName}>CONFIDENT</h3>
              <p style={styles.valueDesc}>
                The goal is not simply to look beautiful — it is to leave our studio feeling deeply confident, empowered, and refreshed in your own skin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Beauty Experience */}
      <section style={styles.experienceSection}>
        <div className="container">
          <div style={styles.experienceCard}>
            <div style={styles.expContent}>
              <span style={styles.sectionBadge}>THE STUDIO ENVIRONMENT</span>
              <h2 style={styles.expTitle}>A Serene Space Designed For Comfort</h2>
              <p style={styles.paragraph}>
                From soft neutral palettes and soothing acoustics to gentle ambient illumination, every element of Aima Glow Studio has been curated to help you unwind completely.
              </p>
              <ul style={styles.expList}>
                <li>Private, sterile treatment areas designed for total relaxation.</li>
                <li>Bespoke skin diagnostic assessment prior to every Hydrafacial.</li>
                <li>Hygienic, premium non-toxic nail and lash formulations.</li>
                <li>Complimentary refreshing beverage bar and personal concierge service.</li>
              </ul>
            </div>

            <div style={styles.expImageWrapper}>
              <Image
                src="/images/hero-bg.png"
                alt="Aima Glow Studio Serene Atmosphere"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Appointment CTA Banner */}
      <section style={styles.ctaSection}>
        <div className="container" style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Experience the Aima Glow Signature</h2>
          <p style={styles.ctaText}>
            Book your consultation or treatment today and step into your confidence.
          </p>
          <button onClick={() => openBooking()} className="btn btn-primary">
            <Calendar size={16} /> Book Your Appointment Now
          </button>
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
    paddingBottom: '5rem',
    borderBottom: '1px solid var(--color-rose)',
  },
  heroContainer: {
    maxWidth: '900px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  heroTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    lineHeight: 1.12,
    color: 'var(--color-espresso)',
  },
  heroSub: {
    fontSize: '1.125rem',
    lineHeight: 1.7,
    color: 'var(--color-espresso-muted)',
    maxWidth: '720px',
  },
  storySection: {
    paddingTop: '6rem',
    paddingBottom: '6rem',
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  storyImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '520px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-editorial)',
    border: '1px solid var(--color-gold-subtle)',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(36,27,29,0) 60%, rgba(101,31,50,0.2) 100%)',
  },
  storyContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionBadge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
  },
  storyTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    color: 'var(--color-espresso)',
    lineHeight: 1.2,
  },
  paragraph: {
    fontSize: '1.0625rem',
    lineHeight: 1.7,
    color: 'var(--color-espresso-muted)',
  },
  accentBox: {
    backgroundColor: 'var(--color-ivory)',
    borderLeft: '3px solid var(--color-gold)',
    padding: '1.25rem 1.5rem',
    borderRadius: '0 8px 8px 0',
    marginTop: '0.5rem',
  },
  accentText: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.1875rem',
    fontStyle: 'italic',
    color: 'var(--color-burgundy)',
    lineHeight: 1.5,
  },
  valuesSection: {
    backgroundColor: 'var(--color-ivory)',
    paddingTop: '6rem',
    paddingBottom: '6rem',
    borderTop: '1px solid var(--color-rose)',
    borderBottom: '1px solid var(--color-rose)',
  },
  valuesHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  valuesTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.75rem',
    color: 'var(--color-espresso)',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
  },
  valueCard: {
    backgroundColor: 'var(--color-warm-white)',
    padding: '2.5rem 2rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(201, 168, 106, 0.25)',
    boxShadow: 'var(--shadow-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
  },
  valueIconWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-rose-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--color-gold-subtle)',
  },
  valueNum: {
    position: 'absolute',
    top: '1.75rem',
    right: '1.75rem',
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    color: 'var(--color-gold)',
    fontWeight: 600,
  },
  valueName: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.125rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    color: 'var(--color-espresso)',
  },
  valueDesc: {
    fontSize: '0.9375rem',
    color: 'var(--color-espresso-muted)',
    lineHeight: 1.6,
  },
  experienceSection: {
    paddingTop: '6rem',
    paddingBottom: '6rem',
  },
  experienceCard: {
    backgroundColor: 'var(--color-warm-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(201, 168, 106, 0.25)',
    boxShadow: 'var(--shadow-editorial)',
    padding: '3.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3.5rem',
    alignItems: 'center',
  },
  expContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  expTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    color: 'var(--color-espresso)',
  },
  expList: {
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    color: 'var(--color-espresso-muted)',
    fontSize: '0.9375rem',
  },
  expImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '420px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  ctaSection: {
    backgroundColor: 'var(--color-burgundy)',
    color: 'var(--color-ivory)',
    paddingTop: '5rem',
    paddingBottom: '5rem',
    textAlign: 'center',
  },
  ctaContainer: {
    maxWidth: '700px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  ctaTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.75rem',
    color: 'var(--color-warm-white)',
  },
  ctaText: {
    fontSize: '1.0625rem',
    color: 'var(--color-rose-subtle)',
  },
};
