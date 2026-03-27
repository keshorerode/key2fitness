import type { Metadata } from 'next'
import { Bebas_Neue, Barlow_Condensed, Barlow } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

const barlow = Barlow({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Key 2 Fitness Unisex Gym',
  description: 'The Key 2 Fitness — Unisex gym in Erode, Tamil Nadu. Personal training, CrossFit, fat reduction and more.',
  keywords: 'gym, fitness, Erode, unisex gym, personal training, CrossFit, Tamil Nadu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  )
}
