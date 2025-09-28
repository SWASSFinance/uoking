import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, Coins, Crown, Shield, Star, ArrowRight, CheckCircle, AlertTriangle, Zap, DollarSign } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sell to UOKing - UO King | Sell Your UO Items & Accounts",
  description: "Sell your Ultima Online items, gold, and accounts to UOKing. Get competitive prices and fast payment. Contact us via live chat for instant quotes.",
  keywords: "sell UO items, sell UO account, sell UO gold, UO items buyer, UO account buyer, sell to UOKing, UO trading",
  openGraph: {
    title: "Sell to UOKing - UO King | Sell Your UO Items & Accounts",
    description: "Sell your Ultima Online items, gold, and accounts to UOKing. Get competitive prices and fast payment. Contact us via live chat for instant quotes.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/sell-to-uoking`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Sell to UOKing - UO King | Sell Your UO Items & Accounts",
    description: "Sell your Ultima Online items, gold, and accounts to UOKing. Get competitive prices and fast payment. Contact us via live chat for instant quotes.",
  },
}

export default function SellToUOKingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Sell to UOKing</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your UO items, gold, and accounts into cash. Get competitive prices and fast payment from the most trusted UO buyer.
            </p>
          </div>

          <Alert className="mb-8">
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to Sell?</strong> Click the live chat button in the bottom right corner to get an instant quote for your items or account.
            </AlertDescription>
          </Alert>

          {/* What We Buy */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>What We Buy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 flex items-center">
                      <span className="text-2xl mr-2">💰</span>
                      UO Gold
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">We buy gold from all official shards at competitive rates.</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>• Atlantic gold</li>
                      <li>• Catskills gold</li>
                      <li>• Chesapeake gold</li>
                      <li>• Great Lakes gold</li>
                      <li>• Lake Superior gold</li>
                      <li>• Siege Perilous gold</li>
                    </ul>
                    <Badge className="bg-blue-100 text-blue-800 mt-2">All Shards</Badge>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-900 flex items-center">
                      <span className="text-2xl mr-2">⚔️</span>
                      Rare Items
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">High-value items, artifacts, and unique equipment.</p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>• Artifacts and rares</li>
                      <li>• Legendary weapons</li>
                      <li>• Exceptional armor</li>
                      <li>• Power scrolls</li>
                      <li>• Rare resources</li>
                    </ul>
                    <Badge className="bg-purple-100 text-purple-800 mt-2">High Value</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 flex items-center">
                      <span className="text-2xl mr-2">👑</span>
                      UO Accounts
                    </h4>
                    <p className="text-sm text-green-700 mb-3">Complete accounts with characters, skills, and items.</p>
                    <ul className="text-xs text-green-600 space-y-1">
                      <li>• High-skill characters</li>
                      <li>• Accounts with houses</li>
                      <li>• Rare character names</li>
                      <li>• Accounts with items</li>
                      <li>• Multiple character accounts</li>
                    </ul>
                    <Badge className="bg-green-100 text-green-800 mt-2">Complete Accounts</Badge>
                  </div>
                  
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-900 flex items-center">
                      <span className="text-2xl mr-2">🏠</span>
                      Houses & Plots
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">Houses, plots, and housing-related items.</p>
                    <ul className="text-xs text-orange-600 space-y-1">
                      <li>• Houses in good locations</li>
                      <li>• Large houses and castles</li>
                      <li>• House deeds</li>
                      <li>• House add-ons</li>
                      <li>• Rare house items</li>
                    </ul>
                    <Badge className="bg-orange-100 text-orange-800 mt-2">Real Estate</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Sell */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <MessageSquare className="h-6 w-6" />
                <span>How to Sell to UOKing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Click Live Chat</h3>
                    <p className="text-gray-600 text-sm">
                      Click the live chat button in the bottom right corner of this page to start a conversation with our team.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Provide Details</h3>
                    <p className="text-gray-600 text-sm">
                      Tell us what you want to sell - include shard, item details, quantities, and any relevant information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Instant Quote</h3>
                    <p className="text-gray-600 text-sm">
                      We'll provide you with a competitive quote within minutes. No waiting or complicated forms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complete Transaction</h3>
                    <p className="text-gray-600 text-sm">
                      Once you accept our offer, we'll arrange the transfer and send payment immediately via your preferred method.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose UOKing */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Shield className="h-6 w-6" />
                <span>Why Choose UOKing?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Competitive Prices</h4>
                      <p className="text-sm text-gray-600">We offer the best rates in the market for your UO items and accounts.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Fast Payment</h4>
                      <p className="text-sm text-gray-600">Get paid immediately via PayPal, bank transfer, or other preferred methods.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Trusted & Secure</h4>
                      <p className="text-sm text-gray-600">Years of experience with thousands of satisfied customers.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Our team is available around the clock to help with your sale.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">No Hidden Fees</h4>
                      <p className="text-sm text-gray-600">Transparent pricing with no surprise charges or fees.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Instant Quotes</h4>
                      <p className="text-sm text-gray-600">Get immediate pricing through our live chat system.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Coins className="h-6 w-6" />
                <span>Payment Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-2xl mb-2">💳</div>
                  <h4 className="font-semibold text-blue-900 text-sm">PayPal</h4>
                  <p className="text-xs text-blue-600">Instant transfer</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl mb-2">🏦</div>
                  <h4 className="font-semibold text-green-900 text-sm">Bank Transfer</h4>
                  <p className="text-xs text-green-600">Direct deposit</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-2xl mb-2">💎</div>
                  <h4 className="font-semibold text-purple-900 text-sm">Crypto</h4>
                  <p className="text-xs text-purple-600">Bitcoin, etc.</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-2xl mb-2">💰</div>
                  <h4 className="font-semibold text-orange-900 text-sm">Other</h4>
                  <p className="text-xs text-orange-600">Ask in chat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Sell Your UO Items?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Get started right now! Click the live chat button in the bottom right corner to connect with our team and get an instant quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/contact">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Our Store
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/how-to-farm-gold">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Gold Farming Guide
                  </Link>
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
