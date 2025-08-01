import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Zap, ArrowUp, Star, Shield, BookOpen } from "lucide-react"
import Link from "next/link"

export default function MagePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Class", href: "/class" },
                { label: "Mage", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Zap className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mage Class Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the arcane arts and become a powerful spellcaster. Mages excel at 
              magical combat, utility spells, and devastating magical damage.
            </p>
          </div>

          {/* Class Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">Mage Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Mages are powerful spellcasters who rely on magical abilities rather than 
                  physical combat. They excel at dealing magical damage and providing utility 
                  through various spells.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Strengths:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      High magical damage output
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Versatile spell selection
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Utility and crowd control
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                      Ranged combat capabilities
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-2xl">Essential Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Magery</h5>
                      <p className="text-sm text-gray-600">Core spellcasting skill</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Meditation</h5>
                      <p className="text-sm text-gray-600">Mana regeneration</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Resisting Spells</h5>
                      <p className="text-sm text-gray-600">Magical defense</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white" asChild>
                  <Link href="/store">
                    Browse Mage Equipment
                    <ArrowUp className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Guide */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Mage Equipment Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Essential Gear</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Robes with magical properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Jewelry with mana regeneration
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Spellbooks and scrolls
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Recommended Properties</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Faster Casting
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Lower Mana Cost
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Spell Damage Increase
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Master Magic?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of mage equipment and start your magical journey.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse Mage Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 