import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Zap, Gift, Crown, Sparkles } from "lucide-react"

export default function SpecialDealsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-amber-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Special Deals
              </h1>
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exclusive offers and limited-time deals on premium Ultima Online items, gold, and services.
            </p>
          </div>

          {/* Featured Deal */}
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-amber-700">
                  <Crown className="h-6 w-6" />
                  <span>Featured Deal of the Week</span>
                </CardTitle>
                <Badge className="bg-red-600 text-white">Limited Time</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gold Bundle Bonanza</h3>
                  <p className="text-gray-700 mb-4">
                    Purchase any gold package over 100M and receive a 20% bonus plus a free rare item!
                  </p>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl font-bold text-amber-600">20% OFF</span>
                    <span className="text-gray-900">+ Free Rare Item</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 text-sm mb-4">
                    <Clock className="h-4 w-4" />
                    <span>Expires in 3 days</span>
                  </div>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    View Gold Packages
                  </Button>
                </div>
                <div className="relative h-48 bg-amber-200 rounded-lg flex items-center justify-center">
                  <Crown className="h-24 w-24 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Gold Deals */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:border-amber-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Star className="h-5 w-5" />
                  <span>Gold Specials</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">100M Gold</span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through text-sm">$120</span>
                      <span className="text-green-600 font-bold ml-2">$96</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">500M Gold</span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through text-sm">$600</span>
                      <span className="text-green-600 font-bold ml-2">$450</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">1B Gold</span>
                    <div className="text-right">
                      <span className="text-gray-500 line-through text-sm">$1200</span>
                      <span className="text-green-600 font-bold ml-2">$840</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Shop Gold Deals
                </Button>
              </CardContent>
            </Card>

            {/* Item Bundles */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:border-amber-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Gift className="h-5 w-5" />
                  <span>Item Bundles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded border border-amber-200">
                    <h4 className="text-gray-900 font-semibold">Warrior Starter Pack</h4>
                    <p className="text-gray-600 text-sm">Complete suit + weapons</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className="bg-green-100 text-green-800">50% OFF</Badge>
                      <span className="text-green-600 font-bold">$75</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded border border-amber-200">
                    <h4 className="text-gray-900 font-semibold">Mage Elite Set</h4>
                    <p className="text-gray-600 text-sm">High-end mage equipment</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className="bg-green-100 text-green-800">40% OFF</Badge>
                      <span className="text-green-600 font-bold">$120</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  View All Bundles
                </Button>
              </CardContent>
            </Card>

            {/* Flash Sales */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:border-red-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <Zap className="h-5 w-5" />
                  <span>Flash Sales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">⚡ LIVE NOW ⚡</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-red-50 border border-red-200 rounded">
                      <span className="text-gray-900 font-semibold">Power Scrolls</span>
                      <div className="text-red-600">60% OFF - 2 hours left</div>
                    </div>
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                      <span className="text-gray-900 font-semibold">Rare Weapons</span>
                      <div className="text-orange-600">45% OFF - 5 hours left</div>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Shop Flash Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
            <CardHeader>
              <CardTitle className="text-center text-amber-600">Never Miss a Deal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Subscribe to our newsletter to get notified about exclusive deals, flash sales, and special offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-amber-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-amber-600"
                  />
                  <Button className="bg-amber-600 hover:bg-amber-700 px-8">
                    Subscribe
                  </Button>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  No spam, unsubscribe anytime
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>* All deals are subject to availability and may expire without notice.</p>
            <p>See our <a href="/terms" className="text-amber-600 hover:underline">Terms & Conditions</a> for more details.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 