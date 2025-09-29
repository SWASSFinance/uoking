import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign Up - UO King | Create Your Account",
  description: "Join UO King and create your account to access premium Ultima Online items, gold, and services. Fast registration with secure authentication.",
  keywords: "sign up, register, create account, UO King, Ultima Online, account registration, new user",
  openGraph: {
    title: "Sign Up - UO King | Create Your Account",
    description: "Join UO King and create your account to access premium Ultima Online items, gold, and services. Fast registration with secure authentication.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/signup`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Sign Up - UO King | Create Your Account",
    description: "Join UO King and create your account to access premium Ultima Online items, gold, and services. Fast registration with secure authentication.",
  },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
