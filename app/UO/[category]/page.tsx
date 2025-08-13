import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowLeft, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getCategories, getProducts, getCategoryBySlug } from '@/lib/db'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

// Helper function to convert URL format to database format
function urlToCategoryName(urlCategory: string) {
  return urlCategory.replace(/_/g, ' ')
}

// Helper function to create slug for database lookup
function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params
  
  // Convert URL parameter to readable category name
  const categoryName = urlToCategoryName(categoryParam)
  const categorySlug = createSlug(categoryName)
  
  // Try to find the category by slug
  let category
  try {
    category = await getCategoryBySlug(categorySlug)
  } catch (error) {
    console.error('Error fetching category:', error)
  }

  // If no category found, try to find by name (case insensitive)
  if (!category) {
    try {
      const allCategories = await getCategories()
      category = allCategories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      )
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // If still no category found, redirect to store
  if (!category) {
    redirect('/store')
  }

  // Fetch products for this category
  let products = []
  try {
    products = await getProducts({ 
      categoryId: category.id,
      limit: 50 
    })
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/store" className="hover:text-amber-600 transition-colors">
            Store
          </Link>
          <span>/</span>
          <span className="text-amber-600 font-medium">{category.name}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/store">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
            {category.image_url && (
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{category.name}</h1>
                  {category.description && (
                    <div className="prose prose-amber max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {category.description.split('\n\n')[0]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {!category.image_url && (
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{category.name}</h1>
                {category.description && (
                  <div className="prose prose-amber max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {category.description.split('\n\n')[0]}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {category.name} Products
            </h2>
            <p className="text-gray-600">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-amber-200">
                <CardContent className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <div className="aspect-square relative mb-4 bg-gray-50 rounded-lg overflow-hidden">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-amber-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price) ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-amber-600">
                              ${parseFloat(product.sale_price).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(product.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-amber-600">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {product.avg_rating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">
                            {parseFloat(product.avg_rating).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({product.review_count})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {product.available_shards && product.available_shards.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          Available on: {product.available_shards.join(', ')}
                        </span>
                      </div>
                    )}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-amber-200">
              <div className="mb-4">
                <Grid className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600 mb-6">
                We don't have any products in this category yet, but we're always adding new items!
              </p>
              <Button asChild>
                <Link href="/store">
                  Browse Other Categories
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Category Description (Full) */}
        {category.description && category.description.includes('\n\n') && (
          <div className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                About {category.name}
              </h3>
              <div className="prose prose-amber max-w-none">
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: category.description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params
  const categoryName = urlToCategoryName(categoryParam)
  const categorySlug = createSlug(categoryName)
  
  let category
  try {
    category = await getCategoryBySlug(categorySlug)
  } catch (error) {
    // Fallback to dynamic title
    return {
      title: `${categoryName} - UO King`,
      description: `Shop ${categoryName} items for Ultima Online at UO King. Fast delivery, competitive prices, and 24/7 support.`
    }
  }

  if (!category) {
    return {
      title: `${categoryName} - UO King`,
      description: `Shop ${categoryName} items for Ultima Online at UO King. Fast delivery, competitive prices, and 24/7 support.`
    }
  }

  return {
    title: category.meta_title || `${category.name} - UO King`,
    description: category.meta_description || category.description?.substring(0, 160) || `Shop ${category.name} items for Ultima Online at UO King.`
  }
} 