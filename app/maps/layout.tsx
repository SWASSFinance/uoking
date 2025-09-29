import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Interactive Maps - UO King | Ultima Online Map Viewer & Plot Locations",
  description: "Explore interactive Ultima Online maps with plot locations, treasure spots, and strategic points. Find the best locations for your UO adventures with our detailed map viewer.",
  keywords: "Ultima Online maps, UO map viewer, plot locations, treasure maps, interactive maps, UO King, Ultima Online locations, map coordinates",
  openGraph: {
    title: "Interactive Maps - UO King | Ultima Online Map Viewer & Plot Locations",
    description: "Explore interactive Ultima Online maps with plot locations, treasure spots, and strategic points. Find the best locations for your UO adventures with our detailed map viewer.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/maps`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Interactive Maps - UO King | Ultima Online Map Viewer & Plot Locations",
    description: "Explore interactive Ultima Online maps with plot locations, treasure spots, and strategic points. Find the best locations for your UO adventures with our detailed map viewer.",
  },
}

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
