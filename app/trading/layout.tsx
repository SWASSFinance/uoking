import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Trading - UO King | Buy & Sell Ultima Online Items",
  description: "Trade your Ultima Online items with other players. Buy and sell UO items, gold, and equipment through our secure trading platform. Safe transactions guaranteed.",
  keywords: "trading, buy, sell, Ultima Online items, UO trading, player trading, secure trading, UO King, trade items, UO marketplace",
  openGraph: {
    title: "Trading - UO King | Buy & Sell Ultima Online Items",
    description: "Trade your Ultima Online items with other players. Buy and sell UO items, gold, and equipment through our secure trading platform. Safe transactions guaranteed.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/trading`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Trading - UO King | Buy & Sell Ultima Online Items",
    description: "Trade your Ultima Online items with other players. Buy and sell UO items, gold, and equipment through our secure trading platform. Safe transactions guaranteed.",
  },
}

export default function TradingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
