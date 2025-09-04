"use client"

import Link from 'next/link'
import { Shield, Crown } from 'lucide-react'

export function SlotSection() {
  const slotItems = [
    "Head",
    "Chest Armor",
    "Leg Armor",
    "Glove Armor",
    "Sleeve Armor",
    "Footwear",
    "Neck Armor",
    "Jewelry",
    "Talismans",
    "Robes",
    "Belts Aprons",
    "Sashes",
    "Cloaks Quivers"
  ]

  // Helper function to convert slot name to category URL (same as header)
  const slotToCategoryUrl = (slotName: string) => {
    const slotToCategoryMap: { [key: string]: string } = {
      "Head": "Head",
      "Chest Armor": "Chest-Armor", 
      "Leg Armor": "Leg-Armor",
      "Glove Armor": "Glove-Armor",
      "Sleeve Armor": "Sleeve-Armor", 
      "Footwear": "Footwear",
      "Neck Armor": "Neck-Armor",
      "Jewelry": "Jewelry",
      "Talismans": "Talismans",
      "Robes": "Robes",
      "Belts Aprons": "Belts-Aprons",
      "Sashes": "Sashes",
      "Cloaks Quivers": "Cloaks-Quivers"
    }
    return slotToCategoryMap[slotName] || slotName.replace(/\s+/g, '-')
  }

  // Get emoji for each slot
  const getSlotEmoji = (slotName: string) => {
    const emojiMap: { [key: string]: string } = {
      "Head": "⛑️",
      "Chest Armor": "🛡️",
      "Leg Armor": "🦵",
      "Glove Armor": "🧤",
      "Sleeve Armor": "👕",
      "Footwear": "👢",
      "Neck Armor": "📿",
      "Jewelry": "💍",
      "Talismans": "🔮",
      "Robes": "👘",
      "Belts Aprons": "🎗️",
      "Sashes": "🎀",
      "Cloaks Quivers": "🧥"
    }
    return emojiMap[slotName] || "⚔️"
  }

  return (
    <section className="py-12 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-amber-600 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Equipment Slots</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse equipment by specific body slots to find the perfect gear for your character
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {slotItems.map((slot) => (
            <Link
              key={slot}
              href={`/UO/${slotToCategoryUrl(slot)}`}
              className="group block p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-amber-500 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {getSlotEmoji(slot)}
              </div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                {slot}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}