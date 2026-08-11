'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    quote: "My skin felt completely renewed after the Hydrafacial at Aima Glow Studio. The glow lasted for weeks and the atmosphere is pure serene luxury.",
    author: "Zainab Malik",
    service: "Hydrafacial Treatment",
  },
  {
    quote: "The nail artistry here is unmatched in precision. Every single detail is executed with pure perfection and creative elegance.",
    author: "Mahnoor Ahmed",
    service: "Signature Nail Art",
  },
  {
    quote: "Subtle, gorgeous, and defined lashes! I get compliments everywhere I go. The team makes you feel like royalty from the moment you step in.",
    author: "Sara Raza",
    service: "Eyelashes Art",
  },
];

export default function TestimonialsSection() {
  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.header}>
          <span style={styles.badge}>CLIENT LOVE & WORDS</span>
          <h2 style={styles.title}>
            Stories of <span style={{ fontStyle: 'italic', color: 'var(--color-burgundy)' }}>Confidence & Glow.</span>
          </h2>
        </div>

        <div style={styles.grid}>
          {reviews.map((rev, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.starsRow}>
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={14} fill="var(--color-gold)" color="var(--color-gold)" />
                ))}
              </div>
              <Quote size={28} color="var(--color-gold-subtle)" style={{ marginBottom: '0.5rem' }} />
              <p style={styles.quoteText}>"{rev.quote}"</p>
              <div style={styles.authorMeta}>
                <span style={styles.authorName}>{rev.author}</span>
                <span style={styles.serviceName}>{rev.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: '5.5rem',
    paddingBottom: '5.5rem',
    backgroundColor: 'var(--color-warm-white)',
    borderTop: '1px solid var(--color-rose)',
    borderBottom: '1px solid var(--color-rose)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3.5rem',
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
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    color: 'var(--color-espresso)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'var(--color-ivory)',
    padding: '2.5rem 2rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(201, 168, 106, 0.25)',
    boxShadow: 'var(--shadow-subtle)',
    display: 'flex',
    flexDirection: 'column',
  },
  starsRow: {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '1rem',
  },
  quoteText: {
    fontSize: '1rem',
    lineHeight: 1.65,
    fontStyle: 'italic',
    color: 'var(--color-espresso)',
    marginBottom: '1.75rem',
    flex: 1,
  },
  authorMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-rose)',
  },
  authorName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--color-espresso)',
  },
  serviceName: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-burgundy)',
  },
};
