import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Sword, Shield, Zap, Users, Target, Star, BookOpen } from "lucide-react"
import Link from "next/link"
import { getClasses } from '@/lib/db'

// Icon mapping for classes
const classIcons: { [key: string]: any } = {
  'mage': Zap,
  'tamer': Users,
  'warrior': Sword,
  'archer': Target,
  'paladin': Shield,
  'necromancer': Star,
  'default': Shield
}

// Color mapping for classes
const classColors: { [key: string]: string } = {
  'mage': 'bg-purple-500',
  'tamer': 'bg-green-500',
  'warrior': 'bg-red-500',
  'archer': 'bg-orange-500',
  'paladin': 'bg-blue-500',
  'necromancer': 'bg-gray-500',
  'default': 'bg-amber-500'
}

// Difficulty mapping
const getDifficultyText = (level: number): string => {
  switch (level) {
    case 1: return 'Beginner'
    case 2: return 'Easy'
    case 3: return 'Intermediate'
    case 4: return 'Advanced'
    case 5: return 'Expert'
    default: return 'Intermediate'
  }
}

export default async function ClassPage() {
  // Fetch actual classes from database
  const dbClasses = await getClasses()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Character Classes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose your path in Ultima Online. Each class offers unique abilities, 
              skills, and playstyles to match your preferences.
            </p>
          </div>

          {/* Class Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {dbClasses.map((classData) => {
              const IconComponent = classIcons[classData.slug] || classIcons.default
              const classColor = classColors[classData.slug] || classColors.default
              const difficultyText = getDifficultyText(classData.difficulty_level)
              
              return (
                <Card key={classData.id} className="group hover:shadow-lg transition-all duration-300 border-amber-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${classColor} text-white`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {difficultyText}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {classData.name}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">{classData.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Skills:</h4>
                      <ul className="space-y-1">
                        {classData.skills?.map((skill: string) => (
                          <li key={skill} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                            <Star className="h-3 w-3 text-amber-500 mr-2" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                      asChild
                    >
                      <Link href={`/class/${classData.slug}`}>
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