import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, ArrowUp, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

const weaponTypes = [
  {
    name: "Swords",
    description: "Classic melee weapons for close combat",
    icon: Sword,
    color: "bg-blue-500",
    features: ["High damage", "Fast attack speed", "Versatile"]
  },
  {
    name: "Axes",
    description: "Heavy weapons for maximum damage",
    icon: Sword,
    color: "bg-red-500",
    features: ["Maximum damage", "Slower speed", "Armor piercing"]
  },
  {
    name: "Maces",
    description: "Blunt weapons for crushing enemies",
    icon: Sword,
    color: "bg-yellow-500",
    features: ["Stun effects", "Armor damage", "Reliable"]
  },
  {
    name: "Fencing",
    description: "Fast and precise weapons",
    icon: Sword,
    color: "bg-green-500",
    features: ["Fast attack", "High accuracy", "Critical hits"]
  },
  {
    name: "Archery",
    description: "Ranged weapons for distance combat",
    icon: Sword,
    color: "bg-purple-500",
    features: ["Ranged attacks", "High accuracy", "Versatile"]
  },
  {
    name: "Throwing",
    description: "Quick ranged weapons",
    icon: Sword,
    color: "bg-orange-500",
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
                { label: "Slot", href: "/slot" },
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
              Weapons Equipment Slot
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right weapon for your combat style. From swords and axes to 
              bows and throwing weapons, find the perfect weapon for your character.
            </p>
          </div>

          {/* Weapon Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {weaponTypes.map((weapon) => {
              const IconComponent = weapon.icon
              return (
                <Card key={weapon.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${weapon.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        Weapon
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {weapon.name}
                    </CardTitle>
                    <p className="text-gray-600">{weapon.description}</p>
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
                      <Link href={`/store/weapons`}>
                        Browse Weapons
                        <ArrowUp className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Tips Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Weapon Selection Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Combat Style</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Choose weapons that match your character's skills
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider your target's armor type
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Balance damage with attack speed
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Equipment Strategy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Look for weapons with special properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider durability and repair costs
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Keep backup weapons for different situations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Arm Yourself?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of powerful weapons for every combat style.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store/weapons">
                Browse Weapons
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 