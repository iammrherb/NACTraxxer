import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portnox Deployment Tracker - ABM Industries',
  description: 'Enterprise Network Access Control deployment tracking and architecture design tool',
    generator: 'v0.dev'
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
