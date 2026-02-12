import { MetadataRoute } from 'next'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://uoking.com'

  try {
    // Fetch all active products
    const productsResult = await query(`
      SELECT slug, updated_at, created_at
      FROM products
      WHERE status = 'active'
      ORDER BY updated_at DESC
    `)

    // Fetch all active categories
    const categoriesResult = await query(`
      SELECT slug, updated_at, created_at
      FROM categories
      WHERE status = 'active'
      ORDER BY updated_at DESC
    `)

    // Fetch all skills
    const skillsResult = await query(`
      SELECT slug, updated_at, created_at
      FROM skills
      ORDER BY updated_at DESC
    `)

    // Static pages with priority and update frequency
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/store`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/skills`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/class`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      // Guide pages
      {
        url: `${baseUrl}/guides/how-to-start-playing`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/guides/beginners-guide`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/guides/download-uo-client`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/character-creation`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/skill-system`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/combat-mechanics`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/housing-in-uo`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/crafting-resources`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/how-to-farm-gold`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/client-comparison`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/guides/uo-enhanced-client-setup`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/guides/uo-3d-client-installation`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      // Shard pages
      {
        url: `${baseUrl}/shards/which-shard-to-play`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/shards/uo-shard-list`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      // Other pages
      {
        url: `${baseUrl}/em-events`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/event-rares`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/maps`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/landmap`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.2,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.2,
      },
    ]

    // Product pages - HIGH PRIORITY for indexing
    const productPages = productsResult.rows.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // High priority for product pages
    }))

    // Category pages
    const categoryPages = categoriesResult.rows.map((category) => ({
      url: `${baseUrl}/UO/${category.slug}`,
      lastModified: new Date(category.updated_at || category.created_at),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }))

    // Skill pages
    const skillPages = skillsResult.rows.map((skill) => ({
      url: `${baseUrl}/skills/${skill.slug}`,
      lastModified: new Date(skill.updated_at || skill.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Combine all pages
    return [
      ...staticPages,
      ...categoryPages,
      ...productPages,
      ...skillPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return minimal sitemap on error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
    ]
  }
}
