"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingProvider from '@/components/BookingProvider';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <BookingProvider>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </BookingProvider>
  );
}
