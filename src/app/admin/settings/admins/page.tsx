"use client";
import React, { useEffect, useState } from 'react';

type Admin = { id: string; user_id: string; role: string; display_name: string | null; email: string | null };

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/profiles', { credentials: 'same-origin' });
    const body = await res.json();
    if (res.ok) setAdmins(body.admins || []);
    else setError(body.error || 'Failed to load');
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/profiles', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const body = await res.json();
    if (res.ok) {
      setEmail(''); setRole('admin'); fetchAdmins();
    } else {
      setError(body.error || 'Failed to create');
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Admin Users</h2>

      <form onSubmit={handleCreate} className="mb-6 max-w-md">
        <div className="mb-2">
          <label className="block text-sm">Email</label>
          <input className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Role</label>
          <select className="w-full border px-3 py-2 rounded" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-[#651F32] text-white rounded">Create Admin</button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="bg-white rounded shadow p-4">
        {loading ? <div>Loading...</div> : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-2">Display</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.display_name ?? '—'}</td>
                  <td className="py-2">{a.email ?? a.user_id}</td>
                  <td className="py-2">{a.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
