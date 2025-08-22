import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, Shield, Crown, Star, Zap, Heart, Target } from "lucide-react"
import Link from "next/link"
import { getCategories } from "@/lib/db"
import Image from "next/image"

// Define slot types that map to categories
const slotTypes = [
  {
    name: "Weapons",
    description: "Primary and secondary weapons",
    icon: Sword,
    color: "bg-red-500",
    category: "Combat",
    features: ["Swords", "Axes", "Maces", "Bows"],
    categorySlug: "weapons"
  },
  {
    name: "Head",
    description: "Helmets and headgear",
    icon: Crown,
    color: "bg-blue-500",
    category: "Armor",
    features: ["Helmets", "Hats", "Crowns", "Hoods"],
    categorySlug: "head-armor"
  },
  {
    name: "Chest Armor",
    description: "Body armor and robes",
    icon: Shield,
    color: "bg-green-500",
    category: "Armor",
    features: ["Plate", "Chain", "Leather", "Robes"],
    categorySlug: "chest-armor"
  },
  {
    name: "Glove Armor",
    description: "Hand protection and gloves",
    icon: Shield,
    color: "bg-yellow-500",
    category: "Armor",
    features: ["Gauntlets", "Gloves", "Bracers", "Hands"],
    categorySlug: "glove-armor"
  },
  {
    name: "Leg Armor",
    description: "Leg protection and pants",
    icon: Shield,
    color: "bg-purple-500",
    category: "Armor",
    features: ["Greaves", "Pants", "Leggings", "Skirts"],
    categorySlug: "leg-armor"
  },
  {
    name: "Footwear",
    description: "Boots and shoes",
    icon: Shield,
    color: "bg-orange-500",
    category: "Armor",
    features: ["Boots", "Shoes", "Sandals", "Greaves"],
    categorySlug: "footwear"
  },
  {
    name: "Neck Armor",
    description: "Necklaces and neck protection",
    icon: Heart,
    color: "bg-pink-500",
    category: "Jewelry",
    features: ["Necklaces", "Amulets", "Gorget", "Collars"],
    categorySlug: "neck-armor"
  },
  {
    name: "Jewelry",
    description: "Rings and bracelets",
    icon: Star,
    color: "bg-indigo-500",
    category: "Jewelry",
    features: ["Rings", "Bracelets", "Earrings", "Charms"],
    categorySlug: "jewelry"
  },
  {
    name: "Belts Aprons",
    description: "Waist equipment and aprons",
    icon: Shield,
    color: "bg-teal-500",
    category: "Armor",
    features: ["Belts", "Aprons", "Sashes", "Waist"],
    categorySlug: "belts-aprons"
  },
  {
    name: "Cloaks Quivers",
    description: "Back equipment and containers",
    icon: Shield,
    color: "bg-cyan-500",
    category: "Armor",
    features: ["Cloaks", "Quivers", "Backpacks", "Capes"],
    categorySlug: "cloaks-quivers"
  },
  {
    name: "Sashes",
    description: "Waist sashes and belts",
    icon: Shield,
    color: "bg-violet-500",
    category: "Armor",
    features: ["Sashes", "Belts", "Waist", "Ties"],
    categorySlug: "sashes"
  },
  {
    name: "Sleeve Armor",
    description: "Arm protection and sleeves",
    icon: Shield,
    color: "bg-rose-500",
    category: "Armor",
    features: ["Sleeves", "Arms", "Bracers", "Vambraces"],
    categorySlug: "sleeve-armor"
  },
  {
    name: "Talismans",
    description: "Magical talismans and charms",
    icon: Zap,
    color: "bg-emerald-500",
    category: "Magic",
    features: ["Talismans", "Charms", "Amulets", "Relics"],
    categorySlug: "talismans"
  }
]

export default async function SlotPage() {
  // Fetch categories from database
  const categories = await getCategories()
  
  // Create a map of category slugs to category data
  const categoryMap = new Map()
  categories.forEach(category => {
    categoryMap.set(category.slug, category)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Slot", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Equipment Slots
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore all equipment slots and find the perfect gear for each part of your character. 
              From weapons to armor, every slot matters for your build.
            </p>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {slotTypes.map((slot) => {
              const IconComponent = slot.icon
              const categoryData = categoryMap.get(slot.categorySlug)
              
              return (
                <Card key={slot.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      {categoryData?.image_url ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={categoryData.image_url}
                            alt={slot.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`p-3 rounded-full ${slot.color} text-white`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                      )}
                      <Badge variant="secondary" className="text-sm">
                        {slot.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {slot.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{slot.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Types:</h4>
                      <ul className="space-y-1">
                        {slot.features.map((feature) => (
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
                      <Link href={`/UO/${slot.name.replace(/\s+/g, '_')}`}>
                        Browse Equipment
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Equip Your Character?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of equipment for every slot.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse All Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 