import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Memory Gap Demo - Persistent Memory for AI Agents',
  description: 'Demonstrating the #1 user-requested AI feature: memory that persists across sessions',
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
