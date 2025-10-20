// Optimized database functions with caching and query optimization
import { query } from './db'
import CacheManager from './cache'

// Optimized product functions with caching
export async function getProductBySlugOptimized(slug: string) {
  // Check cache first
  const cached = await CacheManager.getProduct(slug)
  if (cached) {
    return cached
  }

  try {
    // Optimized query with fewer joins
    const result = await query(`
      SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE p.slug = $1 AND p.status = 'active'
      GROUP BY p.id
    `, [slug])
    
    const product = result.rows[0]
    if (product) {
      // Get categories separately to avoid complex joins
      const categoriesResult = await query(`
        SELECT c.id, c.name, c.slug, pc.is_primary
        FROM product_categories pc
        JOIN categories c ON pc.category_id = c.id
        WHERE pc.product_id = $1
        ORDER BY pc.is_primary DESC, c.name
      `, [product.id])
      
      product.categories = categoriesResult.rows

      // Check deal of the day (simplified)
      const today = new Date().toISOString().split('T')[0]
      const dealResult = await query(`
        SELECT discount_percentage
        FROM deal_of_the_day
        WHERE product_id = $1 AND start_date = $2 AND is_active = true
        LIMIT 1
      `, [product.id, today])

      if (dealResult.rows.length > 0) {
        const dealDiscount = parseFloat(dealResult.rows[0].discount_percentage)
        const originalPrice = parseFloat(product.price)
        const salePrice = originalPrice * (1 - dealDiscount / 100)
        
        product.sale_price = salePrice.toFixed(2)
        product.is_deal_of_the_day = true
        product.deal_discount_percentage = dealDiscount
      }
    }
    
    // Cache the result
    if (product) {
      await CacheManager.setProduct(slug, product)
    }
    
    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
}

// Optimized featured products with caching
export async function getFeaturedProductsOptimized(limit = 6) {
  const cached = await CacheManager.getFeaturedProducts()
  if (cached) {
    return cached
  }

  try {
    const result = await query(`
      SELECT 
        p.id, p.name, p.slug, p.price, p.sale_price, p.image_url,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE p.status = 'active' AND p.featured = true
      GROUP BY p.id
      ORDER BY p.rank ASC, p.created_at DESC
      LIMIT $1
    `, [limit])

    const products = result.rows
    await CacheManager.setFeaturedProducts(products)
    return products
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}

// Optimized categories with caching
export async function getCategoriesOptimized() {
  const cached = await CacheManager.getCategories()
  if (cached) {
    return cached
  }

  try {
    const result = await query(`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY name
    `)
    
    const categories = result.rows
    await CacheManager.setCategories(categories)
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// Optimized user profile with caching
export async function getUserProfileOptimized(userId: string) {
  const cached = await CacheManager.getUserProfile(userId)
  if (cached) {
    return cached
  }

  try {
    const result = await query(`
      SELECT 
        u.id, u.email, u.username, u.first_name, u.last_name, 
        u.discord_username, u.main_shard, u.character_names,
        u.status, u.email_verified, u.is_admin, u.created_at, u.last_login_at,
        u.review_count, u.rating_count, u.total_points_earned, u.account_rank,
        up.phone, up.address, up.city, up.state, up.zip_code, up.country, up.timezone,
        up.profile_image_url
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId])

    const profile = result.rows[0]
    if (profile) {
      await CacheManager.setUserProfile(userId, profile)
    }
    
    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw error
  }
}

// Batch operations to reduce database calls
export async function getMultipleProducts(productIds: string[]) {
  if (productIds.length === 0) return []
  
  try {
    const result = await query(`
      SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE p.id = ANY($1) AND p.status = 'active'
      GROUP BY p.id
    `, [productIds])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching multiple products:', error)
    throw error
  }
}

// Optimized search with better indexing
export async function searchProductsOptimized(searchTerm: string, limit = 20) {
  try {
    const result = await query(`
      SELECT 
        p.id, p.name, p.slug, p.price, p.sale_price, p.image_url,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count,
        ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery('english', $1)) as rank
      FROM products p
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE 
        p.status = 'active' AND 
        (
          p.name ILIKE $2
          OR COALESCE(p.description, '') ILIKE $2
          OR to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('english', $1)
        )
      GROUP BY p.id
      ORDER BY rank DESC, p.featured DESC, p.created_at DESC
      LIMIT $3
    `, [searchTerm, `%${searchTerm}%`, limit])
    
    return result.rows
  } catch (error) {
    console.error('Error searching products:', error)
    throw error
  }
}

export default {
  getProductBySlugOptimized,
  getFeaturedProductsOptimized,
  getCategoriesOptimized,
  getUserProfileOptimized,
  getMultipleProducts,
  searchProductsOptimized
}
