import type { Metadata } from 'next';
import './globals.css';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';
import { WebVitals } from './web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { defaultMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AffAgg" />
      </head>
      <body>
        <WebVitals />
        <ComparisonProvider>
          {children}
          <ComparisonBar />
        </ComparisonProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
