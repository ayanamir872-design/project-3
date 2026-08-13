import type { Metadata } from 'next';
import './globals.css';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Aima Glow Studio | Luxury Beauty, Skincare & Lash Artistry',
  description: 'Where beauty becomes your signature. Bespoke Hydrafacials, refined Nail Art, and Eyelashes Artistry at Aima Glow Studio. Professional beauty experiences designed to enhance your natural glow.',
  keywords: ['Aima Glow Studio', 'Hydrafacial', 'Nail Art', 'Eyelashes Art', 'Beauty Salon', 'Luxury Skincare', 'Pakistani Beauty Salon'],
  authors: [{ name: 'Aima Glow Studio' }],
  openGraph: {
    title: 'Aima Glow Studio | Luxury Beauty Studio',
    description: 'Where beauty becomes your signature. Premium skincare, nail art, and lash artistry.',
    images: ['/images/logo.jpeg'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/images/logo.jpeg" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
