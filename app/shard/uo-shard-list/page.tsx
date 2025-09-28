import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, Users, Globe, Clock, Shield, Star, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
  description: "Complete list of Ultima Online shards with recommendations. Find the best UO server for your playstyle with population, rules, and features comparison.",
  keywords: "UO shard list, Ultima Online servers, UO server recommendations, best UO shard, UO server comparison, UO server population",
  openGraph: {
    title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
    description: "Complete list of Ultima Online shards with recommendations. Find the best UO server for your playstyle with population, rules, and features comparison.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/shards/uo-shard-list`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "UO Shard List & Recommendations - UO King | Best Ultima Online Servers",
    description: "Complete list of Ultima Online shards with recommendations. Find the best UO server for your playstyle with population, rules, and features comparison.",
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
              Find the perfect Ultima Online shard for your playstyle. Compare population, rules, and features to make the best choice.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Choosing a Shard:</strong> Each shard has its own community, rules, and features. Take time to research before committing to one.
            </AlertDescription>
          </Alert>

          {/* Official Shards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 text-amber-600 mr-3" />
              Official Shards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Atlantic */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-amber-600">Atlantic</span>
                    <Badge className="bg-green-100 text-green-800">Most Popular</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: Very High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: North America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    The most populated official shard with active economy and PvP. Great for new players due to large community.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PvP</Badge>
                    <Badge variant="outline" className="text-xs">Active Economy</Badge>
                    <Badge variant="outline" className="text-xs">Large Community</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Pacific */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-600">Pacific</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: West Coast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    West Coast shard with strong community and active roleplay. Good for players in Pacific timezone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PvP</Badge>
                    <Badge variant="outline" className="text-xs">Roleplay</Badge>
                    <Badge variant="outline" className="text-xs">Friendly</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Great Lakes */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-600">Great Lakes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: Central US</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Central US shard with balanced population and active guilds. Good for players seeking smaller community feel.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PvP</Badge>
                    <Badge variant="outline" className="text-xs">Guild Wars</Badge>
                    <Badge variant="outline" className="text-xs">Balanced</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Europa */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-600">Europa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: Europe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    European shard with strong community and active PvP. Best for European players due to timezone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">PvP</Badge>
                    <Badge variant="outline" className="text-xs">European</Badge>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Origin */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-600">Origin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: North America</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Classic UO experience with traditional gameplay. Good for players who prefer the original UO feel.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Classic</Badge>
                    <Badge variant="outline" className="text-xs">Traditional</Badge>
                    <Badge variant="outline" className="text-xs">PvP</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Catskills */}
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-amber-600">Catskills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: Medium</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Region: East Coast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.9%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    East Coast shard with friendly community and active roleplay. Great for new players.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Friendly</Badge>
                    <Badge variant="outline" className="text-xs">Roleplay</Badge>
                    <Badge variant="outline" className="text-xs">New Player Friendly</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Free Shards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-amber-600 mr-3" />
              Popular Free Shards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-amber-600">UO Outlands</span>
                    <Badge className="bg-blue-100 text-blue-800">Custom</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: Very High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Custom Map</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.8%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Custom shard with new map, enhanced PvP, and active development. Very popular with competitive players.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Custom Map</Badge>
                    <Badge variant="outline" className="text-xs">Enhanced PvP</Badge>
                    <Badge variant="outline" className="text-xs">Active Dev</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-amber-600">UO Renaissance</span>
                    <Badge className="bg-purple-100 text-purple-800">Era Accurate</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Population: High</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Classic Era</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Uptime: 99.7%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Era-accurate shard recreating the classic UO experience from the late 90s. Perfect for nostalgia.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Classic Era</Badge>
                    <Badge variant="outline" className="text-xs">Nostalgia</Badge>
                    <Badge variant="outline" className="text-xs">Authentic</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Shard Selection Guide */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">How to Choose the Right Shard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Consider These Factors</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Your timezone and play schedule</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Population size preference</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>PvP vs PvE preference</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Roleplay interest</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Custom content vs classic</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">New Player Recommendations</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Start with Atlantic for large community</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Try Catskills for friendly atmosphere</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Consider Europa if in Europe</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Join guilds for guidance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Ask questions in chat</span>
                    </li>
                  </ul>
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
                Once you've chosen a shard, learn more about getting started and find the equipment you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
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
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/contact">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Get Help
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
