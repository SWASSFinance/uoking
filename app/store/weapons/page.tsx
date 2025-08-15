import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, ArrowUp, Star, Shield, Zap, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {weaponItems.map((weapon) => {
              const IconComponent = weapon.icon
              return (
                <Card key={weapon.name} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <Link href={`/product/${weapon.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden group">
                        <ProductImage
                          src={`/uo/weapons.png`}
                          alt={weapon.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Hover overlay with weapon description */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                          <div className="text-white text-center max-w-full">
                            <p className="text-xs font-sans">
                              {weapon.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Category badge */}
                        <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                          {weapon.category}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                        {weapon.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-amber-600">
                            {weapon.price}
                          </span>
                        </div>
                        
                        {/* Rating placeholder */}
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                      </div>
                    </Link>

                    {/* Add to Cart Button */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                        asChild
                      >
                        <Link href={`/product/${weapon.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          View Details
                        </Link>
                      </Button>
                    </div>
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