import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Sword, Shield, Star, ArrowRight, CheckCircle, AlertTriangle, Crown } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Beginner's Guide to Ultima Online - UO King | New Player Guide",
  description: "Complete beginner's guide to Ultima Online. Learn the basics of UO gameplay, character creation, skills, combat, and how to get started in Britannia.",
  keywords: "beginner's guide, Ultima Online guide, new player guide, UO basics, how to play UO, UO tutorial, Britannia guide",
  openGraph: {
    title: "Beginner's Guide to Ultima Online - UO King | New Player Guide",
    description: "Complete beginner's guide to Ultima Online. Learn the basics of UO gameplay, character creation, skills, combat, and how to get started in Britannia.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/beginners-guide`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Beginner's Guide to Ultima Online - UO King | New Player Guide",
    description: "Complete beginner's guide to Ultima Online. Learn the basics of UO gameplay, character creation, skills, combat, and how to get started in Britannia.",
  },
}

export default function BeginnersGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Beginner's Guide to Ultima Online</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to Britannia! This comprehensive guide will help you get started in the world of Ultima Online.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>New to UO?</strong> This guide covers everything you need to know to start your adventure in Britannia. Take your time and don't rush!
            </AlertDescription>
          </Alert>

          {/* Getting Started */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Getting Started</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Character Creation</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose your character's name carefully</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Select starting skills based on your playstyle</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Pick a starting city (Britain recommended for beginners)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose your character's appearance</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">First Steps</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Complete the new player tutorial</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Learn basic movement and interaction</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Find the bank and learn to store items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Meet other players and ask questions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Classes */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Sword className="h-6 w-6" />
                <span>Character Classes & Builds</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">⚔️</span>
                    Warrior
                  </h4>
                  <p className="text-sm text-gray-600">Melee combat specialist with high strength and durability.</p>
                  <Badge className="bg-red-100 text-red-800">Combat Focused</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧙‍♂️</span>
                    Mage
                  </h4>
                  <p className="text-sm text-gray-600">Magic user with powerful spells and magical abilities.</p>
                  <Badge className="bg-purple-100 text-purple-800">Magic Focused</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏹</span>
                    Archer
                  </h4>
                  <p className="text-sm text-gray-600">Ranged combat specialist with bows and crossbows.</p>
                  <Badge className="bg-green-100 text-green-800">Ranged Combat</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🐉</span>
                    Tamer
                  </h4>
                  <p className="text-sm text-gray-600">Animal tamer who controls powerful creatures.</p>
                  <Badge className="bg-blue-100 text-blue-800">Pet Control</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Crafter
                  </h4>
                  <p className="text-sm text-gray-600">Skilled artisan who creates weapons, armor, and items.</p>
                  <Badge className="bg-amber-100 text-amber-800">Crafting</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🗡️</span>
                    Thief
                  </h4>
                  <p className="text-sm text-gray-600">Stealth specialist with lockpicking and stealing skills.</p>
                  <Badge className="bg-gray-100 text-gray-800">Stealth</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills System */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Shield className="h-6 w-6" />
                <span>Skills System</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">How Skills Work</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Ultima Online uses a skill-based system where you improve by using skills. Each character can have up to 700 skill points total, 
                  distributed across various skills from 0 to 100.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Skill Categories</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Combat Skills (Swordsmanship, Magery, Archery)</li>
                      <li>• Crafting Skills (Blacksmithy, Tailoring, Carpentry)</li>
                      <li>• Utility Skills (Lockpicking, Stealing, Tracking)</li>
                      <li>• Social Skills (Animal Taming, Provocation)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Skill Gain Tips</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Use skills frequently to gain points</li>
                      <li>• Higher difficulty = faster skill gain</li>
                      <li>• Some skills require specific conditions</li>
                      <li>• Skills cap at 100 points each</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Combat Basics */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Sword className="h-6 w-6" />
                <span>Combat Basics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Melee Combat</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Double-click weapons to equip them</li>
                    <li>• Click on enemies to attack</li>
                    <li>• Use shields for defense</li>
                    <li>• Watch your health and stamina</li>
                    <li>• Use bandages to heal</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Magic Combat</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Cast spells from your spellbook</li>
                    <li>• Manage mana (magic points)</li>
                    <li>• Use reagents for spellcasting</li>
                    <li>• Learn new spells from scrolls</li>
                    <li>• Combine spells for combos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Essential Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Crown className="h-6 w-6" />
                <span>Essential Tips for New Players</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Safety & Security</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Never give out your password</li>
                      <li>• Use the bank to store valuable items</li>
                      <li>• Be cautious in dangerous areas</li>
                      <li>• Learn to use the "recall" spell for escape</li>
                      <li>• Join a guild for protection and guidance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Making Money</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Kill monsters for gold and loot</li>
                      <li>• Complete quests for rewards</li>
                      <li>• Sell items to other players</li>
                      <li>• Learn crafting skills to make items</li>
                      <li>• Mine resources and sell them</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready for More?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand the basics, explore more advanced topics and find the perfect shard for your playstyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/skill-system">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn About Skills
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
