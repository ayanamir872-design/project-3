"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AdminGuard from '@/components/AdminGuard';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return (
      <div className="admin-auth-shell">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-app-shell">
      <AdminSidebar />
      <div className="admin-content-shell">
        <AdminHeader />
        <main className="admin-main-content">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
    </div>
  );
}
