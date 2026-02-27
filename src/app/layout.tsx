import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: '성경친구 - 어린이 성경 공부',
  description: '재미있게 성경을 배워요! 이야기, 퀴즈, 암송, 색칠하기',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#87CEEB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="app-shell">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  )
}
