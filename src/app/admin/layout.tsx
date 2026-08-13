import React from 'react';
import '../globals.css';
import AdminShell from '@/components/AdminShell';

export const metadata = {
  title: 'Aima Glow Studio — Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
