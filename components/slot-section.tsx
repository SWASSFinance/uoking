import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Sword, Shield, Zap, Target, Users } from "lucide-react"
import Link from "next/link"

const classes = [
  {
    name: "Mage",
    description: "Powerful spellcasters with devastating magical abilities",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    items: 150,
    popular: true,
    href: "/class/mage",
  },
  {
    name: "Tamer",
    description: "Masters of beasts and creatures, commanding powerful pets",
    icon: Users,
    color: "from-green-500 to-green-600",
    items: 120,
    popular: false,
    href: "/class/tamer",
  },
  {
    name: "Melee",
    description: "Close combat warriors with exceptional physical strength",
    icon: Sword,
    color: "from-red-500 to-red-600",
    items: 200,
    popular: true,
    href: "/class/melee",
  },
  {
    name: "Ranged",
    description: "Skilled archers and marksmen with precision accuracy",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    items: 180,
    popular: false,
    href: "/class/ranged",
  },
  {
    name: "Thief",
    description: "Stealthy rogues with exceptional agility and cunning",
    icon: Shield,
    color: "from-gray-500 to-gray-600",
    items: 90,
    popular: false,
    href: "/class/thief",
  },
  {
    name: "Crafter",
    description: "Master artisans creating powerful equipment and items",
    icon: Crown,
    color: "from-amber-500 to-amber-600",
    items: 250,
    popular: true,
    href: "/class/crafter",
  },
]

export function SlotSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-amber-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ultima Online Items - By Slot</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect equipment for every equipment slot
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const IconComponent = classItem.icon
            return (
              <Link key={classItem.name} href={classItem.href}>
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer">
                  <div className={`h-32 bg-gradient-to-r ${classItem.color} flex items-center justify-center`}>
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{classItem.name}</h3>
                      {classItem.popular && (
                        <Badge className="bg-amber-500 text-white">Popular</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm text-gray-600">{classItem.items} items</span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                      >
                        Browse {classItem.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
          >
            View All Slots
          </Button>
        </div>
      </div>
    </section>
  )
}
