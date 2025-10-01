import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
