import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ProductImage } from '@/components/ui/product-image'
import { Star, ArrowLeft, Filter, Grid, List, ShoppingCart, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import CategoryClient from './category-client'
import { Metadata } from 'next'


interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
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
  category_names?: string
  stats?: any[]
}

interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
  meta_title?: string
  meta_description?: string
}

// Helper function to convert URL format to database format
function urlToCategoryName(urlCategory: string) {
  return urlCategory.replace(/-/g, ' ')
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

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: catParam } = await params
  
  // Convert URL parameter to readable category name
  const categoryName = urlToCategoryName(catParam)
  
  // Create SEO-friendly title and description format (always use our format, ignore database meta fields)
  const seoTitle = `UO ${categoryName} - Buy Ultima Online ${categoryName} At Cheap Prices | UO King`
  const seoDescription = `Buy ${categoryName} for Ultima Online at UO King. Fast delivery, competitive prices, and 24/7 support. Get your ${categoryName.toLowerCase()} now!`

  // Try to get the category image for OpenGraph/Twitter card (optional, won't break if it fails)
  let imageUrl: string | undefined
  try {
    const categorySlug = createSlug(categoryName)
    const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/api/categories/${categorySlug}`)
    if (categoryResponse.ok) {
      const foundCategory = await categoryResponse.json()
      if (foundCategory.image_url) {
        imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}${foundCategory.image_url}`
      }
    }
  } catch (error) {
    // Silently fail - image is optional for metadata
    console.log('Could not fetch category image for metadata:', error)
  }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: `${categoryName}, Ultima Online, UO, ${categoryName.toLowerCase()}, buy ${categoryName.toLowerCase()}, cheap ${categoryName.toLowerCase()}, gaming items`,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/UO/${catParam}`,
      siteName: 'UO King',
      locale: 'en_US',
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${categoryName} - Ultima Online`,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: catParam } = await params
  
  // Convert URL parameter to readable category name
  const categoryName = urlToCategoryName(catParam)
  const categorySlug = createSlug(categoryName)
  
  // Try to find the category by slug
  let foundCategory
  let categoryProducts = []
  
  try {
    const categoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/api/categories/${categorySlug}`)
    if (categoryResponse.ok) {
      foundCategory = await categoryResponse.json()
      
      // If category found, fetch products
      if (foundCategory) {
        try {
          const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/api/products?categoryId=${foundCategory.id}&limit=100`)
          if (productsResponse.ok) {
            categoryProducts = await productsResponse.json()
          }
        } catch (error) {
          console.error('Error fetching products:', error)
        }
      }
    }
  } catch (error) {
    console.error('Error fetching category:', error)
  }

  // If no category found, try to find by name (case insensitive)
  if (!foundCategory) {
    try {
      const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/api/categories`)
      if (categoriesResponse.ok) {
        const allCategories = await categoriesResponse.json()
        foundCategory = allCategories.find((cat: any) => 
          cat.name.toLowerCase() === categoryName.toLowerCase()
        )
        
        // If category found, fetch products
        if (foundCategory) {
          try {
            const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/api/products?categoryId=${foundCategory.id}&limit=100`)
            if (productsResponse.ok) {
              categoryProducts = await productsResponse.json()
            }
          } catch (error) {
            console.error('Error fetching products:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Create a fallback category object if none found in database
  if (!foundCategory) {
    foundCategory = {
      id: 'fallback',
      name: categoryName,
      description: `Browse ${categoryName} items at UO King. Premium Ultima Online items, fast delivery, and competitive prices.`,
      image_url: null,
      slug: categorySlug
    }
  }

  return <CategoryClient category={foundCategory} products={categoryProducts} categoryParam={catParam} />
}

 