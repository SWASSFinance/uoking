"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Clock, Crown, Star, Shield, Zap } from "lucide-react"

export function HelpSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Can't Find Something?</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            If you don't see the item you are looking for then just ask live chat. There is a good chance we carry whatever you are looking for.
          </p>
        </div> 

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          

          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Email Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Send us an email and we'll get back to you within hours
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Discord: mr.brc</p>
                <p className="text-sm text-gray-600">Email: sales@uoking.com</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                We're here to help you with your Ultima Online needs
              </p>
              <div className="space-y-2">
                <p className="text-lg font-bold text-amber-600">9AM - 1AM ET</p>
                <p className="text-sm text-gray-600">7 days a week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Transactions</h3>
            <p className="text-sm text-gray-600">100% secure payment processing</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Average delivery under 5 minutes</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Trusted Seller</h3>
            <p className="text-sm text-gray-600">10,000+ happy customers</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Crown className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">Only the best UO items</p>
          </div>
        </div>

        {/* Special Offers */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">🎄 Merry Christmas Special! 🎄</h3>
          <p className="text-lg mb-4">Use coupon code: <span className="font-bold text-yellow-300 text-xl">fiveoff</span></p>
          <p className="text-green-100 mb-6">Get 5% off your UO gold orders and items!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 hover:bg-green-50 border-2 border-white">
              Shop Now
            </Button>
            <Button 
              className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-green-600"
              onClick={() => window.open('https://discord.gg/jAWgunBH', '_blank')}
            >
              Join Discord
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
