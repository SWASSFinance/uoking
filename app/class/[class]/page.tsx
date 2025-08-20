"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { Star, ShoppingCart, Crown, Shield, Zap, Target, Eye, Hand, Hammer, Users, Sword } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface ClassPageProps {
  params: Promise<{ class: string }>
}

export default function ClassPage({ params }: ClassPageProps) {
  const [classParam, setClassParam] = useState<string>('')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const resolvedParams = await params
        const classValue = resolvedParams.class
        setClassParam(classValue)
  
  // Fetch real products for this class
        const response = await fetch(`/api/products?class=${classValue}&limit=100`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error loading class data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params])

  const handleAddToCart = (product: any) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: parseFloat(product.sale_price || product.price),
      image_url: product.image_url || '',
      category: product.category_names ? product.category_names.split(', ')[0] : ''
    })
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    })
  }
  
  // Function to convert item name to URL-friendly slug
  const createProductSlug = (itemName: string) => {
    return itemName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  const classData = {
    mage: {
      name: "Mage",
      description: "In the mystical realms of Ultima Online, Mage Items are the lifeblood of any aspiring spellcaster, infusing your character with the arcane power needed to dominate both the battlefield and the enchanting wilderness. These items, ranging from enchanted staves to mystical robes, are meticulously designed to amplify your magical abilities, ensuring that each spell cast is more potent, precise, and impactful.",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      itemCount: 150,
      popular: true,
      features: [
        "Spell Damage Increase (SDI)",
        "Faster Cast Recovery (FCR)",
        "Mana Regeneration",
        "Lower Mana Cost",
        "Spell Channeling",
        "Hit Point Regeneration"
      ],
      veteranDescription: "Imagine you are a seasoned mage, well-versed in the arcane arts and ever in search of relics that can enhance your spellcasting prowess. Your journey has led you to a treasure trove of Mage Items, each one humming with latent power. The Elder's Spellbook, its pages crackling with energy, boosts your spell damage and casting speed, transforming simple incantations into devastating forces of nature. Meanwhile, the Archmage's Robe, woven with threads of pure mana, envelops you in an aura of protection and regeneration, allowing you to stand firm amidst the chaos of battle. As you peruse these artifacts, you come across the Sorcerer's Amulet, a delicate yet powerful piece that augments your mana pool and enhances your spell accuracy, making every fireball and lightning strike land with lethal precision. These items are not merely tools; they are extensions of your will, channeling the raw forces of magic into disciplined, destructive spells. Each Mage Item has its own story, often obtained through braving ancient dungeons, completing perilous quests, or mastering the art of crafting using rare and mystical components. As you gather these powerful relics, your capabilities as a mage expand, allowing you to summon storms, heal allies, and vanquish foes with unparalleled efficiency. For mages who seek to transcend the ordinary and become legends of magic, the quest for the ultimate Mage Items is a journey worth undertaking. Embrace these enchanted artifacts, and let your arcane legacy shine brilliantly in the world of Ultima Online."
    },
         tamer: {
       name: "Tamer",
       description: "Every seasoned adventurer in Ultima Online knows that the true strength of a Tamer lies not only in their mastery over beasts but also in the powerful artifacts they wield to enhance their connection with their companions. Tamer Items are designed to fortify this bond, providing essential boosts that transform a simple pet into a legendary ally, capable of turning the tide of any encounter.",
       icon: Users,
       color: "from-green-500 to-green-600",
       itemCount: 120,
       popular: false,
       features: [
         "Taming Bonus",
         "Lore Bonus",
         "Mana Regeneration",
         "Lower Mana Cost",
         "Faster Cast Recovery",
         "Hit Point Regeneration"
       ],
      veteranDescription: "As a master tamer who has spent countless hours in the wilderness, you understand that the bond between a tamer and their creatures is sacred. Your journey has led you to discover Tamer Items that enhance this connection, making your companions not just pets, but true partners in adventure. The Beastmaster's Ring, with its ancient enchantments, strengthens the bond between you and your creatures, allowing for better control and communication. The Tamer's Staff, carved from the heartwood of an ancient tree, channels your will more effectively, making it easier to command even the most stubborn of beasts. As you explore these artifacts, you find the Companion's Amulet, a delicate piece that not only boosts your taming abilities but also provides your creatures with enhanced strength and resilience. These items are more than mere accessories; they are conduits of understanding, allowing you to forge deeper connections with the creatures of the world. Each Tamer Item carries the wisdom of generations of beastmasters, often crafted from rare materials found only in the most remote corners of the realm. As you collect these powerful relics, your ability to tame, train, and command creatures grows exponentially, allowing you to assemble a menagerie of loyal companions that can face any challenge. For tamers who seek to become legends of the wild, the pursuit of the ultimate Tamer Items is a path of discovery and growth. Embrace these enchanted artifacts, and let your bond with the creatures of Ultima Online become legendary."
     },
         melee: {
       name: "Melee",
      description: "In the brutal world of Ultima Online, where steel meets steel and honor is tested in combat, Melee Items stand as the foundation of any warrior's arsenal. These powerful artifacts, from legendary swords to enchanted armor, are crafted to enhance your physical prowess, ensuring that every strike lands with devastating force and every defense holds firm against the fiercest of enemies.",
       icon: Sword,
       color: "from-red-500 to-red-600",
      itemCount: 180,
       popular: true,
       features: [
        "Damage Increase (DI)",
        "Hit Point Regeneration",
         "Stamina Regeneration",
        "Faster Hit Recovery",
        "Lower Requirements",
        "Enhanced Durability"
      ],
      veteranDescription: "As a battle-hardened warrior who has faced countless foes on the field of honor, you know that the difference between victory and defeat often lies in the quality of your equipment. Your journey has led you to discover Melee Items that transform a simple warrior into an unstoppable force of destruction. The Warrior's Blade, forged in the fires of ancient forges, channels your strength into devastating attacks that can cleave through armor and flesh alike. The Champion's Armor, crafted from rare metals and blessed by the gods of war, provides protection that allows you to stand firm against overwhelming odds. As you examine these artifacts, you discover the Berserker's Ring, a powerful talisman that not only enhances your damage output but also provides the stamina needed to fight through the longest of battles. These items are not mere weapons and armor; they are extensions of your will to fight, each piece carrying the legacy of legendary warriors who came before you. Each Melee Item has its own story, often forged from materials gathered from the most dangerous creatures or crafted by master smiths using techniques passed down through generations. As you collect these powerful relics, your capabilities as a warrior expand, allowing you to face down dragons, demons, and other legendary foes with confidence. For warriors who seek to become legends of the battlefield, the quest for the ultimate Melee Items is a journey of strength and honor. Embrace these enchanted artifacts, and let your martial prowess become the stuff of legends in the world of Ultima Online."
     },
         ranged: {
       name: "Ranged",
      description: "In the vast landscapes of Ultima Online, where precision and distance can mean the difference between life and death, Ranged Items are the tools of choice for those who prefer to strike from afar. These specialized artifacts, from enchanted bows to magical ammunition, are designed to enhance your accuracy, range, and damage, making every shot count in the heat of battle.",
       icon: Target,
       color: "from-blue-500 to-blue-600",
      itemCount: 90,
       popular: false,
       features: [
        "Damage Increase (DI)",
        "Hit Point Regeneration",
         "Stamina Regeneration",
        "Faster Hit Recovery",
        "Lower Requirements",
        "Enhanced Accuracy"
      ],
      veteranDescription: "As a master archer who has spent years perfecting the art of the bow, you understand that true skill lies not just in the strength of your arm, but in the quality of your equipment. Your journey has led you to discover Ranged Items that transform a simple archer into a deadly force of precision and power. The Hunter's Bow, crafted from the finest yew and strung with enchanted sinew, allows you to loose arrows with deadly accuracy at incredible distances. The Archer's Quiver, blessed by the spirits of the forest, ensures that every arrow you fire carries the power to pierce even the thickest armor. As you explore these artifacts, you find the Ranger's Ring, a delicate piece that not only enhances your damage but also provides the stamina needed to maintain your aim through the longest of battles. These items are more than mere weapons; they are tools of precision, each piece carrying the wisdom of legendary archers who mastered the art of the bow. Each Ranged Item has its own story, often crafted from materials gathered from the most elusive creatures or blessed by ancient spirits of the wilderness. As you collect these powerful relics, your ability to strike from afar grows exponentially, allowing you to eliminate threats before they can even reach you. For archers who seek to become legends of the hunt, the pursuit of the ultimate Ranged Items is a path of precision and patience. Embrace these enchanted artifacts, and let your arrows become the harbingers of doom in the world of Ultima Online."
     },
         thief: {
       name: "Thief",
      description: "In the shadowy corners of Ultima Online, where stealth and cunning are valued above brute force, Thief Items are the tools of choice for those who prefer to work from the shadows. These specialized artifacts, from enchanted daggers to magical cloaks, are designed to enhance your stealth abilities, lockpicking skills, and combat effectiveness when the shadows fail you.",
      icon: Eye,
       color: "from-gray-500 to-gray-600",
      itemCount: 75,
       popular: false,
       features: [
        "Stealth Enhancement",
         "Lockpicking Bonus",
        "Damage Increase (DI)",
        "Hit Point Regeneration",
        "Faster Hit Recovery",
        "Enhanced Hiding"
      ],
      veteranDescription: "As a master thief who has spent years perfecting the art of stealth and deception, you know that success in your profession depends not just on skill, but on the quality of your tools. Your journey has led you to discover Thief Items that transform a simple rogue into a master of shadows and secrets. The Shadow's Dagger, forged from rare obsidian and blessed by the spirits of darkness, allows you to strike with deadly precision while remaining unseen. The Thief's Cloak, woven from enchanted silk and imbued with the essence of shadows, makes you nearly invisible to all but the most vigilant of guards. As you examine these artifacts, you discover the Rogue's Ring, a powerful talisman that not only enhances your stealth abilities but also provides the agility needed to escape from any situation. These items are more than mere tools; they are extensions of your shadowy nature, each piece carrying the legacy of legendary thieves who mastered the art of stealth. Each Thief Item has its own story, often crafted from materials gathered from the most dangerous heists or blessed by ancient spirits of deception. As you collect these powerful relics, your ability to move unseen and strike from the shadows grows exponentially, allowing you to infiltrate the most secure locations and escape with treasures beyond imagination. For thieves who seek to become legends of the shadows, the quest for the ultimate Thief Items is a journey of cunning and stealth. Embrace these enchanted artifacts, and let your shadowy exploits become the stuff of whispered legends in the world of Ultima Online."
     },
    crafter: {
      name: "Crafter",
      description: "In the bustling workshops and forges of Ultima Online, where skill and dedication transform raw materials into works of art, Crafter Items are the tools of choice for those who prefer to create rather than destroy. These specialized artifacts, from enchanted hammers to magical workbenches, are designed to enhance your crafting abilities, making every creation a masterpiece of quality and value.",
      icon: Hammer,
      color: "from-yellow-500 to-yellow-600",
      itemCount: 60,
      popular: false,
      features: [
        "Crafting Bonus",
        "Resource Gathering",
        "Quality Enhancement",
        "Durability Increase",
        "Lower Requirements",
        "Enhanced Skills"
      ],
      veteranDescription: "As a master crafter who has spent years perfecting the art of creation, you understand that true craftsmanship lies not just in skill, but in the quality of your tools. Your journey has led you to discover Crafter Items that transform a simple artisan into a master of creation and innovation. The Artisan's Hammer, forged from rare metals and blessed by the spirits of creation, allows you to craft items of exceptional quality that stand the test of time. The Crafter's Workbench, crafted from ancient wood and imbued with the essence of craftsmanship, provides the perfect environment for creating masterpieces. As you explore these artifacts, you discover the Master's Ring, a powerful talisman that not only enhances your crafting abilities but also provides the inspiration needed to create truly legendary items. These items are more than mere tools; they are extensions of your creative spirit, each piece carrying the legacy of legendary craftsmen who mastered the art of creation. Each Crafter Item has its own story, often crafted from materials gathered from the most remote locations or blessed by ancient spirits of craftsmanship. As you collect these powerful relics, your ability to create and innovate grows exponentially, allowing you to craft items that become the envy of all who see them. For craftsmen who seek to become legends of creation, the pursuit of the ultimate Crafter Items is a journey of skill and dedication. Embrace these enchanted artifacts, and let your creations become the stuff of legends in the world of Ultima Online."
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
        <Header />
        <main className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading class information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentClass = classData[classParam as keyof typeof classData]
  if (!currentClass) {
    notFound()
  }

  const IconComponent = currentClass.icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-4 rounded-lg bg-gradient-to-r ${currentClass.color}`}>
                <IconComponent className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">UO {currentClass.name} Items</h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mt-4 leading-relaxed">
              {currentClass.description}
            </p>
            {currentClass.popular && (
              <Badge className="mt-4 bg-amber-500 text-white">Popular Class</Badge>
            )}
          </div>

                                          {/* Class Items Grid - Show for Mage, Tamer, Melee, Ranged, Thief, and Crafter classes */}
           {(classParam === 'mage' || classParam === 'tamer' || classParam === 'melee' || classParam === 'ranged' || classParam === 'thief' || classParam === 'crafter') && products && products.length > 0 && (
             <div className="mb-12">
               <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{currentClass.name} Items</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {products.map((product: any) => (
                   <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                     <CardContent className="p-3">
                       <Link href={`/product/${product.slug}`}>
                         <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden group">
                           <ProductImage
                             src={product.image_url}
                             alt={product.name}
                             fill
                             className="object-cover"
                           />
                           
                           {product.featured && (
                             <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                               Featured
                             </Badge>
                           )}
                         </div>
                         
                         <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                           {product.name}
                         </h3>
                         
                         <div className="flex items-center justify-between mb-3">
                           <div className="flex flex-col">
                             {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) ? (
                               <div className="flex items-center space-x-2">
                                 <span className="text-sm font-bold text-amber-600">
                                   ${parseFloat(product.sale_price).toFixed(2)}
                                 </span>
                                 <span className="text-xs text-gray-500 line-through">
                                   ${parseFloat(product.price).toFixed(2)}
                                 </span>
                               </div>
                             ) : (
                               <span className="text-sm font-bold text-amber-600">
                                 ${parseFloat(product.price).toFixed(2)}
                               </span>
                             )}
                           </div>
                           
                           {product.avg_rating > 0 && (
                             <div className="flex items-center space-x-1">
                               <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                               <span className="text-xs font-medium">
                                 {typeof product.avg_rating === 'string' ? parseFloat(product.avg_rating).toFixed(1) : product.avg_rating.toFixed(1)}
                               </span>
                             </div>
                           )}
                         </div>
                       </Link>

                       {/* Add to Cart Button */}
                       <div className="flex items-center gap-2">
                         <Button 
                          onClick={() => handleAddToCart(product)}
                           size="sm"
                           className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                         >
                             <ShoppingCart className="h-3 w-3 mr-1" />
                             Add to Cart
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
           )}

          {/* Class Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentClass.features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border border-amber-200">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    <Star className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

                     {/* Veteran Class Description - Show for Mage, Tamer, Melee, Ranged, Thief, and Crafter classes */}
           {(classParam === 'mage' || classParam === 'tamer' || classParam === 'melee' || classParam === 'ranged' || classParam === 'thief' || classParam === 'crafter') && 'veteranDescription' in currentClass && currentClass.veteranDescription && (
             <div className="mb-12">
                                    <Card className={`bg-gradient-to-r ${
                       classParam === 'mage' ? 'from-purple-50 to-purple-100 border-purple-200' :
                       classParam === 'tamer' ? 'from-green-50 to-green-100 border-green-200' :
                       classParam === 'melee' ? 'from-red-50 to-red-100 border-red-200' :
                       classParam === 'ranged' ? 'from-blue-50 to-blue-100 border-blue-200' :
                       classParam === 'thief' ? 'from-gray-50 to-gray-100 border-gray-200' :
                       'from-yellow-50 to-yellow-100 border-yellow-200'
                     } border`}>
                 <CardContent className="p-8">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                           {classParam === 'mage' ? 'A Veteran Mage' :
                            classParam === 'tamer' ? 'A Master Tamer Reflecting on Their Journey' :
                            classParam === 'melee' ? 'A Battle-Hardened Warrior Reflecting on Their Arsenal' :
                            classParam === 'ranged' ? 'A Master Archer Reflecting on Their Arsenal' :
                            classParam === 'thief' ? 'A Cunning Thief Recounting Their Exploits' :
                            'A Legendary Crafter Reflecting on Their Tools'}
                         </h3>
                   <p className="text-gray-700 leading-relaxed text-lg">
                     {currentClass.veteranDescription}
                   </p>
                 </CardContent>
               </Card>
             </div>
           )}

          {/* Newest Products for this Class */}
          {products && products.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest {currentClass.name} Items</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.slice(0, 12).map((product: any) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-amber-200 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <Link href={`/product/${product.slug}`}>
                        <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg overflow-hidden group">
                          <ProductImage
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          
                          {product.featured && (
                            <Badge className="absolute top-1 left-1 bg-amber-500 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors text-sm">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-amber-600">
                                  ${parseFloat(product.sale_price).toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  ${parseFloat(product.price).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-bold text-amber-600">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                          
                          {product.avg_rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium">
                                {typeof product.avg_rating === 'string' ? parseFloat(product.avg_rating).toFixed(1) : product.avg_rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Add to Cart Button */}
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          size="sm"
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs py-2"
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* View All Products Button */}
              <div className="text-center mt-8">
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                  <Link href={`/UO/${classParam}`}>
                    View All {currentClass.name} Items
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Equip Your {currentClass.name}?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Discover the perfect items to enhance your {currentClass.name.toLowerCase()} character's abilities.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse All Items
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 