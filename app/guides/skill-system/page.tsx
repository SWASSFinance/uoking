import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Sword, Shield, Hammer, ArrowRight, CheckCircle, AlertTriangle, Star } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Skill System in Ultima Online - UO King | Complete UO Skills Guide",
  description: "Complete guide to the Ultima Online skill system. Learn how skills work, skill gain mechanics, skill caps, and the best skill combinations for different character builds.",
  keywords: "UO skill system, Ultima Online skills, UO skill guide, skill gain, skill caps, character builds, UO skills list",
  openGraph: {
    title: "Skill System in Ultima Online - UO King | Complete UO Skills Guide",
    description: "Complete guide to the Ultima Online skill system. Learn how skills work, skill gain mechanics, skill caps, and the best skill combinations for different character builds.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/skill-system`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Skill System in Ultima Online - UO King | Complete UO Skills Guide",
    description: "Complete guide to the Ultima Online skill system. Learn how skills work, skill gain mechanics, skill caps, and the best skill combinations for different character builds.",
  },
}

export default function SkillSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Skill System in Ultima Online</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the skill system to create powerful characters. Learn how skills work, gain points, and combine for optimal builds.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Skill Cap:</strong> Each character can have a maximum of 700 skill points total, distributed across various skills from 0 to 100 each.
            </AlertDescription>
          </Alert>

          {/* How Skills Work */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>How Skills Work</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skill Gain Mechanics</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Use skills to gain points</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Higher difficulty = faster gain</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Skills cap at 100 points</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Total cap is 700 points</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skill Categories</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Combat Skills (Swords, Magery)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Crafting Skills (Blacksmithy)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Utility Skills (Lockpicking)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Social Skills (Animal Taming)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Combat Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Sword className="h-6 w-6" />
                <span>Combat Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">⚔️</span>
                    Swordsmanship
                  </h4>
                  <p className="text-sm text-gray-600">Melee combat with swords and other bladed weapons.</p>
                  <Badge className="bg-red-100 text-red-800">Combat</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🏹</span>
                    Archery
                  </h4>
                  <p className="text-sm text-gray-600">Ranged combat with bows and crossbows.</p>
                  <Badge className="bg-green-100 text-green-800">Ranged</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧙‍♂️</span>
                    Magery
                  </h4>
                  <p className="text-sm text-gray-600">Casting spells and magical combat abilities.</p>
                  <Badge className="bg-purple-100 text-purple-800">Magic</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🛡️</span>
                    Parrying
                  </h4>
                  <p className="text-sm text-gray-600">Defensive skill for blocking attacks with shields.</p>
                  <Badge className="bg-blue-100 text-blue-800">Defense</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🗡️</span>
                    Fencing
                  </h4>
                  <p className="text-sm text-gray-600">Fast melee combat with fencing weapons.</p>
                  <Badge className="bg-yellow-100 text-yellow-800">Speed</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Mace Fighting
                  </h4>
                  <p className="text-sm text-gray-600">Heavy melee combat with maces and clubs.</p>
                  <Badge className="bg-orange-100 text-orange-800">Heavy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crafting Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Hammer className="h-6 w-6" />
                <span>Crafting Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Blacksmithy
                  </h4>
                  <p className="text-sm text-gray-600">Create weapons, armor, and tools from metal.</p>
                  <Badge className="bg-gray-100 text-gray-800">Metalwork</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">✂️</span>
                    Tailoring
                  </h4>
                  <p className="text-sm text-gray-600">Create clothing, bags, and leather armor.</p>
                  <Badge className="bg-pink-100 text-pink-800">Clothing</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🪚</span>
                    Carpentry
                  </h4>
                  <p className="text-sm text-gray-600">Create furniture, boats, and wooden items.</p>
                  <Badge className="bg-amber-100 text-amber-800">Woodwork</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧪</span>
                    Alchemy
                  </h4>
                  <p className="text-sm text-gray-600">Create potions and magical reagents.</p>
                  <Badge className="bg-green-100 text-green-800">Potions</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🍞</span>
                    Cooking
                  </h4>
                  <p className="text-sm text-gray-600">Prepare food and beverages for healing.</p>
                  <Badge className="bg-orange-100 text-orange-800">Food</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">💎</span>
                    Tinkering
                  </h4>
                  <p className="text-sm text-gray-600">Create mechanical devices and tools.</p>
                  <Badge className="bg-blue-100 text-blue-800">Mechanical</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Builds */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Shield className="h-6 w-6" />
                <span>Popular Character Builds</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Warrior Build</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Swordsmanship: 100</li>
                      <li>• Tactics: 100</li>
                      <li>• Anatomy: 100</li>
                      <li>• Healing: 100</li>
                      <li>• Parrying: 100</li>
                      <li>• Resist Spells: 100</li>
                      <li>• Chivalry: 100</li>
                    </ul>
                    <Badge className="bg-red-100 text-red-800">Melee Combat</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Mage Build</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Magery: 100</li>
                      <li>• Eval Int: 100</li>
                      <li>• Meditation: 100</li>
                      <li>• Resist Spells: 100</li>
                      <li>• Wrestling: 100</li>
                      <li>• Inscription: 100</li>
                      <li>• Mysticism: 100</li>
                    </ul>
                    <Badge className="bg-purple-100 text-purple-800">Magic Combat</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Tamer Build</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Animal Taming: 100</li>
                      <li>• Animal Lore: 100</li>
                      <li>• Veterinary: 100</li>
                      <li>• Magery: 100</li>
                      <li>• Eval Int: 100</li>
                      <li>• Meditation: 100</li>
                      <li>• Resist Spells: 100</li>
                    </ul>
                    <Badge className="bg-blue-100 text-blue-800">Pet Control</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Crafter Build</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Blacksmithy: 100</li>
                      <li>• Mining: 100</li>
                      <li>• Magery: 100</li>
                      <li>• Eval Int: 100</li>
                      <li>• Meditation: 100</li>
                      <li>• Resist Spells: 100</li>
                      <li>• Tinkering: 100</li>
                    </ul>
                    <Badge className="bg-amber-100 text-amber-800">Crafting</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gain Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Skill Gain Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">General Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Use skills frequently to gain points</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Higher difficulty = faster skill gain</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Some skills require specific conditions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Skills cap at 100 points each</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Advanced Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Use skill gain items when available</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Train with other players for faster gains</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Plan your build before starting</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Consider skill synergy combinations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Build Your Character?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand the skill system, learn about combat mechanics and find the equipment you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/combat-mechanics">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Combat Guide
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Equipment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/guides/beginners-guide">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Beginner's Guide
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
