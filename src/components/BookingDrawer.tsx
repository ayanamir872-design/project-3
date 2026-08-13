'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialService: string;
}

export default function BookingDrawer({ isOpen, onClose, initialService }: BookingDrawerProps) {
  const [service, setService] = useState(initialService);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00 PM');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialService) {
      setService(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form state after transition
      setTimeout(() => {
        setSubmitted(false);
      }, 400);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date) return;

    setIsSaving(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: name,
          phone_number: phone,
          service_name: service,
          appointment_date: date,
          appointment_time: time,
          notes: note,
          status: 'pending',
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMessage = result?.details || result?.error || `Booking request failed (${response.status})`;
        console.error('Booking request failed', { status: response.status, body: result });
        throw new Error(errorMessage);
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#651F32', '#C9A86A', '#E8D6D0', '#F7F1E8']
      });
    } catch (error) {
      console.error('Booking save failed', error);
      setErrorMessage('We could not save your booking right now. Please call us directly at 0312 4994697.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        style={styles.drawer} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-drawer-title"
      >
        <div style={styles.header}>
          <div>
            <span style={styles.tag}>Aima Glow Studio</span>
            <h2 id="booking-drawer-title" style={styles.title}>Book Your Experience</h2>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close booking modal">
            <X size={20} color="var(--color-espresso)" />
          </button>
        </div>

        {submitted ? (
          <div style={styles.successState}>
            <div style={styles.successIconWrapper}>
              <CheckCircle2 size={54} color="var(--color-burgundy)" />
            </div>
            <h3 style={styles.successTitle}>Appointment Requested</h3>
            <p style={styles.successText}>
              Thank you, <strong style={{ color: 'var(--color-burgundy)' }}>{name}</strong>. We have received your booking request for <strong>{service}</strong> on {date} at {time}.
            </p>
            <p style={styles.successSubtext}>
              Our concierge will contact you at <strong>{phone}</strong> shortly to confirm your reservation.
            </p>
            
            <div style={styles.directContactBox}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-espresso)', marginBottom: '0.5rem' }}>
                Need immediate assistance or custom scheduling?
              </p>
              <a href="tel:+923124994697" style={styles.phoneDirectBtn}>
                <Phone size={16} /> Call 0312 4994697
              </a>
            </div>

            <button style={styles.doneBtn} onClick={onClose}>
              Return to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <p style={styles.subtitle}>
              Select your desired treatment and appointment details below.
            </p>

            {/* Service Selection */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Selected Treatment</label>
              <select 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                style={styles.select}
              >
                <option value="Hydrafacial">Hydrafacial (Deep Cleansing & Hydration)</option>
                <option value="Nail Art">Nail Art (Bespoke Luxury Nail Artistry)</option>
                <option value="Eyelashes Art">Eyelashes Art (Defined Natural Lash Extensions)</option>
                <option value="Hairstyling">Hairstyling (Blowouts & Couture Styling)</option>
                <option value="Make Up">Make Up (Editorial & Glam Makeup Artistry)</option>
                <option value="Bridal Make-Up">Bridal Make-Up (Exclusive Luxury Bridal Package)</option>
                <option value="Signature Glowing Facial Ritual">Signature Glowing Facial Ritual</option>
                <option value="Luxe Manicure & Pedicure Spa">Luxe Manicure & Pedicure Spa</option>
                <option value="Brow Sculpting & Lamination">Brow Sculpting & Lamination</option>
              </select>
            </div>

            {/* Full Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <User size={14} style={{ marginRight: '6px' }} /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ayesha Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Phone Number */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <Phone size={14} style={{ marginRight: '6px' }} /> Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="0312 0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Date & Time Row */}
            <div style={styles.rowGroup}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>
                  <Calendar size={14} style={{ marginRight: '6px' }} /> Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>
                  <Clock size={14} style={{ marginRight: '6px' }} /> Preferred Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={styles.select}
                >
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:30 PM">12:30 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                </select>
              </div>
            </div>

            {/* Additional Notes */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <MessageSquare size={14} style={{ marginRight: '6px' }} /> Special Preferences (Optional)
              </label>
              <textarea
                placeholder="Any skin allergies, nail design preferences, or special requests..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                style={styles.textarea}
              />
            </div>

            {/* Direct Phone Call Alternative */}
            <div style={styles.phoneDirectNotice}>
              <span>Prefer calling directly?</span>
              <a href="tel:+923124994697" style={styles.phoneLink}>
                0312 4994697
              </a>
            </div>

            {errorMessage ? (
              <div style={styles.errorBox}>{errorMessage}</div>
            ) : null}

            <button type="submit" style={styles.submitBtn} disabled={isSaving}>
              <Sparkles size={16} /> {isSaving ? 'Saving Request...' : 'Confirm Appointment Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(36, 27, 29, 0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 300ms ease',
  },
  drawer: {
    width: '100%',
    maxWidth: '520px',
    height: '100%',
    backgroundColor: 'var(--color-warm-white)',
    borderLeft: '1px solid var(--color-gold-subtle)',
    boxShadow: '-10px 0 40px rgba(36, 27, 29, 0.15)',
    padding: '2.5rem 2rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid var(--color-rose)',
  },
  tag: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-burgundy)',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.25rem',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.85rem',
    color: 'var(--color-espresso)',
    lineHeight: 1.2,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 200ms ease',
  },
  subtitle: {
    fontSize: '0.9375rem',
    color: 'var(--color-espresso-muted)',
    marginBottom: '1.75rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  rowGroup: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--color-espresso)',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-ivory)',
    border: '1px solid rgba(201, 168, 106, 0.3)',
    borderRadius: '8px',
    outline: 'none',
    color: 'var(--color-espresso)',
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-ivory)',
    border: '1px solid rgba(201, 168, 106, 0.3)',
    borderRadius: '8px',
    outline: 'none',
    color: 'var(--color-espresso)',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '0.875rem 1rem',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-sans)',
    backgroundColor: 'var(--color-ivory)',
    border: '1px solid rgba(201, 168, 106, 0.3)',
    borderRadius: '8px',
    outline: 'none',
    color: 'var(--color-espresso)',
    resize: 'vertical',
  },
  phoneDirectNotice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--color-rose-subtle)',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: 'var(--color-espresso-muted)',
    marginTop: '0.5rem',
  },
  phoneLink: {
    color: 'var(--color-burgundy)',
    fontWeight: 700,
    textDecoration: 'none',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--color-burgundy)',
    color: 'var(--color-ivory)',
    border: 'none',
    borderRadius: '9999px',
    padding: '1.125rem',
    fontSize: '0.9375rem',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: 'var(--shadow-subtle)',
    transition: 'all 200ms ease',
    opacity: 1,
  },
  errorBox: {
    backgroundColor: '#fff1f2',
    color: '#9f1239',
    border: '1px solid #fecdd3',
    borderRadius: '10px',
    padding: '0.9rem 1rem',
    fontSize: '0.92rem',
    lineHeight: 1.5,
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '3rem 1rem',
    gap: '1rem',
  },
  successIconWrapper: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-rose-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    border: '1px solid var(--color-gold)',
  },
  successTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '2.25rem',
    color: 'var(--color-espresso)',
  },
  successText: {
    fontSize: '1.0625rem',
    color: 'var(--color-espresso)',
    lineHeight: 1.6,
  },
  successSubtext: {
    fontSize: '0.9375rem',
    color: 'var(--color-espresso-muted)',
  },
  directContactBox: {
    backgroundColor: 'var(--color-ivory)',
    padding: '1.25rem',
    borderRadius: '12px',
    width: '100%',
    marginTop: '1rem',
    border: '1px solid var(--color-gold-subtle)',
  },
  phoneDirectBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--color-burgundy)',
    color: 'var(--color-ivory)',
    padding: '0.625rem 1.25rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  doneBtn: {
    backgroundColor: 'transparent',
    color: 'var(--color-espresso)',
    border: '1px solid var(--color-espresso-muted)',
    borderRadius: '9999px',
    padding: '0.75rem 2rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1.5rem',
  },
};
