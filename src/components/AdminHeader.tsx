"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminHeader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
      setLoading(false);
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="admin-header">
      <div>
        <p className="admin-header-context">Aima Glow Studio</p>
        <h1>{pathname.startsWith('/admin/appointments') ? 'Appointments' : pathname.startsWith('/admin/services') ? 'Services' : pathname === '/admin' || pathname === '/admin/dashboard' ? 'Dashboard' : 'Admin workspace'}</h1>
      </div>
      <div className="admin-header-actions">
        <button className="btn btn-primary" onClick={() => window.location.href = '/admin/services'}>Manage services</button>
        <button className="btn btn-secondary" onClick={signOut} disabled={loading}>{loading ? 'Signing out...' : 'Sign out'}</button>
      </div>
    </header>
  );
}
