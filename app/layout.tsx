import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOYUZ BC North America | Hockey Sticks',
  description: 'Official SOYUZ BC North America store. Professional hockey sticks, B2B portal and affiliate program.',
  keywords: 'hockey sticks, SOYUZ, batons de hockey, KHL, professional hockey',
  openGraph: {
    title: 'SOYUZ BC North America',
    description: 'Professional hockey sticks - Strength in Unity, Power with SOYUZ',
    url: 'https://soyuz-app-dashboard.vercel.app',
    siteName: 'SOYUZ BC North America',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen carbon-texture">
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
