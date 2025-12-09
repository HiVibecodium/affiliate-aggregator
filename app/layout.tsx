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
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { JsonLd } from '@/components/JsonLd';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { ToastProvider } from '@/components/Toast';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateSoftwareApplicationSchema,
} from '@/lib/seo/structured-data';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Search Engine Verification - Add your codes here after registering */}
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="p1cIXuadbLcYL6mD1hJFnRn3ma9r6OkIl9etzF4bY0U"
        />

        {/* Bing Webmaster Tools Verification */}
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}

        {/* Yandex Webmaster Verification (optional - for Russian market) */}
        {process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && (
          <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION} />
        )}

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AffAgg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <JsonLd
          data={[
            generateOrganizationSchema(),
            generateWebsiteSchema(),
            generateSoftwareApplicationSchema(),
          ]}
        />
        <OfflineIndicator />
        <WebVitals />
        <ThemeProvider>
          <OrganizationProvider>
            <ComparisonProvider>
              <ToastProvider>
                <Navbar />
                <div className="animate-page-enter">{children}</div>
                <ComparisonBar />
                <BottomNav />
                <PWAInstallPrompt />
                <PWAUpdateNotification />
              </ToastProvider>
            </ComparisonProvider>
          </OrganizationProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
