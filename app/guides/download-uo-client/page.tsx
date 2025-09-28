import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Monitor, Smartphone, AlertTriangle, CheckCircle, ExternalLink, ArrowRight } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Download UO Client - UO King | Ultima Online Client Download Guide",
  description: "Complete guide to downloading and installing the Ultima Online client. Learn how to download UO Classic, Enhanced Client, and UO 3D client for free.",
  keywords: "download UO, UO client download, Ultima Online client, UO Classic, UO Enhanced Client, UO 3D, free download",
  openGraph: {
    title: "How to Download UO Client - UO King | Ultima Online Client Download Guide",
    description: "Complete guide to downloading and installing the Ultima Online client. Learn how to download UO Classic, Enhanced Client, and UO 3D client for free.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/download-uo-client`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "How to Download UO Client - UO King | Ultima Online Client Download Guide",
    description: "Complete guide to downloading and installing the Ultima Online client. Learn how to download UO Classic, Enhanced Client, and UO 3D client for free.",
  },
}

export default function DownloadUOClientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">How to Download UO Client</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete guide to downloading and installing the Ultima Online client. Get started with UO today!
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Ultima Online is free to play! You only need to download the client and create an account to start playing.
            </AlertDescription>
          </Alert>

          {/* Client Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* UO Classic Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Monitor className="h-6 w-6" />
                  <span>UO Classic Client</span>
                </CardTitle>
                <Badge className="w-fit bg-green-100 text-green-800">Recommended</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  The original 2D client with classic UO graphics. Perfect for nostalgic players and those who prefer the traditional UO experience.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Classic 2D graphics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Lightweight and fast</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Most shard support</span>
                  </li>
                </ul>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Classic Client
                </Button>
              </CardContent>
            </Card>

            {/* UO Enhanced Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Monitor className="h-6 w-6" />
                  <span>UO Enhanced Client</span>
                </CardTitle>
                <Badge className="w-fit bg-blue-100 text-blue-800">Modern</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  The modern client with improved graphics, better UI, and enhanced features. Great for new players and those who want a more polished experience.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Enhanced graphics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Better user interface</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Modern features</span>
                  </li>
                </ul>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download Enhanced Client
                </Button>
              </CardContent>
            </Card>

            {/* UO 3D Client */}
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <Smartphone className="h-6 w-6" />
                  <span>UO 3D Client</span>
                </CardTitle>
                <Badge className="w-fit bg-purple-100 text-purple-800">3D Graphics</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  The 3D client with full 3D graphics and modern rendering. Perfect for players who want a completely different visual experience.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Full 3D graphics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Modern rendering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Unique perspective</span>
                  </li>
                </ul>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download 3D Client
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Installation Steps */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Installation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Download the Client</h3>
                    <p className="text-gray-600 text-sm">
                      Click the download button above for your preferred client. The download is completely free and takes just a few minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Run the Installer</h3>
                    <p className="text-gray-600 text-sm">
                      Once downloaded, run the installer and follow the on-screen instructions. The installation process is straightforward and automated.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Create Your Account</h3>
                    <p className="text-gray-600 text-sm">
                      Launch the client and create your free UO account. You'll need a valid email address to complete registration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Start Playing</h3>
                    <p className="text-gray-600 text-sm">
                      Choose your shard, create your character, and start your adventure in Britannia! Welcome to Ultima Online!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Requirements */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">System Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Minimum Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Windows 7 or later</li>
                    <li>• 1GB RAM</li>
                    <li>• 2GB free disk space</li>
                    <li>• DirectX 9.0c compatible graphics</li>
                    <li>• Internet connection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Requirements</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Windows 10 or later</li>
                    <li>• 4GB RAM</li>
                    <li>• 5GB free disk space</li>
                    <li>• DirectX 11 compatible graphics</li>
                    <li>• Broadband internet connection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Start Your Adventure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Once you have the client installed, check out our beginner's guide to learn the basics of Ultima Online gameplay.
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
