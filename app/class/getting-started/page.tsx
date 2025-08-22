import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { BookOpen, ArrowRight, Star, Users, Target } from "lucide-react"
import Link from "next/link"

export default function GettingStartedPage() {
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
                { label: "Getting Started", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Getting Started with Ultima Online
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to the world of Ultima Online! This guide will help you get started 
              with your first character and understand the basics of the game.
            </p>
          </div>

          {/* Getting Started Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">Step 1</Badge>
                </div>
                <CardTitle className="text-xl">Choose Your Character</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Decide on your character's race and starting skills. Consider your playstyle 
                  and what type of character you want to build.
                </p>
                <Button asChild>
                  <Link href="/class">
                    Browse Classes
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-green-500 text-white">
                    <Target className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">Step 2</Badge>
                </div>
                <CardTitle className="text-xl">Learn Basic Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Start with basic skills like combat, healing, and resource gathering. 
                  These will help you survive and progress in the game.
                </p>
                <Button asChild>
                  <Link href="/prop">
                    View Properties
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-full bg-purple-500 text-white">
                    <Star className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">Step 3</Badge>
                </div>
                <CardTitle className="text-xl">Get Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Equip your character with appropriate gear for your chosen path. 
                  Start with basic equipment and upgrade as you progress.
                </p>
                <Button asChild>
                  <Link href="/store">
                    Browse Store
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Essential Tips for Beginners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Combat Tips</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Start with simple combat against weak monsters
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Learn to use healing spells and potions
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Practice with different weapon types
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Skill Development</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Focus on a few skills initially
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Use skill scrolls to increase caps
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Join a guild for guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your Adventure?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Choose your path and start your journey in Ultima Online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/class">
                  Browse All Classes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 