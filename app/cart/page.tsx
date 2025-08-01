import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, Shield, Truck, Crown } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  // Sample cart items
  const cartItems = [
    {
      id: 1,
      name: "Hawkwinds Robe",
      price: 3.99,
      quantity: 1,
      image: "/medieval-robe.png",
      shard: "Arirang",
      category: "Mage Items"
    },
    {
      id: 2,
      name: "SDI Spellbook 40 Plus",
      price: 6.49,
      quantity: 2,
      image: "/medieval-chest-armor.png",
      shard: "All Shards",
      category: "Mage Items"
    },
    {
      id: 3,
      name: "Shadow's Fury",
      price: 8.99,
      quantity: 1,
      image: "/medieval-helmet.png",
      shard: "All Shards",
      category: "Thief Items"
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-amber-600 hover:text-amber-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="h-8 w-8 mr-3 text-amber-600" />
              Shopping Cart
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <Badge variant="outline" className="text-xs mt-1">{item.shard}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price} each</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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

                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure Payment</span>
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Empty Cart State (hidden when items exist) */}
          {cartItems.length === 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 text-center py-12">
              <CardContent>
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started!</p>
                <Link href="/">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 