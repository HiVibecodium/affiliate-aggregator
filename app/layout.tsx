import type { Metadata } from 'next';
import './globals.css';
import './tour.css';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { ComparisonBar } from '@/components/ComparisonBar';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { WebVitals } from './web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { defaultMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Search Engine Verification - Add your codes here after registering */}
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="p1cIXuadbLcYL6mD1hJFnRn3ma9r6OkIl9etzF4bY0U"
        />

        {/* TODO: Add Bing Webmaster verification code */}
        {/* <meta name="msvalidate.01" content="YOUR_BING_CODE" /> */}

        {/* TODO: Add Yandex Webmaster verification code (optional) */}
        {/* <meta name="yandex-verification" content="YOUR_YANDEX_CODE" /> */}

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AffAgg" />
      </head>
      <body>
        <WebVitals />
        <ThemeProvider>
          <OrganizationProvider>
            <ComparisonProvider>
              {children}
              <ComparisonBar />
            </ComparisonProvider>
          </OrganizationProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
