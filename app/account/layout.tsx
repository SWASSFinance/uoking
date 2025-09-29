import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "My Account - UO King | Manage Your Profile & Orders",
  description: "Manage your UO King account, view order history, update profile settings, and access your Ultima Online gaming preferences. Secure account management.",
  keywords: "account, profile, orders, settings, UO King account, user dashboard, order history, account management, Ultima Online profile",
  openGraph: {
    title: "My Account - UO King | Manage Your Profile & Orders",
    description: "Manage your UO King account, view order history, update profile settings, and access your Ultima Online gaming preferences. Secure account management.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/account`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "My Account - UO King | Manage Your Profile & Orders",
    description: "Manage your UO King account, view order history, update profile settings, and access your Ultima Online gaming preferences. Secure account management.",
  },
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
