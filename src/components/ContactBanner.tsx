'use client';

import React from 'react';
import { Phone, Instagram, Calendar, MapPin, Clock } from 'lucide-react';
import { useBooking } from './BookingProvider';

export default function ContactBanner() {
  const { openBooking } = useBooking();

  return (
    <section style={styles.section}>
      <div className="container">
        <div style={styles.card}>
          <div style={styles.infoCol}>
            <span style={styles.badge}>VISIT AIMA GLOW STUDIO</span>
            <h3 style={styles.title}>
              Step Into Serenity & Luxury
            </h3>
            <p style={styles.text}>
              Ready to experience our signature Hydrafacial, custom Nail Art, or defined Lash Artistry? Reserve your appointment or connect directly with our studio concierge.
            </p>

            <div style={styles.contactDetailsGrid}>
              <div style={styles.detailItem}>
                <Phone size={18} color="var(--color-burgundy)" />
                <div>
                  <span style={styles.detailLabel}>Direct Line</span>
                  <a href="tel:+923124994697" style={styles.detailValLink}>
                    0312 4994697
                  </a>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Instagram size={18} color="var(--color-burgundy)" />
                <div>
                  <span style={styles.detailLabel}>Instagram Profile</span>
                  <a
                    href="https://instagram.com/aima.glow.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.detailValLink}
                  >
                    @aima.glow.studio
                  </a>
                </div>
              </div>

              <div style={styles.detailItem}>
                <Clock size={18} color="var(--color-burgundy)" />
                <div>
                  <span style={styles.detailLabel}>Appointment Hours</span>
                  <span style={styles.detailVal}>Mon - Sat: 11:00 AM - 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.ctaCol}>
            <div style={styles.ctaCard}>
              <h4 style={styles.ctaCardTitle}>Ready For Your Glow?</h4>
              <p style={styles.ctaCardText}>
                Bookings are recommended in advance to ensure dedicated individual attention.
              </p>
              <button
                onClick={() => openBooking()}
                className="btn btn-primary"
                style={styles.ctaBtn}
              >
                <Calendar size={16} /> Reserve Appointment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    paddingTop: '5rem',
    paddingBottom: '5rem',
    backgroundColor: 'var(--color-ivory)',
  },
  card: {
    backgroundColor: 'var(--color-warm-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(201, 168, 106, 0.3)',
    boxShadow: 'var(--shadow-editorial)',
    padding: '3.5rem 3rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    alignItems: 'center',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  badge: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.5rem',
    color: 'var(--color-espresso)',
    lineHeight: 1.15,
  },
  text: {
    fontSize: '1rem',
    lineHeight: 1.65,
    color: 'var(--color-espresso-muted)',
  },
  contactDetailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '0.5rem',
    paddingTop: '1.25rem',
    borderTop: '1px solid var(--color-rose)',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.875rem',
  },
  detailLabel: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-espresso-muted)',
  },
  detailVal: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--color-espresso)',
  },
  detailValLink: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-burgundy)',
    textDecoration: 'none',
  },
  ctaCol: {
    display: 'flex',
    justifyContent: 'center',
  },
  ctaCard: {
    backgroundColor: 'var(--color-ivory)',
    padding: '2.5rem 2rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-gold-subtle)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    maxWidth: '380px',
  },
  ctaCardTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.75rem',
    color: 'var(--color-espresso)',
  },
  ctaCardText: {
    fontSize: '0.875rem',
    color: 'var(--color-espresso-muted)',
  },
  ctaBtn: {
    width: '100%',
    marginTop: '0.5rem',
  },
};
