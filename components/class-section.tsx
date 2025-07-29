import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wand2, Hammer, Sword, Target, UserX, Wrench } from "lucide-react"

const classes = [
  { name: "Mage", icon: Wand2, color: "bg-blue-500", description: "Magical items and reagents" },
  { name: "Tamer", icon: Hammer, color: "bg-green-500", description: "Pet training and taming gear" },
  { name: "Melee", icon: Sword, color: "bg-red-500", description: "Weapons and combat gear" },
  { name: "Ranged", icon: Target, color: "bg-purple-500", description: "Bows, arrows, and ranged weapons" },
  { name: "Thief", icon: UserX, color: "bg-gray-700", description: "Stealth and lockpicking tools" },
  { name: "Crafter", icon: Wrench, color: "bg-orange-500", description: "Crafting tools and materials" },
]

export function ClassSection() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Class</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find items specifically tailored for your character class and playstyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => {
            const IconComponent = classItem.icon
            return (
              <Card
                key={classItem.name}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-amber-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`${classItem.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                      <p className="text-sm text-gray-600">{classItem.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-amber-50 group-hover:border-amber-300 bg-transparent"
                  >
                    Browse {classItem.name} Items
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
