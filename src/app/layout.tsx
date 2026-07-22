import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'  // ✅ HARUS ADA

export const metadata: Metadata = {
  title: 'Lp CMS - Company Profile Pro',
  description: 'Platform manajemen konten website profesional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Analytics />  {/* ✅ HARUS ADA */}
      </body>
    </html>
  )
}