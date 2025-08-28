import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Map, Search, Calculator, Shield, Clock, Users, DollarSign, Gift, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ProductImage } from "@/components/ui/product-image"

interface ToolItem {
  name: string
  description: string
  icon: any
  color: string
  status: string
  features: string[]
  href?: string
}

const toolItems: ToolItem[] = [
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
    name: "EM Rares",
    description: "Event Master rare items database",
    icon: Gift,
    color: "bg-yellow-500",
    status: "Available",
    features: ["Event items", "Rare collectibles", "Limited editions"],
    href: "/event-rares"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {toolItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.name} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <Link href={item.href || `/UO/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden group">
                        <ProductImage
                          src={`/uo/tools.png`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Hover overlay with tool description */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                          <div className="text-white text-center max-w-full">
                            <p className="text-xs font-sans">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Status badge */}
                        <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            Tool
                          </span>
                        </div>
                        
                        {/* Rating placeholder */}
                        <div className="flex items-center space-x-1">
                          <Search className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">Free</span>
                        </div>
                      </div>
                    </Link>

                    {/* Access Tool Button */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                        asChild
                      >
                        <Link href={item.href || `/UO/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Access Tool
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