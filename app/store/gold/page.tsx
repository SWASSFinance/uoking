import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Coins, ArrowUp, Star, Shield, Zap } from "lucide-react"
import Link from "next/link"

const goldPackages = [
  {
    name: "Starter Gold",
    description: "Perfect for new players getting started",
    icon: Coins,
    color: "bg-green-500",
    price: "$9.99",
    amount: "1 Million Gold",
    features: ["Perfect for beginners", "Fast delivery", "Safe transaction", "24/7 support"]
  },
  {
    name: "Standard Gold",
    description: "Great value for regular players",
    icon: Coins,
    color: "bg-blue-500",
    price: "$24.99",
    amount: "5 Million Gold",
    features: ["Popular choice", "Best value", "Quick delivery", "Secure payment"]
  },
  {
    name: "Premium Gold",
    description: "Large amount for serious players",
    icon: Coins,
    color: "bg-purple-500",
    price: "$49.99",
    amount: "15 Million Gold",
    features: ["Large amount", "Premium service", "Priority delivery", "VIP support"]
  },
  {
    name: "Ultimate Gold",
    description: "Maximum gold for power players",
    icon: Coins,
    color: "bg-red-500",
    price: "$99.99",
    amount: "50 Million Gold",
    features: ["Maximum amount", "Ultimate service", "Instant delivery", "Premium support"]
  },
  {
    name: "Custom Amount",
    description: "Get exactly the amount you need",
    icon: Coins,
    color: "bg-orange-500",
    price: "Custom",
    amount: "Your Choice",
    features: ["Flexible amounts", "Custom pricing", "Personal service", "Direct contact"]
  },
  {
    name: "Bulk Gold",
    description: "Special rates for large orders",
    icon: Coins,
    color: "bg-yellow-500",
    price: "Contact Us",
    amount: "100M+ Gold",
    features: ["Bulk discounts", "Special rates", "Wholesale pricing", "Enterprise service"]
  }
]

export default function GoldPage() {
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
                { label: "Gold", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Coins className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UO Gold Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get the gold you need to dominate Ultima Online. From starter amounts to 
              bulk orders, we have competitive prices and fast delivery.
            </p>
          </div>

          {/* Gold Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {goldPackages.map((package_) => {
              const IconComponent = package_.icon
              return (
                <Card key={package_.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${package_.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {package_.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {package_.name}
                    </CardTitle>
                    <p className="text-gray-600">{package_.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {package_.amount}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Features:</h4>
                      <ul className="space-y-1">
                        {package_.features.map((feature) => (
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
                      <Link href={`/product/${package_.name.toLowerCase().replace(' ', '-')}`}>
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
              Ready to Buy Gold?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Choose your package and get the gold you need to succeed in Ultima Online.
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