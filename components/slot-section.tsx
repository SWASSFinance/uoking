import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const slots = [
  { name: "Belts Aprons", items: 45, image: "/medieval-belt.png" },
  { name: "Chest Armor", items: 67, image: "/medieval-chest-armor.png" },
  { name: "Cloaks Quivers", items: 32, image: "/medieval-cloak.png" },
  { name: "Footwear", items: 28, image: "/medieval-boots.png" },
  { name: "Glove Armor", items: 41, image: "/medieval-gloves.png" },
  { name: "Head", items: 53, image: "/medieval-helmet.png" },
  { name: "Leg Armor", items: 39, image: "/medieval-leg-armor.png" },
  { name: "Neck Armor", items: 24, image: "/medieval-necklace.png" },
  { name: "Robes", items: 56, image: "/medieval-robe.png" },
  { name: "Sashes", items: 18, image: "/medieval-sash.png" },
  { name: "Sleeve Armor", items: 33, image: "/placeholder-8zye4.png" },
  { name: "Talismans", items: 47, image: "/medieval-talisman.png" },
]

export function SlotSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Equipment Slot</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect gear for every equipment slot on your character
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {slots.map((slot) => (
            <Card
              key={slot.name}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <CardContent className="p-4 text-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center mb-2 group-hover:from-amber-200 group-hover:to-orange-300 transition-colors">
                    <img src={slot.image || "/placeholder.svg"} alt={slot.name} className="w-10 h-10 object-contain" />
                  </div>
                  <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs">
                    {slot.items}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {slot.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
