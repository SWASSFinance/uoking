"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useCart } from "@/contexts/cart-context"
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Package,
  Shield,
  DollarSign,
  AlertCircle,
  Tag,
  X,
  Gift,
  Crown
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { cart, updateQuantity, removeItem, clearCart, syncToServer } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [cashbackBalance, setCashbackBalance] = useState(0)
  const [cashbackToUse, setCashbackToUse] = useState(0)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [selectedShard, setSelectedShard] = useState('')
  const [shards, setShards] = useState<any[]>([])
  const [isLoadingShards, setIsLoadingShards] = useState(false)
  const [availableGifts, setAvailableGifts] = useState<any[]>([])
  const [selectedGift, setSelectedGift] = useState<string>('')
  const [isLoadingGifts, setIsLoadingGifts] = useState(false)
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [premiumDiscount, setPremiumDiscount] = useState(0)

  // Fetch cashback balance and premium status when user is authenticated
  useEffect(() => {
    if (session?.user?.email) {
      setIsLoadingBalance(true)
      
      // Fetch both cashback balance and user profile
      Promise.all([
        fetch('/api/user/cashback-balance').then(res => res.json()),
        fetch('/api/user/profile').then(res => res.json())
      ])
      .then(([cashbackData, profileData]) => {
        setCashbackBalance(cashbackData.referral_cash || 0)
        setIsPremiumUser(profileData.account_rank === 1)
      })
      .catch(error => {
        console.error('Error fetching user data:', error)
      })
      .finally(() => {
        setIsLoadingBalance(false)
      })
    }
  }, [session])

  // Calculate premium discount when cart or premium status changes
  useEffect(() => {
    if (isPremiumUser && cart.total > 0) {
      // Get premium discount percentage from settings
      fetch('/api/admin/premium-settings')
        .then(res => res.json())
        .then(data => {
          const discountPercentage = data.settings?.premium_discount_percentage || 10
          setPremiumDiscount((cart.total * discountPercentage) / 100)
        })
        .catch(error => {
          console.error('Error fetching premium settings:', error)
          // Fallback to 10% if API fails
          setPremiumDiscount((cart.total * 10) / 100)
        })
    } else {
      setPremiumDiscount(0)
    }
  }, [isPremiumUser, cart.total])

  // Fetch shards
  useEffect(() => {
    setIsLoadingShards(true)
    fetch('/api/shard')
      .then(res => res.json())
      .then(data => {
        setShards(data)
      })
      .catch(error => {
        console.error('Error fetching shards:', error)
      })
      .finally(() => {
        setIsLoadingShards(false)
      })
  }, [])

  // Fetch available gifts based on cart total
  useEffect(() => {
    if (cart.total > 0) {
      setIsLoadingGifts(true)
      fetch(`/api/gifts?cartTotal=${cart.total}`)
        .then(res => res.json())
        .then(data => {
          setAvailableGifts(data || [])
        })
        .catch(error => {
          console.error('Error fetching gifts:', error)
        })
        .finally(() => {
          setIsLoadingGifts(false)
        })
    } else {
      setAvailableGifts([])
      setSelectedGift('')
    }
  }, [cart.total])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId)
    try {
      updateQuantity(itemId, newQuantity)
      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      variant: "default",
    })
  }

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart()
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
        variant: "default",
      })
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      })
      return
    }

    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to apply a coupon",
        variant: "destructive",
      })
      return
    }

    setIsApplyingCoupon(true)
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          cartTotal: cart.total
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAppliedCoupon(data.coupon)
        setCouponCode('')
        toast({
          title: "Coupon Applied!",
          description: `${data.coupon.description} - ${data.coupon.discount_type === 'percentage' ? `${data.coupon.discount_value}% off` : `$${data.coupon.discount_value} off`}`,
        })
      } else {
        toast({
          title: "Invalid Coupon",
          description: data.error || "Failed to apply coupon",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      })
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your cart",
    })
  }

  const handleCheckout = async () => {
    if (!session) {
      toast({
        title: "Login Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    if (cart.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      })
      return
    }

    if (!selectedShard) {
      toast({
        title: "Shard Required",
        description: "Please select a shard for delivery.",
        variant: "destructive",
      })
      return
    }

    // Validate cashback amount
    if (cashbackToUse > cashbackBalance) {
      toast({
        title: "Invalid Cashback Amount",
        description: "Cashback amount cannot exceed your available balance.",
        variant: "destructive",
      })
      return
    }

    if (cashbackToUse > cart.total) {
      toast({
        title: "Invalid Cashback Amount",
        description: "Cashback amount cannot exceed cart total.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)
    try {
      // Create PayPal form checkout
      const response = await fetch('/api/paypal/simple-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cart.items,
          cashbackToUse,
          selectedShard,
          couponCode: appliedCoupon?.code || null,
          giftId: selectedGift || null
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Check if this is a cashback-only order
        const finalTotal = cart.total - (appliedCoupon?.discount_amount || 0) - cashbackToUse
        if (finalTotal <= 0.01) {
          // This is a cashback-only order, complete it directly
          const completeResponse = await fetch('/api/user/complete-cashback-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: data.orderId
            }),
          })

          const completeData = await completeResponse.json()

          if (completeResponse.ok && completeData.success) {
            toast({
              title: "Order Completed!",
              description: `Your order has been completed successfully using $${completeData.cashbackUsed.toFixed(2)} cashback.`,
              variant: "default",
            })
            clearCart()
            router.push('/account?tab=orders')
          } else {
            toast({
              title: "Order Completion Failed",
              description: completeData.error || "Failed to complete order with cashback.",
              variant: "destructive",
            })
          }
        } else {
          // This requires PayPal payment, redirect to PayPal
          const form = document.createElement('form')
          form.method = 'POST'
          form.action = data.paypalUrl
          form.style.display = 'none'

          // Add form fields
          Object.entries(data.paypalFormData).forEach(([key, value]) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = value as string
            form.appendChild(input)
          })

          // Add cmd field for PayPal
          const cmdInput = document.createElement('input')
          cmdInput.type = 'hidden'
          cmdInput.name = 'cmd'
          cmdInput.value = '_xclick'
          form.appendChild(cmdInput)

          document.body.appendChild(form)
          form.submit()
        }
      } else {
        toast({
          title: "Checkout Failed",
          description: data.error || "Failed to create order. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Error",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-12">
              <ShoppingCart className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to see items here!
              </p>
              <div className="space-x-4">
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/store">
                    <Package className="h-4 w-4 mr-2" />
                    Browse Products
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
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
        <div className="container mx-auto max-w-6xl">
          {/* Continue Shopping Button */}
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Shopping Cart</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''} in your cart
                </p>
              </div>
              <Button variant="outline" onClick={handleClearCart} className="text-red-600 border-red-200 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-600">
                  <CardContent className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-4">
                      {/* Top Row: Image and Details */}
                      <div className="flex items-start space-x-3">
                        {/* Item Image */}
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{item.name}</h3>
                          {item.category && (
                            <Badge variant="secondary" className="mt-1 text-xs dark:bg-gray-600 dark:text-gray-200">
                              {item.category}
                            </Badge>
                          )}
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Bottom Row: Quantity and Price */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isUpdating === item.id || item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <div className="w-10 text-center">
                            {isUpdating === item.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <span className="font-medium text-sm">{item.quantity}</span>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id || item.quantity >= 10000}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
                        {item.category && (
                          <Badge variant="secondary" className="mt-1 dark:bg-gray-600 dark:text-gray-200">
                            {item.category}
                          </Badge>
                        )}
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-2">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={isUpdating === item.id || item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <div className="w-12 text-center">
                          {isUpdating === item.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <span className="font-medium">{item.quantity}</span>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={isUpdating === item.id || item.quantity >= 10000}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-600 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon Section */}
                  <div className="space-y-3">
                    {!appliedCoupon ? (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || !couponCode.trim()}
                            size="sm"
                            variant="outline"
                          >
                            {isApplyingCoupon ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Tag className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              {appliedCoupon.code}
                            </span>
                          </div>
                          <Button
                            onClick={handleRemoveCoupon}
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {appliedCoupon.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cashback Balance Section */}
                  {session && (
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cashback Balance</span>
                        </div>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {isLoadingBalance ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            `$${cashbackBalance.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      
                      {cashbackBalance > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={cashbackToUse}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0
                                setCashbackToUse(Math.min(value, Math.min(cashbackBalance, cart.total)))
                              }}
                              min="0"
                              max={Math.min(cashbackBalance, cart.total)}
                              step="0.01"
                              className="flex-1 text-sm"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCashbackToUse(Math.min(cashbackBalance, cart.total))}
                              className="text-xs"
                            >
                              Max
                            </Button>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Use cashback</span>
                            <span>Max: ${Math.min(cashbackBalance, cart.total).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shard Selection Section */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Information</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Shard *
                        </label>
                        <select
                          value={selectedShard}
                          onChange={(e) => setSelectedShard(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                          disabled={isLoadingShards}
                        >
                          <option value="">
                            {isLoadingShards ? "Loading shards..." : "Choose your shard..."}
                          </option>
                          {shards.map((shard) => (
                            <option key={shard.id} value={shard.slug}>
                              {shard.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Gift Selection Section */}
                      {availableGifts.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Choose Your Gift
                          </label>
                          <div className="space-y-2">
                            {isLoadingGifts ? (
                              <div className="text-sm text-gray-500 dark:text-gray-400">Loading gifts...</div>
                            ) : (
                              availableGifts.map((gift) => (
                                <label key={gift.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gift"
                                    value={gift.id}
                                    checked={selectedGift === gift.id}
                                    onChange={(e) => setSelectedGift(e.target.value)}
                                    className="text-amber-600 focus:ring-amber-500 dark:bg-gray-600"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                      <span className="font-medium text-gray-900 dark:text-white">{gift.name}</span>
                                    </div>
                                    {gift.description && (
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{gift.description}</p>
                                    )}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Available for orders ${(parseFloat(gift.price_threshold) || 0).toFixed(2)}+
                                    </p>
                                  </div>
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal ({cart.itemCount} items)</span>
                      <span className="font-medium dark:text-white">${cart.total.toFixed(2)}</span>
                    </div>
                    
                    {isPremiumUser && premiumDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center">
                          <Crown className="h-3 w-3 mr-1 text-purple-600 dark:text-purple-400" />
                          Premium Discount
                        </span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          -${premiumDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {appliedCoupon && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Discount ({appliedCoupon.code})</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -${appliedCoupon.discount_amount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {cashbackToUse > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Cashback Applied</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -${cashbackToUse.toFixed(2)}
                        </span>
                      </div>
                    )}
                    

                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="dark:text-white">Total</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        ${(cart.total - premiumDiscount - (appliedCoupon?.discount_amount || 0) - cashbackToUse).toFixed(2)}
                      </span>
                    </div>
                  </div>



                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || cart.items.length === 0 || !selectedShard}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  >
                    {isCheckingOut ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="sm" text="Processing..." />
                      </div>
                    ) : (
                      <>
                        {cashbackToUse >= (cart.total - (appliedCoupon?.discount_amount || 0)) ? (
                          <DollarSign className="h-5 w-5 mr-2" />
                        ) : (
                          <CreditCard className="h-5 w-5 mr-2" />
                        )}
                        {cashbackToUse >= (cart.total - (appliedCoupon?.discount_amount || 0)) 
                          ? "Complete Order"
                          : "Proceed to Checkout"
                        }
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Secure checkout powered by UOKing
                  </div>


                </CardContent>
              </Card>

              {/* Features */}
              <div className="mt-6 space-y-3">

                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Secure Payment</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">100% secure checkout</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">Cashback Rewards</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">Earn rewards on every purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 