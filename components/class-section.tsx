import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star } from "lucide-react"
import Link from "next/link"

const equipmentSlots = [
  {
    name: "Belts Aprons",
    description: "Waist protection and utility items",
    image: "/medieval-belt.png",
    items: 85,
    popular: false,
    href: "/slot/belts-aprons",
  },
  {
    name: "Chest Armor",
    description: "Primary body protection and core defense",
    image: "/medieval-chest-armor.png",
    items: 120,
    popular: true,
    href: "/slot/chest-armor",
  },
  {
    name: "Cloaks Quivers",
    description: "Back items for storage and protection",
    image: "/medieval-cloak.png",
    items: 95,
    popular: false,
    href: "/slot/cloaks-quivers",
  },
  {
    name: "Footwear",
    description: "Boots and shoes for mobility and protection",
    image: "/uo/footwear.png",
    items: 75,
    popular: false,
    href: "/slot/footwear",
  },
  {
    name: "Glove Armor",
    description: "Hand protection and dexterity enhancement",
    image: "/uo/gloves.png",
    items: 65,
    popular: false,
    href: "/slot/glove-armor",
  },
  {
    name: "Head",
    description: "Helmets and headgear for protection",
    image: "/uo/headarmor.png",
    items: 110,
    popular: true,
    href: "/slot/head",
  },
  {
    name: "Jewelry",
    description: "Rings, bracelets, and magical accessories",
    image: "/medieval-necklace.png",
    items: 150,
    popular: true,
    href: "/slot/jewelry",
  },
  {
    name: "Leg Armor",
    description: "Leg protection and mobility gear",
    image: "/uo/legarmor.png",
    items: 80,
    popular: false,
    href: "/slot/leg-armor",
  },
  {
    name: "Neck Armor",
    description: "Necklaces and throat protection",
    image: "/uo/neckarmor.png",
    items: 70,
    popular: false,
    href: "/slot/neck-armor",
  },
  {
    name: "Robes",
    description: "Magical robes and spellcaster attire",
    image: "/uo/robes.png",
    items: 90,
    popular: true,
    href: "/slot/robes",
  },
  {
    name: "Sashes",
    description: "Decorative and utility waist items",
    image: "/medieval-sash.png",
    items: 45,
    popular: false,
    href: "/slot/sashes",
  },
  {
    name: "Sleeve Armor",
    description: "Arm protection and mobility gear",
    image: "/medieval-gloves.png",
    items: 60,
    popular: false,
    href: "/slot/sleeve-armor",
  },
  {
    name: "Talismans",
    description: "Magical talismans and powerful artifacts",
    image: "/medieval-talisman.png",
    items: 40,
    popular: true,
    href: "/slot/talismans",
  },
]

export function ClassSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ultima Online Items - By Class</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of items organized by character class
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipmentSlots.map((slot) => (
            <Link key={slot.name} href={slot.href}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer">
                <div className="relative h-32 bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                  <img
                    src={slot.image}
                    alt={slot.name}
                    className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  {slot.popular && (
                    <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-xs">Popular</Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{slot.name}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{slot.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-gray-600">{slot.items} items</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white text-xs"
                    >
                      Browse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
          >
            View All Classes
          </Button>
        </div>
      </div>
    </section>
  )
}
