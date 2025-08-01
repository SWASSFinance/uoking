import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, Shield, Zap, Users, Target, Star, BookOpen } from "lucide-react"
import Link from "next/link"

const classTypes = [
  {
    name: "Getting Started",
    description: "Begin your journey in Ultima Online",
    icon: BookOpen,
    color: "bg-blue-500",
    difficulty: "Beginner",
    features: ["Basic skills", "Equipment guide", "Combat tips"]
  },
  {
    name: "Mage",
    description: "Master of magic and spells",
    icon: Zap,
    color: "bg-purple-500",
    difficulty: "Intermediate",
    features: ["Spell casting", "Mana management", "Magical combat"]
  },
  {
    name: "Tamer",
    description: "Beast master and animal companion",
    icon: Users,
    color: "bg-green-500",
    difficulty: "Advanced",
    features: ["Pet training", "Animal control", "Companion combat"]
  },
  {
    name: "Melee",
    description: "Close combat warrior",
    icon: Sword,
    color: "bg-red-500",
    difficulty: "Beginner",
    features: ["Weapon mastery", "Armor proficiency", "Physical combat"]
  },
  {
    name: "Ranged",
    description: "Distance combat specialist",
    icon: Target,
    color: "bg-orange-500",
    difficulty: "Intermediate",
    features: ["Bow mastery", "Archery skills", "Distance tactics"]
  },
  {
    name: "Thief",
    description: "Stealth and subterfuge",
    icon: Shield,
    color: "bg-gray-500",
    difficulty: "Advanced",
    features: ["Stealth skills", "Lockpicking", "Sneak attacks"]
  },
  {
    name: "Crafter",
    description: "Master of crafting and trade",
    icon: Star,
    color: "bg-yellow-500",
    difficulty: "Intermediate",
    features: ["Item crafting", "Resource gathering", "Trade skills"]
  }
]

export default function ClassPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Class", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Sword className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Character Classes
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your path in Ultima Online. Each class offers unique abilities, 
              skills, and playstyles to match your preferences.
            </p>
          </div>

          {/* Class Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {classTypes.map((classType) => {
              const IconComponent = classType.icon
              return (
                <Card key={classType.name} className="group hover:shadow-lg transition-all duration-300 border-amber-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${classType.color} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {classType.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {classType.name}
                    </CardTitle>
                    <p className="text-gray-600">{classType.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Features:</h4>
                      <ul className="space-y-1">
                        {classType.features.map((feature) => (
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
                      <Link href={`/class/${classType.name.toLowerCase().replace(' ', '-')}`}>
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
              Ready to Choose Your Class?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Start your adventure with the perfect character class for your playstyle.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Get Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 