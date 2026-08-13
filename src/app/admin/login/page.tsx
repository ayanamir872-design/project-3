"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const body = await response.json().catch(() => ({ error: 'Unable to sign in.' }));
      if (!response.ok) {
        throw new Error(body.error || 'Unable to sign in. Check your credentials.');
      }

      router.replace('/admin/dashboard');
      router.refresh();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md border border-[#e7ddd2] bg-white p-8 shadow-sm">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#756b64]">Aima Glow Studio</p>
      <h2 className="mb-2 text-2xl font-semibold text-[#651F32]">Admin sign in</h2>
      <p className="mb-6 text-sm text-[#756b64]">Use your Supabase Auth admin email and password.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="admin-username">Admin email</label>
          <input id="admin-username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required className="w-full border border-[#d8cbc0] px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full border border-[#d8cbc0] px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-[#651F32] px-4 py-3 font-medium text-white" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {message && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm text-red-800">{message}</p>}
    </div>
  );
}
