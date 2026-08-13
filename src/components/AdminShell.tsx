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
      <div className="min-h-screen bg-[#F7F1E8] px-4 py-16 text-[#1f1f1f]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F7F1E8] text-[#1f1f1f]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-6">
          <AdminGuard>{children}</AdminGuard>
        </main>
      </div>
    </div>
  );
}
