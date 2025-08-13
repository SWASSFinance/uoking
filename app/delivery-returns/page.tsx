import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Truck, RotateCcw, Clock, Shield, CheckCircle, Package } from "lucide-react"

export default function DeliveryReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Delivery & Returns</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, secure delivery for all your Ultima Online needs. Learn about our delivery process and return policy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Delivery Information */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Truck className="h-6 w-6" />
                  <span>Delivery Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                      <p className="text-gray-600 text-sm">Most items delivered within 5-30 minutes during business hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Delivery Method</h3>
                      <p className="text-gray-600 text-sm">In-game delivery directly to your character or secure trade window</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Secure Process</h3>
                      <p className="text-gray-600 text-sm">All transactions are verified and secure. Your items are guaranteed.</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-amber-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Hours</h4>
                  <p className="text-gray-600 text-sm">Monday - Sunday: 9:00 AM - 1:00 AM ET</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">24/7 Support Available</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Returns Policy */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <RotateCcw className="h-6 w-6" />
                  <span>Returns Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Gold Returns</h3>
                      <p className="text-gray-600 text-sm">100% satisfaction guarantee on all gold purchases</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Item Quality</h3>
                      <p className="text-gray-600 text-sm">All items verified for quality and authenticity before delivery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Account Safety</h3>
                      <p className="text-gray-600 text-sm">We never ask for account passwords or personal information</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-amber-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Return Window</h4>
                  <p className="text-gray-600 text-sm">Contact us within 24 hours if you experience any issues</p>
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-600">No Questions Asked</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Process */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">How Delivery Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Place Order</h3>
                  <p className="text-gray-600 text-sm">Complete your purchase and provide character details</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Info</h3>
                  <p className="text-gray-600 text-sm">We'll contact you via Discord or email for delivery</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Meet In-Game</h3>
                  <p className="text-gray-600 text-sm">Meet our delivery agent at the agreed location</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receive Items</h3>
                  <p className="text-gray-600 text-sm">Get your items through secure trade window</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Our support team is available 24/7 to assist with any delivery or return questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-green-600 hover:bg-green-50">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Discord: mr.brc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
} 