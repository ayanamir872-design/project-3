"use client";
import React, { useState } from 'react';

export default function AdminHeader() {
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
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <h1 className="text-lg font-medium">Admin</h1>
      <div className="flex items-center gap-4">
        <button className="px-3 py-2 bg-[#651F32] text-white rounded" onClick={() => window.location.href = '/admin/new'}>Quick Action</button>
        <button className="px-3 py-2 border rounded" onClick={signOut} disabled={loading}>{loading ? 'Signing out...' : 'Sign out'}</button>
      </div>
    </header>
  );
}
