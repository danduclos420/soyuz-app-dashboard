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

import DevOverlay from '@/components/dev/DevOverlay';
import WixModeManager from '@/components/dev/WixModeManager';
import StudioSidebar from '@/components/dev/StudioSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bebas+Neue&family=Cinzel:wght@400;900&family=Dancing+Script:wght@700&family=Ewert&family=Fascinate+Inline&family=Faster+One&family=Fredericka+the+Great&family=Goldman:wght@400;700&family=Great+Vibes&family=Michroma&family=Monoton&family=Montserrat:wght@400;900&family=Nosifer&family=Orbitron:wght@400;900&family=Permanent+Marker&family=Playball&family=Press+Start+2P&family=Rye&family=Stalinist+One&family=Syncopate:wght@400;700&family=Ultra&family=UnifrakturMaguntia&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0D0D0D] text-white antialiased min-h-screen overflow-x-hidden">
        <WixModeManager />
        <Header />
        <main className="relative">
          {children}
        </main>
        <Footer />
        <DevOverlay />
        <StudioSidebar />
      </body>
    </html>
  );
}
