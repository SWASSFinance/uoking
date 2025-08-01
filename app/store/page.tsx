import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { 
  Crown, 
  ShoppingBag, 
  Coins, 
  Scroll, 
  Sword, 
  Shield, 
  ArrowUp,
  Star,
  Gem,
  Home,
  BookOpen,
  Zap,
  Heart,
  Target,
  Hammer,
  Ship,
  ScrollText,
  Trophy,
  Clock,
  Gift
} from "lucide-react"
import Link from "next/link"

const storeCategories = [
  {
    name: "Weapons",
    description: "Powerful weapons for every combat style",
    icon: Sword,
    color: "bg-red-500",
    itemCount: "50+ items",
    features: ["Swords", "Axes", "Bows", "Maces"]
  },
  {
    name: "Armor",
    description: "Protective gear for all character types",
    icon: Shield,
    color: "bg-blue-500",
    itemCount: "100+ items",
    features: ["Plate", "Chain", "Leather", "Robes"]
  },
  {
    name: "Jewelry",
    description: "Magical rings, bracelets, and necklaces",
    icon: Gem,
    color: "bg-purple-500",
    itemCount: "75+ items",
    features: ["Rings", "Bracelets", "Necklaces", "Talismans"]
  },
  {
    name: "Scrolls",
    description: "Skill and power enhancement scrolls",
    icon: Scroll,
    color: "bg-yellow-500",
    itemCount: "25+ items",
    features: ["Alacrity", "Power", "Transcendence", "Training"]
  },
  {
    name: "Gold",
    description: "In-game currency for all your needs",
    icon: Coins,
    color: "bg-green-500",
    itemCount: "Various amounts",
    features: ["Small amounts", "Bulk gold", "Premium packages", "Custom amounts"]
  },
  {
    name: "Accounts",
    description: "Pre-leveled accounts with skills",
    icon: Crown,
    color: "bg-indigo-500",
    itemCount: "10+ accounts",
    features: ["Starter accounts", "Maxed accounts", "Specialized builds", "Rare characters"]
  },
  {
    name: "Houses",
    description: "Player housing and real estate",
    icon: Home,
    color: "bg-pink-500",
    itemCount: "Various sizes",
    features: ["Small houses", "Large houses", "Castles", "Custom designs"]
  },
  {
    name: "Mounts",
    description: "Rideable creatures and vehicles",
    icon: Ship,
    color: "bg-orange-500",
    itemCount: "20+ mounts",
    features: ["Horses", "Dragons", "Ships", "Rare mounts"]
  },
  {
    name: "Pets",
    description: "Companion animals and creatures",
    icon: Heart,
    color: "bg-teal-500",
    itemCount: "30+ pets",
    features: ["Dogs", "Cats", "Dragons", "Rare pets"]
  },
  {
    name: "Resources",
    description: "Crafting materials and supplies",
    icon: Hammer,
    color: "bg-gray-500",
    itemCount: "100+ items",
    features: ["Ingots", "Cloth", "Wood", "Reagents"]
  },
  {
    name: "Rares",
    description: "Rare and collectible items",
    icon: Trophy,
    color: "bg-amber-500",
    itemCount: "50+ items",
    features: ["Event items", "Limited editions", "Collectibles", "Unique items"]
  },
  {
    name: "Services",
    description: "Professional gaming services",
    icon: Clock,
    color: "bg-cyan-500",
    itemCount: "Various services",
    features: ["Power leveling", "Crafting", "Quest help", "Custom services"]
  }
]

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Store", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UOKing Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your one-stop shop for all Ultima Online needs. From weapons and armor to 
              accounts and services, we have everything you need to dominate the game.
            </p>
          </div>

          {/* Featured Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {storeCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${category.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {category.itemCount}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {category.name}
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm">Includes:</h4>
                        <ul className="space-y-1">
                          {category.features.map((feature) => (
                            <li key={feature} className="text-xs text-gray-600 flex items-center">
                              <Star className="h-3 w-3 text-amber-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        size="sm"
                        asChild
                      >
                        <Link href={`/store/${category.name.toLowerCase().replace(' ', '-')}`}>
                          Browse {category.name}
                          <ArrowUp className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Items Available</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">12</h3>
                <p className="text-gray-600">Categories</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
                <p className="text-gray-600">Support Available</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Shop?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our complete selection of Ultima Online items and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 