import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shopping Cart - UO King | Ultima Online Items & Gold",
  description: "Review your Ultima Online items and gold in your shopping cart. Secure checkout with multiple payment options. Fast delivery to all UO shards.",
  keywords: "shopping cart, Ultima Online items, UO gold, checkout, payment, UO King, cart, purchase, buy UO items",
  openGraph: {
    title: "Shopping Cart - UO King | Ultima Online Items & Gold",
    description: "Review your Ultima Online items and gold in your shopping cart. Secure checkout with multiple payment options. Fast delivery to all UO shards.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/cart`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Shopping Cart - UO King | Ultima Online Items & Gold",
    description: "Review your Ultima Online items and gold in your shopping cart. Secure checkout with multiple payment options. Fast delivery to all UO shards.",
  },
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
