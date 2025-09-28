import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, Sword, Hammer, Pickaxe, Star, ArrowRight, CheckCircle, AlertTriangle, Crown, Zap } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to Farm Gold in UO - UO King | Ultimate Gold Farming Guide",
  description: "Complete guide to farming gold in Ultima Online. Learn the best methods, locations, and strategies to make gold efficiently in UO.",
  keywords: "UO gold farming, Ultima Online gold guide, UO money making, UO gold tips, UO farming guide, UO gold methods",
  openGraph: {
    title: "How to Farm Gold in UO - UO King | Ultimate Gold Farming Guide",
    description: "Complete guide to farming gold in Ultima Online. Learn the best methods, locations, and strategies to make gold efficiently in UO.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/how-to-farm-gold`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "How to Farm Gold in UO - UO King | Ultimate Gold Farming Guide",
    description: "Complete guide to farming gold in Ultima Online. Learn the best methods, locations, and strategies to make gold efficiently in UO.",
  },
}

export default function HowToFarmGoldPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Coins className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">How to Farm Gold in UO</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of gold farming in Britannia. Learn proven methods, strategies, and locations to build your wealth efficiently.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Gold Farming:</strong> Success in UO requires gold for equipment, housing, and advancement. These methods will help you build wealth efficiently.
            </AlertDescription>
          </Alert>

          {/* Farming Methods Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Gold Farming Methods</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Combat-Based Methods</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Monster hunting and looting</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Dungeon farming</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Champion spawns</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Peerless encounters</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Non-Combat Methods</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mining and resource gathering</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Crafting and selling items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Vendor trading</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Quest completion</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Combat Farming */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Sword className="h-6 w-6" />
                <span>Combat Gold Farming</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-900 flex items-center">
                        <span className="text-2xl mr-2">🏰</span>
                        Dungeon Farming
                      </h4>
                      <p className="text-sm text-red-700 mb-3">High-risk, high-reward gold farming in dangerous dungeons.</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        <li>• Deceit - Good for mid-level characters</li>
                        <li>• Despise - Beginner-friendly dungeon</li>
                        <li>• Covetous - Moderate difficulty</li>
                        <li>• Shame - High-level farming</li>
                      </ul>
                      <Badge className="bg-red-100 text-red-800 mt-2">High Risk</Badge>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 flex items-center">
                        <span className="text-2xl mr-2">👑</span>
                        Champion Spawns
                      </h4>
                      <p className="text-sm text-purple-700 mb-3">Group-based farming for valuable rewards.</p>
                      <ul className="text-xs text-purple-600 space-y-1">
                        <li>• Requires group coordination</li>
                        <li>• High-value rewards</li>
                        <li>• Power scrolls and artifacts</li>
                        <li>• Best with guild support</li>
                      </ul>
                      <Badge className="bg-purple-100 text-purple-800 mt-2">Group Activity</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-semibold text-orange-900 flex items-center">
                        <span className="text-2xl mr-2">🌊</span>
                        Ocean Farming
                      </h4>
                      <p className="text-sm text-orange-700 mb-3">Farming sea creatures for valuable resources.</p>
                      <ul className="text-xs text-orange-600 space-y-1">
                        <li>• Sea serpents and krakens</li>
                        <li>• Pearls and rare fish</li>
                        <li>• Requires fishing skill</li>
                        <li>• Boat and navigation needed</li>
                      </ul>
                      <Badge className="bg-orange-100 text-orange-800 mt-2">Unique Rewards</Badge>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 flex items-center">
                        <span className="text-2xl mr-2">🏞️</span>
                        Wilderness Farming
                      </h4>
                      <p className="text-sm text-green-700 mb-3">Farming creatures in the wilderness areas.</p>
                      <ul className="text-xs text-green-600 space-y-1">
                        <li>• Dragons and drakes</li>
                        <li>• Elementals and demons</li>
                        <li>• PvP risk in some areas</li>
                        <li>• Good for solo farming</li>
                      </ul>
                      <Badge className="bg-green-100 text-green-800 mt-2">Solo Friendly</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crafting and Gathering */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Hammer className="h-6 w-6" />
                <span>Crafting & Resource Gathering</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-900 flex items-center">
                        <span className="text-2xl mr-2">⛏️</span>
                        Mining
                      </h4>
                      <p className="text-sm text-amber-700 mb-3">Gather valuable ores and gems from mines.</p>
                      <ul className="text-xs text-amber-600 space-y-1">
                        <li>• Iron, gold, and silver ore</li>
                        <li>• Gems and rare minerals</li>
                        <li>• Safe and consistent income</li>
                        <li>• Requires mining skill</li>
                      </ul>
                      <Badge className="bg-amber-100 text-amber-800 mt-2">Safe Method</Badge>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 flex items-center">
                        <span className="text-2xl mr-2">🔨</span>
                        Blacksmithing
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">Craft weapons and armor for profit.</p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• High-demand items</li>
                        <li>• Custom orders from players</li>
                        <li>• Requires materials and skill</li>
                        <li>• Steady market demand</li>
                      </ul>
                      <Badge className="bg-blue-100 text-blue-800 mt-2">High Demand</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-900 flex items-center">
                        <span className="text-2xl mr-2">🧪</span>
                        Alchemy
                      </h4>
                      <p className="text-sm text-green-700 mb-3">Brew potions and reagents for profit.</p>
                      <ul className="text-xs text-green-600 space-y-1">
                        <li>• Healing and mana potions</li>
                        <li>• Specialized reagents</li>
                        <li>• High profit margins</li>
                        <li>• Requires alchemy skill</li>
                      </ul>
                      <Badge className="bg-green-100 text-green-800 mt-2">High Profit</Badge>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 flex items-center">
                        <span className="text-2xl mr-2">📜</span>
                        Inscription
                      </h4>
                      <p className="text-sm text-purple-700 mb-3">Create spell scrolls and books.</p>
                      <ul className="text-xs text-purple-600 space-y-1">
                        <li>• Spell scrolls for mages</li>
                        <li>• Spellbooks and tomes</li>
                        <li>• Always in demand</li>
                        <li>• Requires inscription skill</li>
                      </ul>
                      <Badge className="bg-purple-100 text-purple-800 mt-2">Always Needed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gold Farming Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Zap className="h-6 w-6" />
                <span>Gold Farming Tips & Strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Efficiency Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Focus on high-value items and resources</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Learn market prices and trends</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Use multiple characters for different activities</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Join guilds for group farming opportunities</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Safety & Security</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Use insurance on valuable equipment</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Store gold and items in secure locations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Be aware of PvP areas and risks</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Diversify your farming methods</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Locations */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Best Gold Farming Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Beginner Locations</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Britain Graveyard - Skeletons and zombies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Despise Dungeon - Low-level creatures</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Mining caves near towns</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Forest areas for lumberjacking</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Advanced Locations</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Shame Dungeon - High-value loot</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Dragon areas - Valuable scales and gems</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Ocean areas - Sea serpents and pearls</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Champion spawn locations</span>
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
              <CardTitle className="text-xl font-bold">Ready to Start Farming Gold?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you know how to farm gold, get the equipment you need and start building your wealth in Britannia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Equipment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/crafting-resources">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn Crafting
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/combat-mechanics">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Combat Guide
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
