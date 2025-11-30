import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { CartProvider } from "./cart/CartContext";

export const metadata: Metadata = {
  title: 'Luxxe Labels - High Fashion, Higher Standards',
  description: 'Discover timeless elegance and unwavering commitment to quality with Luxxe Labels. Premium luxury fashion and accessories designed with passion and precision.',
  keywords: 'luxury fashion, high fashion, premium accessories, designer clothing, luxury brands, Luxxe Labels',
  authors: [{ name: 'Luxxe Labels' }],
  creator: 'Luxxe Labels',
  publisher: 'Luxxe Labels',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { UserProvider } = require("./user/UserContext");
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <UserProvider>
          <CartProvider>
            {children}
            <Analytics />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
