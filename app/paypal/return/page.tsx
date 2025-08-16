"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PayPalReturnPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'cancelled'>('loading')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const handleReturn = async () => {
      const token = searchParams.get('token')
      const payerId = searchParams.get('PayerID')
      const cancelled = searchParams.get('cancelled')

      if (cancelled === 'true') {
        setStatus('cancelled')
        return
      }

      if (!token || !payerId) {
        setStatus('error')
        setErrorMessage('Invalid PayPal return parameters')
        return
      }

      try {
        // Capture the payment
        const response = await fetch('/api/paypal/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paypalOrderId: token
          }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus('success')
          setOrderId(data.orderId)
          
          toast({
            title: "Payment Successful!",
            description: "Your order has been processed and payment completed.",
            variant: "default",
          })
        } else {
          setStatus('error')
          setErrorMessage(data.message || 'Payment capture failed')
          
          toast({
            title: "Payment Failed",
            description: data.message || "Failed to process payment. Please contact support.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Payment capture error:', error)
        setStatus('error')
        setErrorMessage('An error occurred while processing your payment')
        
        toast({
          title: "Payment Error",
          description: "An error occurred while processing your payment. Please contact support.",
          variant: "destructive",
        })
      }
    }

    if (session) {
      handleReturn()
    }
  }, [session, searchParams, toast])

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-8 text-center">
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">Please log in to view this page.</p>
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/login">Log In</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-900">
                Payment Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              {status === 'loading' && (
                <div>
                  <LoadingSpinner size="lg" text="Processing your payment..." />
                  <p className="text-gray-600 mt-4">
                    Please wait while we process your payment...
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-4">
                    Your order has been processed and payment completed successfully.
                  </p>
                  {orderId && (
                    <p className="text-sm text-gray-500 mb-6">
                      Order ID: {orderId}
                    </p>
                  )}
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                      <Link href="/account">View My Orders</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/store">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                  <p className="text-gray-600 mb-4">
                    {errorMessage || 'There was an error processing your payment.'}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Please contact support if you believe this is an error.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                      <Link href="/cart">Return to Cart</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              )}

              {status === 'cancelled' && (
                <div>
                  <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
                  <p className="text-gray-600 mb-4">
                    You cancelled the payment process. Your order has not been charged.
                  </p>
                  <div className="space-y-3">
                    <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                      <Link href="/cart">Return to Cart</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/store">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 