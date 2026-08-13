"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const response = await fetch('/api/admin/check-role', {
          method: 'GET',
          credentials: 'same-origin',
        });

        if (!response.ok) {
          router.replace('/admin/login');
          return;
        }

        const body = await response.json();
        const role = body?.role;
        if (!role || (role !== 'admin' && role !== 'superadmin' && role !== 'staff')) {
          router.replace('/admin/login');
          return;
        }
      } catch (err) {
        console.error('Auth check failed', err);
        router.replace('/admin/login');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    check();

    return () => { mounted = false; };
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading admin...</div>;
  }

  return <>{children}</>;
}
