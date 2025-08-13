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
  Truck,
  MessageCircle,
  Globe,
  Users
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, getCategoryBySlug } from "@/lib/db"

export default async function GoldPage() {
  // Fetch gold products from the database
  let goldProducts = []
  let goldCategory = null
  
  try {
    // Get the Gold category
    goldCategory = await getCategoryBySlug('gold')
    
    if (goldCategory) {
      // Fetch products from the Gold category
      goldProducts = await getProducts({ 
        categoryId: goldCategory.id,
        limit: 50 
      })
    }
  } catch (error) {
    console.error('Error fetching gold products:', error)
  }

  // Sort products by price (lowest to highest)
  goldProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))

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

  const shards = [
    "Atlantic", "Arirang", "Asuka", "Balhae", "Baja", "Catskills", 
    "Chesapeake", "Drachenfels", "Europa", "Formosa", "Great Lakes", 
    "Hokuto", "Izumo", "Lake Austin", "Lake Superior", "Legends", 
    "Mizuho", "Mugan", "Napa Valley", "Oceania", "Origins", "Pacific", 
    "Sakura", "Sonoma", "Siege Perilous", "Wakoku", "Yamato"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Coins className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Ultima Online Gold
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              At UOKing.com, our Ultima Online gold is sourced from dedicated players committed to providing a reliable and trustworthy service. 
              Each piece of gold is meticulously collected and prepared for immediate delivery upon payment, ensuring a seamless experience for our customers. 
              Purchasing UO gold from us allows you to establish a solid foothold in the game, enabling you to explore and enjoy the rich, late-game content that Ultima Online has to offer.
            </p>
          </div>

          {/* Gold Products Grid */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Choose Your Gold Package
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {goldProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 bg-white border-2 border-gray-200 hover:border-blue-300 hover:scale-105">
                  <CardHeader className="text-center pb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg">
                    <div className="relative w-full h-40 mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
                          <Coins className="h-16 w-16 text-yellow-600" />
                        </div>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3">
                      {product.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                    {product.short_description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {product.short_description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      Add to Cart
                      <ArrowUp className="h-5 w-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* GTC Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-10 mb-16 text-white shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">
                GTC 4 Gold
              </h2>
              <p className="text-2xl mb-8 opacity-95">
                Gametime codes with gold
              </p>
              <div className="text-3xl font-bold mb-8 bg-white/20 rounded-2xl p-6 inline-block">
                1 Month = 135 Mil // 6 Month = 420 Mil
              </div>
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-xl" asChild>
                <Link href="/contact">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Ring Live Chat!
                </Link>
              </Button>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-3xl p-10 mb-16 border-2 border-gray-200 shadow-xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Delivery Information
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                Open up a chat with the delivery team and we'll meet you in-game seconds after your purchase is completed.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Available Shards
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {shards.map((shard) => (
                  <div key={shard} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-colors">
                    <span className="text-sm font-semibold text-gray-800">{shard}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl p-10 mb-16 border-2 border-blue-200">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                UO Gold Delivery Questions
              </h2>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  How long will it take to get the UO gold?
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We can meet you in game seconds after your purchase is completed to deliver your gold.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-3xl p-10 mb-16 border-2 border-gray-200 shadow-xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose UOKing Gold?
              </h2>
              <p className="text-xl text-gray-700">
                We provide the most reliable and secure gold delivery service in Ultima Online
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <div key={feature.title} className="text-center group">
                    <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Accepted Payment Methods
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                      <CreditCard className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Credit Cards</h3>
                  <p className="text-gray-700">Visa, MasterCard, American Express</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                      <DollarSign className="h-10 w-10 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Payments</h3>
                  <p className="text-gray-700">Venmo, Zelle, Cash App</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-200 bg-white hover:border-blue-300 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                      <Truck className="h-10 w-10 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Bank Transfer</h3>
                  <p className="text-gray-700">Direct bank transfers available</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-2 border-gray-200 bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full">
                    <TrendingUp className="h-10 w-10 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">10M+</h3>
                <p className="text-gray-700 text-lg">Gold Delivered</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-gray-200 bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">50K+</h3>
                <p className="text-gray-700 text-lg">Happy Customers</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-gray-200 bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                    <Globe className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">27</h3>
                <p className="text-gray-700 text-lg">Shards Supported</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Your Gold?
            </h2>
            <p className="text-2xl mb-10 opacity-95">
              Join thousands of satisfied customers who trust UOKing for their gold needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-xl" asChild>
                <Link href="/contact">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold px-8 py-4 rounded-xl" asChild>
                <Link href="/store">
                  Browse All Items
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