import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Shield, Truck, Crown, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  // Sample order data
  const orderItems = [
    {
      id: 1,
      name: "Hawkwinds Robe",
      price: 3.99,
      quantity: 1,
      image: "/medieval-robe.png",
      shard: "Arirang"
    },
    {
      id: 2,
      name: "SDI Spellbook 40 Plus",
      price: 6.49,
      quantity: 2,
      image: "/medieval-chest-armor.png",
      shard: "All Shards"
    }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link href="/cart" className="flex items-center text-amber-600 hover:text-amber-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CreditCard className="h-8 w-8 mr-3 text-amber-600" />
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discord">Discord Username (Optional)</Label>
                    <Input id="discord" placeholder="username#1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shard">Preferred Shard</Label>
                    <Input id="shard" placeholder="Atlantic" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="character">Character Name</Label>
                    <Input id="character" placeholder="Your UO Character Name" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <Badge variant="outline" className="text-xs">{item.shard}</Badge>
                        </div>
                        <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-amber-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Place Order
                  </Button>

                  {/* Trust Indicators */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Shield className="h-4 w-4" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Truck className="h-4 w-4" />
                      <span>Instant Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2 text-amber-600">
                      <Crown className="h-4 w-4" />
                      <span>Trusted Seller</span>
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 text-center">
                    By placing your order, you agree to our{" "}
                    <Link href="/terms" className="text-amber-600 hover:text-amber-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-amber-600 hover:text-amber-700">
                      Privacy Policy
                    </Link>
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