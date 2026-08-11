'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Instagram, ArrowUpRight, Sparkles, MapPin, Heart } from 'lucide-react';
import { useBooking } from './BookingProvider';

export default function Footer() {
  const { openBooking } = useBooking();

  return (
    <footer style={styles.footer}>
      {/* Pre-footer Callout Banner */}
      <div style={styles.preFooter}>
        <div className="container" style={styles.preFooterContainer}>
          <div>
            <span style={styles.preFooterSub}>YOUR PERSONAL GLOW AWAITS</span>
            <h2 style={styles.preFooterTitle}>Let’s Create Your Signature Look.</h2>
          </div>
          <button
            onClick={() => openBooking()}
            className="btn btn-gold"
            style={styles.preFooterBtn}
          >
            <Sparkles size={16} /> Book Your Appointment
          </button>
        </div>
      </div>

      {/* Main Footer Container */}
      <div className="container" style={styles.mainFooter}>
        <div style={styles.grid}>
          {/* Col 1: Brand Info */}
          <div style={styles.brandCol}>
            <div style={styles.logoWrapper}>
              <Image
                src="/images/logo.jpeg"
                alt="Aima Glow Studio"
                width={170}
                height={58}
                style={styles.logoImg}
              />
            </div>
            <p style={styles.tagline}>"Beauty. Confidence. You."</p>
            <p style={styles.brandDesc}>
              Bespoke beauty studio delivering radiant Hydrafacials, couture Nail Art, and refined Lash Artistry tailored to your unique elegance.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div style={styles.navCol}>
            <h4 style={styles.colTitle}>Navigation</h4>
            <ul style={styles.navList}>
              <li>
                <Link href="/" style={styles.navLink}>Home</Link>
              </li>
              <li>
                <Link href="/about" style={styles.navLink}>About Us</Link>
              </li>
              <li>
                <Link href="/services" style={styles.navLink}>Services</Link>
              </li>
              <li>
                <button
                  onClick={() => openBooking()}
                  style={styles.navLinkBtn}
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Signature Treatments */}
          <div style={styles.servicesCol}>
            <h4 style={styles.colTitle}>Signature Offerings</h4>
            <ul style={styles.navList}>
              <li>
                <span onClick={() => openBooking('Hydrafacial')} style={styles.serviceLink}>
                  Hydrafacial Rejuvenation
                </span>
              </li>
              <li>
                <span onClick={() => openBooking('Nail Art')} style={styles.serviceLink}>
                  Couture Nail Art
                </span>
              </li>
              <li>
                <span onClick={() => openBooking('Eyelashes Art')} style={styles.serviceLink}>
                  Defined Eyelashes Art
                </span>
              </li>
              <li>
                <span onClick={() => openBooking('Signature Glowing Facial Ritual')} style={styles.serviceLink}>
                  Glowing Facial Ritual
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div style={styles.contactCol}>
            <h4 style={styles.colTitle}>Connect With Us</h4>

            <div style={styles.contactRow}>
              <Phone size={16} color="var(--color-gold)" />
              <a href="tel:+923124994697" style={styles.contactLink}>
                0312 4994697
              </a>
            </div>

            <div style={styles.contactRow}>
              <Instagram size={16} color="var(--color-gold)" />
              <a
                href="https://instagram.com/aima.glow.studio"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.contactLink}
              >
                @aima.glow.studio <ArrowUpRight size={14} style={{ display: 'inline', marginLeft: '2px' }} />
              </a>
            </div>

            <div style={styles.contactRow}>
              <MapPin size={16} color="var(--color-gold)" />
              <span style={{ color: 'var(--color-rose-subtle)', fontSize: '0.875rem' }}>
                Boutique Studio Appointments
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © 2026 Aima Glow Studio. All rights reserved.
          </p>
          <div style={styles.creditsRow}>
            <span>Crafted with</span>
            <Heart size={13} fill="var(--color-gold)" color="var(--color-gold)" />
            <span>for natural beauty & confidence.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: 'var(--color-burgundy-dark)',
    color: 'var(--color-ivory)',
    position: 'relative',
    overflow: 'hidden',
  },
  preFooter: {
    backgroundColor: 'var(--color-burgundy)',
    borderBottom: '1px solid rgba(201, 168, 106, 0.25)',
    paddingTop: '3.5rem',
    paddingBottom: '3.5rem',
  },
  preFooterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  preFooterSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-gold)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.25rem',
  },
  preFooterTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
    color: 'var(--color-warm-white)',
  },
  preFooterBtn: {
    padding: '1rem 2rem',
  },
  mainFooter: {
    paddingTop: '4.5rem',
    paddingBottom: '2.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '3rem',
    marginBottom: '4rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '320px',
  },
  logoWrapper: {
    backgroundColor: 'var(--color-warm-white)',
    padding: '6px 12px',
    borderRadius: '6px',
    display: 'inline-block',
    width: 'fit-content',
  },
  logoImg: {
    objectFit: 'contain',
    height: 'auto',
  },
  tagline: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '1.25rem',
    color: 'var(--color-gold)',
  },
  brandDesc: {
    fontSize: '0.875rem',
    color: 'var(--color-rose)',
    lineHeight: 1.6,
  },
  navCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  servicesCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  contactCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  colTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.35rem',
    color: 'var(--color-gold)',
    letterSpacing: '0.02em',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  navLink: {
    color: 'var(--color-rose-subtle)',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'color 200ms ease',
  },
  navLinkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-gold)',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
  },
  serviceLink: {
    color: 'var(--color-rose-subtle)',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'color 200ms ease',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  contactLink: {
    color: 'var(--color-ivory)',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'color 200ms ease',
  },
  bottomBar: {
    borderTop: '1px solid rgba(201, 168, 106, 0.2)',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.8125rem',
    color: 'var(--color-rose)',
  },
  copyright: {
    color: 'var(--color-rose)',
    fontSize: '0.8125rem',
  },
  creditsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
};
