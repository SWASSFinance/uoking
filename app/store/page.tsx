import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { 
  Crown, 
  ShoppingBag, 
  Coins, 
  Scroll, 
  Sword, 
  Shield, 
  ArrowUp,
  Star,
  Gem,
  Home,
  BookOpen,
  Zap,
  Heart,
  Target,
  Hammer,
  Ship,
  ScrollText,
  Trophy,
  Clock,
  Gift
} from "lucide-react"
import Link from "next/link"

const storeData = [
  {
    name: "Accounts",
    description: "Pre-leveled accounts with skills and resources",
    icon: Crown,
    color: "bg-purple-500",
    category: "Accounts",
    items: ["Starter Accounts", "Maxed Accounts", "Specialized Builds", "Rare Characters"]
  },
  {
    name: "Alacrity Scrolls",
    description: "Scrolls to increase skill levels quickly",
    icon: Scroll,
    color: "bg-blue-500",
    category: "Scrolls",
    items: ["Skill Scrolls", "Power Scrolls", "Enhancement Scrolls", "Training Scrolls"]
  },
  {
    name: "Armor Refinements",
    description: "Materials to enhance armor properties",
    icon: Shield,
    color: "bg-gray-500",
    category: "Materials",
    items: ["Refinement Materials", "Enhancement Kits", "Upgrade Items", "Crafting Supplies"]
  },
  {
    name: "Artifacts",
    description: "Rare and powerful magical items",
    icon: Gem,
    color: "bg-yellow-500",
    category: "Rare Items",
    items: ["Ancient Artifacts", "Magical Items", "Rare Equipment", "Unique Items"]
  },
  {
    name: "Crest Of Blackthorn",
    description: "Special faction items and rewards",
    icon: Trophy,
    color: "bg-red-500",
    category: "Faction Items",
    items: ["Faction Rewards", "Special Items", "Unique Equipment", "Rare Collectibles"]
  },
  {
    name: "Custom Suits",
    description: "Complete character equipment sets",
    icon: Shield,
    color: "bg-green-500",
    category: "Equipment",
    items: ["Complete Sets", "Matching Gear", "Coordinated Equipment", "Full Outfits"]
  },
  {
    name: "Decorations",
    description: "House and guild decoration items",
    icon: Home,
    color: "bg-pink-500",
    category: "Decorations",
    items: ["House Decor", "Guild Items", "Furniture", "Ornamental Items"]
  },
  {
    name: "Dye Tubs",
    description: "Items to change equipment colors",
    icon: Zap,
    color: "bg-indigo-500",
    category: "Cosmetics",
    items: ["Dye Tubs", "Color Changes", "Customization", "Style Items"]
  },
  {
    name: "Dyes",
    description: "Various colors for equipment customization",
    icon: Zap,
    color: "bg-cyan-500",
    category: "Cosmetics",
    items: ["Color Dyes", "Customization", "Style Options", "Visual Effects"]
  },
  {
    name: "GameTime",
    description: "Game time and subscription services",
    icon: Clock,
    color: "bg-orange-500",
    category: "Services",
    items: ["Game Time", "Subscriptions", "Access Codes", "Account Services"]
  },
  {
    name: "Gems",
    description: "Precious stones and magical crystals",
    icon: Gem,
    color: "bg-purple-500",
    category: "Materials",
    items: ["Precious Gems", "Magical Crystals", "Crafting Materials", "Enhancement Items"]
  },
  {
    name: "Gold",
    description: "In-game currency for purchases",
    icon: Coins,
    color: "bg-yellow-500",
    category: "Currency",
    items: ["Game Gold", "Currency", "Money", "Trade Items"]
  },
  {
    name: "Hair Dyes",
    description: "Change your character's hair color",
    icon: Heart,
    color: "bg-pink-500",
    category: "Cosmetics",
    items: ["Hair Colors", "Character Customization", "Style Options", "Visual Changes"]
  },
  {
    name: "Houses",
    description: "Player housing and property",
    icon: Home,
    color: "bg-brown-500",
    category: "Property",
    items: ["Player Houses", "Property", "Real Estate", "Housing"]
  },
  {
    name: "Ingots",
    description: "Metal materials for crafting",
    icon: Hammer,
    color: "bg-gray-500",
    category: "Materials",
    items: ["Metal Ingots", "Crafting Materials", "Smithing Supplies", "Raw Materials"]
  },
  {
    name: "Luck Gear",
    description: "Equipment that increases luck",
    icon: Star,
    color: "bg-green-500",
    category: "Equipment",
    items: ["Luck Items", "Fortune Equipment", "Chance Enhancers", "Lucky Gear"]
  },
  {
    name: "Mastery Primers",
    description: "Items to enhance skill mastery",
    icon: BookOpen,
    color: "bg-blue-500",
    category: "Training",
    items: ["Skill Primers", "Mastery Items", "Training Materials", "Enhancement Scrolls"]
  },
  {
    name: "Mounts",
    description: "Riding animals and transportation",
    icon: Heart,
    color: "bg-green-500",
    category: "Transportation",
    items: ["Riding Animals", "Mounts", "Transportation", "Travel Items"]
  },
  {
    name: "New Legacy",
    description: "New Legacy server specific items",
    icon: Crown,
    color: "bg-purple-500",
    category: "Server Specific",
    items: ["Legacy Items", "Server Specific", "Unique Items", "Special Equipment"]
  },
  {
    name: "New Legacy Gold",
    description: "Gold for New Legacy server",
    icon: Coins,
    color: "bg-yellow-500",
    category: "Currency",
    items: ["Legacy Gold", "Server Currency", "Money", "Trade Items"]
  },
  {
    name: "Pets",
    description: "Companion animals and creatures",
    icon: Heart,
    color: "bg-pink-500",
    category: "Companions",
    items: ["Companion Animals", "Pets", "Creatures", "Animal Companions"]
  },
  {
    name: "Potions",
    description: "Healing and enhancement potions",
    icon: Zap,
    color: "bg-red-500",
    category: "Consumables",
    items: ["Healing Potions", "Enhancement Potions", "Utility Potions", "Magical Brews"]
  },
  {
    name: "Power Leveling",
    description: "Character leveling services",
    icon: Target,
    color: "bg-orange-500",
    category: "Services",
    items: ["Leveling Services", "Character Development", "Skill Training", "Experience Boosts"]
  },
  {
    name: "Powerscrolls",
    description: "Scrolls to increase skill caps",
    icon: ScrollText,
    color: "bg-blue-500",
    category: "Scrolls",
    items: ["Skill Cap Scrolls", "Power Scrolls", "Enhancement Items", "Training Materials"]
  },
  {
    name: "Rares",
    description: "Rare and collectible items",
    icon: Trophy,
    color: "bg-yellow-500",
    category: "Collectibles",
    items: ["Rare Items", "Collectibles", "Unique Items", "Special Equipment"]
  },
  {
    name: "Reagents",
    description: "Spell casting materials",
    icon: BookOpen,
    color: "bg-green-500",
    category: "Materials",
    items: ["Spell Reagents", "Casting Materials", "Magical Supplies", "Enchanted Items"]
  },
  {
    name: "Recipes",
    description: "Crafting instructions and patterns",
    icon: BookOpen,
    color: "bg-brown-500",
    category: "Crafting",
    items: ["Crafting Recipes", "Instructions", "Patterns", "Crafting Guides"]
  },
  {
    name: "Resources",
    description: "Raw materials for crafting",
    icon: Hammer,
    color: "bg-gray-500",
    category: "Materials",
    items: ["Raw Materials", "Crafting Supplies", "Resources", "Base Materials"]
  },
  {
    name: "Runics",
    description: "Magical crafting tools",
    icon: Zap,
    color: "bg-purple-500",
    category: "Tools",
    items: ["Runic Tools", "Magical Crafting", "Enchanted Tools", "Crafting Equipment"]
  },
  {
    name: "Shard Bound",
    description: "Server-specific bound items",
    icon: Crown,
    color: "bg-indigo-500",
    category: "Server Specific",
    items: ["Bound Items", "Server Specific", "Unique Equipment", "Special Items"]
  },
  {
    name: "Shields",
    description: "Defensive equipment and protection",
    icon: Shield,
    color: "bg-blue-500",
    category: "Equipment",
    items: ["Defensive Shields", "Protection Items", "Blocking Equipment", "Defense Gear"]
  },
  {
    name: "Ships",
    description: "Maritime vessels and boats",
    icon: Ship,
    color: "bg-cyan-500",
    category: "Transportation",
    items: ["Maritime Vessels", "Boats", "Ships", "Water Transportation"]
  },
  {
    name: "SOT Scrolls",
    description: "Scrolls of Transcendence",
    icon: ScrollText,
    color: "bg-purple-500",
    category: "Scrolls",
    items: ["Transcendence Scrolls", "Power Scrolls", "Enhancement Items", "Training Materials"]
  },
  {
    name: "Special Deals",
    description: "Limited time offers and discounts",
    icon: Gift,
    color: "bg-red-500",
    category: "Offers",
    items: ["Limited Offers", "Discounts", "Special Prices", "Deals"]
  },
  {
    name: "Spellbooks",
    description: "Magical books and spell tomes",
    icon: BookOpen,
    color: "bg-purple-500",
    category: "Magic",
    items: ["Spell Books", "Magic Tomes", "Enchanted Books", "Magical Items"]
  },
  {
    name: "Statues",
    description: "Decorative statues and monuments",
    icon: Trophy,
    color: "bg-gray-500",
    category: "Decorations",
    items: ["Decorative Statues", "Monuments", "Ornamental Items", "House Decor"]
  },
  {
    name: "Time of Legends",
    description: "Time of Legends specific items",
    icon: Clock,
    color: "bg-orange-500",
    category: "Server Specific",
    items: ["Legends Items", "Server Specific", "Unique Equipment", "Special Items"]
  },
  {
    name: "Tokens",
    description: "Special currency and tokens",
    icon: Coins,
    color: "bg-yellow-500",
    category: "Currency",
    items: ["Special Tokens", "Event Currency", "Unique Money", "Special Items"]
  },
  {
    name: "Veteran Rewards",
    description: "Rewards for long-term players",
    icon: Trophy,
    color: "bg-green-500",
    category: "Rewards",
    items: ["Veteran Items", "Long-term Rewards", "Special Equipment", "Recognition Items"]
  },
  {
    name: "Weapons",
    description: "Combat weapons and arms",
    icon: Sword,
    color: "bg-red-500",
    category: "Equipment",
    items: ["Combat Weapons", "Arms", "Fighting Equipment", "Battle Gear"]
  }
]

