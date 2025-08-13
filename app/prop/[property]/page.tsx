import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, ArrowUp, Star, Target, Zap, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { searchProducts } from "@/lib/db"

export default async function PropertyPage({ params }: { params: Promise<{ property: string }> }) {
  const { property } = await params
  
  // Convert URL slug back to property name (e.g., "damage-increase" -> "Damage Increase")
  const propertyName = property
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Search for products containing the property name
  const products = await searchProducts(propertyName, 50)

  // Function to convert item name to URL-friendly slug
  const createProductSlug = (itemName: string) => {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  // Property descriptions and icons
  const propertyInfo = {
    "Damage Increase": {
      description: "Increase your weapon damage and become a more formidable fighter. Damage Increase is one of the most important combat properties in Ultima Online.",
      icon: Sword,
      color: "from-red-500 to-red-600",
      category: "Combat"
    },
    "Defense Chance Increase": {
      description: "Improve your chance to avoid attacks and increase your survivability in combat. Essential for any defensive build.",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      category: "Defense"
    },
    "Enhance Potions": {
      description: "Make your potions more effective and get better value from your healing items. Perfect for characters who rely on potions.",
      icon: Zap,
      color: "from-green-500 to-green-600",
      category: "Utility"
    },
    "Faster Cast Recovery": {
      description: "Reduce spell casting delay and cast spells more frequently. Essential for mages and spellcasters.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      category: "Magic"
    },
    "Faster Casting": {
      description: "Increase your spell casting speed and become a more effective spellcaster. Perfect for mage builds.",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      category: "Magic"
    },
    "Hit Chance Increase": {
      description: "Improve your accuracy in combat and land more successful attacks. Essential for any combat build.",
      icon: Target,
      color: "from-orange-500 to-orange-600",
      category: "Combat"
    },
    "Hit Point Regeneration": {
      description: "Automatically regenerate health over time and improve your survivability. Great for PvE and sustained combat.",
      icon: Star,
      color: "from-pink-500 to-pink-600",
      category: "Defense"
    },
    "Lower Mana Cost": {
      description: "Reduce spell mana consumption and cast more spells with the same mana pool. Essential for mage efficiency.",
      icon: Zap,
      color: "from-indigo-500 to-indigo-600",
      category: "Magic"
    },
    "Lower Reagent Cost": {
      description: "Reduce spell reagent usage and save on casting costs. Perfect for mages who cast frequently.",
      icon: Star,
      color: "from-teal-500 to-teal-600",
      category: "Magic"
    },
    "Mana Regeneration": {
      description: "Automatically regenerate mana over time and maintain sustained spellcasting. Essential for mage builds.",
      icon: Zap,
      color: "from-cyan-500 to-cyan-600",
      category: "Magic"
    },
    "Spell Channeling": {
      description: "Allow movement while casting spells and gain a significant advantage in combat. Perfect for mobile mages.",
      icon: Zap,
      color: "from-violet-500 to-violet-600",
      category: "Magic"
    },
    "Spell Damage Increase": {
      description: "Increase magical damage output and become a more powerful spellcaster. Essential for offensive mage builds.",
      icon: Zap,
      color: "from-rose-500 to-rose-600",
      category: "Magic"
    },
    "Stamina Regeneration": {
      description: "Automatically regenerate stamina and maintain peak performance in combat. Essential for melee characters.",
      icon: Star,
      color: "from-emerald-500 to-emerald-600",
      category: "Utility"
    },
    "Swing Speed Increase": {
      description: "Increase weapon attack speed and deal more damage over time. Perfect for melee DPS builds.",
      icon: Sword,
      color: "from-amber-500 to-amber-600",
      category: "Combat"
    }
  }

  const currentProperty = propertyInfo[propertyName as keyof typeof propertyInfo]
  const IconComponent = currentProperty?.icon || Sword

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Prop", href: "/prop" },
                { label: propertyName, current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${currentProperty?.color || 'from-amber-500 to-amber-600'}`}>
                <IconComponent className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {propertyName} Property
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentProperty?.description || `Items with ${propertyName} property`}
            </p>
            {currentProperty?.category && (
              <Badge className="mt-4 bg-amber-500 text-white">{currentProperty.category}</Badge>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">What is {propertyName}?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  {propertyName} is a property that enhances your character's abilities in Ultima Online. 
                  It's one of the most sought-after properties for optimizing your build.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Enhances your character's performance
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Works with various equipment types
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Stacks with other properties
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Essential for optimized builds
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">How to Get {propertyName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Target className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Equipment</h5>
                      <p className="text-sm text-gray-600">Find items with {propertyName} property</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Enhancement</h5>
                      <p className="text-sm text-gray-600">Use enhancement materials to add the property</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Sword className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Crafting</h5>
                      <p className="text-sm text-gray-600">Craft items with {propertyName}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                  <Link href="/store">
                    Browse Equipment
                    <ArrowUp className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Items with this Property */}
          {products.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Items with {propertyName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/product/${product.slug}`} className="block">
                    <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 mr-2">{product.name}</h3>
                          <Badge className="bg-amber-600 text-white text-xs">
                            ${product.sale_price || product.price}
                          </Badge>
                        </div>
                        {product.short_description && (
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.short_description}</p>
                        )}
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Items Found */}
          {products.length === 0 && (
            <div className="text-center mb-12">
              <Card className="border-amber-200 max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any items with the {propertyName} property. 
                    Try browsing our general store for similar items.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/store">
                      Browse All Items
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Tips for Maximizing {propertyName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Equipment Strategy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Focus on items that complement your build
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Look for items with multiple beneficial properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider the trade-off with other properties
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Build Optimization</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Combine with complementary properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Balance with your character's strengths
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Test different combinations for best results
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Enhance Your Equipment?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of equipment with {propertyName} properties.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 