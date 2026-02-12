import type { Metadata } from 'next'
import { getProductBySlugOptimized } from '@/lib/db-optimized'

// This function generates metadata for each product page
export async function generateMetadata({
  params
}: {
  params: Promise<{ 'product-name': string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const productSlug = resolvedParams['product-name']

  // Create safe fallback metadata first
  const fallbackTitle = `${productSlug.replace(/-/g, ' ')} - UO King | Ultima Online Items`
  const fallbackDescription = `Buy ${productSlug.replace(/-/g, ' ')} for Ultima Online. Premium quality items with fast delivery and 24/7 support.`

  try {
    // Fetch product data directly from database (no API call needed)
    const product = await getProductBySlugOptimized(productSlug)

    if (!product) {
      // Fallback metadata if product not found - still allow indexing for SEO
      return {
        title: fallbackTitle,
        description: fallbackDescription,
        keywords: `${productSlug.replace(/-/g, ' ')}, Ultima Online, UO, buy UO items, UO King, premium items, fast delivery`,
        robots: {
          index: true, // ✅ Allow indexing even for fallback
          follow: true,
        },
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          url: `https://uoking.com/product/${productSlug}`,
          siteName: 'UO King',
          locale: 'en_US',
          type: 'website',
        },
        twitter: {
          card: 'summary',
          title: fallbackTitle,
          description: fallbackDescription,
        },
        alternates: {
          canonical: `https://uoking.com/product/${productSlug}`,
        },
      }
    }

    // Get primary category info
    const primaryCategory = product.categories?.find((c: any) => c.is_primary) || product.categories?.[0]
    const categoryName = primaryCategory?.name || 'Items'
    const categorySlug = primaryCategory?.slug

    // Generate optimized SEO title (under 60 chars for Google)
    const title = `Buy ${product.name} | Ultima Online - UO King`

    // Generate compelling meta description (under 160 chars)
    const shortDesc = product.short_description?.substring(0, 100) || ''
    const description = shortDesc
      ? `${shortDesc} Fast delivery, secure payment, 24/7 support. Get your ${product.name} today!`
      : `Buy ${product.name} for Ultima Online. Premium ${categoryName.toLowerCase()} with instant delivery, competitive prices & 5% cashback. In stock now!`

    // Comprehensive keywords for SEO
    const keywords = [
      product.name,
      `buy ${product.name}`,
      `${product.name} UO`,
      'Ultima Online',
      'UO items',
      categoryName,
      `buy ${categoryName}`,
      'UO King',
      'ultima online items for sale',
      'cheap UO items',
      'fast delivery'
    ].filter(Boolean).join(', ')

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'
    const canonicalUrl = `https://uoking.com/product/${productSlug}`

    return {
      title,
      description,
      keywords,
      robots: {
        index: true, // ✅ Always allow indexing
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      openGraph: {
        title: `${product.name} - Ultima Online Item`,
        description,
        url: canonicalUrl,
        siteName: 'UO King',
        locale: 'en_US',
        type: 'website',
        images: product.image_url ? [
          {
            url: product.image_url.startsWith('http') ? product.image_url : `${baseUrl}${product.image_url}`,
            width: 800,
            height: 600,
            alt: `${product.name} - Ultima Online`,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - Ultima Online`,
        description,
        images: product.image_url ? [
          product.image_url.startsWith('http') ? product.image_url : `${baseUrl}${product.image_url}`
        ] : undefined,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    }
  } catch (error) {
    // Log error but don't crash - return safe fallback
    console.error('Error generating product metadata:', error)

    // Even on error, create SEO-friendly fallback with indexing enabled
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: `${productSlug.replace(/-/g, ' ')}, Ultima Online, UO, buy UO items, UO King, premium items, fast delivery`,
      robots: {
        index: true, // ✅ Allow indexing even on error
        follow: true,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: `https://uoking.com/product/${productSlug}`,
        siteName: 'UO King',
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: fallbackTitle,
        description: fallbackDescription,
      },
      alternates: {
        canonical: `https://uoking.com/product/${productSlug}`,
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
