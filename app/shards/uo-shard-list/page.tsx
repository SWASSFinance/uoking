import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, Users, Globe, Clock, Shield, Star, ArrowRight, CheckCircle, AlertTriangle, MapPin, Crown } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
  description: "Complete list of Ultima Online shards with recommendations. Find the best UO servers, compare populations, and choose the perfect shard for your playstyle.",
  keywords: "UO shard list, Ultima Online servers, UO server list, best UO shards, UO server recommendations, UO shard comparison",
  openGraph: {
    title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
    description: "Complete list of Ultima Online shards with recommendations. Find the best UO servers, compare populations, and choose the perfect shard for your playstyle.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/shards/uo-shard-list`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
    description: "Complete list of Ultima Online shards with recommendations. Find the best UO servers, compare populations, and choose the perfect shard for your playstyle.",
  },
}

export default function UOShardListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Server className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO Shard List & Recommendations</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the best Ultima Online shards. Compare official and free shards, find active communities, and choose your perfect UO server.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Shard Selection:</strong> Choose your shard carefully as it will determine your UO experience, community, and available content.
            </AlertDescription>
          </Alert>

          {/* Official Shards */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Crown className="h-6 w-6" />
                <span>Official Shards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 flex items-center">
                      <span className="text-2xl mr-2">🌊</span>
                      Atlantic
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">The most populated official shard with the largest economy.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-green-100 text-green-800">Very High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>PvP Activity:</span>
                        <Badge className="bg-red-100 text-red-800">High</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Economy:</span>
                        <Badge className="bg-blue-100 text-blue-800">Largest</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Best for: Competitive players, large economy, active PvP</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 flex items-center">
                      <span className="text-2xl mr-2">🌙</span>
                      Catskills
                    </h4>
                    <p className="text-sm text-green-700 mb-3">Friendly community with strong roleplay elements.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Community:</span>
                        <Badge className="bg-green-100 text-green-800">Friendly</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Roleplay:</span>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">Best for: New players, roleplayers, friendly community</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-900 flex items-center">
                      <span className="text-2xl mr-2">🌊</span>
                      Chesapeake
                    </h4>
                    <p className="text-sm text-purple-700 mb-3">East coast shard with dedicated community.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Community:</span>
                        <Badge className="bg-green-100 text-green-800">Dedicated</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Region:</span>
                        <Badge className="bg-blue-100 text-blue-800">East Coast</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">Best for: East coast players, dedicated community</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-900 flex items-center">
                      <span className="text-2xl mr-2">🏔️</span>
                      Great Lakes
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">Balanced shard with good mix of PvP and PvE.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>PvP Activity:</span>
                        <Badge className="bg-orange-100 text-orange-800">Moderate</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Economy:</span>
                        <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-orange-600 mt-2">Best for: Balanced gameplay, crafters, moderate competition</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <h4 className="font-semibold text-teal-900 flex items-center">
                      <span className="text-2xl mr-2">🏔️</span>
                      Lake Superior
                    </h4>
                    <p className="text-sm text-teal-700 mb-3">Midwest shard with dedicated community.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Region:</span>
                        <Badge className="bg-teal-100 text-teal-800">Midwest</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Community:</span>
                        <Badge className="bg-green-100 text-green-800">Dedicated</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-teal-600 mt-2">Best for: Midwest players, dedicated community</p>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 flex items-center">
                      <span className="text-2xl mr-2">⚔️</span>
                      Siege Perilous
                    </h4>
                    <p className="text-sm text-red-700 mb-3">Hardcore PvP shard with full loot and no insurance.</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Population:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>PvP Activity:</span>
                        <Badge className="bg-red-100 text-red-800">Extreme</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge className="bg-red-100 text-red-800">Hardcore</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-red-600 mt-2">Best for: Hardcore PvP players, experienced veterans</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Shard Comparison */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <MapPin className="h-6 w-6" />
                <span>Shard Comparison Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left p-4 font-semibold text-gray-900">Shard</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Type</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Population</th>
                      <th className="text-center p-4 font-semibold text-gray-900">PvP Level</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Atlantic</td>
                      <td className="p-4 text-center">Official</td>
                      <td className="p-4 text-center"><Badge className="bg-green-100 text-green-800">Very High</Badge></td>
                      <td className="p-4 text-center"><Badge className="bg-red-100 text-red-800">High</Badge></td>
                      <td className="p-4 text-center">Competitive players</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Catskills</td>
                      <td className="p-4 text-center">Official</td>
                      <td className="p-4 text-center"><Badge className="bg-yellow-100 text-yellow-800">Low</Badge></td>
                      <td className="p-4 text-center"><Badge className="bg-orange-100 text-orange-800">Moderate</Badge></td>
                      <td className="p-4 text-center">New players</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Chesapeake</td>
                      <td className="p-4 text-center">Official</td>
                      <td className="p-4 text-center"><Badge className="bg-yellow-100 text-yellow-800">Low</Badge></td>
                      <td className="p-4 text-center"><Badge className="bg-orange-100 text-orange-800">Moderate</Badge></td>
                      <td className="p-4 text-center">East coast players</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Great Lakes</td>
                      <td className="p-4 text-center">Official</td>
                      <td className="p-4 text-center"><Badge className="bg-yellow-100 text-yellow-800">Low</Badge></td>
                      <td className="p-4 text-center"><Badge className="bg-orange-100 text-orange-800">Moderate</Badge></td>
                      <td className="p-4 text-center">Balanced gameplay</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Lake Superior</td>
                      <td className="p-4 text-center">Official</td>
                      <td className="p-4 text-center"><Badge className="bg-yellow-100 text-yellow-800">Low</Badge></td>
                      <td className="p-4 text-center"><Badge className="bg-orange-100 text-orange-800">Moderate</Badge></td>
                      <td className="p-4 text-center">Midwest players</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Choosing Your Shard */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">How to Choose Your Shard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Consider Your Playstyle</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>PvP vs PvE preference</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Roleplay interest level</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Time commitment and schedule</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Desired population size</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Research Steps</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Visit shard websites and forums</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Check population statistics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Read shard rules and policies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Test multiple shards before committing</span>
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
                Now that you've seen the shard options, learn more about getting started and find the equipment you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/shards/which-shard-to-play">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    How to Choose a Shard
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
