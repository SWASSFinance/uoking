import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Monitor, Download, Settings, CheckCircle, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "UO Enhanced Client Setup Guide - UO King | How to Install UO Enhanced Client",
  description: "Complete guide to downloading and setting up the UO Enhanced Client. Learn how to install, configure, and optimize the modern Ultima Online client.",
  keywords: "UO Enhanced Client, UO client setup, UO Enhanced Client download, UO client installation, UO client configuration",
  openGraph: {
    title: "UO Enhanced Client Setup Guide - UO King | How to Install UO Enhanced Client",
    description: "Complete guide to downloading and setting up the UO Enhanced Client. Learn how to install, configure, and optimize the modern Ultima Online client.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/uo-enhanced-client-setup`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "UO Enhanced Client Setup Guide - UO King | How to Install UO Enhanced Client",
    description: "Complete guide to downloading and setting up the UO Enhanced Client. Learn how to install, configure, and optimize the modern Ultima Online client.",
  },
}

export default function UOEnhancedClientSetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Monitor className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO Enhanced Client Setup Guide</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to download, install, and configure the UO Enhanced Client for the best Ultima Online experience.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Enhanced Client:</strong> The UO Enhanced Client offers improved graphics, better UI, and modern features while maintaining compatibility with all UO shards.
            </AlertDescription>
          </Alert>

          {/* Download & Installation */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Download className="h-6 w-6" />
                <span>Download & Installation</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Download the Client</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Visit the official UO website and download the UO Enhanced Client installer.
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download Enhanced Client
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Run the Installer</h3>
                    <p className="text-gray-600 text-sm">
                      Run the downloaded installer and follow the on-screen instructions. The installation process is straightforward and automated.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Launch the Client</h3>
                    <p className="text-gray-600 text-sm">
                      Once installed, launch the UO Enhanced Client from your desktop or start menu.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Settings className="h-6 w-6" />
                <span>Configuration & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Display Settings</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set resolution to match your monitor</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Enable fullscreen or windowed mode</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Adjust graphics quality settings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Configure UI scaling</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Gameplay Settings</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set up hotkeys for spells and items</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Configure chat and message settings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Enable/disable sound effects</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set up macro commands</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Enhanced Client Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🎨</span>
                    Enhanced Graphics
                  </h4>
                  <p className="text-sm text-gray-600">Improved textures, lighting, and visual effects for a more modern look.</p>
                  <Badge className="bg-blue-100 text-blue-800">Visual</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🖱️</span>
                    Better UI
                  </h4>
                  <p className="text-sm text-gray-600">Improved user interface with better organization and customization options.</p>
                  <Badge className="bg-green-100 text-green-800">Interface</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">⚡</span>
                    Performance
                  </h4>
                  <p className="text-sm text-gray-600">Better performance and stability compared to the classic client.</p>
                  <Badge className="bg-purple-100 text-purple-800">Performance</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔧</span>
                    Customization
                  </h4>
                  <p className="text-sm text-gray-600">More customization options for UI layout and appearance.</p>
                  <Badge className="bg-orange-100 text-orange-800">Customizable</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">📱</span>
                    Modern Features
                  </h4>
                  <p className="text-sm text-gray-600">Modern features like improved tooltips and better item management.</p>
                  <Badge className="bg-pink-100 text-pink-800">Modern</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🛡️</span>
                    Compatibility
                  </h4>
                  <p className="text-sm text-gray-600">Full compatibility with all official UO shards and most free shards.</p>
                  <Badge className="bg-gray-100 text-gray-800">Compatible</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Troubleshooting Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Installation Issues</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Run installer as administrator</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Disable antivirus temporarily</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Check system requirements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Update graphics drivers</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Issues</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Lower graphics settings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Close unnecessary programs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Update to latest version</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Check internet connection</span>
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
              <CardTitle className="text-xl font-bold">Ready to Start Playing?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you have the Enhanced Client set up, learn the basics of UO gameplay and choose your shard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
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
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Items
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
