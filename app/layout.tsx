import type { Metadata } from 'next';
import './globals.css';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';
import { WebVitals } from './web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'Affiliate Aggregator',
  description: 'Global affiliate networks tracking and management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
