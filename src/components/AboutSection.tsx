'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RevealSection } from '@/hooks/useScrollReveal';

export default function AboutSection() {
  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.grid}>
          {/* Left Editorial Visual with Champagne Gold Accent */}
          <RevealSection className="reveal-left">
            <div style={styles.visualCol}>
              <div style={styles.imageCard}>
                <Image
                  src="/images/about-philosophy.png"
                  alt="Aima Glow Studio Philosophy"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
                <div style={styles.imageGlassOverlay} />
              </div>

              {/* Thin Champagne Gold Vertical Line Motif */}
              <div style={styles.goldVerticalLineContainer}>
                <div className="gold-vertical-line" />
              </div>
            </div>
          </RevealSection>

          {/* Right Copy Column */}
          <RevealSection className="reveal-right">
            <div style={styles.textCol}>
              <div style={styles.badgeWrapper}>
                <span className="badge-tag">
                  <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  OUR PHILOSOPHY
                </span>
              </div>

              <h2 style={styles.title}>
                More than beauty. <br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-burgundy)' }}>
                  It&apos;s your confidence.
                </span>
              </h2>

              <p style={styles.paragraph}>
                At Aima Glow Studio, we believe true beauty is an extension of inner self-assurance. We do not alter who you are — we refine, illuminate, and celebrate your natural features.
              </p>

              <p style={styles.paragraph}>
                From our signature Hydrafacial rejuvenation rituals to precision Lash and Nail Artistry, every detail of your appointment is designed to deliver serenity, perfection, and effortless elegance.
              </p>

              {/* 3 Philosophy Pillars */}
              <div style={styles.pillarsGrid}>
                <div style={styles.pillarItem}>
                  <span style={styles.pillarNum}>01</span>
                  <h4 style={styles.pillarTitle}>Personal</h4>
                  <p style={styles.pillarText}>Every client receives custom consultation and individual care.</p>
                </div>
                <div style={styles.pillarItem}>
                  <span style={styles.pillarNum}>02</span>
                  <h4 style={styles.pillarTitle}>Refined</h4>
                  <p style={styles.pillarText}>Masterful technique using ultra-premium skin and lash formulas.</p>
                </div>
                <div style={styles.pillarItem}>
                  <span style={styles.pillarNum}>03</span>
                  <h4 style={styles.pillarTitle}>Confident</h4>
                  <p style={styles.pillarText}>You leave not just looking beautiful, but feeling deeply empowered.</p>
                </div>
              </div>

              <div style={styles.ctaWrapper}>
                <Link href="/about" className="btn btn-secondary">
                  Discover Our Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: '6rem',
    paddingBottom: '6rem',
    backgroundColor: 'var(--color-ivory)',
    position: 'relative',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  visualCol: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
    height: '560px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-editorial)',
    border: '1px solid rgba(201, 168, 106, 0.3)',
  },
  imageGlassOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(36,27,29,0) 60%, rgba(101,31,50,0.2) 100%)',
  },
  goldVerticalLineContainer: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  textCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  badgeWrapper: {
    marginBottom: '0.25rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
    lineHeight: 1.12,
    color: 'var(--color-espresso)',
  },
  paragraph: {
    fontSize: '1.0625rem',
    lineHeight: 1.7,
    color: 'var(--color-espresso-muted)',
  },
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--color-rose)',
  },
  pillarItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  pillarNum: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.25rem',
    color: 'var(--color-gold)',
    fontWeight: 600,
  },
  pillarTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem',
    color: 'var(--color-espresso)',
  },
  pillarText: {
    fontSize: '0.8125rem',
    color: 'var(--color-espresso-muted)',
    lineHeight: 1.5,
  },
  ctaWrapper: {
    marginTop: '0.5rem',
  },
};
