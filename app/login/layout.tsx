import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Login - UO King | Sign In to Your Account",
  description: "Sign in to your UO King account to access premium Ultima Online items, gold, and services. Secure login with Google, Discord, or email authentication.",
  keywords: "login, sign in, UO King account, Ultima Online login, secure authentication, user account, access account",
  openGraph: {
    title: "Login - UO King | Sign In to Your Account",
    description: "Sign in to your UO King account to access premium Ultima Online items, gold, and services. Secure login with Google, Discord, or email authentication.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/login`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Login - UO King | Sign In to Your Account",
    description: "Sign in to your UO King account to access premium Ultima Online items, gold, and services. Secure login with Google, Discord, or email authentication.",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
