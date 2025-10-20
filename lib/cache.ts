// Redis-based caching layer for Vercel optimization
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_URL!.split('@')[0].split('://')[1] || '',
})

// Cache configuration
const CACHE_TTL = {
  PRODUCTS: 3600, // 1 hour
  CATEGORIES: 7200, // 2 hours
  USER_PROFILE: 1800, // 30 minutes
  MAP_IMAGES: 86400, // 24 hours
  STATIC_DATA: 14400, // 4 hours
}

export class CacheManager {
  // Generic cache methods
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T | null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  // Product-specific caching
  static async getProduct(slug: string) {
    return this.get(`product:${slug}`)
  }

  static async setProduct(slug: string, product: any) {
    return this.set(`product:${slug}`, product, CACHE_TTL.PRODUCTS)
  }

  static async invalidateProduct(slug: string) {
    return this.del(`product:${slug}`)
  }

  // Category caching
  static async getCategories() {
    return this.get('categories:all')
  }

  static async setCategories(categories: any[]) {
    return this.set('categories:all', categories, CACHE_TTL.CATEGORIES)
  }

  // User profile caching
  static async getUserProfile(userId: string) {
    return this.get(`user:profile:${userId}`)
  }

  static async setUserProfile(userId: string, profile: any) {
    return this.set(`user:profile:${userId}`, profile, CACHE_TTL.USER_PROFILE)
  }

  // Map image caching
  static async getMapImage(params: string) {
    return this.get(`map:image:${params}`)
  }

  static async setMapImage(params: string, imageBuffer: Buffer) {
    return this.set(`map:image:${params}`, imageBuffer.toString('base64'), CACHE_TTL.MAP_IMAGES)
  }

  // Featured products caching
  static async getFeaturedProducts() {
    return this.get('products:featured')
  }

  static async setFeaturedProducts(products: any[]) {
    return this.set('products:featured', products, CACHE_TTL.PRODUCTS)
  }

  // Cache invalidation helpers
  static async invalidateProductCaches() {
    const keys = ['products:featured', 'categories:all']
    await Promise.all(keys.map(key => this.del(key)))
  }

  static async invalidateUserCache(userId: string) {
    return this.del(`user:profile:${userId}`)
  }
}

export default CacheManager
