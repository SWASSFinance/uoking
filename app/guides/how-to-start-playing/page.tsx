import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Star, ArrowRight, CheckCircle, AlertTriangle, Crown, Users } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Start Playing Ultima Online - UO King | New Player Getting Started Guide",
  description: "Complete guide on how to start playing Ultima Online. Learn the first steps, character creation, basic gameplay, and how to get started in Britannia.",
  keywords: "how to start playing UO, Ultima Online getting started, new player guide, UO first steps, how to play UO, UO beginner tutorial",
  openGraph: {
    title: "How to Start Playing Ultima Online - UO King | New Player Getting Started Guide",
    description: "Complete guide on how to start playing Ultima Online. Learn the first steps, character creation, basic gameplay, and how to get started in Britannia.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/how-to-start-playing`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "How to Start Playing Ultima Online - UO King | New Player Getting Started Guide",
    description: "Complete guide on how to start playing Ultima Online. Learn the first steps, character creation, basic gameplay, and how to get started in Britannia.",
  },
}

export default function HowToStartPlayingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">How to Start Playing Ultima Online</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your complete guide to getting started in Britannia. From downloading the client to your first adventure.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Welcome to Britannia!</strong> Ultima Online is free to play. Follow this guide to get started on your adventure.
            </AlertDescription>
          </Alert>

          {/* Getting Started Steps */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Getting Started - Step by Step</span>
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
                      Download and install the Ultima Online client. You can choose between Classic, Enhanced, or 3D client.
                    </p>
                    <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Link href="/guides/download-uo-client">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Download Guide
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Choose a Shard</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Select a shard (server) to play on. Atlantic is recommended for new players due to its large community.
                    </p>
                    <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Link href="/shards/uo-shard-list">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Shard Guide
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Create Your Account</h3>
                    <p className="text-gray-600 text-sm">
                      Create a free UO account using a valid email address. This will be your login for the game.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Create Your Character</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Design your character, choose a name, select starting skills, and pick a starting city.
                    </p>
                    <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700">
                      <Link href="/guides/beginners-guide">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Character Guide
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complete the Tutorial</h3>
                    <p className="text-gray-600 text-sm">
                      Go through the new player tutorial to learn basic movement, combat, and game mechanics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Start Your Adventure</h3>
                    <p className="text-gray-600 text-sm">
                      Explore Britannia, meet other players, join a guild, and begin your journey in the world of UO!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Creation Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Crown className="h-6 w-6" />
                <span>Character Creation Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Starting Skills</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose skills that match your playstyle</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Start with 50 points in each skill</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Consider a balanced build for beginners</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>You can change skills later</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Starting City</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Britain - Most popular, lots of players</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Moonglow - Good for mages</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Minoc - Good for crafters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Vesper - Good for merchants</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Steps in Game */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Users className="h-6 w-6" />
                <span>Your First Steps in Britannia</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Essential First Actions</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Find the bank and learn to use it</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Learn basic movement and interaction</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Practice combat on weak monsters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Meet other players and ask questions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Getting Help</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Use the help system in-game</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Ask questions in general chat</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Join a guild for guidance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Visit UO community websites</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beginner Builds */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Recommended Beginner Builds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">⚔️</span>
                    Warrior
                  </h4>
                  <p className="text-sm text-gray-600">Simple melee combat build perfect for learning the basics.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Swordsmanship: 50</li>
                    <li>• Tactics: 50</li>
                    <li>• Healing: 50</li>
                    <li>• Anatomy: 50</li>
                  </ul>
                  <Badge className="bg-red-100 text-red-800">Easy to Learn</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧙‍♂️</span>
                    Mage
                  </h4>
                  <p className="text-sm text-gray-600">Magic-focused build with powerful spells and utility.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Magery: 50</li>
                    <li>• Eval Int: 50</li>
                    <li>• Meditation: 50</li>
                    <li>• Resist Spells: 50</li>
                  </ul>
                  <Badge className="bg-purple-100 text-purple-800">Versatile</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Crafter
                  </h4>
                  <p className="text-sm text-gray-600">Build focused on creating items and making money.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Blacksmithy: 50</li>
                    <li>• Mining: 50</li>
                    <li>• Magery: 50</li>
                    <li>• Eval Int: 50</li>
                  </ul>
                  <Badge className="bg-amber-100 text-amber-800">Profitable</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Begin Your Adventure?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you know how to get started, dive deeper into UO gameplay and find the equipment you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Complete Beginner's Guide
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/skill-system">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn About Skills
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
