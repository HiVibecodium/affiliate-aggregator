import type { Metadata } from 'next'
import './globals.css'
import { ComparisonProvider } from '@/contexts/ComparisonContext'
import { ComparisonBar } from '@/components/ComparisonBar'

export const metadata: Metadata = {
  title: 'Affiliate Aggregator',
  description: 'Global affiliate networks tracking and management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ComparisonProvider>
          {children}
          <ComparisonBar />
        </ComparisonProvider>
      </body>
    </html>
  )
}
