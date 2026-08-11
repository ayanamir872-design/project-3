'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';
import { useBooking } from './BookingProvider';

export default function HeroSection() {
  const { openBooking } = useBooking();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return;
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax offsets
  const bgOffset = reduceMotion ? { x: 0, y: 0 } : { x: mousePos.x * 3, y: mousePos.y * 3 };
  const imageOffset = reduceMotion ? { x: 0, y: 0 } : { x: mousePos.x * 6, y: mousePos.y * 6 };
  const goldRingOffset = reduceMotion ? { x: 0, y: 0 } : { x: mousePos.x * -11, y: mousePos.y * -11 };

  return (
    <section style={styles.heroSection}>
      {/* Subtle Background Radial Pattern */}
      <div
        style={{
          ...styles.bgGradient,
          transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`,
        }}
      />

      <div className="container" style={styles.heroGrid}>
        {/* Left Editorial Content */}
        <div style={styles.leftCol}>
          <div style={styles.brandTagWrapper}>
            <span className="badge-tag">
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Aima Glow Studio
            </span>
          </div>

          <h1 style={styles.headline}>
            Where beauty becomes <br />
            <span style={styles.italicAccent}>your signature.</span>
          </h1>

          <p style={styles.supportingText}>
            Professional beauty experiences designed to enhance your natural glow, confidence and individuality.
          </p>

          <div style={styles.ctaGroup}>
            <button
              onClick={() => openBooking()}
              className="btn btn-primary"
              style={styles.primaryCta}
            >
              <Calendar size={16} /> Book Your Appointment
            </button>

            <Link href="/services" className="btn btn-secondary" style={styles.secondaryCta}>
              Explore Services <ArrowRight size={16} />
            </Link>
          </div>

          {/* Quick Value Metrics */}
          <div style={styles.metricsRow}>
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>100%</span>
              <span style={styles.metricLabel}>Bespoke Care</span>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>Refined</span>
              <span style={styles.metricLabel}>Luxury Aesthetics</span>
            </div>
            <div style={styles.metricDivider} />
            <div style={styles.metricItem}>
              <span style={styles.metricVal}>Radiant</span>
              <span style={styles.metricLabel}>Natural Glow</span>
            </div>
          </div>
        </div>

        {/* Right 3D Visual Parallax Layer */}
        <div style={styles.rightCol}>
          <div style={styles.parallaxContainer}>
            {/* 3D Champagne Gold Accent Ring */}
            <div
              style={{
                ...styles.goldRing,
                transform: `translate3d(${goldRingOffset.x}px, ${goldRingOffset.y}px, 0) rotate(12deg)`,
              }}
            />

            {/* Subtle Soft Rose Backdrop Card */}
            <div style={styles.backdropCard} />

            {/* Primary Editorial Image Frame */}
            <div
              style={{
                ...styles.imageFrame,
                transform: `translate3d(${imageOffset.x}px, ${imageOffset.y}px, 0)`,
              }}
            >
              <Image
                src="/images/hero-bg.png"
                alt="Aima Glow Studio Luxury Atmosphere"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover' }}
              />
              <div style={styles.imageOverlay} />
            </div>

            {/* Floating Luxury Tag */}
            <div style={styles.floatingBadge}>
              <div style={styles.floatingBadgeDot} />
              <div>
                <span style={styles.floatingBadgeTitle}>Hydrafacial & Lash Artistry</span>
                <span style={styles.floatingBadgeSub}>Tailored Beauty Rituals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    position: 'relative',
    paddingTop: '3.5rem',
    paddingBottom: '5rem',
    backgroundColor: 'var(--color-ivory)',
    overflow: 'hidden',
  },
  bgGradient: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '700px',
    height: '700px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(232, 214, 208, 0.45) 0%, rgba(247, 241, 232, 0) 70%)',
    pointerEvents: 'none',
    transition: 'transform 200ms ease-out',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '3.5rem',
    alignItems: 'center',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    zIndex: 2,
  },
  brandTagWrapper: {
    marginBottom: '0.25rem',
  },
  headline: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
    lineHeight: 1.08,
    color: 'var(--color-espresso)',
    fontWeight: 400,
  },
  italicAccent: {
    fontStyle: 'italic',
    color: 'var(--color-burgundy)',
    fontWeight: 300,
  },
  supportingText: {
    fontSize: '1.125rem',
    lineHeight: 1.7,
    color: 'var(--color-espresso-muted)',
    maxWidth: '540px',
  },
  ctaGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.25rem',
    marginTop: '0.5rem',
    alignItems: 'center',
  },
  primaryCta: {
    padding: '1.125rem 2.25rem',
  },
  secondaryCta: {
    padding: '1.125rem 2.25rem',
  },
  metricsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
    marginTop: '2.5rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(201, 168, 106, 0.25)',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  metricVal: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.75rem',
    fontWeight: 500,
    color: 'var(--color-burgundy)',
    lineHeight: 1.1,
  },
  metricLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-espresso-muted)',
  },
  metricDivider: {
    width: '1px',
    height: '35px',
    backgroundColor: 'var(--color-rose)',
  },
  rightCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  parallaxContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '540px',
    height: '580px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goldRing: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    border: '1.5px solid var(--color-gold)',
    boxShadow: 'var(--shadow-gold-glow)',
    pointerEvents: 'none',
    opacity: 0.85,
    transition: 'transform 300ms ease-out',
    zIndex: 1,
  },
  backdropCard: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    backgroundColor: 'var(--color-rose)',
    borderRadius: 'var(--radius-lg)',
    top: '5%',
    right: '2%',
    zIndex: 0,
    opacity: 0.6,
  },
  imageFrame: {
    position: 'relative',
    width: '88%',
    height: '88%',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-editorial)',
    border: '1px solid rgba(255, 253, 252, 0.6)',
    zIndex: 2,
    transition: 'transform 300ms ease-out',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(36,27,29,0) 65%, rgba(101,31,50,0.3) 100%)',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: '8%',
    left: '-5%',
    zIndex: 3,
    backgroundColor: 'rgba(255, 253, 252, 0.94)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--color-gold-subtle)',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-editorial)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  floatingBadgeDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-gold)',
    boxShadow: '0 0 10px var(--color-gold)',
  },
  floatingBadgeTitle: {
    display: 'block',
    fontFamily: 'var(--font-serif)',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-espresso)',
  },
  floatingBadgeSub: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--color-espresso-muted)',
    letterSpacing: '0.04em',
  },
};