const categories = [
  { name: "Equipment", icon: Sword, color: "bg-red-500" },
  { name: "Materials", icon: Hammer, color: "bg-gray-500" },
  { name: "Currency", icon: Coins, color: "bg-yellow-500" },
  { name: "Scrolls", icon: Scroll, color: "bg-blue-500" },
  { name: "Services", icon: Crown, color: "bg-purple-500" },
  { name: "Cosmetics", icon: Zap, color: "bg-pink-500" },
  { name: "Decorations", icon: Home, color: "bg-brown-500" },
  { name: "Transportation", icon: Ship, color: "bg-cyan-500" }
]

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Store", current: true }
              ]} 
            />
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UOKing Store
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your one-stop shop for all Ultima Online items. 
              From basic equipment to rare artifacts, we have everything you need to succeed in your adventures.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.name}
                    variant="outline"
                    className="border-amber-200 hover:bg-amber-50"
                    asChild
                  >
                    <Link href={`/store/category/${category.name.toLowerCase()}`}>
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category.name}
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Store Items Grid - ULTRA COMPRESSED */}
          <div className="grid gap-1 mb-12" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
            {storeData.map((item) => {
              const IconComponent = item.icon
              return (
                <Card key={item.name} className="group hover:shadow-sm transition-all duration-300 border-amber-200 h-full">
                  <CardHeader className="pb-0.5 px-2 pt-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className={`p-0.5 rounded-full ${item.color} text-white`}>
                        <IconComponent className="h-2 w-2" />
                      </div>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-[10px] font-bold text-gray-900 leading-tight">
                      {item.name}
                    </CardTitle>
                    <p className="text-gray-600 text-[9px] leading-tight line-clamp-1">{item.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-0.5 px-2 pb-2">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-gray-900 text-[9px]">Items:</h4>
                      <div className="flex flex-wrap gap-0.5">
                        {item.items.slice(0, 1).map((subItem) => (
                          <Badge key={subItem} variant="outline" className="text-[8px] px-1 py-0">
                            {subItem}
                          </Badge>
                        ))}
                        {item.items.length > 1 && (
                          <Badge variant="outline" className="text-[8px] px-1 py-0">
                            +{item.items.length - 1}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-[9px] h-6"
                      size="sm"
                      asChild
                    >
                      <Link href={`/store/${item.name.toLowerCase().replace(' ', '-')}`}>
                        View
                        <ArrowUp className="h-2 w-2 ml-0.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Featured Categories */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Store Categories
              </h2>
              <p className="text-gray-600">
                These categories are most frequently browsed by our customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => {
                const IconComponent = category.icon
                return (
                  <div key={category.name} className="text-center group">
                    <div className={`inline-flex p-4 rounded-full ${category.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/store/category/${category.name.toLowerCase()}`}>
                        Browse Category
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">40+</h3>
                <p className="text-gray-600">Store Categories</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">5000+</h3>
                <p className="text-gray-600">Store Items</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-amber-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">8</h3>
                <p className="text-gray-600">Main Categories</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Shop?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our extensive collection of Ultima Online items and find everything you need for your adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/store">
                  Browse All Items
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600" asChild>
                <Link href="/contact">
                  Get Expert Advice
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