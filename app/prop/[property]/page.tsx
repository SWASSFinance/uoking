import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ProductImage } from "@/components/ui/product-image"
import { Sword, ArrowUp, Star, Target, Zap, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Metadata } from 'next'
import { getProducts } from "@/lib/db"
import { ProductsGrid } from "@/components/products-grid"

interface PropertyPageProps {
  params: Promise<{ property: string }>
}

interface Product {
  id: string | number
  name: string
  slug: string
  price: string
  sale_price?: string
  image_url?: string
  short_description?: string
  featured: boolean
  avg_rating: number
  review_count: number
  category?: string
  stats?: any[]
}

// Helper function to convert URL slug to property name
function slugToPropertyName(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Property descriptions and icons
const propertyInfo = {
  "Damage Increase": {
    description: "Increase your weapon damage and become a more formidable fighter. Damage Increase is one of the most important combat properties in Ultima Online.",
    icon: Sword,
    color: "from-red-500 to-red-600",
    category: "Combat"
  },
  "Defense Chance Increase": {
    description: "Improve your chance to avoid attacks and increase your survivability in combat. Essential for any defensive build.",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    category: "Defense"
  },
  "Enhance Potions": {
    description: "Make your potions more effective and get better value from your healing items. Perfect for characters who rely on potions.",
    icon: Zap,
    color: "from-green-500 to-green-600",
    category: "Utility"
  },
  "Faster Cast Recovery": {
    description: "Reduce spell casting delay and cast spells more frequently. Essential for mages and spellcasters.",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    category: "Magic"
  },
  "Faster Casting": {
    description: "Increase your spell casting speed and become a more effective spellcaster. Perfect for mage builds.",
    icon: Zap,
    color: "from-yellow-500 to-yellow-600",
    category: "Magic"
  },
  "Hit Chance Increase": {
    description: "Improve your accuracy in combat and land more successful attacks. Essential for any combat build.",
    icon: Target,
    color: "from-orange-500 to-orange-600",
    category: "Combat"
  },
  "Hit Point Regeneration": {
    description: "Automatically regenerate health over time and improve your survivability. Great for PvE and sustained combat.",
    icon: Star,
    color: "from-pink-500 to-pink-600",
    category: "Defense"
  },
  "Lower Mana Cost": {
    description: "Reduce spell mana consumption and cast more spells with the same mana pool. Essential for mage efficiency.",
    icon: Zap,
    color: "from-indigo-500 to-indigo-600",
    category: "Magic"
  },
  "Lower Reagent Cost": {
    description: "Reduce spell reagent usage and save on casting costs. Perfect for mages who cast frequently.",
    icon: Star,
    color: "from-teal-500 to-teal-600",
    category: "Magic"
  },
  "Mana Regeneration": {
    description: "Automatically regenerate mana over time and maintain sustained spellcasting. Essential for mage builds.",
    icon: Zap,
    color: "from-cyan-500 to-cyan-600",
    category: "Magic"
  },
  "Spell Channeling": {
    description: "Allow movement while casting spells and gain a significant advantage in combat. Perfect for mobile mages.",
    icon: Zap,
    color: "from-violet-500 to-violet-600",
    category: "Magic"
  },
  "Spell Damage Increase": {
    description: "Increase magical damage output and become a more powerful spellcaster. Essential for offensive mage builds.",
    icon: Zap,
    color: "from-rose-500 to-rose-600",
    category: "Magic"
  },
  "Stamina Regeneration": {
    description: "Automatically regenerate stamina and maintain peak performance in combat. Essential for melee characters.",
    icon: Star,
    color: "from-emerald-500 to-emerald-600",
    category: "Utility"
  },
  "Swing Speed Increase": {
    description: "Increase weapon attack speed and deal more damage over time. Perfect for melee DPS builds.",
    icon: Sword,
    color: "from-amber-500 to-amber-600",
    category: "Combat"
  }
}

// Generate metadata for the property page
export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { property: propertySlug } = await params
  
  // Convert URL parameter to readable property name
  const propertyName = slugToPropertyName(propertySlug)
  
  // Create SEO-friendly title and description format (always use our format, ignore database meta fields)
  const seoTitle = `UO ${propertyName} - Buy Ultima Online ${propertyName} At Cheap Prices | UO King`
  const seoDescription = `Buy ${propertyName} for Ultima Online at UO King. Fast delivery, competitive prices, and 24/7 support. Get your ${propertyName.toLowerCase()} now!`

  // Try to get a featured product image for OpenGraph/Twitter card (optional, won't break if it fails)
  let imageUrl: string | undefined
  try {
    const products = await getProducts({ 
      search: propertyName, 
      limit: 1 
    })
    if (products.length > 0 && products[0].image_url) {
      // Check if the image URL is already a full URL (starts with http/https)
      if (products[0].image_url.startsWith('http://') || products[0].image_url.startsWith('https://')) {
        imageUrl = products[0].image_url
      } else {
        // Only prepend base URL if it's a relative path
        imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}${products[0].image_url}`
      }
    }
  } catch (error) {
    // Silently fail - image is optional for metadata
    console.log('Could not fetch product image for metadata:', error)
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: `${propertyName}, Ultima Online, UO, ${propertyName.toLowerCase()}, buy ${propertyName.toLowerCase()}, cheap ${propertyName.toLowerCase()}, gaming items`,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/prop/${propertySlug}`,
      siteName: 'UO King',
      locale: 'en_US',
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${propertyName} - Ultima Online`,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      ...(imageUrl && {
        images: [imageUrl],
      }),
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { property: propertySlug } = await params
  
  // Convert URL slug back to property name
  const propertyName = slugToPropertyName(propertySlug)
  const currentProperty = propertyInfo[propertyName as keyof typeof propertyInfo]
  const IconComponent = currentProperty?.icon || Sword

  // Search for products containing the property name
  let products: Product[] = []
  try {
    products = await getProducts({ 
      search: propertyName, 
      limit: 50 
    })
  } catch (error) {
    console.error('Error loading property data:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb 
              items={[
                { label: "Properties", href: "/prop" },
                { label: propertyName, current: true }
              ]} 
            />
          </div>

          {/* Property Header */}
          <div className="mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200 dark:border-gray-600">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 -mt-4">
                  <div className={`w-full h-full rounded-lg bg-gradient-to-r ${currentProperty?.color || 'from-amber-500 to-amber-600'} flex items-center justify-center`}>
                    <IconComponent className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 mt-6">Ultima Online {propertyName} Items</h1>
                  <div className="prose prose-amber max-w-none">
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {currentProperty?.description || `Items with ${propertyName} property`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details - Compact Version */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-amber-200 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What is Property */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Star className="h-5 w-5 text-amber-500 mr-2" />
                  What is {propertyName}?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {propertyName} is a property that enhances your character's abilities in Ultima Online. 
                  It's one of the most sought-after properties for optimizing your build.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Enhances performance
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Works with various equipment
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-400 mr-1" />
                    Stacks with other properties
                  </div>
                </div>
              </div>

              {/* How to Get Property */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-5 w-5 text-blue-500 mr-2" />
                  How to Get {propertyName}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Target className="h-4 w-4 text-blue-400 mr-2" />
                    Find items with {propertyName}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Zap className="h-4 w-4 text-purple-400 mr-2" />
                    Use enhancement materials
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Sword className="h-4 w-4 text-green-400 mr-2" />
                    Craft items with {propertyName}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {propertyName} Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {products.length} {products.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 && (
            <ProductsGrid products={products} />
          )}

          {/* No Items Found */}
          {products.length === 0 && (
            <div className="text-center mb-12">
              <Card className="border-amber-200 dark:border-gray-600 max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Items Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    We couldn't find any items with the {propertyName} property. 
                    Try browsing our general store for similar items.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href="/store">
                      Browse All Items
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Section */}
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-amber-200 dark:border-gray-600">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Tips for Maximizing {propertyName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Equipment Strategy</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Focus on items that complement your build
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Look for items with multiple beneficial properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Consider the trade-off with other properties
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Build Optimization</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Combine with complementary properties
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Balance with your character's strengths
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                    Test different combinations for best results
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Enhance Your Equipment?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Browse our selection of equipment with {propertyName} properties.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/store">
                Browse Equipment
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 