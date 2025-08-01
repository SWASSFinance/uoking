import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, ArrowUp, Star, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function DamageIncreasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Prop", href: "/prop" },
                { label: "Damage Increase", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sword className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Damage Increase Property
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Increase your weapon damage and become a more formidable fighter. 
              Damage Increase is one of the most important combat properties in Ultima Online.
            </p>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">What is Damage Increase?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Damage Increase is a property that directly increases the damage output of your weapons. 
                  It's one of the most sought-after properties for combat-focused characters.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Increases weapon damage by a percentage
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Works with all weapon types
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Stacks with other damage properties
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Essential for PvP and PvE combat
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">How to Get Damage Increase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Target className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Equipment</h5>
                      <p className="text-sm text-gray-600">Find items with Damage Increase property</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Enhancement</h5>
                      <p className="text-sm text-gray-600">Use enhancement materials to add the property</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Sword className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Crafting</h5>
                      <p className="text-sm text-gray-600">Craft items with Damage Increase</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                  <Link href="/store">
                    Browse Equipment
                    <ArrowUp className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Tips for Maximizing Damage Increase
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Equipment Strategy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Focus on weapons and jewelry first
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Look for items with multiple damage properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider the trade-off with other properties
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Combat Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Combine with Hit Chance Increase
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Use appropriate weapon types for your target
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Balance damage with survivability
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Increase Your Damage?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of equipment with Damage Increase properties.
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