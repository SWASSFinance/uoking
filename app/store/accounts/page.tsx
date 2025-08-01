import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Crown, ArrowUp, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

const accountItems = [
  {
    name: "Starter Account",
    description: "New account with basic skills and equipment",
    icon: Crown,
    color: "bg-green-500",
    price: "$49.99",
    category: "Beginner",
    features: ["Basic skills", "Starter equipment", "Gold included", "House included"]
  },
  {
    name: "Maxed Account",
    description: "Fully developed character with all skills",
    icon: Crown,
    color: "bg-purple-500",
    price: "$199.99",
    category: "Advanced",
    features: ["All skills maxed", "Premium equipment", "Large gold amount", "Multiple houses"]
  },
  {
    name: "Mage Account",
    description: "Specialized mage character with magical gear",
    icon: Crown,
    color: "bg-blue-500",
    price: "$89.99",
    category: "Specialized",
    features: ["Magery skills", "Mage equipment", "Spellbooks", "Mana gear"]
  },
  {
    name: "Warrior Account",
    description: "Combat-focused character with heavy armor",
    icon: Crown,
    color: "bg-red-500",
    price: "$89.99",
    category: "Specialized",
    features: ["Combat skills", "Heavy armor", "Weapons", "Defense gear"]
  },
  {
    name: "Tamer Account",
    description: "Beast master with trained pets",
    icon: Crown,
    color: "bg-yellow-500",
    price: "$129.99",
    category: "Specialized",
    features: ["Taming skills", "Trained pets", "Pet equipment", "Beast gear"]
  },
  {
    name: "Crafter Account",
    description: "Skilled artisan with crafting abilities",
    icon: Crown,
    color: "bg-orange-500",
    price: "$79.99",
    category: "Specialized",
    features: ["Crafting skills", "Crafting tools", "Resources", "Workshop"]
  }
]

export default function AccountsPage() {
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
                { label: "Accounts", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Crown className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UO Accounts
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Skip the grind and start playing with a pre-leveled account. 
              Choose from starter accounts to fully maxed characters with premium equipment.
            </p>
          </div>

          {/* Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {accountItems.map((account) => {
              const IconComponent = account.icon
              return (
                <Card key={account.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${account.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {account.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {account.name}
                    </CardTitle>
                    <p className="text-gray-600">{account.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {account.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Includes:</h4>
                      <ul className="space-y-1">
                        {account.features.map((feature) => (
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
                      <Link href={`/product/${account.name.toLowerCase().replace(' ', '-')}`}>
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
              Ready to Start Playing?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Choose the perfect account for your playstyle and start your adventure today.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 