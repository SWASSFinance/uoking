"use client"

interface ProductStructuredDataProps {
  product: {
    id: number
    name: string
    slug: string
    description: string
    short_description?: string
    price: string
    sale_price?: string
    image_url?: string
    avg_rating?: number
    review_count?: number
    category_name?: string
    type?: string
  }
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  // Safely handle missing product data
  if (!product || !product.slug || !product.name) {
    return null
  }

  const baseUrl = 'https://uoking.com'
  const productUrl = `${baseUrl}/product/${product.slug}`

  const price = product.sale_price || product.price
  const regularPrice = product.price

  // Product schema for rich snippets
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Ultima Online ${product.name}`,
    description: product.short_description || product.description?.substring(0, 200) || `Buy ${product.name} for Ultima Online`,
    image: product.image_url || `${baseUrl}/uo-king-logo.png`,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'UO King',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: parseFloat(price),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'UO King',
        url: baseUrl,
      },
    },
  }

  // Add aggregate rating if reviews exist
  if (product.review_count && product.review_count > 0 && product.avg_rating) {
    productSchema['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: product.avg_rating,
      reviewCount: product.review_count,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Add category if available
  if (product.category_name) {
    productSchema['category'] = product.category_name
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Store',
        item: `${baseUrl}/store`,
      },
      product.category_name ? {
        '@type': 'ListItem',
        position: 3,
        name: product.category_name,
        item: `${baseUrl}/UO/${product.category_name.toLowerCase().replace(/\s+/g, '-')}`,
      } : null,
      {
        '@type': 'ListItem',
        position: product.category_name ? 4 : 3,
        name: product.name,
        item: productUrl,
      },
    ].filter(Boolean),
  }

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UO King',
    url: baseUrl,
    logo: `${baseUrl}/uo-king-logo.png`,
    description: 'Premium Ultima Online items, gold, and services. Fast delivery, secure payments, and 24/7 support.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
    sameAs: [
      // Add social media profiles here if available
    ],
  }

  return (
    <>
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  )
}
