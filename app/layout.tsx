import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'SOYUZ BC — Professional Hockey Sticks',
    template: '%s | SOYUZ BC',
  },
  description: 'SOYUZ BC North America — Professional hockey sticks designed for elite athletes. Shop HIT ULTRA, CLASSIC, MASTER FRST, LORD Goalie series.',
  keywords: ['hockey sticks', 'SOYUZ', 'professional hockey', 'elite athletes', 'carbon fiber hockey sticks'],
  authors: [{ name: 'SOYUZ BC North America' }],
  openGraph: {
    title: 'SOYUZ BC — Professional Hockey Sticks',
    description: 'Designed for elite athletes. Shop professional hockey sticks.',
    url: 'https://soyuz-app-dashboard.vercel.app',
    siteName: 'SOYUZ BC',
    locale: 'en_US',
    type: 'website',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0D0D0D',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#0D0D0D] text-white antialiased min-h-screen overflow-x-hidden">
        <Header />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
