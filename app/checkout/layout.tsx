import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Checkout - UO King | Secure Payment & Order Processing",
  description: "Complete your Ultima Online purchase securely. Fast checkout with multiple payment options including credit cards, PayPal, and cryptocurrency. Instant delivery to all UO shards.",
  keywords: "checkout, payment, order, purchase, Ultima Online items, UO gold, secure payment, credit card, PayPal, cryptocurrency, instant delivery",
  openGraph: {
    title: "Checkout - UO King | Secure Payment & Order Processing",
    description: "Complete your Ultima Online purchase securely. Fast checkout with multiple payment options including credit cards, PayPal, and cryptocurrency. Instant delivery to all UO shards.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/checkout`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Checkout - UO King | Secure Payment & Order Processing",
    description: "Complete your Ultima Online purchase securely. Fast checkout with multiple payment options including credit cards, PayPal, and cryptocurrency. Instant delivery to all UO shards.",
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
