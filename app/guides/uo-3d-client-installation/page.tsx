import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Download, Settings, CheckCircle, AlertTriangle, ArrowRight, ExternalLink, Monitor } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "UO 3D Client Installation Guide - UO King | How to Install UO 3D Client",
  description: "Complete guide to downloading and installing the UO 3D Client. Learn how to set up the 3D version of Ultima Online with enhanced graphics and modern features.",
  keywords: "UO 3D Client, UO 3D installation, UO 3D download, Ultima Online 3D, UO 3D setup, UO 3D client guide",
  openGraph: {
    title: "UO 3D Client Installation Guide - UO King | How to Install UO 3D Client",
    description: "Complete guide to downloading and installing the UO 3D Client. Learn how to set up the 3D version of Ultima Online with enhanced graphics and modern features.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/uo-3d-client-installation`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "UO 3D Client Installation Guide - UO King | How to Install UO 3D Client",
    description: "Complete guide to downloading and installing the UO 3D Client. Learn how to set up the 3D version of Ultima Online with enhanced graphics and modern features.",
  },
}

export default function UO3DClientInstallationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Smartphone className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO 3D Client Installation Guide</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience Ultima Online in full 3D! Learn how to download, install, and configure the UO 3D Client for a completely different visual experience.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>3D Client:</strong> The UO 3D Client offers a completely different perspective on Britannia with full 3D graphics and modern rendering.
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
                    <h3 className="font-semibold text-gray-900 mb-2">Download the 3D Client</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Download the UO 3D Client installer from the official UO website. This is a separate client from the classic and enhanced versions.
                    </p>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Download 3D Client
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">System Requirements Check</h3>
                    <p className="text-gray-600 text-sm">
                      Ensure your system meets the requirements for 3D graphics. The 3D client requires more powerful hardware than the classic client.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Run the Installer</h3>
                    <p className="text-gray-600 text-sm">
                      Run the installer as administrator and follow the installation wizard. The process may take longer than other clients due to 3D assets.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Launch and Configure</h3>
                    <p className="text-gray-600 text-sm">
                      Launch the 3D client and configure your graphics settings for optimal performance and visual quality.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Requirements */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Monitor className="h-6 w-6" />
                <span>System Requirements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Minimum Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Windows 7 or later</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>4GB RAM</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>DirectX 11 compatible graphics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>10GB free disk space</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Broadband internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Windows 10 or later</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>8GB RAM</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Dedicated graphics card</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>20GB free disk space</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>High-speed internet connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3D Features */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">3D Client Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🎮</span>
                    Full 3D Graphics
                  </h4>
                  <p className="text-sm text-gray-600">Complete 3D rendering of the world with modern graphics technology.</p>
                  <Badge className="bg-blue-100 text-blue-800">Visual</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🎥</span>
                    Camera Control
                  </h4>
                  <p className="text-sm text-gray-600">Full camera control with zoom, rotation, and different viewing angles.</p>
                  <Badge className="bg-green-100 text-green-800">Control</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">💡</span>
                    Dynamic Lighting
                  </h4>
                  <p className="text-sm text-gray-600">Realistic lighting effects and shadows for immersive gameplay.</p>
                  <Badge className="bg-purple-100 text-purple-800">Lighting</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🌊</span>
                    Particle Effects
                  </h4>
                  <p className="text-sm text-gray-600">Enhanced spell effects and environmental particles.</p>
                  <Badge className="bg-orange-100 text-orange-800">Effects</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🎵</span>
                    Enhanced Audio
                  </h4>
                  <p className="text-sm text-gray-600">Improved sound quality and 3D positional audio.</p>
                  <Badge className="bg-pink-100 text-pink-800">Audio</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🖥️</span>
                    Modern UI
                  </h4>
                  <p className="text-sm text-gray-600">Updated user interface designed for modern displays.</p>
                  <Badge className="bg-gray-100 text-gray-800">Interface</Badge>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Graphics Settings</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Adjust texture quality</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Configure shadow quality</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set particle effects level</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Optimize for your hardware</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Camera Settings</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Configure camera controls</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set default viewing angle</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Adjust zoom limits</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Enable/disable camera smoothing</span>
                      </li>
                    </ul>
                  </div>
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
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Issues</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Lower graphics settings</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Update graphics drivers</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Close unnecessary programs</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Check system resources</span>
                      </li>
                    </ul>
                  </div>
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
                        <span>Check available disk space</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Verify system requirements</span>
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
              <CardTitle className="text-xl font-bold">Ready to Experience 3D UO?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you have the 3D client set up, learn the basics of UO gameplay and choose your shard.
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
