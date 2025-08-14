"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return

    // If no session, redirect to login
    if (!session) {
      router.push('/login')
      return
    }

    // If user is not admin, redirect to homepage
    if (!session.user?.isAdmin) {
      router.push('/')
      return
    }

    // User is authenticated and is admin
    setIsAuthorized(true)
  }, [session, status, router])

  // Show loading while checking authentication
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <>{children}</>
} 