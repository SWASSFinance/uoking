import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, ArrowUp, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

const weaponItems = [
  {
    name: "Viking Sword",
    description: "Powerful melee weapon with high damage",
    icon: Sword,
    color: "bg-red-500",
    price: "$29.99",
    category: "Swords",
    features: ["High damage", "Fast attack", "Durability"]
  },
  {
    name: "War Axe",
    description: "Heavy axe for maximum damage output",
    icon: Sword,
    color: "bg-orange-500",
    price: "$34.99",
    category: "Axes",
    features: ["Maximum damage", "Armor piercing", "Slow speed"]
  },
  {
    name: "War Hammer",
    description: "Blunt weapon for crushing enemies",
    icon: Sword,
    color: "bg-yellow-500",
    price: "$27.99",
    category: "Maces",
    features: ["Stun effects", "Armor damage", "Reliable"]
  },
  {
    name: "Rapier",
    description: "Fast and precise fencing weapon",
    icon: Sword,
    color: "bg-green-500",
    price: "$24.99",
    category: "Fencing",
    features: ["Fast attack", "High accuracy", "Critical hits"]
  },
  {
    name: "Composite Bow",
    description: "Ranged weapon for distance combat",
    icon: Sword,
    color: "bg-purple-500",
    price: "$39.99",
    category: "Archery",
    features: ["Ranged attacks", "High accuracy", "Versatile"]
  },
  {
    name: "Throwing Axe",
    description: "Quick ranged throwing weapon",
    icon: Sword,
    color: "bg-blue-500",
    price: "$19.99",
    category: "Throwing",
    features: ["Quick attacks", "Mobility", "Fast reload"]
  }
]

export default function WeaponsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Store", href: "/store" },
                { label: "Weapons", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sword className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Weapons Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect weapon for your combat style. From swords and axes to 
              bows and throwing weapons, we have everything you need to dominate in battle.
            </p>
          </div>

          {/* Weapons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {weaponItems.map((weapon) => {
              const IconComponent = weapon.icon
              return (
                <Card key={weapon.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${weapon.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {weapon.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {weapon.name}
                    </CardTitle>
                    <p className="text-gray-600">{weapon.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {weapon.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Features:</h4>
                      <ul className="space-y-1">
                        {weapon.features.map((feature) => (
                          <li key={feature} className="text-sm text-gray-600 flex items-center">
                            <Star className="h-3 w-3 text-amber-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      asChild
                    >
                      <Link href={`/product/${weapon.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Details
                        <ArrowUp className="h-4 w-4 ml-2" />
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
              Ready to Arm Yourself?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our complete selection of weapons for every combat style.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse All Items
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 