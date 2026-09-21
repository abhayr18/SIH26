import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { PwaRegister } from '@/components/pwa-register';

const gilroySans = Plus_Jakarta_Sans({
  variable: '--font-gilroy',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
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
  title: 'HeatVector — Heatwave Early Warning',
  description:
    'District heat-risk intelligence, early warning and response support for India.',
  manifest: '/manifest.webmanifest',
  applicationName: 'HeatVector',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HeatVector',
  },
  openGraph: {
    title: 'HeatVector — Heatwave Early Warning',
    description:
      'District heat-risk intelligence, early warning and response support for India.',
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
    title: 'HeatVector — Heatwave Early Warning',
    description:
      'District heat-risk intelligence, early warning and response support for India.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gilroySans.variable} ${monoFont.variable} antialiased bg-white text-[#0e0f10]`}>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
