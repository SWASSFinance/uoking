import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Shield } from "lucide-react"

export default async function SlotPage({ params }: { params: Promise<{ slot: string }> }) {
  const { slot } = await params
  const slotData = {
    "belts-aprons": {
      name: "Belts Aprons",
      description: "Waist protection and utility items",
      image: "/medieval-belt.png",
      items: 85,
      popular: false,
      features: [
        "Waist Protection",
        "Utility Storage",
        "Decorative Options",
        "Stat Bonuses",
        "Dyeable",
        "Lightweight"
      ]
    },
    "chest-armor": {
      name: "Chest Armor",
      description: "Primary body protection and core defense",
      image: "/medieval-chest-armor.png",
      items: 120,
      popular: true,
      features: [
        "Primary Defense",
        "Core Protection",
        "High Durability",
        "Stat Bonuses",
        "Multiple Materials",
        "Class Specific"
      ]
    },
    "cloaks-quivers": {
      name: "Cloaks Quivers",
      description: "Back items for storage and protection",
      image: "/medieval-cloak.png",
      items: 95,
      popular: false,
      features: [
        "Back Protection",
        "Storage Capacity",
        "Decorative",
        "Weather Protection",
        "Lightweight",
        "Class Specific"
      ]
    },
    "footwear": {
      name: "Footwear",
      description: "Boots and shoes for mobility and protection",
      image: "/uo/footwear.png",
      items: 75,
      popular: false,
      features: [
        "Foot Protection",
        "Mobility Bonus",
        "Terrain Adaptation",
        "Lightweight",
        "Durable",
        "Class Specific"
      ]
    },
    "glove-armor": {
      name: "Glove Armor",
      description: "Hand protection and dexterity enhancement",
      image: "/uo/gloves.png",
      items: 65,
      popular: false,
      features: [
        "Hand Protection",
        "Dexterity Bonus",
        "Grip Enhancement",
        "Lightweight",
        "Flexible",
        "Class Specific"
      ]
    },
    "head": {
      name: "Head",
      description: "Helmets and headgear for protection",
      image: "/uo/headarmor.png",
      items: 110,
      popular: true,
      features: [
        "Head Protection",
        "Vision Enhancement",
        "Hearing Protection",
        "Decorative",
        "Lightweight",
        "Class Specific"
      ]
    },
    "jewelry": {
      name: "Jewelry",
      description: "Rings, bracelets, and magical accessories",
      image: "/medieval-necklace.png",
      items: 150,
      popular: true,
      features: [
        "Magical Properties",
        "Stat Bonuses",
        "Decorative",
        "Lightweight",
        "Multiple Slots",
        "Class Specific"
      ]
    },
    "leg-armor": {
      name: "Leg Armor",
      description: "Leg protection and mobility gear",
      image: "/uo/legarmor.png",
      items: 80,
      popular: false,
      features: [
        "Leg Protection",
        "Mobility Enhancement",
        "Durability",
        "Flexible",
        "Lightweight",
        "Class Specific"
      ]
    },
    "neck-armor": {
      name: "Neck Armor",
      description: "Necklaces and throat protection",
      image: "/uo/neckarmor.png",
      items: 70,
      popular: false,
      features: [
        "Throat Protection",
        "Magical Properties",
        "Decorative",
        "Lightweight",
        "Stat Bonuses",
        "Class Specific"
      ]
    },
    "robes": {
      name: "Robes",
      description: "Magical robes and spellcaster attire",
      image: "/uo/robes.png",
      items: 90,
      popular: true,
      features: [
        "Magical Enhancement",
        "Spell Protection",
        "Mana Regeneration",
        "Decorative",
        "Lightweight",
        "Class Specific"
      ]
    },
    "sashes": {
      name: "Sashes",
      description: "Decorative and utility waist items",
      image: "/medieval-sash.png",
      items: 45,
      popular: false,
      features: [
        "Decorative",
        "Utility Storage",
        "Lightweight",
        "Dyeable",
        "Flexible",
        "Class Specific"
      ]
    },
    "sleeve-armor": {
      name: "Sleeve Armor",
      description: "Arm protection and mobility gear",
      image: "/medieval-gloves.png",
      items: 60,
      popular: false,
      features: [
        "Arm Protection",
        "Mobility Enhancement",
        "Flexible",
        "Lightweight",
        "Durable",
        "Class Specific"
      ]
    },
    "talismans": {
      name: "Talismans",
      description: "Magical talismans and powerful artifacts",
      image: "/medieval-talisman.png",
      items: 40,
      popular: true,
      features: [
        "Magical Properties",
        "Powerful Bonuses",
        "Rare Items",
        "Unique Effects",
        "Collectible",
        "Class Specific"
      ]
    }
  }

  const currentSlot = slotData[slot as keyof typeof slotData]

  if (!currentSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Slot Not Found</h1>
            <p className="text-gray-600">The requested equipment slot could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="relative h-32 w-32 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <img
                  src={currentSlot.image}
                  alt={currentSlot.name}
                  className="h-20 w-20 object-contain"
                />
                {currentSlot.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white">Popular</Badge>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{currentSlot.name}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
              {currentSlot.description}
            </p>
          </div>

          {/* Slot Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentSlot.features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Item Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Common</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Standard {currentSlot.name.toLowerCase()} items</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Common</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Rare</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Rare {currentSlot.name.toLowerCase()} items</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Rare</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Legendary</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Legendary {currentSlot.name.toLowerCase()} items</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Legendary</Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-gray-900">Custom</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600 mb-4">Custom {currentSlot.name.toLowerCase()} items</p>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">Browse Custom</Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 text-white text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">{currentSlot.name} Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold">{currentSlot.items}</div>
                <div className="text-amber-200">Total Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-amber-200">Support Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{"<5min"}</div>
                <div className="text-amber-200">Average Delivery</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-3 text-lg">
              Browse All {currentSlot.name} Items
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 