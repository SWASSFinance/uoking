import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://uoking.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/checkout',
          '/cart',
          '/account',
          '/debug-session',
          '/paypal/',
          '/*?*', // Disallow URLs with query parameters to avoid duplicate content
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's web crawler
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl bot
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai', // Anthropic's crawler
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
