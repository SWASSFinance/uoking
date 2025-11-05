import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductImage } from "@/components/ui/product-image"
import { Star, ShoppingCart, Crown, Shield, Zap, Target, Eye, Hand, Hammer, Users, Sword } from "lucide-react"
import Link from "next/link"
import { Metadata } from 'next'
import { getProducts, getClasses } from '@/lib/db'
import { ProductsGrid } from "@/components/products-grid"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ClassPageProps {
  params: Promise<{ class: string }>
}

interface ClassData {
  id: string
  name: string
  slug: string
  description: string
  image_url?: string
  primary_stats: string[]
  skills: string[]
  playstyle: string
  difficulty_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Icon mapping for classes
const classIcons: { [key: string]: any } = {
  'mage': Zap,
  'tamer': Users,
  'melee': Sword,
  'ranged': Target,
  'thief': Eye,
  'crafter': Hammer,
  'default': Shield
}

// Color mapping for classes
const classColors: { [key: string]: string } = {
  'mage': 'from-purple-500 to-purple-600',
  'tamer': 'from-green-500 to-green-600',
  'melee': 'from-red-500 to-red-600',
  'ranged': 'from-blue-500 to-blue-600',
  'thief': 'from-gray-500 to-gray-600',
  'crafter': 'from-yellow-500 to-yellow-600',
  'default': 'from-amber-500 to-amber-600'
}

// Helper function to convert URL slug to class name
function slugToClassName(slug: string) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Generate metadata for the class page
export async function generateMetadata({ params }: ClassPageProps): Promise<Metadata> {
  const { class: classSlug } = await params
  
  // Convert URL parameter to readable class name
  const className = slugToClassName(classSlug)
  
  // Create SEO-friendly title and description format (always use our format, ignore database meta fields)
  const seoTitle = `UO ${className} - Buy Ultima Online ${className} At Cheap Prices | UO King`
  const seoDescription = `Buy ${className} for Ultima Online at UO King. Fast delivery, competitive prices, and 24/7 support. Get your ${className.toLowerCase()} now!`

  // Try to get a featured product image for OpenGraph/Twitter card (optional, won't break if it fails)
  let imageUrl: string | undefined
  try {
    // First get the class data to get the class ID
    const classes = await getClasses()
    const normalizedSlug = classSlug.toLowerCase()
    
    // Try exact match first, then case-insensitive
    let foundClass = classes.find((cls: any) => cls.slug === classSlug && cls.is_active)
    if (!foundClass) {
      foundClass = classes.find((cls: any) => 
        cls.slug.toLowerCase() === normalizedSlug && cls.is_active
      )
    }
    
    if (foundClass) {
      const products = await getProducts({ 
        classId: foundClass.id, 
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
    }
  } catch (error) {
    // Silently fail - image is optional for metadata
    console.log('Could not fetch product image for metadata:', error)
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: `${className}, Ultima Online, UO, ${className.toLowerCase()}, buy ${className.toLowerCase()}, cheap ${className.toLowerCase()}, gaming items`,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/Class/${classSlug}`,
      siteName: 'UO King',
      locale: 'en_US',
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${className} - Ultima Online`,
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

export default async function ClassPage({ params }: ClassPageProps) {
  const { class: classSlug } = await params
  
  // Normalize slug to lowercase for matching
  const normalizedSlug = classSlug.toLowerCase()
  
  // Fetch class data from database
  let classData: ClassData | null = null
  let products: any[] = []
  
  try {
    const classes = await getClasses()
    // Try exact match first (case-sensitive)
    classData = classes.find((cls: ClassData) => cls.slug === classSlug && cls.is_active)
    
    // If not found, try case-insensitive match
    if (!classData) {
      classData = classes.find((cls: ClassData) => 
        cls.slug.toLowerCase() === normalizedSlug && cls.is_active
      )
    }
  } catch (error) {
    console.error('Error fetching class data:', error)
  }

  // If no class found, return 404
  if (!classData) {
    console.log(`Class not found for slug: ${classSlug} (normalized: ${normalizedSlug})`)
    notFound()
  }

  // Fetch products for this class
  try {
    if (classData) {
      products = await getProducts({ 
        classId: classData.id, 
        limit: 100 
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  const IconComponent = classIcons[classData.slug] || classIcons.default
  const classColor = classColors[classData.slug] || classColors.default
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/class" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Classes
            </Link>
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">{classData.name}</span>
          </nav>

          {/* Class Header */}
          <div className="mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200 dark:border-gray-600">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 -mt-4">
                  {classData.image_url ? (
                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg relative">
                      <ProductImage
                        src={classData.image_url}
                        alt={classData.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-full rounded-lg bg-gradient-to-r ${classColor} flex items-center justify-center`}>
                      <IconComponent className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 mt-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">UO {classData.name} Items</h1>
                    {classData.difficulty_level <= 2 && (
                      <Badge className="bg-amber-500 text-white">Popular Class</Badge>
                    )}
                  </div>
                  <div className="prose prose-amber max-w-none">
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {classData.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                {classData.name} Products
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {products.length} {products.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products available for this class yet.</p>
            </div>
          )}

          {/* Class Features */}
          {classData.primary_stats && classData.primary_stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 mb-12">
              {classData.primary_stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-600">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{stat}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All Products Button */}
          {products && products.length > 0 && (
            <div className="text-center mt-8 mb-12">
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                <Link href="/store">
                  View All Items
                </Link>
              </Button>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
} 