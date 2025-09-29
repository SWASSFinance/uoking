import type { Metadata } from 'next'

// This function generates metadata for each product page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ 'product-name': string }> 
}): Promise<Metadata> {
  const resolvedParams = await params
  const productSlug = resolvedParams['product-name']
  
  try {
    // Fetch product data to generate dynamic metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/by-slug/${productSlug}`, {
      cache: 'force-cache' // Cache the metadata for better performance
    })
    
    if (!response.ok) {
      // Fallback metadata if product not found
      return {
        title: "Product Not Found - UO King",
        description: "The requested Ultima Online product could not be found. Browse our collection of premium UO items, gold, and services.",
        robots: {
          index: false,
          follow: true,
        }
      }
    }
    
    const data = await response.json()
    const product = data.product
    
    if (!product) {
      return {
        title: "Product Not Found - UO King",
        description: "The requested Ultima Online product could not be found. Browse our collection of premium UO items, gold, and services.",
        robots: {
          index: false,
          follow: true,
        }
      }
    }
    
    // Generate dynamic metadata based on product data
    const title = `${product.name} - UO King | Ultima Online ${product.category_name || 'Items'}`
    const description = product.short_description 
      ? `${product.short_description} - Buy ${product.name} for Ultima Online. Fast delivery, competitive prices, and 24/7 support.`
      : `Buy ${product.name} for Ultima Online. Premium quality ${product.category_name?.toLowerCase() || 'items'} with fast delivery and 24/7 support.`
    
    const keywords = [
      product.name,
      'Ultima Online',
      'UO',
      product.category_name || 'items',
      'buy UO items',
      'UO King',
      'premium items',
      'fast delivery'
    ].filter(Boolean).join(', ')
    
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/product/${productSlug}`,
        siteName: 'UO King',
        locale: 'en_US',
        type: 'website',
        images: product.image_url ? [
          {
            url: product.image_url,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image_url ? [product.image_url] : undefined,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/product/${productSlug}`,
      },
    }
  } catch (error) {
    console.error('Error generating product metadata:', error)
    
    // Fallback metadata on error
    return {
      title: `${productSlug.replace(/-/g, ' ')} - UO King | Ultima Online Items`,
      description: `Buy ${productSlug.replace(/-/g, ' ')} for Ultima Online. Premium quality items with fast delivery and 24/7 support.`,
      keywords: `${productSlug.replace(/-/g, ' ')}, Ultima Online, UO, buy UO items, UO King, premium items, fast delivery`,
      openGraph: {
        title: `${productSlug.replace(/-/g, ' ')} - UO King | Ultima Online Items`,
        description: `Buy ${productSlug.replace(/-/g, ' ')} for Ultima Online. Premium quality items with fast delivery and 24/7 support.`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'}/product/${productSlug}`,
        siteName: 'UO King',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: `${productSlug.replace(/-/g, ' ')} - UO King | Ultima Online Items`,
        description: `Buy ${productSlug.replace(/-/g, ' ')} for Ultima Online. Premium quality items with fast delivery and 24/7 support.`,
      },
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
