"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#651F32]">Aima Glow Admin</h2>
        <p className="text-sm text-gray-500">Control panel</p>
      </div>
      <nav className="space-y-2">
        <Link href="/admin" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Dashboard</Link>
        <Link href="/admin/appointments" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Appointments</Link>
        <Link href="/admin/services" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Services</Link>
        <Link href="/admin/media" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Media</Link>
        <Link href="/admin/customers" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Customers</Link>
        <Link href="/admin/staff" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Staff</Link>
        <Link href="/admin/reviews" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Reviews</Link>
        <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-[#F2EDE8]">Settings</Link>
      </nav>
    </aside>
  );
}
