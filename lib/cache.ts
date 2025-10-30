// DISABLED: Redis-based caching layer for Vercel optimization
// import { createClient } from 'redis'

// const redis = createClient({
//   url: process.env.REDIS_URL!,
// })

// Connect to Redis - DISABLED
// redis.connect().catch(console.error)

// Cache configuration
const CACHE_TTL = {
  PRODUCTS: 3600, // 1 hour
  CATEGORIES: 7200, // 2 hours
  USER_PROFILE: 1800, // 30 minutes
  MAP_IMAGES: 86400, // 24 hours
  STATIC_DATA: 14400, // 4 hours
}

export class CacheManager {
  // DISABLED: Generic cache methods - NO CACHING
  static async get<T>(key: string): Promise<T | null> {
    // DISABLED: Always return null to force fresh data
    return null
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // DISABLED: Do nothing - no caching
    return
  }

  static async del(key: string): Promise<void> {
    // DISABLED: Do nothing - no caching
    return
  }

  // DISABLED: Product-specific caching - NO CACHING
  static async getProduct(slug: string) {
    return null // DISABLED: Always return null
  }

  static async setProduct(slug: string, product: any) {
    return // DISABLED: Do nothing
  }

  static async invalidateProduct(slug: string) {
    return // DISABLED: Do nothing
  }

  // DISABLED: Category caching - NO CACHING
  static async getCategories() {
    return null // DISABLED: Always return null
  }

  static async setCategories(categories: any[]) {
    return // DISABLED: Do nothing
  }

  // User profile caching - DISABLED FOR SECURITY
  static async getUserProfile(userId: string) {
    // DISABLED: Return null to force database lookup
    return null
  }

  static async setUserProfile(userId: string, profile: any) {
    // DISABLED: Do not cache user profiles
    return
  }

  // DISABLED: Map image caching - NO CACHING
  static async getMapImage(params: string) {
    return null // DISABLED: Always return null
  }

  static async setMapImage(params: string, imageBuffer: Buffer) {
    return // DISABLED: Do nothing
  }

  // DISABLED: Featured products caching - NO CACHING
  static async getFeaturedProducts() {
    return null // DISABLED: Always return null
  }

  static async setFeaturedProducts(products: any[]) {
    return // DISABLED: Do nothing
  }

  // DISABLED: Cache invalidation helpers - NO CACHING
  static async invalidateProductCaches() {
    return // DISABLED: Do nothing
  }

  static async invalidateUserCache(userId: string) {
    return // DISABLED: Do nothing
  }
}

export default CacheManager
