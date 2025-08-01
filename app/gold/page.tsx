import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { 
  Crown, 
  Coins, 
  Shield, 
  Zap, 
  Clock, 
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  DollarSign,
  CreditCard,
  Truck
} from "lucide-react"
import Link from "next/link"

const goldPackages = [
  {
    name: "Starter Gold",
    amount: "100K",
    price: "$5.99",
    description: "Perfect for new players getting started",
    features: ["Instant Delivery", "Secure Transaction", "24/7 Support"],
    popular: false
  },
  {
    name: "Adventurer Gold",
    amount: "500K",
    price: "$24.99",
    description: "Great for mid-level characters and equipment",
    features: ["Instant Delivery", "Secure Transaction", "24/7 Support", "Bulk Discount"],
    popular: true
  },
  {
    name: "Warrior Gold",
    amount: "1M",
    price: "$44.99",
    description: "For serious players and high-end equipment",
    features: ["Instant Delivery", "Secure Transaction", "24/7 Support", "Bulk Discount", "Priority Support"],
    popular: false
  },
  {
    name: "Legendary Gold",
    amount: "5M",
    price: "$199.99",
    description: "For guild leaders and top-tier equipment",
    features: ["Instant Delivery", "Secure Transaction", "24/7 Support", "Bulk Discount", "Priority Support", "VIP Treatment"],
    popular: false
  }
]

const features = [
  {
    icon: Clock,
    title: "Instant Delivery",
    description: "Receive your gold immediately after payment confirmation"
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "All payments are processed through secure, encrypted channels"
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Only the highest quality gold from legitimate sources"
  },
  {
    icon: CheckCircle,
    title: "24/7 Support",
    description: "Our support team is available around the clock"
  }
]

export default function GoldPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Gold", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Coins className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Ultima Online Gold
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, secure, and reliable gold delivery for all your Ultima Online needs. 
              Get the gold you need to dominate the game and build your empire.
            </p>
          </div>

          {/* Gold Packages */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Choose Your Gold Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {goldPackages.map((pkg) => (
                <Card key={pkg.name} className={`relative border-amber-200 hover:shadow-xl transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-amber-500' : ''
                }`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-amber-500 text-white px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {pkg.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-amber-600">
                      {pkg.amount}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {pkg.price}
                    </div>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {pkg.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      asChild
                    >
                      <Link href={`/gold/buy/${pkg.name.toLowerCase().replace(' ', '-')}`}>
                        Buy Now
                        <ArrowUp className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose UOKing Gold?
              </h2>
              <p className="text-gray-600">
                We provide the most reliable and secure gold delivery service in Ultima Online
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <div key={feature.title} className="text-center group">
                    <div className="inline-flex p-4 rounded-full bg-amber-100 text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 mb-12 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-600">
                Getting your gold is simple and secure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Package</h3>
                <p className="text-gray-600">Select the gold amount that fits your needs and budget</p>
              </div>
              
              <div className="text-center">
                <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
                <p className="text-gray-600">Pay securely through our encrypted payment system</p>
              </div>
              
              <div className="text-center">
                <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-600">Receive your gold immediately after payment confirmation</p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Accepted Payment Methods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Credit Cards</h3>
                  <p className="text-gray-600 text-sm">Visa, MasterCard, American Express</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <DollarSign className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">PayPal</h3>
                  <p className="text-gray-600 text-sm">Fast and secure PayPal payments</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Truck className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bank Transfer</h3>
                  <p className="text-gray-600 text-sm">Direct bank transfers available</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10M+</h3>
                <p className="text-gray-600">Gold Delivered</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">50K+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
                <p className="text-gray-600">Customer Support</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Get Your Gold?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of satisfied customers who trust UOKing for their gold needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/gold/buy">
                  Buy Gold Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 