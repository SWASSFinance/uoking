import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, Shield, Zap, Star, Target, Clock, Heart } from "lucide-react"
import Link from "next/link"

const propertyTypes = [
  {
    name: "Damage Increase",
    description: "Increases weapon damage output",
    icon: Sword,
    color: "bg-red-500",
    category: "Combat",
    features: ["Weapon damage", "PvP essential", "Stackable"]
  },
  {
    name: "Defense Chance Increase",
    description: "Improves chance to avoid attacks",
    icon: Shield,
    color: "bg-blue-500",
    category: "Defense",
    features: ["Dodge attacks", "Survivability", "PvP useful"]
  },
  {
    name: "Enhance Potions",
    description: "Makes potions more effective",
    icon: Zap,
    color: "bg-green-500",
    category: "Utility",
    features: ["Better healing", "Stronger effects", "Cost effective"]
  },
  {
    name: "Faster Cast Recovery",
    description: "Reduces spell casting delay",
    icon: Clock,
    color: "bg-purple-500",
    category: "Magic",
    features: ["Quick casting", "Mage essential", "PvP advantage"]
  },
  {
    name: "Faster Casting",
    description: "Increases spell casting speed",
    icon: Zap,
    color: "bg-yellow-500",
    category: "Magic",
    features: ["Fast spells", "Mage builds", "Combat speed"]
  },
  {
    name: "Hit Chance Increase",
    description: "Improves accuracy in combat",
    icon: Target,
    color: "bg-orange-500",
    category: "Combat",
    features: ["Better accuracy", "Combat essential", "PvP useful"]
  },
  {
    name: "Hit Point Regeneration",
    description: "Automatically regenerates health",
    icon: Heart,
    color: "bg-pink-500",
    category: "Defense",
    features: ["Health regen", "Survivability", "PvE useful"]
  },
  {
    name: "Lower Mana Cost",
    description: "Reduces spell mana consumption",
    icon: Zap,
    color: "bg-indigo-500",
    category: "Magic",
    features: ["Mana efficiency", "Mage builds", "Cost saving"]
  },
  {
    name: "Lower Reagent Cost",
    description: "Reduces spell reagent usage",
    icon: Star,
    color: "bg-teal-500",
    category: "Magic",
    features: ["Cost saving", "Mage efficiency", "Resource management"]
  },
  {
    name: "Mana Regeneration",
    description: "Automatically regenerates mana",
    icon: Zap,
    color: "bg-cyan-500",
    category: "Magic",
    features: ["Mana regen", "Mage essential", "Sustained casting"]
  },
  {
    name: "Spell Channeling",
    description: "Allows movement while casting",
    icon: Zap,
    color: "bg-violet-500",
    category: "Magic",
    features: ["Mobile casting", "PvP advantage", "Mage builds"]
  },
  {
    name: "Spell Damage Increase",
    description: "Increases magical damage",
    icon: Zap,
    color: "bg-rose-500",
    category: "Magic",
    features: ["Magic damage", "Mage builds", "PvP essential"]
  },
  {
    name: "Stamina Regeneration",
    description: "Automatically regenerates stamina",
    icon: Heart,
    color: "bg-emerald-500",
    category: "Utility",
    features: ["Stamina regen", "Combat sustain", "Movement"]
  },
  {
    name: "Swing Speed Increase",
    description: "Increases weapon attack speed",
    icon: Sword,
    color: "bg-amber-500",
    category: "Combat",
    features: ["Fast attacks", "DPS increase", "PvP useful"]
  }
]

export default function PropPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Prop", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Star className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Item Properties
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful properties that can enhance your equipment. 
              From combat bonuses to magical enhancements, find the perfect properties for your build.
            </p>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {propertyTypes.map((property) => {
              const IconComponent = property.icon
              return (
                <Card key={property.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${property.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {property.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {property.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{property.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Benefits:</h4>
                      <ul className="space-y-1">
                        {property.features.map((feature) => (
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
                      <Link href={`/prop/${property.name.toLowerCase().replace(' ', '-')}`}>
                        Learn More
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
              Ready to Enhance Your Equipment?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of items with powerful properties.
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