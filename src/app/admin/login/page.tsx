"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="admin-login-page">
      <div className="admin-login-brand" aria-label="Aima Glow Studio">
        <span className="admin-brand-mark">AG</span>
        <span>Aima Glow Studio</span>
      </div>
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-heading">
          <span className="admin-login-kicker">Studio workspace</span>
          <h1 id="admin-login-title">Welcome back</h1>
          <p>Sign in to manage appointments and daily studio operations.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-username">Admin email</label>
            <input id="admin-username" type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>
          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-password-field">
              <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="admin-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="submit" className="admin-login-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {message && <p role="alert" className="admin-login-error">{message}</p>}
      </section>
      <p className="admin-login-footer">Secure access for studio staff</p>
    </main>
  );
}
