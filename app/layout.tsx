import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

const interSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const displayFont = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thermowatch-sih26083.vercel.app'),
  title: 'HeatVector — Heatwave Early Warning & Decision Support',
  description:
    'District heat-risk intelligence, early warning and response decision support for India.',
  manifest: '/manifest.webmanifest',
  applicationName: 'HeatVector',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HeatVector',
  },
  openGraph: {
    title: 'HeatVector — Heatwave Early Warning & Decision Support',
    description:
      'District heat-risk intelligence, early warning and response decision support for India.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'HeatVector heatwave early warning dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HeatVector — Heatwave Early Warning & Decision Support',
    description:
      'District heat-risk intelligence, early warning and response decision support for India.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} ${displayFont.variable} ${monoFont.variable} antialiased bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white`}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
