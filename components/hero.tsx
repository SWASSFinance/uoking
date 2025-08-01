import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Sword, Crown, Star, Clock, Users } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-amber-200">
              <Crown className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700">Trusted Ultima Online Gold Seller</span>
              <Star className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            UO <span className="text-amber-600">KING</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Your ultimate destination for premium Ultima Online items, gold, and services.
            <br className="hidden md:block" />
            Fast delivery, competitive prices, and 24/7 support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
              <Zap className="h-5 w-5 mr-2" />
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-white/80 backdrop-blur-sm text-lg border-2">
              Browse Categories
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">{"<5min"}</div>
              <div className="text-sm text-gray-600">Average Delivery</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Secure Transactions</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-3xl font-bold">🎄</div>
              <div>
                <h3 className="text-xl font-bold mb-1">Merry Christmas From UO King!</h3>
                <p className="text-green-100">Use coupon code: <span className="font-bold text-yellow-300">fiveoff</span> for 5% off your UO gold orders and items!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
