import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Reset Password - UO King | Recover Your Account Access",
  description: "Reset your UO King account password securely. Enter your email to receive password reset instructions. Quick and secure account recovery process.",
  keywords: "reset password, forgot password, account recovery, UO King, password reset, account access, secure recovery",
  openGraph: {
    title: "Reset Password - UO King | Recover Your Account Access",
    description: "Reset your UO King account password securely. Enter your email to receive password reset instructions. Quick and secure account recovery process.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/forgot-password`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Reset Password - UO King | Recover Your Account Access",
    description: "Reset your UO King account password securely. Enter your email to receive password reset instructions. Quick and secure account recovery process.",
  },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
