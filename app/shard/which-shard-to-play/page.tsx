import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, Users, Globe, Clock, Shield, Star, ArrowRight, CheckCircle, AlertTriangle, MapPin } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Which UO Shard to Play - UO King | How to Choose the Best UO Server",
  description: "Complete guide to choosing the right UO shard for your playstyle. Compare official and free shards, learn about population, rules, and find your perfect UO server.",
  keywords: "which UO shard to play, choose UO server, best UO shard, UO server comparison, UO shard guide, UO server selection",
  openGraph: {
    title: "Which UO Shard to Play - UO King | How to Choose the Best UO Server",
    description: "Complete guide to choosing the right UO shard for your playstyle. Compare official and free shards, learn about population, rules, and find your perfect UO server.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/shards/which-shard-to-play`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Which UO Shard to Play - UO King | How to Choose the Best UO Server",
    description: "Complete guide to choosing the right UO shard for your playstyle. Compare official and free shards, learn about population, rules, and find your perfect UO server.",
  },
}

export default function WhichShardToPlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Server className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Which UO Shard to Play?</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect UO shard for your playstyle. Compare official and free shards to make the best choice for your adventure.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Choosing a Shard:</strong> The shard you choose will significantly impact your UO experience. Consider your preferences carefully before committing.
            </AlertDescription>
          </Alert>

          {/* Decision Factors */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Key Decision Factors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Your Preferences</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Play schedule and timezone</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>PvP vs PvE preference</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Population size preference</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Roleplay interest level</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Custom content vs classic</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Shard Characteristics</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Population size and activity</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Server rules and policies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Community culture and friendliness</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Economy and item availability</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Stability and uptime</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Official vs Free Shards */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Shield className="h-6 w-6" />
                <span>Official vs Free Shards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏛️</span>
                    Official Shards
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Guaranteed Stability</p>
                        <p className="text-xs text-gray-600">Professional servers with 99.9% uptime</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Large Communities</p>
                        <p className="text-xs text-gray-600">Thousands of active players</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Official Support</p>
                        <p className="text-xs text-gray-600">Customer service and bug fixes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Regular Updates</p>
                        <p className="text-xs text-gray-600">New content and features</p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Recommended for New Players</Badge>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🌟</span>
                    Free Shards
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Custom Content</p>
                        <p className="text-xs text-gray-600">Unique features and modifications</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Active Development</p>
                        <p className="text-xs text-gray-600">Community-driven improvements</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Tight Communities</p>
                        <p className="text-xs text-gray-600">Close-knit player groups</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Free to Play</p>
                        <p className="text-xs text-gray-600">No subscription required</p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">For Experienced Players</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shard Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <MapPin className="h-6 w-6" />
                <span>Shard Recommendations by Playstyle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">For New Players</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900">Atlantic</h5>
                        <p className="text-sm text-blue-700">Most populated, great for learning and finding help</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900">Catskills</h5>
                        <p className="text-sm text-green-700">Friendly community, good for beginners</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">For PvP Players</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="font-medium text-red-900">Atlantic</h5>
                        <p className="text-sm text-red-700">Most competitive PvP scene</p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-medium text-purple-900">UO Outlands</h5>
                        <p className="text-sm text-purple-700">Enhanced PvP with custom features</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">For Roleplayers</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <h5 className="font-medium text-amber-900">Pacific</h5>
                        <p className="text-sm text-amber-700">Strong roleplay community</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-900">Catskills</h5>
                        <p className="text-sm text-green-700">Active roleplay events</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">For Crafters</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-900">Atlantic</h5>
                        <p className="text-sm text-blue-700">Largest market for selling items</p>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <h5 className="font-medium text-orange-900">Great Lakes</h5>
                        <p className="text-sm text-orange-700">Good balance of competition and opportunity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Making Your Decision */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">How to Make Your Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Research Steps</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Read shard descriptions and rules</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Check population statistics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Visit shard websites and forums</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Ask questions in community chats</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Testing Shards</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Create test characters on multiple shards</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Spend time in each shard's community</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Test gameplay mechanics and features</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Compare ping and performance</span>
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
              <CardTitle className="text-xl font-bold">Ready to Choose Your Shard?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand how to choose a shard, explore the complete shard list and start your adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/shards/uo-shard-list">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Complete Shard List
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Beginner's Guide
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Equipment
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
