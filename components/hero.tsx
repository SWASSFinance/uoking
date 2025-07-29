import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Sword } from "lucide-react"

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <Sword className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700">Premium Ultima Online Items</span>
              <Shield className="h-6 w-6 text-amber-600" />
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
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
              <Zap className="h-5 w-5 mr-2" />
              Shop Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
              Browse Categories
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="text-2xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="text-2xl font-bold text-amber-600 mb-2">{"<5min"}</div>
              <div className="text-sm text-gray-600">Average Delivery</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="text-2xl font-bold text-amber-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Secure Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
