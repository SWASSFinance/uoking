import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Hammer, Pickaxe, ArrowRight, CheckCircle, AlertTriangle, Star, Coins } from "lucide-react"
import { Metadata } from 'next'
import Link from "next/link"

export const metadata: Metadata = {
  title: "Crafting & Resource Guides - UO King | Ultima Online Crafting Guide",
  description: "Complete guide to crafting and resources in Ultima Online. Learn about blacksmithing, tailoring, mining, lumberjacking, and all crafting skills in UO.",
  keywords: "UO crafting, Ultima Online crafting, UO resources, blacksmithing, tailoring, mining, lumberjacking, UO crafting guide",
  openGraph: {
    title: "Crafting & Resource Guides - UO King | Ultima Online Crafting Guide",
    description: "Complete guide to crafting and resources in Ultima Online. Learn about blacksmithing, tailoring, mining, lumberjacking, and all crafting skills in UO.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/guides/crafting-resources`,
    siteName: 'UO King',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Crafting & Resource Guides - UO King | Ultima Online Crafting Guide",
    description: "Complete guide to crafting and resources in Ultima Online. Learn about blacksmithing, tailoring, mining, lumberjacking, and all crafting skills in UO.",
  },
}

export default function CraftingResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Hammer className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Crafting & Resource Guides</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of crafting in Britannia. Learn about all crafting skills, resource gathering, and how to make money through crafting.
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Crafting in UO:</strong> Crafting is one of the most profitable and rewarding activities in Ultima Online. Learn the skills to become a master artisan.
            </AlertDescription>
          </Alert>

          {/* Crafting Overview */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Star className="h-6 w-6" />
                <span>Crafting Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Why Craft?</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Create your own equipment</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Make money selling items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Repair your own gear</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Contribute to the economy</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Getting Started</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Choose a primary crafting skill</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Learn the corresponding resource skill</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Find tools and materials</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Practice to gain skill points</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Crafting Skills */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Hammer className="h-6 w-6" />
                <span>Primary Crafting Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🔨</span>
                    Blacksmithy
                  </h4>
                  <p className="text-sm text-gray-600">Create weapons, armor, and tools from metal ingots.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: Mining skill</li>
                    <li>• Materials: Iron, colored metals</li>
                    <li>• Tools: Smith's hammer</li>
                    <li>• Location: Forge</li>
                  </ul>
                  <Badge className="bg-gray-100 text-gray-800">Metalwork</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">✂️</span>
                    Tailoring
                  </h4>
                  <p className="text-sm text-gray-600">Create clothing, bags, and leather armor from cloth and leather.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: No resource skill</li>
                    <li>• Materials: Cloth, leather, fur</li>
                    <li>• Tools: Sewing kit</li>
                    <li>• Location: Anywhere</li>
                  </ul>
                  <Badge className="bg-pink-100 text-pink-800">Clothing</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🪚</span>
                    Carpentry
                  </h4>
                  <p className="text-sm text-gray-600">Create furniture, boats, and wooden items from logs.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: Lumberjacking</li>
                    <li>• Materials: Logs, boards</li>
                    <li>• Tools: Saw, hammer</li>
                    <li>• Location: Carpenter's bench</li>
                  </ul>
                  <Badge className="bg-amber-100 text-amber-800">Woodwork</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🧪</span>
                    Alchemy
                  </h4>
                  <p className="text-sm text-gray-600">Create potions and magical reagents for spellcasting.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: No resource skill</li>
                    <li>• Materials: Reagents, bottles</li>
                    <li>• Tools: Mortar and pestle</li>
                    <li>• Location: Anywhere</li>
                  </ul>
                  <Badge className="bg-green-100 text-green-800">Potions</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">🍞</span>
                    Cooking
                  </h4>
                  <p className="text-sm text-gray-600">Prepare food and beverages for healing and sustenance.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: No resource skill</li>
                    <li>• Materials: Raw food, ingredients</li>
                    <li>• Tools: Cooking utensils</li>
                    <li>• Location: Oven or campfire</li>
                  </ul>
                  <Badge className="bg-orange-100 text-orange-800">Food</Badge>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">💎</span>
                    Tinkering
                  </h4>
                  <p className="text-sm text-gray-600">Create mechanical devices, tools, and small items.</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Requires: No resource skill</li>
                    <li>• Materials: Ingots, gears</li>
                    <li>• Tools: Tinker's tools</li>
                    <li>• Location: Anywhere</li>
                  </ul>
                  <Badge className="bg-blue-100 text-blue-800">Mechanical</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource Gathering */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Pickaxe className="h-6 w-6" />
                <span>Resource Gathering Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Mining</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Gather ore from mountains and caves</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Smelt ore into ingots at forges</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Find colored metals (gold, silver, etc.)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Essential for blacksmithing</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Lumberjacking</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Chop trees to get logs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Process logs into boards</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Find special wood types</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Essential for carpentry</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Making Money */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-amber-600">
                <Coins className="h-6 w-6" />
                <span>Making Money Through Crafting</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Profitable Items</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Weapons and armor</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Tools and equipment</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Potions and reagents</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Furniture and decorations</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Selling Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Set up a vendor in busy areas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Advertise in chat channels</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Offer custom orders</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Build reputation for quality</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crafting Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 mb-8">
            <CardHeader>
              <CardTitle className="text-amber-600">Crafting Tips & Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skill Development</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Start with simple items to gain skill</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Use skill gain items when available</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Practice regularly to maintain skill</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Learn from other crafters</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Business Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Research market prices</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Specialize in high-demand items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Build relationships with customers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Keep materials in stock</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Ready to Start Crafting?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6">
                Now that you understand crafting, learn more about skills and find the tools you need to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                  <Link href="/guides/skill-system">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Learn About Skills
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  <Link href="/store">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Tools & Materials
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
