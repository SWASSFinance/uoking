import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Scroll, ArrowUp, Star, Zap } from "lucide-react"
import Link from "next/link"

const scrollItems = [
  {
    name: "Alacrity Scrolls",
    description: "Scrolls to increase skill levels quickly",
    icon: Scroll,
    color: "bg-blue-500",
    price: "$5.99",
    features: ["Quick skill leveling", "Instant results", "Multiple skills"]
  },
  {
    name: "Power Scrolls",
    description: "Scrolls to increase skill caps",
    icon: Star,
    color: "bg-purple-500",
    price: "$12.99",
    features: ["Skill cap increase", "Permanent boost", "All skills"]
  },
  {
    name: "Transcendence Scrolls",
    description: "Scrolls of Transcendence for maximum power",
    icon: Zap,
    color: "bg-yellow-500",
    price: "$19.99",
    features: ["Maximum power", "Ultimate boost", "Rare items"]
  }
]

export default function ScrollsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Scrolls", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Scroll className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UOKing Scrolls
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful scrolls to enhance your character's skills and capabilities. 
              From basic skill increases to ultimate power boosts.
            </p>
          </div>

          {/* Scrolls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {scrollItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${item.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {item.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {item.name}
                    </CardTitle>
                    <p className="text-gray-600">{item.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Features:</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature) => (
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
                      <Link href={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
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
              Ready to Power Up?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Choose the right scrolls for your character and dominate the game.
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