import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us - UO King | Ultima Online Support & Customer Service",
  description: "Get in touch with UO King's support team. We're here to help with all your Ultima Online needs. Contact us via Discord, email, or live chat for fast assistance.",
  keywords: "contact, support, Ultima Online, UO King, customer service, help, discord, email, live chat, assistance",
  openGraph: {
    title: "Contact Us - UO King | Ultima Online Support & Customer Service",
    description: "Get in touch with UO King's support team. We're here to help with all your Ultima Online needs. Contact us via Discord, email, or live chat for fast assistance.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/contact`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Contact Us - UO King | Ultima Online Support & Customer Service",
    description: "Get in touch with UO King's support team. We're here to help with all your Ultima Online needs. Contact us via Discord, email, or live chat for fast assistance.",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
