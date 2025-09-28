import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Home, Hammer, Coins, ArrowRight, CheckCircle, AlertTriangle, Star, Shield } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Housing in Ultima Online - UO King | Complete UO Housing Guide",
  description: "Complete guide to housing in Ultima Online. Learn how to place houses, decorate, secure your home, and become a successful homeowner in Britannia.",
  keywords: "UO housing, Ultima Online housing, UO house guide, UO house placement, UO house decoration, UO house security, UO homeowner",
  openGraph: {
    title: "Housing in Ultima Online - UO King | Complete UO Housing Guide",
    description: "Complete guide to housing in Ultima Online. Learn how to place houses, decorate, secure your home, and become a successful homeowner in Britannia.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/housing-in-uo`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Housing in Ultima Online - UO King | Complete UO Housing Guide",
    description: "Complete guide to housing in Ultima Online. Learn how to place houses, decorate, secure your home, and become a successful homeowner in Britannia.",
  },
}

export default function HousingInUOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Housing in Ultima Online</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of housing in Britannia. Learn how to place houses, decorate, secure your home, and become a successful homeowner.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Housing in UO:</strong> Owning a house is one of the most rewarding aspects of Ultima Online. It provides storage, security, and a place to call home.
            </AlertDescription>
          </Alert>

          {/* Housing Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Housing Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Benefits of Owning a House</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Secure storage for your items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Private space for crafting and activities</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Status symbol and achievement</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Potential for profit through vendors</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Types of Houses</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Small houses - Starter homes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Medium houses - Family homes</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Large houses - Mansions and castles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Custom houses - Unique designs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* House Placement */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Hammer className="h-6 w-6" />
                <span>House Placement Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Find a Suitable Location</h3>
                    <p className="text-gray-600 text-sm">
                      Look for flat, open areas away from roads and other houses. Consider proximity to towns, resources, and other players.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Check Placement Requirements</h3>
                    <p className="text-gray-600 text-sm">
                      Ensure the area is large enough for your house type and meets all placement restrictions. Use the house placement tool to preview.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Purchase the House</h3>
                    <p className="text-gray-600 text-sm">
                      Buy the house deed from a housing vendor or player. Make sure you have enough gold and meet any skill requirements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Place the House</h3>
                    <p className="text-gray-600 text-sm">
                      Double-click the house deed and target the location where you want to place your house. The house will appear instantly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* House Types */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">House Types and Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏠</span>
                    Small Houses
                  </h4>
                  <p className="text-sm text-gray-600">Perfect for new players and single characters.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 1-2 rooms</li>
                    <li>• Basic storage</li>
                    <li>• Affordable price</li>
                    <li>• Easy to place</li>
                  </ul>
                  <Badge className="bg-green-100 text-green-800">Beginner Friendly</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏘️</span>
                    Medium Houses
                  </h4>
                  <p className="text-sm text-gray-600">Great for families and small guilds.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 3-5 rooms</li>
                    <li>• Good storage space</li>
                    <li>• Moderate price</li>
                    <li>• More placement options</li>
                  </ul>
                  <Badge className="bg-blue-100 text-blue-800">Family Size</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏰</span>
                    Large Houses
                  </h4>
                  <p className="text-sm text-gray-600">Mansions and castles for wealthy players.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 6+ rooms</li>
                    <li>• Massive storage</li>
                    <li>• Expensive price</li>
                    <li>• Limited placement</li>
                  </ul>
                  <Badge className="bg-purple-100 text-purple-800">Luxury</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* House Security */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Shield className="h-6 w-6" />
                <span>House Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Access Control</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set house access levels (owner, co-owner, friend)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Control who can enter your house</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Manage vendor access and permissions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Secure containers and storage</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Security Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Keep valuable items in secure containers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Don't give access to strangers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Use house signs to communicate rules</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Regularly check your house permissions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* House Decoration */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">House Decoration and Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Decoration Options</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Furniture and decorations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Paint and color customization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Gardens and landscaping</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Vendor shops and displays</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Decoration Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Plan your layout before placing items</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Use themes for cohesive design</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Create functional spaces (crafting, storage)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Show off rare and valuable items</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* House Economics */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Coins className="h-6 w-6" />
                <span>House Economics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Making Money with Houses</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set up vendor shops to sell items</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Rent out rooms to other players</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Create crafting stations for hire</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Host events and charge admission</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">House Maintenance</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Pay house taxes regularly</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Keep vendors stocked and running</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Maintain security and access controls</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Update decorations and displays</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Become a Homeowner?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand housing, learn more about crafting and find the items you need to decorate your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/crafting-resources">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn About Crafting
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse House Items
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Beginner's Guide
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
