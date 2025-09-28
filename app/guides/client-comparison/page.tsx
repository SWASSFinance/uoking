import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Smartphone, ArrowRight, CheckCircle, AlertTriangle, Star, Zap } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "UO Client Comparison Guide - UO King | Compare UO Classic, Enhanced, and 3D Clients",
  description: "Complete comparison of Ultima Online clients. Compare UO Classic, Enhanced, and 3D clients to choose the best UO client for your needs and preferences.",
  keywords: "UO client comparison, UO Classic vs Enhanced, UO 3D client, UO client guide, best UO client, UO client features",
  openGraph: {
    title: "UO Client Comparison Guide - UO King | Compare UO Classic, Enhanced, and 3D Clients",
    description: "Complete comparison of Ultima Online clients. Compare UO Classic, Enhanced, and 3D clients to choose the best UO client for your needs and preferences.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/client-comparison`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "UO Client Comparison Guide - UO King | Compare UO Classic, Enhanced, and 3D Clients",
    description: "Complete comparison of Ultima Online clients. Compare UO Classic, Enhanced, and 3D clients to choose the best UO client for your needs and preferences.",
  },
}

export default function ClientComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Monitor className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO Client Comparison Guide</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare all Ultima Online clients to find the perfect one for your playstyle. Detailed comparison of features, performance, and compatibility.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Client Choice:</strong> Each UO client offers a different experience. Choose the one that best fits your preferences and system capabilities.
            </AlertDescription>
          </Alert>

          {/* Client Comparison Table */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Client Comparison Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-amber-200">
                      <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Classic Client</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Enhanced Client</th>
                      <th className="text-center p-4 font-semibold text-gray-900">3D Client</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Graphics</td>
                      <td className="p-4 text-center">2D Classic</td>
                      <td className="p-4 text-center">Enhanced 2D</td>
                      <td className="p-4 text-center">Full 3D</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Performance</td>
                      <td className="p-4 text-center">Excellent</td>
                      <td className="p-4 text-center">Good</td>
                      <td className="p-4 text-center">Requires Good Hardware</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">System Requirements</td>
                      <td className="p-4 text-center">Low</td>
                      <td className="p-4 text-center">Medium</td>
                      <td className="p-4 text-center">High</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Shard Compatibility</td>
                      <td className="p-4 text-center">All Shards</td>
                      <td className="p-4 text-center">Most Shards</td>
                      <td className="p-4 text-center">Official Shards</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">User Interface</td>
                      <td className="p-4 text-center">Classic</td>
                      <td className="p-4 text-center">Modern</td>
                      <td className="p-4 text-center">3D Interface</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Customization</td>
                      <td className="p-4 text-center">Limited</td>
                      <td className="p-4 text-center">Good</td>
                      <td className="p-4 text-center">Moderate</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-4 font-medium text-gray-900">Learning Curve</td>
                      <td className="p-4 text-center">Easy</td>
                      <td className="p-4 text-center">Easy</td>
                      <td className="p-4 text-center">Moderate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Client Reviews */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Classic Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-amber-600">UO Classic Client</span>
                  <Badge className="bg-green-100 text-green-800">Most Compatible</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Pros</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Works on any system</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Compatible with all shards</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Familiar to veteran players</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Lightweight and fast</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Cons</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Outdated graphics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Limited UI customization</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Basic features</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Best For</h4>
                  <p className="text-sm text-gray-600">Veteran players, low-end systems, maximum compatibility</p>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-amber-600">UO Enhanced Client</span>
                  <Badge className="bg-blue-100 text-blue-800">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Pros</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Modern graphics and UI</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Better performance than 3D</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Good customization options</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Compatible with most shards</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Cons</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Not compatible with all free shards</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Higher system requirements</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Different from classic experience</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Best For</h4>
                  <p className="text-sm text-gray-600">New players, modern systems, balanced experience</p>
                </div>
              </CardContent>
            </Card>

            {/* 3D Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-amber-600">UO 3D Client</span>
                  <Badge className="bg-purple-100 text-purple-800">Unique Experience</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Pros</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Full 3D graphics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Camera control</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Modern rendering</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span>Enhanced effects</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Cons</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>High system requirements</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Limited shard compatibility</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Different gameplay feel</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-red-600" />
                      <span>Learning curve for controls</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Best For</h4>
                  <p className="text-sm text-gray-600">High-end systems, unique experience, official shards only</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Requirements Comparison */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Zap className="h-6 w-6" />
                <span>System Requirements Comparison</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Classic Client</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Windows 7 or later</li>
                    <li>• 1GB RAM</li>
                    <li>• 2GB free disk space</li>
                    <li>• DirectX 9.0c compatible graphics</li>
                    <li>• Internet connection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Enhanced Client</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Windows 7 or later</li>
                    <li>• 2GB RAM</li>
                    <li>• 3GB free disk space</li>
                    <li>• DirectX 10 compatible graphics</li>
                    <li>• Broadband internet connection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">3D Client</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Windows 7 or later</li>
                    <li>• 4GB RAM</li>
                    <li>• 10GB free disk space</li>
                    <li>• DirectX 11 compatible graphics</li>
                    <li>• High-speed internet connection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Client Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">For New Players</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Start with Enhanced Client for modern experience</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Try Classic Client if Enhanced doesn't work</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Consider 3D Client only if you have powerful hardware</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">For Veteran Players</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Stick with Classic Client for familiarity</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Try Enhanced Client for modern features</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Experiment with 3D Client for new perspective</span>
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
              <CardTitle className="text-xl font-bold">Ready to Choose Your Client?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand the differences, download your chosen client and start your UO adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/download-uo-client">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Download UO Client
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Beginner's Guide
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/shards/uo-shard-list">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Choose a Shard
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
