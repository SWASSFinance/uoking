"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ImageUpload } from "@/components/ui/image-upload"
import { 
  User, 
  ShoppingBag, 
  Settings, 
  DollarSign, 
  Calendar,
  Package,
  Edit,
  Save,
  X,
  Shield,
  Crown,
  Mail,
  Phone,
  MapPin,
  Gift,
  MessageCircle,
  CheckCircle,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Clock,
  Trash2,
  Star,
  Users,
  CalendarCheck
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  id: string
  product_id?: string
  product_name: string
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
  total_amount: string
  subtotal: string
  discount_amount: string
  cashback_used: string
  delivery_shard: string
  coupon_code?: string
  payment_status: string
  created_at: string
  item_count: number
  items?: OrderItem[]
}

interface UserProfile {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  discord_username?: string
  main_shard?: string
  character_names?: string[]
  profile_image_url?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  timezone?: string
  email_verified: boolean
  is_admin: boolean
  created_at: string
  last_login_at?: string
  review_count?: number
  rating_count?: number
  total_points_earned?: number
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { clearCart } = useCart()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [cashbackBalance, setCashbackBalance] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set())
  const [orderDetails, setOrderDetails] = useState<Record<string, Order>>({})
  const [userReviews, setUserReviews] = useState<any[]>([])
  const [userPoints, setUserPoints] = useState<any>(null)
  const [referralStats, setReferralStats] = useState<any>(null)
  const [isLoadingReviews, setIsLoadingReviews] = useState(false)
  const [isLoadingPoints, setIsLoadingPoints] = useState(false)
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false)
  const [isLoadingCheckin, setIsLoadingCheckin] = useState(false)
  const [checkinData, setCheckinData] = useState<any>(null)
  const [countdown, setCountdown] = useState<string>('')
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    discord_username: "",
    main_shard: "",
    character_names: [] as string[],
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
    timezone: "",
    profile_image_url: ""
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Load user data
  useEffect(() => {
    if (session?.user?.email) {
      loadUserData()
    }
  }, [session])

  // Load tab-specific data when tab changes
  useEffect(() => {
    if (session?.user?.email) {
      if (activeTab === 'reviews' && userReviews.length === 0) {
        loadUserReviews()
      } else if (activeTab === 'points' && !userPoints) {
        loadUserPoints()
      } else if (activeTab === 'referrals' && !referralStats) {
        loadReferralStats()
      } else if (activeTab === 'checkin' && !checkinData) {
        loadCheckinData()
      }
    }
  }, [activeTab, session])

  // Countdown timer for next check-in
  useEffect(() => {
    if (!checkinData) return

    const updateCountdown = () => {
      const now = new Date()
      
      if (checkinData.status?.checked_in_today) {
        // User has checked in today - countdown to next check-in
        const tomorrow = new Date(now)
        tomorrow.setDate(now.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0) // Set to midnight
        
        const timeLeft = tomorrow.getTime() - now.getTime()
        
        if (timeLeft <= 0) {
          setCountdown('Ready to check in!')
          // Refresh check-in data when countdown reaches zero
          loadCheckinData()
          return
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
        
        setCountdown(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        // User hasn't checked in today - countdown to end of day
        const endOfDay = new Date(now)
        endOfDay.setHours(23, 59, 59, 999) // Set to end of day
        
        const timeLeft = endOfDay.getTime() - now.getTime()
        
        if (timeLeft <= 0) {
          setCountdown('Day is over!')
          return
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
        
        setCountdown(`${hours}h ${minutes}m ${seconds}s`)
      }
    }

    // Update immediately
    updateCountdown()
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000)
    
    return () => clearInterval(interval)
  }, [checkinData])

  const loadUserData = async () => {
    try {
      const [profileResponse, ordersResponse, balanceResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/user/orders'),
        fetch('/api/user/cashback-balance')
      ])

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setUserProfile(profileData)
        setEditForm({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          discord_username: profileData.discord_username || "",
          main_shard: profileData.main_shard || "",
          character_names: profileData.character_names || [],
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || "",
          state: profileData.state || "",
          zip_code: profileData.zip_code || "",
          country: profileData.country || "United States",
          timezone: profileData.timezone || "",
          profile_image_url: profileData.profile_image_url || ""
        })
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders || [])
      }

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json()
        setCashbackBalance(balanceData.referral_cash || 0)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserReviews = async () => {
    setIsLoadingReviews(true)
    try {
      const response = await fetch('/api/user/reviews')
      if (response.ok) {
        const data = await response.json()
        setUserReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error loading reviews:', error)
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingReviews(false)
    }
  }

  const loadUserPoints = async () => {
    setIsLoadingPoints(true)
    try {
      console.log('Loading user points...')
      const response = await fetch('/api/user/points')
      console.log('Points response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Points data:', data)
        setUserPoints(data.points)
      } else {
        const errorData = await response.json()
        console.error('Points API error:', errorData)
        toast({
          title: "Error",
          description: "Failed to load points. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error loading points:', error)
      toast({
        title: "Error",
        description: "Failed to load points. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPoints(false)
    }
  }

  const loadReferralStats = async () => {
    setIsLoadingReferrals(true)
    try {
      const response = await fetch('/api/user/referral-stats')
      if (response.ok) {
        const data = await response.json()
        setReferralStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading referral stats:', error)
      toast({
        title: "Error",
        description: "Failed to load referral stats. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingReferrals(false)
    }
  }

  const loadCheckinData = async () => {
    setIsLoadingCheckin(true)
    try {
      const response = await fetch('/api/user/daily-checkin')
      if (response.ok) {
        const data = await response.json()
        setCheckinData(data)
      }
    } catch (error) {
      console.error('Error loading check-in data:', error)
      toast({
        title: "Error",
        description: "Failed to load check-in data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCheckin(false)
    }
  }

  const handleDailyCheckin = async () => {
    setIsLoadingCheckin(true)
    try {
      const response = await fetch('/api/user/daily-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Check-in Successful!",
          description: `You earned ${data.points_awarded} points! Come back tomorrow for more!`,
          variant: "default",
        })
        setCheckinData(data)
      } else {
        toast({
          title: "Check-in Failed",
          description: data.error || "Failed to check in. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error performing daily check-in:', error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCheckin(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
          variant: "default",
        })
        setIsEditing(false)
        loadUserData() // Reload data
      } else {
        const error = await response.json()
        toast({
          title: "Update Failed",
          description: error.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscordLink = () => {
    // Redirect to Discord OAuth
    const discordAuthUrl = `/api/auth/signin?provider=discord&callbackUrl=${encodeURIComponent(window.location.href)}`
    window.location.href = discordAuthUrl
  }

  const toggleOrderExpansion = async (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
      setExpandedOrders(newExpanded)
    } else {
      newExpanded.add(orderId)
      setExpandedOrders(newExpanded)
      
      // Load order details if not already loaded
      if (!orderDetails[orderId]) {
        await loadOrderDetails(orderId)
      }
    }
  }

  const loadOrderDetails = async (orderId: string) => {
    const newLoading = new Set(loadingOrders)
    newLoading.add(orderId)
    setLoadingOrders(newLoading)
    
    try {
      const response = await fetch(`/api/user/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(prev => ({
          ...prev,
          [orderId]: data.order
        }))
      }
    } catch (error) {
      console.error('Error loading order details:', error)
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      })
    } finally {
      const newLoading = new Set(loadingOrders)
      newLoading.delete(orderId)
      setLoadingOrders(newLoading)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/user/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove order from local state
        setOrders(prev => prev.filter(order => order.id !== orderId))
        setOrderDetails(prev => {
          const newDetails = { ...prev }
          delete newDetails[orderId]
          return newDetails
        })
        
        toast({
          title: "Order Deleted",
          description: "Order has been deleted successfully.",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Delete Failed",
          description: data.error || "Failed to delete order.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the order.",
        variant: "destructive",
      })
    }
  }

  const handlePayOrder = async (order: Order) => {
    try {
      // Clear existing cart first to avoid conflicts
      clearCart()
      
      // Convert order items to cart format
      const cartItems = (order.items || []).map(item => ({
        id: item.product_id || item.id,
        name: item.product_name,
        price: parseFloat(item.unit_price),
        quantity: item.quantity,
        image_url: item.product_image,
        category: item.category
      }))

      // Create PayPal checkout for this specific order
      const response = await fetch('/api/paypal/simple-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItems,
          cashbackToUse: parseFloat(order.cashback_used) || 0,
          selectedShard: order.delivery_shard,
          couponCode: order.coupon_code || null,
          existingOrderId: order.id
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Create and submit PayPal form
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
      } else {
        toast({
          title: "Payment Failed",
          description: data.error || "Failed to create payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Error",
        description: "An error occurred while processing payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCharacterNamesChange = (value: string) => {
    const names = value.split(',').map(name => name.trim()).filter(name => name.length > 0)
    setEditForm({...editForm, character_names: names})
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isOrderEligibleForDeletion = (order: Order) => {
    if (order.payment_status !== 'pending') return false
    
    const orderDate = new Date(order.created_at)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    return orderDate <= fiveMinutesAgo
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <LoadingSpinner size="lg" text="Loading your account..." />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load user data.</p>
            </div>
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
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your profile, orders, and preferences</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cashback Balance</p>
                    <p className="text-2xl font-bold text-green-600">${cashbackBalance.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold text-purple-600">{userProfile.review_count || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Points</p>
                    <p className="text-2xl font-bold text-amber-600">{userProfile.total_points_earned || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-2xl font-bold text-cyan-600">
                      {new Date(userProfile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-white/80 backdrop-blur-sm border border-amber-200">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="points" className="flex items-center space-x-2">
                <Gift className="h-4 w-4" />
                <span>Points</span>
              </TabsTrigger>
              <TabsTrigger value="plots" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Plots</span>
              </TabsTrigger>
              <TabsTrigger value="checkin" className="flex items-center space-x-2">
                <CalendarCheck className="h-4 w-4" />
                <span>Daily Check-in</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center space-x-2">
                <LinkIcon className="h-4 w-4" />
                <span>Referrals</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold text-gray-900">Profile Information</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="bg-amber-600 hover:bg-amber-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={() => setIsEditing(false)} variant="outline">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                      {editForm.profile_image_url ? (
                        <Image
                          src={editForm.profile_image_url}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userProfile.first_name} {userProfile.last_name}
                      </h3>
                      <p className="text-gray-600">{userProfile.email}</p>
                      {userProfile.is_admin && (
                        <Badge className="mt-2 bg-purple-100 text-purple-800">
                          <Crown className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-4">
                      <ImageUpload
                        value={editForm.profile_image_url}
                        onChange={(url) => setEditForm({...editForm, profile_image_url: url})}
                        label="Profile Image"
                      />
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="first_name" className="text-gray-700 font-medium">Character Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{userProfile.first_name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="discord_username" className="text-gray-700 font-medium">Discord Username</Label>
                      {isEditing ? (
                        <Input
                          id="discord_username"
                          value={editForm.discord_username}
                          onChange={(e) => setEditForm({...editForm, discord_username: e.target.value})}
                          placeholder="username#1234"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{userProfile.discord_username || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="main_shard" className="text-gray-700 font-medium">Main Shard</Label>
                      {isEditing ? (
                        <Input
                          id="main_shard"
                          value={editForm.main_shard}
                          onChange={(e) => setEditForm({...editForm, main_shard: e.target.value})}
                          placeholder="e.g., Atlantic, Arirang"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{userProfile.main_shard || 'Not set'}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="character_names" className="text-gray-700 font-medium">Character Names</Label>
                      {isEditing ? (
                        <Textarea
                          id="character_names"
                          value={editForm.character_names.join(', ')}
                          onChange={(e) => handleCharacterNamesChange(e.target.value)}
                          placeholder="Enter character names separated by commas"
                          className="mt-1"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {userProfile.character_names && userProfile.character_names.length > 0 
                            ? userProfile.character_names.join(', ') 
                            : 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{userProfile.phone || 'Not set'}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="timezone" className="text-gray-700 font-medium">Timezone</Label>
                        {isEditing ? (
                          <Select value={editForm.timezone} onValueChange={(value) => setEditForm({...editForm, timezone: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="EST">Eastern Time</SelectItem>
                              <SelectItem value="CST">Central Time</SelectItem>
                              <SelectItem value="MST">Mountain Time</SelectItem>
                              <SelectItem value="PST">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="mt-1 text-gray-900">{userProfile.timezone || 'Not set'}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Discord Account Linking */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Discord Account</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {session?.user?.discordId ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Connected to Discord
                              </p>
                              <p className="text-sm text-gray-600">
                                @{session.user.discordUsername}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Link Discord Account
                              </p>
                              <p className="text-sm text-gray-600">
                                Connect your Discord account to sync your profile image and username
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleDiscordLink()}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Link Discord
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">Start shopping to see your order history here</p>
                      <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/store">
                          <Package className="h-4 w-4 mr-2" />
                          Browse Products
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          {/* Order Header */}
                          <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleOrderExpansion(order.id)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Order #{order.order_number}</h4>
                                  <p className="text-sm text-gray-600">
                                    {order.item_count} item{order.item_count !== 1 ? 's' : ''} • 
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</p>
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                                {loadingOrders.has(order.id) ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                                ) : (
                                  <div className="text-gray-400">
                                    {expandedOrders.has(order.id) ? (
                                      <ChevronUp className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Order Details Dropdown */}
                          {expandedOrders.has(order.id) && orderDetails[order.id] && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <div className="space-y-4">
                                {/* Order Items */}
                                <div>
                                  <h5 className="font-semibold text-gray-900 mb-3">Order Items</h5>
                                  <div className="space-y-3">
                                    {orderDetails[order.id].items?.map((item) => (
                                      <div key={item.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                          <p className="font-medium text-gray-900">{item.product_name}</p>
                                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-gray-900">${parseFloat(item.total_price).toFixed(2)}</p>
                                          <p className="text-sm text-gray-600">${parseFloat(item.unit_price).toFixed(2)} each</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-white p-4 rounded-lg">
                                  <h5 className="font-semibold text-gray-900 mb-3">Order Summary</h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Subtotal</span>
                                      <span className="font-medium">${parseFloat(orderDetails[order.id].subtotal).toFixed(2)}</span>
                                    </div>
                                    {parseFloat(orderDetails[order.id].discount_amount) > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="font-medium text-green-600">-${parseFloat(orderDetails[order.id].discount_amount).toFixed(2)}</span>
                                      </div>
                                    )}
                                    {parseFloat(orderDetails[order.id].cashback_used) > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Cashback Used</span>
                                        <span className="font-medium text-green-600">-${parseFloat(orderDetails[order.id].cashback_used).toFixed(2)}</span>
                                      </div>
                                    )}
                                    <div className="border-t pt-2 flex justify-between font-semibold">
                                      <span>Total</span>
                                      <span>${parseFloat(orderDetails[order.id].total_amount).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Order Details */}
                                <div className="bg-white p-4 rounded-lg">
                                  <h5 className="font-semibold text-gray-900 mb-3">Order Details</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Delivery Shard:</span>
                                      <p className="font-medium">{orderDetails[order.id].delivery_shard}</p>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Payment Status:</span>
                                      <Badge className={getStatusColor(orderDetails[order.id].payment_status)}>
                                        {orderDetails[order.id].payment_status}
                                      </Badge>
                                    </div>
                                    {orderDetails[order.id].coupon_code && (
                                      <div>
                                        <span className="text-gray-600">Coupon Code:</span>
                                        <p className="font-medium">{orderDetails[order.id].coupon_code}</p>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-600">Order Date:</span>
                                      <p className="font-medium">{new Date(orderDetails[order.id].created_at).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Action */}
                                {orderDetails[order.id].payment_status === 'pending' && (
                                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                        <div>
                                          <p className="font-medium text-amber-900">Payment Pending</p>
                                          <p className="text-sm text-amber-700">Complete your payment to process this order</p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2">
                                        {isOrderEligibleForDeletion(orderDetails[order.id]) && (
                                          <Button 
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleDeleteOrder(order.id)
                                            }}
                                            variant="outline"
                                            className="border-red-200 text-red-600 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </Button>
                                        )}
                                        <Button 
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handlePayOrder(orderDetails[order.id])
                                          }}
                                          className="bg-amber-600 hover:bg-amber-700"
                                        >
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          Pay Now
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReviews ? (
                    <div className="text-center py-8">
                      <LoadingSpinner size="lg" text="Loading reviews..." />
                    </div>
                  ) : userReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                      <p className="text-gray-600 mb-4">Start reviewing products to earn points and help other customers!</p>
                      <Button asChild className="bg-amber-600 hover:bg-amber-700">
                        <Link href="/store">
                          Browse Products
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {review.product_image ? (
                                <Image
                                  src={review.product_image}
                                  alt={review.product_name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  <Link href={`/product/${review.product_slug}`} className="hover:text-amber-600">
                                    {review.product_name}
                                  </Link>
                                </h4>
                                <Badge className={review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                  {review.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">{review.rating}/5</span>
                              </div>
                              {review.title && (
                                <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                              )}
                              {review.content && (
                                <p className="text-gray-600 text-sm mb-2">{review.content}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Reviewed on {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Points Tab */}
            <TabsContent value="points" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Points & Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPoints ? (
                    <div className="text-center py-8">
                      <LoadingSpinner size="lg" text="Loading points..." />
                    </div>
                  ) : userPoints ? (
                    <div className="space-y-6">
                      {/* Points Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Gift className="h-8 w-8 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Current Points</p>
                              <p className="text-2xl font-bold text-amber-600">{userPoints.current_points || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Gift className="h-8 w-8 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">Lifetime Points</p>
                              <p className="text-2xl font-bold text-green-600">{userPoints.lifetime_points || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Gift className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Points Spent</p>
                              <p className="text-2xl font-bold text-blue-600">{userPoints.points_spent || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Check-in Statistics */}
                      {userPoints.checkin_totals && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <CalendarCheck className="h-5 w-5 mr-2 text-amber-600" />
                            Daily Check-in Statistics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Total Check-ins</span>
                              <span className="font-semibold text-amber-600">{userPoints.checkin_totals.total_checkins || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Points from Check-ins</span>
                              <span className="font-semibold text-amber-600">{userPoints.checkin_totals.total_points_from_checkins || 0}</span>
                            </div>
                            {userPoints.checkin_totals.first_checkin_date && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">First Check-in</span>
                                <span className="font-semibold">{new Date(userPoints.checkin_totals.first_checkin_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {userPoints.checkin_totals.last_checkin_date && (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Last Check-in</span>
                                <span className="font-semibold">{new Date(userPoints.checkin_totals.last_checkin_date).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Referral Points Statistics */}
                      {userPoints.referral_points && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <LinkIcon className="h-5 w-5 mr-2 text-green-600" />
                            Referral Points Statistics
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Total Referrals</span>
                              <span className="font-semibold text-green-600">{userPoints.referral_points.total_referrals || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Points from Referrals</span>
                              <span className="font-semibold text-green-600">{userPoints.referral_points.total_points_from_referrals || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Points per Referral</span>
                              <span className="font-semibold text-green-600">25</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Total Cashback</span>
                              <span className="font-semibold text-green-600">${userPoints.referral_cash || 0}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Activity Stats */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Activity Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Reviews Written</span>
                            <span className="font-semibold">{userPoints.review_count || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Ratings Given</span>
                            <span className="font-semibold">{userPoints.rating_count || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total Points Earned</span>
                            <span className="font-semibold">{userPoints.total_points_earned || 0}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Referral Cash</span>
                            <span className="font-semibold text-green-600">${userPoints.referral_cash || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* How to Earn Points */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">How to Earn Points</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Daily check-in: <strong>10 points</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Write a product review: <strong>10 points</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Add a rating: <strong>+5 points</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Write detailed review (50+ chars): <strong>+5 points</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Refer friends: <strong>25 points per referral</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Points Data</h3>
                      <p className="text-gray-600">Start reviewing products to earn points!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plots Tab */}
            <TabsContent value="plots" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">My Plots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">View Your Plots</h3>
                    <p className="text-gray-600 mb-6">
                      Manage and view all your owned plots in one place.
                    </p>
                    <Button 
                      onClick={() => router.push('/account/plots')}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View My Plots
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Daily Check-in Tab */}
            <TabsContent value="checkin" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Daily Check-in</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCheckin ? (
                    <div className="text-center py-8">
                      <LoadingSpinner size="lg" text="Loading check-in data..." />
                    </div>
                  ) : checkinData ? (
                    <div className="space-y-6">
                      {/* Check-in Status */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <CalendarCheck className="h-8 w-8 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">Today's Status</p>
                              <p className="text-2xl font-bold text-green-600">
                                {checkinData.status.checked_in_today ? 'Checked In!' : 'Not Checked In'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Gift className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Points Available</p>
                              <p className="text-2xl font-bold text-blue-600">10</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Star className="h-8 w-8 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-600">Current Streak</p>
                              <p className="text-2xl font-bold text-purple-600">{checkinData.streak || 0} days</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Check-in Button */}
                      <div className="text-center">
                        {checkinData.status.checked_in_today ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                              <CheckCircle className="h-8 w-8 text-green-600" />
                              <h3 className="text-xl font-semibold text-green-900">Already Checked In Today!</h3>
                            </div>
                            <p className="text-green-700 mb-4">
                              You earned {checkinData.status.today_points} points today. Come back tomorrow for more!
                            </p>
                            <div className="text-sm text-green-600">
                              Next check-in available: {(() => {
                                // Calculate next check-in date based on today's check-in
                                const today = new Date()
                                const tomorrow = new Date(today)
                                tomorrow.setDate(today.getDate() + 1)
                                return tomorrow.toLocaleDateString()
                              })()}
                            </div>
                            {countdown && (
                              <div className="text-sm text-amber-600 font-medium mt-2">
                                ⏰ Countdown: {countdown}
                              </div>
                            )}
                            {/* Debug info - remove this after testing */}
                            <div className="text-xs text-gray-500 mt-1">
                              Debug: Today is {new Date().toLocaleDateString()}, Check-in date: {checkinData.status.checkin_date}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                              <CalendarCheck className="h-8 w-8 text-amber-600" />
                              <h3 className="text-xl font-semibold text-amber-900">Ready to Check In!</h3>
                            </div>
                            <p className="text-amber-700 mb-4">
                              Click the button below to earn 10 points for today's check-in!
                            </p>
                            {countdown && (
                              <div className="text-sm text-amber-600 font-medium mb-4">
                                ⏰ Time remaining today: {countdown}
                              </div>
                            )}
                            <Button 
                              onClick={handleDailyCheckin}
                              disabled={isLoadingCheckin}
                              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
                            >
                              {isLoadingCheckin ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                  Checking In...
                                </>
                              ) : (
                                <>
                                  <CalendarCheck className="h-5 w-5 mr-2" />
                                  Check In Now
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Check-in History */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Recent Check-ins</h4>
                        {checkinData.history && checkinData.history.length > 0 ? (
                          <div className="space-y-2">
                            {checkinData.history.map((checkin: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <CalendarCheck className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">
                                    {new Date(checkin.checkin_date).toLocaleDateString()}
                                  </span>
                                  {/* Debug info - remove this after testing */}
                                  <span className="text-xs text-gray-500">
                                    (raw: {checkin.checkin_date})
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Gift className="h-4 w-4 text-amber-600" />
                                  <span className="text-sm font-medium text-amber-600">
                                    +{checkin.points_earned} points
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No check-in history yet. Start checking in daily to build your streak!
                          </div>
                        )}
                      </div>

                      {/* How it Works */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">How Daily Check-ins Work</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Check in once per day to earn <strong>10 points</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Build a streak for bonus rewards and achievements</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Points can be used for discounts and special offers</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            <span>Check-in resets at midnight in your local timezone</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Check-in Data</h3>
                      <p className="text-gray-600">Start checking in daily to earn points!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReferrals ? (
                    <div className="text-center py-8">
                      <LoadingSpinner size="lg" text="Loading referral stats..." />
                    </div>
                  ) : referralStats ? (
                    <div className="space-y-6">
                      {/* Referral Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <LinkIcon className="h-8 w-8 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">Total Referrals</p>
                              <p className="text-2xl font-bold text-green-600">{referralStats.total_referrals || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-8 w-8 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Total Earnings</p>
                              <p className="text-2xl font-bold text-blue-600">${referralStats.total_earnings || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Users className="h-8 w-8 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-600">Active Referrals</p>
                              <p className="text-2xl font-bold text-purple-600">{referralStats.active_referrals || 0}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <Gift className="h-8 w-8 text-amber-600" />
                            <div>
                              <p className="text-sm text-gray-600">Referral Points</p>
                              <p className="text-2xl font-bold text-amber-600">{referralStats.referral_points?.total_points_from_referrals || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Referral Link */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Your Referral Link</h4>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={`${window.location.origin}/signup?ref=${referralStats.referral_code || 'YOURCODE'}`}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${referralStats.referral_code || 'YOURCODE'}`)
                              toast({
                                title: "Link Copied!",
                                description: "Your referral link has been copied to clipboard.",
                              })
                            }}
                            variant="outline"
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Share this link with friends to earn cashback when they make their first purchase!
                        </p>
                      </div>

                      {/* How Referrals Work */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">How Referrals Work</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>Share your referral link with friends</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>When they sign up and make their first purchase</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>You earn <strong>2.5% cashback</strong> on their order</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>They also get <strong>5% cashback</strong> on their purchase</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Referral Link */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Your Referral Link</h4>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={`${window.location.origin}/signup?ref=${referralStats?.referral_code || 'YOURCODE'}`}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/signup?ref=${referralStats?.referral_code || 'YOURCODE'}`)
                              toast({
                                title: "Link Copied!",
                                description: "Your referral link has been copied to clipboard.",
                              })
                            }}
                            variant="outline"
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Share this link with friends to earn cashback when they make their first purchase!
                        </p>
                      </div>

                      {/* How Referrals Work */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">How Referrals Work</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>Share your referral link with friends</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>When they sign up and make their first purchase</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>You earn <strong>2.5% cashback</strong> on their order</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span>They also get <strong>5% cashback</strong> on their purchase</span>
                          </div>
                        </div>
                      </div>

                      {/* No Referrals Yet */}
                      <div className="text-center py-8">
                        <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Referrals Yet</h3>
                        <p className="text-gray-600">Start sharing your referral link to earn cashback rewards!</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates about orders and promotions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Danger Zone</h4>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
} 