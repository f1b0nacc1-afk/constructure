import React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Constructure - Визуальный конструктор курсов',
  description: 'Современная платформа для создания интерактивных образовательных курсов с drag & drop интерфейсом',
  keywords: 'конструктор курсов, образование, drag and drop, визуализация, обучение',
  authors: [{ name: 'Constructure Team' }],
  creator: 'Constructure',
  publisher: 'Constructure',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://constructure.app',
    title: 'Constructure - Визуальный конструктор курсов',
    description: 'Создавайте интерактивные образовательные курсы с помощью современного drag & drop интерфейса',
    siteName: 'Constructure',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructure - Визуальный конструктор курсов',
    description: 'Создавайте интерактивные образовательные курсы с помощью современного drag & drop интерфейса',
    creator: '@constructure',
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
        {children}
      </body>
    </html>
  )
} 