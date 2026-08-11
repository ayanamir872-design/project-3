'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, Calendar, Sparkles } from 'lucide-react';
import { useBooking } from './BookingProvider';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();
  const navLinksRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sliding pill indicator position calculation
  const updateIndicator = useCallback(() => {
    if (!navLinksRef.current) return;
    const activeLink = navLinksRef.current.querySelector('.active') as HTMLElement;
    if (activeLink) {
      const parentRect = navLinksRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - parentRect.left,
        width: linkRect.width,
      });
    }
  }, []);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname, updateIndicator]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`floating-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="floating-nav-inner">
          {/* Logo */}
          <Link href="/" aria-label="Aima Glow Studio Home" style={styles.logoLink}>
            <Image
              src="/images/logo.jpeg"
              alt="Aima Glow Studio"
              width={130}
              height={44}
              priority
              style={styles.logoImg}
            />
          </Link>

          {/* Desktop Navigation with Sliding Pill */}
          <div className="nav-links" ref={navLinksRef}>
            {/* Sliding Indicator */}
            <div
              className="nav-indicator"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />

            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div style={styles.actionsGroup}>
            <a
              href="tel:+923124994697"
              className="nav-phone-link"
              style={styles.phoneLink}
              aria-label="Call 0312 4994697"
            >
              <Phone size={14} />
              <span>0312 4994697</span>
            </a>

            <button
              type="button"
              className="nav-book-btn"
              onClick={() => openBooking()}
              aria-label="Book Appointment"
            >
              <Calendar size={14} />
              <span>Book Now</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              style={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div style={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu" style={styles.mobileMenu}>
            <nav style={styles.mobileNav}>
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...styles.mobileNavLink,
                    color: pathname === item.href ? 'var(--color-burgundy)' : 'var(--color-espresso)',
                    animationDelay: `${i * 80}ms`,
                  }}
                  className="reveal visible"
                >
                  {item.label}
                </Link>
              ))}

              <div style={styles.mobileDivider} />

              <a href="tel:+923124994697" style={styles.mobilePhoneLink}>
                <Phone size={18} color="var(--color-burgundy)" />
                <span>0312 4994697</span>
              </a>

              <a
                href="https://instagram.com/aima.glow.studio"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mobileInstaLink}
              >
                <Sparkles size={16} color="var(--color-gold)" />
                @aima.glow.studio
              </a>

              <button
                className="btn btn-primary"
                onClick={() => { setMobileMenuOpen(false); openBooking(); }}
                style={styles.mobileBookBtn}
              >
                <Calendar size={16} /> Book Your Appointment
              </button>
            </nav>
          </div>
        </>
      )}

      {/* Spacer for floating navbar */}
      <div style={{ height: 'calc(var(--header-height) + 16px)' }} />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoImg: {
    objectFit: 'contain',
    maxHeight: '40px',
    width: 'auto',
    borderRadius: '4px',
  },
  actionsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
  },
  phoneLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none',
    color: 'var(--color-espresso)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    padding: '0.5rem 0.875rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(232, 214, 208, 0.35)',
    transition: 'all 200ms ease',
    whiteSpace: 'nowrap',
  },
  mobileToggle: {
    background: 'none',
    border: 'none',
    color: 'var(--color-espresso)',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 200ms ease',
  },
  mobileOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(36, 27, 29, 0.4)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
  },
  mobileMenu: {
    position: 'fixed',
    top: '80px',
    left: '1rem',
    right: '1rem',
    backgroundColor: 'var(--color-warm-white)',
    border: '1px solid var(--color-gold-subtle)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 20px 60px rgba(36, 27, 29, 0.15)',
    padding: '2rem 1.75rem',
    zIndex: 999,
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  mobileNavLink: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-serif)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.5rem 0',
  },
  mobileDivider: {
    width: '60px',
    height: '1px',
    backgroundColor: 'var(--color-gold)',
    margin: '0.5rem 0',
  },
  mobilePhoneLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    color: 'var(--color-espresso)',
    fontWeight: 700,
    fontSize: '1.0625rem',
  },
  mobileInstaLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'var(--color-espresso-muted)',
    fontSize: '0.9375rem',
  },
  mobileBookBtn: {
    width: '100%',
    marginTop: '0.75rem',
  },
};
