import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Sword, Crown, Star, Clock, Users } from "lucide-react"
import Image from "next/image"

export function Banner() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white/95 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl border border-amber-200">
              <Crown className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700">Trusted Ultima Online Gold Seller</span>
              <Star className="h-6 w-6 text-amber-600" />
            </div>
          </div>

          {/* Main Banner with Logo */}
          <div className="relative mb-12">
            {/* Logo Container */}
            <div className="relative mb-8">
              <div className="relative inline-block">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-3xl opacity-30 animate-pulse"></div>
                
                {/* Logo Image */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-amber-200">
                  <div className="relative w-96 h-48 mx-auto">
                    <Image
                      src="/logof.png"
                      alt="UO KING"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Your ultimate destination for premium Ultima Online items, gold, and services
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Fast delivery, competitive prices, and 24/7 support. 
              Join thousands of satisfied customers who trust UO KING for their gaming needs.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
              <Zap className="h-5 w-5 mr-2" />
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 bg-white/90 backdrop-blur-sm text-lg border-2 border-amber-300 hover:bg-amber-50 transform hover:scale-105 transition-all duration-200">
              Browse Categories
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-amber-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-amber-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <Zap className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">{"<5min"}</div>
              <div className="text-sm text-gray-600">Average Delivery</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-amber-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Secure Transactions</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-amber-200 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
          </div>

          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-4xl">🎄</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Merry Christmas From UO King!</h3>
                <p className="text-green-100 text-lg">
                  Use coupon code: <span className="font-bold text-yellow-300 text-xl">fiveoff</span> for 5% off your UO gold orders and items!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 