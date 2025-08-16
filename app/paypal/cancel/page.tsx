"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PayPalCancelPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id')
    if (orderIdParam) {
      setOrderId(orderIdParam)
    }
  }, [searchParams])

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-8 text-center">
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
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Problem!</h2>
              <p className="text-gray-600 mb-4">
                You cancelled the payment process. Your order has not been charged and no money has been taken from your account.
              </p>
              {orderId && (
                <p className="text-sm text-gray-500 mb-6">
                  Order ID: {orderId}
                </p>
              )}
              <p className="text-sm text-gray-600 mb-6">
                You can return to your cart and try again whenever you're ready, or browse our store for other items.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                  <Link href="/cart">Return to Cart</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/store">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 