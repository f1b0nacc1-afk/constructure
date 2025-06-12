import React from 'react'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/layout'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Constructure - Конструктор образовательных курсов',
  description: 'Современная платформа для создания и изучения интерактивных образовательных курсов',
  keywords: 'конструктор курсов, образование, drag and drop, визуализация, обучение',
  authors: [{ name: 'Constructure Team' }],
  creator: 'Constructure',
  publisher: 'Constructure',
  robots: 'index, follow',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`),
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`),
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: 'Constructure - Конструктор образовательных курсов',
    description: 'Создавайте интерактивные образовательные курсы с помощью современного drag & drop интерфейса',
    url: 'https://constructure.app/',
    siteName: 'Constructure',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@constructure',
    title: 'Constructure - Конструктор образовательных курсов',
    description: 'Создавайте интерактивные образовательные курсы с помощью современного drag & drop интерфейса',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
} 