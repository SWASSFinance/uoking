"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Package,
  User,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Shield,
  Eye,
  EyeOff
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  id: string
  product_name: string
  product_slug?: string
  product_image?: string
  quantity: number
  unit_price: string
  total_price: string
  category?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: string
  discount_amount?: string
  premium_discount?: string
  cashback_used?: string
  total_amount: string
  currency: string
  payment_method: string
  delivery_shard: string
  coupon_code?: string
  gift_name?: string
  created_at: string
  items: OrderItem[]
}

export default function PaymentPendingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPopupInstructions, setShowPopupInstructions] = useState(false)

  const orderId = params.orderId as string

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/login')
      return
    }

    fetchOrder()
  }, [session, status, orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        setError('Order not found or access denied')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading order details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <Button asChild>
                <Link href="/account?tab=orders">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/account?tab=orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Pending</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Order #{order.order_number} • Created {new Date(order.created_at).toLocaleDateString()}
            </p>
            <Badge className="mt-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
              Awaiting Payment
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Instructions */}
            <div className="space-y-6">
              {/* Live Chat Instructions */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Complete Your Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Step 1: Contact Us</h3>
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                      Use the live chat widget in the bottom right corner of your screen to contact us about payment.
                    </p>
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 text-sm">
                      <MessageSquare className="h-4 w-4" />
                      <span>Look for the chat bubble in the bottom right</span>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Step 2: Payment Options</h3>
                    <p className="text-green-800 dark:text-green-200 text-sm mb-2">
                      We accept the following payment methods:
                    </p>
                    <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                      <li>• <strong>Venmo:</strong> Quick and easy mobile payments</li>
                      <li>• <strong>Zelle:</strong> Bank-to-bank transfers</li>
                      <li>• <strong>CashApp:</strong> Instant mobile payments</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Step 3: Order Confirmation</h3>
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                      Once payment is received and verified, we'll approve your order and begin processing for delivery.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Don't See Live Chat?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Disable popup blockers</strong> - Some browsers block the chat widget
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Refresh the page</strong> - Sometimes the chat widget needs a moment to load
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 dark:text-orange-400 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Try a different browser</strong> - Chrome, Firefox, or Safari usually work best
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPopupInstructions(!showPopupInstructions)}
                    className="mt-3 w-full"
                  >
                    {showPopupInstructions ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Popup Blocker Instructions
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show Popup Blocker Instructions
                      </>
                    )}
                  </Button>

                  {showPopupInstructions && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Disable Popup Blockers:</h4>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>Chrome:</strong> Click the popup blocked icon in the address bar, then "Always allow popups"</p>
                        <p><strong>Firefox:</strong> Click the shield icon in the address bar, then "Disable Blocking"</p>
                        <p><strong>Safari:</strong> Go to Safari → Preferences → Websites → Pop-up Windows → Allow</p>
                        <p><strong>Edge:</strong> Click the popup blocked notification, then "Always allow"</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Details */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{item.product_name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                          {item.category && (
                            <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            ${parseFloat(item.total_price).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            ${parseFloat(item.unit_price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Gift Item */}
                    {order.gift_name && (
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">{order.gift_name}</h4>
                          <Badge className="bg-amber-200 text-amber-800 text-xs mt-1">FREE GIFT</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400 text-sm">FREE</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                      <span className="font-medium dark:text-white">${parseFloat(order.subtotal).toFixed(2)}</span>
                    </div>
                    
                    {parseFloat(order.premium_discount || '0') > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Premium Discount</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          -${parseFloat(order.premium_discount || '0').toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(order.discount_amount || '0') > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Discount {order.coupon_code && `(${order.coupon_code})`}
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -${parseFloat(order.discount_amount || '0').toFixed(2)}
                        </span>
                      </div>
                    )}

                    {parseFloat(order.cashback_used || '0') > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Cashback Applied</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -${parseFloat(order.cashback_used || '0').toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="dark:text-white">Total Due</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Shard:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{order.delivery_shard}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">Payment Method:</span>
                      <p className="font-medium text-gray-900 dark:text-white">Manual Payment (Venmo/Zelle/CashApp)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Secure Transaction</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Your order is securely stored and will only be processed after payment confirmation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


