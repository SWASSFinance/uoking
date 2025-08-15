import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Map, Search, Calculator, Shield, Clock, Users, DollarSign, Gift } from "lucide-react"
import Link from "next/link"

const toolItems = [
  {
    name: "Maps",
    description: "Interactive maps and location guides",
    icon: Map,
    color: "bg-green-500",
    status: "Available",
    features: ["Interactive maps", "Location markers", "Navigation guides"]
  },
  {
    name: "IDOC",
    description: "In Danger of Collapse house tracking",
    icon: Shield,
    color: "bg-red-500",
    status: "Available",
    features: ["House tracking", "Collapse timers", "Notifications"]
  },
  {
    name: "EM Event List",
    description: "Event Master event schedules and information",
    icon: Clock,
    color: "bg-purple-500",
    status: "Available",
    features: ["Event schedules", "Event details", "Reminders"]
  },
  {
    name: "Event Rares",
    description: "Rare items from special events",
    icon: Gift,
    color: "bg-yellow-500",
    status: "Available",
    features: ["Event items", "Rare collectibles", "Limited editions"]
  },
  {
    name: "Price Checker",
    description: "Real-time item price checking tool",
    icon: Calculator,
    color: "bg-blue-500",
    status: "Available",
    features: ["Price tracking", "Market analysis", "Price alerts"]
  },
  {
    name: "Lost Ark Gold",
    description: "Lost Ark gold trading services",
    icon: DollarSign,
    color: "bg-orange-500",
    status: "Available",
    features: ["Gold trading", "Secure transactions", "Fast delivery"]
  },
  {
    name: "Auction Safes",
    description: "Secure auction house tools",
    icon: Shield,
    color: "bg-indigo-500",
    status: "Available",
    features: ["Secure auctions", "Bid protection", "Transaction safety"]
  },
  {
    name: "Invasion Event",
    description: "Invasion event tracking and information",
    icon: Users,
    color: "bg-pink-500",
    status: "Available",
    features: ["Event tracking", "Invasion alerts", "Reward info"]
  }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Tools", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Search className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UOKing Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential tools and utilities to enhance your Ultima Online experience. 
              From maps and tracking to price checking and event management.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {toolItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${item.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {item.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {item.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm">Features:</h4>
                      <ul className="space-y-1">
                        {item.features.map((feature) => (
                          <li key={feature} className="text-xs text-gray-600 flex items-center">
                            <Search className="h-3 w-3 text-amber-500 mr-2" />
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
                      <Link href={`/UO/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        Access Tool
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
              Need More Tools?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Contact us for custom tools and specialized services.
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