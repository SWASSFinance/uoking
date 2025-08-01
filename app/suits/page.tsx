import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { 
  Crown, 
  Shield, 
  Sword, 
  Zap, 
  Heart, 
  Target, 
  ArrowUp,
  Star,
  Armor,
  Gem,
  Hammer,
  Eye,
  BookOpen,
  Users,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

const suitData = [
  {
    name: "Mage Suit",
    description: "Complete magical equipment set for spellcasters",
    icon: Zap,
    color: "bg-purple-500",
    category: "Magic",
    price: "$99.99",
    items: ["Mage Robe", "Spellbook", "Magical Jewelry", "Enchanted Items"],
    features: ["Faster Casting", "Spell Damage Increase", "Mana Regeneration", "Lower Mana Cost"]
  },
  {
    name: "Warrior Suit",
    description: "Heavy armor and weapons for melee combat",
    icon: Sword,
    color: "bg-red-500",
    category: "Combat",
    price: "$149.99",
    items: ["Heavy Armor", "Melee Weapons", "Defense Gear", "Combat Equipment"],
    features: ["Damage Increase", "Defense Chance", "Hit Chance", "Swing Speed"]
  },
  {
    name: "Archer Suit",
    description: "Ranged combat equipment for skilled archers",
    icon: Target,
    color: "bg-orange-500",
    category: "Combat",
    price: "$129.99",
    items: ["Bows & Arrows", "Ranged Armor", "Aiming Gear", "Quivers"],
    features: ["Hit Chance Increase", "Damage Increase", "Faster Casting", "Defense Chance"]
  },
  {
    name: "Tamer Suit",
    description: "Equipment for beast masters and animal companions",
    icon: Heart,
    color: "bg-green-500",
    category: "Specialized",
    price: "$119.99",
    items: ["Taming Gear", "Pet Equipment", "Animal Training", "Beast Mastery"],
    features: ["Taming Bonus", "Pet Control", "Animal Bonding", "Companion Enhancement"]
  },
  {
    name: "Thief Suit",
    description: "Stealth equipment for sneaky characters",
    icon: Eye,
    color: "bg-gray-500",
    category: "Specialized",
    price: "$109.99",
    items: ["Stealth Gear", "Lockpicks", "Thief Tools", "Shadow Equipment"],
    features: ["Hiding Bonus", "Stealth Enhancement", "Lockpicking", "Sneak Attack"]
  },
  {
    name: "Crafter Suit",
    description: "Tools and equipment for skilled artisans",
    icon: Hammer,
    color: "bg-amber-500",
    category: "Crafting",
    price: "$89.99",
    items: ["Crafting Tools", "Resource Gear", "Artisan Equipment", "Gathering Tools"],
    features: ["Crafting Bonus", "Resource Gathering", "Quality Enhancement", "Skill Bonus"]
  },
  {
    name: "Priest Suit",
    description: "Holy equipment for divine spellcasters",
    icon: BookOpen,
    color: "bg-blue-500",
    category: "Magic",
    price: "$139.99",
    items: ["Priest Robes", "Holy Items", "Divine Equipment", "Healing Gear"],
    features: ["Healing Bonus", "Divine Protection", "Holy Power", "Spell Enhancement"]
  },
  {
    name: "Paladin Suit",
    description: "Holy warrior equipment for divine combat",
    icon: Shield,
    color: "bg-indigo-500",
    category: "Combat",
    price: "$159.99",
    items: ["Holy Armor", "Divine Weapons", "Protection Gear", "Sacred Equipment"],
    features: ["Holy Damage", "Divine Protection", "Combat Bonus", "Healing Ability"]
  }
]

const categories = [
  { name: "Combat", icon: Sword, color: "bg-red-500" },
  { name: "Magic", icon: Zap, color: "bg-purple-500" },
  { name: "Specialized", icon: Eye, color: "bg-gray-500" },
  { name: "Crafting", icon: Hammer, color: "bg-amber-500" }
]

export default function SuitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Suits", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Armor className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Character Suits
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete equipment sets designed for specific character builds and playstyles. 
              Get everything you need in one convenient package.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="border-amber-200 hover:bg-amber-50"
                    asChild
                  >
                    <Link href={`/suits/category/${category.name.toLowerCase()}`}>
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Suits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {suitData.map((suit) => {
              const IconComponent = suit.icon
              return (
                <Card key={suit.name} className="group hover:shadow-xl transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-full ${suit.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {suit.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {suit.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{suit.description}</p>
                    <div className="text-2xl font-bold text-amber-600">
                      {suit.price}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Includes:</h4>
                      <div className="flex flex-wrap gap-1">
                        {suit.items.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Features:</h4>
                      <div className="space-y-1">
                        {suit.features.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      asChild
                    >
                      <Link href={`/suits/${suit.name.toLowerCase().replace(' ', '-')}`}>
                        View Details
                        <ArrowUp className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Featured Suits */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Most Popular Suits
              </h2>
              <p className="text-gray-600">
                These complete sets are our best sellers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suitData.slice(0, 4).map((suit) => {
                const IconComponent = suit.icon
                return (
                  <div key={suit.name} className="text-center group">
                    <div className={`inline-flex p-4 rounded-full ${suit.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{suit.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{suit.description}</p>
                    <div className="text-lg font-bold text-amber-600 mb-4">{suit.price}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/suits/${suit.name.toLowerCase().replace(' ', '-')}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Custom Suits */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 mb-12 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Custom Suits
              </h2>
              <p className="text-gray-600">
                Need a specific combination? We can create custom suits tailored to your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose Custom?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Perfect for your specific build</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Optimized for your playstyle</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Include only what you need</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Cost-effective solutions</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Custom Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Hybrid character builds</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Gem className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-700">Rare item combinations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">Budget-friendly options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Crown className="h-5 w-5 text-amber-500" />
                    <span className="text-gray-700">Premium luxury sets</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                <Link href="/contact">
                  Request Custom Suit
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">8</h3>
                <p className="text-gray-600">Complete Suits</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Armor className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600">Suit Items</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">4</h3>
                <p className="text-gray-600">Suit Categories</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Equip Your Character?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Choose from our complete suits or request a custom build tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/store">
                  Browse All Suits
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600" asChild>
                <Link href="/contact">
                  Get Custom Quote
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