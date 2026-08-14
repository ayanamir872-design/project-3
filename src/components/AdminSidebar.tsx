"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const links = [
    { href: '/admin', label: 'Dashboard', match: pathname === '/admin' || pathname === '/admin/dashboard' },
    { href: '/admin/appointments', label: 'Appointments', match: pathname.startsWith('/admin/appointments') },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/media', label: 'Media' },
    { href: '/admin/customers', label: 'Customers' },
    { href: '/admin/staff', label: 'Staff' },
    { href: '/admin/reviews', label: 'Reviews' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-brand-mark">AG</span>
        <div>
          <h2>Aima Glow Studio</h2>
          <p>Admin workspace</p>
        </div>
      </div>
      <nav className="admin-nav" aria-label="Admin navigation">
        <p className="admin-nav-label">Workspace</p>
        {links.map((link) => (
          <Link href={link.href} key={link.href} className={`admin-nav-link${link.match ? ' is-active' : ''}`} aria-current={link.match ? 'page' : undefined}>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="admin-sidebar-note"><span className="admin-status-indicator" /> Supabase Auth protected</div>
    </aside>
  );
}
