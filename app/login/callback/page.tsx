'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { processReferral } from '@/lib/referral'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (status === 'loading') return
      
      if (status === 'unauthenticated') {
        router.push('/login')
        return
      }

      if (status === 'authenticated' && session?.user) {
        const ref = searchParams.get('ref')
        
        if (ref) {
          setIsProcessing(true)
          try {
            // Process referral for OAuth user
            await processReferral(ref, session.user.id)
            console.log(`Referral processed successfully for OAuth user ${session.user.id} with code ${ref}`)
          } catch (error) {
            console.error('Failed to process referral for OAuth user:', error)
            setError('Failed to process referral code. Your account was created successfully.')
          } finally {
            setIsProcessing(false)
          }
        }
        
        // Redirect to home page
        router.push('/')
      }
    }

    handleOAuthCallback()
  }, [status, session, searchParams, router])

  if (status === 'loading' || isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Processing...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <LoadingSpinner size="lg" text="Setting up your account..." />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Account Created</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded"
            >
              Continue to Home
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
