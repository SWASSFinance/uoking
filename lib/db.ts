// Database connection utility for Next.js
import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || 'postgres://neondb_owner:npg_RPzI0AWebu8l@ep-royal-waterfall-adludrzw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection function
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as timestamp, COUNT(*) as user_count FROM users');
    client.release();
    
    return {
      success: true,
      timestamp: result.rows[0].timestamp,
      userCount: result.rows[0].user_count,
      message: 'Database connection successful!'
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Generic query function
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// User functions
export async function getUsers() {
  try {
    const result = await query('SELECT id, email, username, first_name, last_name, status, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Category functions
export async function getCategories(parentId?: string) {
  try {
    if (parentId) {
      // If parentId is provided, get subcategories of that parent
      const result = await query(`
        SELECT * FROM categories 
        WHERE parent_id = $1 AND is_active = true 
        ORDER BY sort_order, name
      `, [parentId]);
      return result.rows;
    } else {
      // If no parentId, get ALL categories (both top-level and subcategories)
      const result = await query(`
        SELECT * FROM categories 
        WHERE is_active = true 
        ORDER BY name
      `);
      return result.rows;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const result = await query('SELECT * FROM categories WHERE slug = $1 AND is_active = true', [slug]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

// Class functions  
export async function getClasses() {
  try {
    const result = await query(`
      SELECT id, name, slug, description, image_url, primary_stats, skills, 
             playstyle, difficulty_level 
      FROM classes 
      WHERE is_active = true 
      ORDER BY name
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
}

export async function getClassBySlug(slug: string) {
  try {
    const result = await query('SELECT * FROM classes WHERE slug = $1 AND is_active = true', [slug]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching class:', error);
    throw error;
  }
}

// Product functions
export async function getProducts(filters?: {
  categoryId?: string;
  classId?: string;
  type?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  try {
    let whereConditions = ['p.status = $1'];
    let params: any[] = ['active'];
    let paramCount = 1;

    if (filters?.categoryId) {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM product_categories pc 
        WHERE pc.product_id = p.id AND pc.category_id = $${++paramCount}
      )`);
      params.push(filters.categoryId);
    }

    if (filters?.classId) {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM product_classes pc 
        WHERE pc.product_id = p.id AND pc.class_id = $${++paramCount}
      )`);
      params.push(filters.classId);
    }

    if (filters?.type) {
      whereConditions.push(`p.type = $${++paramCount}`);
      params.push(filters.type);
    }

    if (filters?.featured) {
      whereConditions.push(`p.featured = $${++paramCount}`);
      params.push(filters.featured);
    }

    if (filters?.search) {
      whereConditions.push(`(p.name ILIKE $${++paramCount} OR p.description ILIKE $${++paramCount})`);
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.join(' AND ');
    const limitClause = filters?.limit ? `LIMIT $${++paramCount}` : '';
    const offsetClause = filters?.offset ? `OFFSET $${++paramCount}` : '';

    if (filters?.limit) params.push(filters.limit);
    if (filters?.offset) params.push(filters.offset);

    const result = await query(`
      SELECT 
        p.*,
        STRING_AGG(DISTINCT cl.name, ', ') as class_names,
        STRING_AGG(DISTINCT cl.id::text, ',') as class_ids,
        STRING_AGG(DISTINCT c.name, ', ') as category_names,
        STRING_AGG(DISTINCT c.id::text, ',') as category_ids,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(DISTINCT pr.id) as review_count
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_classes pcl ON p.id = pcl.product_id
      LEFT JOIN classes cl ON pcl.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE ${whereClause}
      GROUP BY p.id
      ORDER BY p.rank ASC, p.name ASC, p.featured DESC, p.created_at DESC
      ${limitClause} ${offsetClause}
    `, params);

    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE p.slug = $1 AND p.status = 'active'
      GROUP BY p.id
    `, [slug]);
    
    const product = result.rows[0];
    if (product) {
      // Get all categories for this product
      const categoriesResult = await query(`
        SELECT c.id, c.name, c.slug, pc.is_primary
        FROM product_categories pc
        JOIN categories c ON pc.category_id = c.id
        WHERE pc.product_id = $1
        ORDER BY pc.is_primary DESC, c.name
      `, [product.id]);
      
      product.categories = categoriesResult.rows;
    }
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    return getProducts({ featured: true, limit });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
}

export async function getProductsByCategory(categorySlug: string, limit?: number) {
  try {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    return getProducts({ categoryId: category.id, limit });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function getProductsByClass(classSlug: string, limit?: number) {
  try {
    const classData = await getClassBySlug(classSlug);
    if (!classData) return [];
    
    return getProducts({ classId: classData.id, limit });
  } catch (error) {
    console.error('Error fetching products by class:', error);
    throw error;
  }
}

// Product Review functions
export async function getProductReviews(productId: string) {
  try {
    const result = await query(`
      SELECT 
        pr.*,
        u.username,
        u.first_name,
        u.last_name,
        u.character_names,
        up.profile_image_url
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE pr.product_id = $1 AND pr.status = 'approved'
      ORDER BY pr.created_at DESC
    `, [productId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
}

export async function createProductReview({
  productId,
  userId,
  rating,
  title,
  content,
  status = 'pending'
}: {
  productId: string
  userId: string
  rating: number
  title?: string | null
  content: string
  status?: string
}) {
  try {
    await query('BEGIN')
    
    // Check if user already reviewed this product
    const existingReview = await query(`
      SELECT id, status FROM product_reviews 
      WHERE product_id = $1 AND user_id = $2
    `, [productId, userId])
    
    if (existingReview.rows.length > 0) {
      await query('ROLLBACK')
      throw new Error('You have already reviewed this product. You cannot submit another review.')
    }

    // Check if user has too many pending reviews (rate limiting)
    const pendingReviewsCount = await query(`
      SELECT COUNT(*) as count FROM product_reviews 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    if (pendingReviewsCount.rows[0].count >= 5) {
      await query('ROLLBACK')
      throw new Error('You have reached the maximum limit of 5 pending reviews. Please wait for your existing reviews to be approved before submitting more.')
    }
    
    // Calculate points for new review
    let pointsEarned = 10 // Base points for review
    
    if (rating) {
      pointsEarned += 5 // Bonus points for rating
    }
    
    if (content && content.length > 50) {
      pointsEarned += 5 // Bonus points for detailed review
    }
    
    // Insert new review
    const result = await query(`
      INSERT INTO product_reviews (product_id, user_id, rating, title, content, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [productId, userId, rating, title, content, status])
    
    // Update user points
    try {
      await query(`
        UPDATE users 
        SET total_points_earned = COALESCE(total_points_earned, 0) + $1
        WHERE id = $2
      `, [pointsEarned, userId])
    } catch (error) {
      console.warn('Could not update user total_points_earned (column may not exist):', error)
    }
    
    // Update user_points table
    await query(`
      INSERT INTO user_points (user_id, current_points, lifetime_points)
      VALUES ($1, $2, $2)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        current_points = user_points.current_points + $2,
        lifetime_points = user_points.lifetime_points + $2
    `, [userId, pointsEarned])
    
    // Get updated count of pending reviews
    const updatedPendingCount = await query(`
      SELECT COUNT(*) as count FROM product_reviews 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    await query('COMMIT')
    return { 
      ...result.rows[0], 
      pointsEarned, 
      isNewReview: true,
      pendingReviewsCount: parseInt(updatedPendingCount.rows[0].count),
      remainingReviews: Math.max(0, 5 - parseInt(updatedPendingCount.rows[0].count))
    }
  } catch (error) {
    await query('ROLLBACK')
    console.error('Error creating product review:', error)
    throw error
  }
}

// Check if user has already reviewed a product
export async function hasUserReviewedProduct(userId: string, productId: string) {
  try {
    const result = await query(`
      SELECT id, status, rating, title, content, created_at
      FROM product_reviews 
      WHERE user_id = $1 AND product_id = $2
    `, [userId, productId])
    
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error('Error checking user review:', error)
    throw error
  }
}

// Get user's pending review count
export async function getUserPendingReviewCount(userId: string) {
  try {
    const result = await query(`
      SELECT COUNT(*) as count FROM product_reviews 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    return parseInt(result.rows[0].count)
  } catch (error) {
    console.error('Error getting user pending review count:', error)
    throw error
  }
}

// Get user's pending spawn location submission count
export async function getUserPendingSpawnSubmissionCount(userId: string) {
  try {
    const result = await query(`
      SELECT COUNT(*) as count FROM spawn_location_submissions 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    return parseInt(result.rows[0].count)
  } catch (error) {
    console.error('Error getting user pending spawn submission count:', error)
    throw error
  }
}

// Get user's reviews
export async function getUserReviews(userId: string) {
  try {
    const result = await query(`
      SELECT 
        pr.*,
        p.name as product_name,
        p.slug as product_slug,
        p.image_url as product_image,
        u.username,
        u.first_name,
        u.last_name,
        u.character_names
      FROM product_reviews pr
      JOIN products p ON pr.product_id = p.id
      JOIN users u ON pr.user_id = u.id
      WHERE pr.user_id = $1
      ORDER BY pr.created_at DESC
    `, [userId])
    return result.rows
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    throw error
  }
}

// Get user's actual review count from product_reviews table
export async function getUserReviewCount(userId: string) {
  try {
    const result = await query(`
      SELECT COUNT(*) as review_count
      FROM product_reviews 
      WHERE user_id = $1
    `, [userId])
    return parseInt(result.rows[0].review_count)
  } catch (error) {
    console.error('Error fetching user review count:', error)
    throw error
  }
}

// Get user points and statistics
export async function getUserPoints(userId: string) {
  try {
    // First try to get existing user_points record
    const result = await query(`
      SELECT 
        up.*,
        u.review_count,
        u.rating_count,
        u.total_points_earned
      FROM user_points up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = $1
    `, [userId])
    
    if (result.rows.length > 0) {
      return result.rows[0]
    }
    
    // If no user_points record exists, get user data and create one
    const userResult = await query(`
      SELECT 
        id,
        review_count,
        rating_count,
        total_points_earned
      FROM users 
      WHERE id = $1
    `, [userId])
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found')
    }
    
    const user = userResult.rows[0]
    
    // Create user points record
    const createResult = await query(`
      INSERT INTO user_points (user_id, current_points, lifetime_points, points_spent)
      VALUES ($1, $2, $2, 0)
      RETURNING *
    `, [userId, user.total_points_earned || 0])
    
    // Return combined data
    return {
      ...createResult.rows[0],
      review_count: user.review_count || 0,
      rating_count: user.rating_count || 0,
      total_points_earned: user.total_points_earned || 0
    }
  } catch (error) {
    console.error('Error fetching user points:', error)
    throw error
  }
}

// Order functions (replacing old transaction functions)
export async function getOrders() {
  try {
    const result = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.username,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.email, u.username
      ORDER BY o.created_at DESC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(id: string) {
  try {
    const result = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.username,
        u.first_name,
        u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function getOrderItems(orderId: string) {
  try {
    const result = await query(`
      SELECT 
        oi.*,
        p.name as current_product_name,
        p.image_url as current_product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `, [orderId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching order items:', error);
    throw error;
  }
}

// News functions
export async function getNews(limit?: number) {
  try {
    const limitClause = limit ? 'LIMIT $1' : '';
    const params = limit ? [limit] : [];
    
    const result = await query(`
      SELECT 
        n.*,
        u.username as author_name,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.status = 'published' AND n.published_at <= NOW()
      ORDER BY n.featured DESC, n.published_at DESC
      ${limitClause}
    `, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const result = await query(`
      SELECT 
        n.*,
        u.username as author_name,
        u.first_name as author_first_name,
        u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.slug = $1 AND n.status = 'published'
    `, [slug]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching news article:', error);
    throw error;
  }
}

// Facet and Map functions
export async function getFacets() {
  try {
    const result = await query(`
      SELECT * FROM facets 
      WHERE is_active = true 
      ORDER BY name
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching facets:', error);
    throw error;
  }
}

export async function getMaps(facetId?: string) {
  try {
    const whereClause = facetId ? 'WHERE f.id = $1 AND m.is_active = true' : 'WHERE m.is_active = true';
    const params = facetId ? [facetId] : [];
    
    const result = await query(`
      SELECT 
        m.*,
        f.name as facet_name,
        f.slug as facet_slug
      FROM maps m
      JOIN facets f ON m.facet_id = f.id
      ${whereClause}
      ORDER BY f.name, m.name
    `, params);
    return result.rows;
  } catch (error) {
    console.error('Error fetching maps:', error);
    throw error;
  }
}

// Cart functions
export async function getCartItems(userId: string) {
  try {
    const result = await query(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.price,
        p.sale_price,
        p.image_url,
        p.requires_character_name,
        p.requires_shard,
        p.available_shards
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1 AND p.status = 'active'
      ORDER BY ci.created_at DESC
    `, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
}

export async function addToCart(userId: string, productId: string, quantity: number, options?: any) {
  try {
    const result = await query(`
      INSERT INTO cart_items (user_id, product_id, quantity, custom_options)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET 
        quantity = cart_items.quantity + $3,
        custom_options = $4,
        updated_at = NOW()
      RETURNING *
    `, [userId, productId, quantity, JSON.stringify(options || {})]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

// Search function
export async function searchProducts(searchTerm: string, limit = 20) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        STRING_AGG(DISTINCT cl.name, ', ') as class_names,
        STRING_AGG(DISTINCT cl.id::text, ',') as class_ids,
        STRING_AGG(DISTINCT c.name, ', ') as category_names,
        STRING_AGG(DISTINCT c.id::text, ',') as category_ids,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_classes pcl ON p.id = pcl.product_id
      LEFT JOIN classes cl ON pcl.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE 
        p.status = 'active' AND 
        (
          p.name ILIKE $1
          OR COALESCE(p.description, '') ILIKE $1
          OR COALESCE(p.short_description, '') ILIKE $1
        )
      GROUP BY p.id
      ORDER BY p.featured DESC, p.created_at DESC, p.name ASC
      LIMIT $2
    `, [`%${searchTerm}%`, limit]);
    return result.rows;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// New function to get products by category using junction table
export async function getProductsByCategoryJunction(categoryId: string, filters?: {
  limit?: number;
  offset?: number;
  featured?: boolean;
}) {
  try {
    const { limit = 50, offset = 0, featured } = filters || {};
    
    let whereClause = 'p.status = \'active\'';
    const params: any[] = [categoryId];
    
    if (featured !== undefined) {
      whereClause += ' AND p.featured = $' + (params.length + 1);
      params.push(featured);
    }
    
    const limitClause = limit ? `LIMIT $${params.length + 1}` : '';
    if (limitClause) params.push(limit);
    
    const offsetClause = offset > 0 ? `OFFSET $${params.length + 1}` : '';
    if (offsetClause) params.push(offset);
    
    const result = await query(`
      SELECT DISTINCT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        cl.name as class_name,
        cl.slug as class_slug,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count,
        pc.is_primary
      FROM products p
      JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_classes pc2 ON p.id = pc2.product_id
      LEFT JOIN classes cl ON pc2.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE pc.category_id = $1 AND ${whereClause}
      GROUP BY p.id, pc.is_primary
      ORDER BY pc.is_primary DESC, p.featured DESC, p.created_at DESC
      ${limitClause} ${offsetClause}
    `, params);

    return result.rows;
  } catch (error) {
    console.error('Error fetching products by category junction:', error);
    throw error;
  }
}

// Function to get all categories for a product
export async function getProductCategories(productId: string) {
  try {
    const result = await query(`
      SELECT c.id, c.name, c.slug, pc.sort_order
      FROM product_categories pc
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.product_id = $1
      ORDER BY pc.sort_order, c.name
    `, [productId]);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
}

// Admin functions for products
export async function getAllProducts() {
  try {
    const result = await query(`
      SELECT 
        p.*,
        STRING_AGG(DISTINCT cl.name, ', ') as class_names,
        STRING_AGG(DISTINCT cl.id::text, ',') as class_ids,
        STRING_AGG(DISTINCT c.name, ', ') as category_names,
        STRING_AGG(DISTINCT c.id::text, ',') as category_ids
      FROM products p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.id
      LEFT JOIN product_classes pcl ON p.id = pcl.product_id
      LEFT JOIN classes cl ON pcl.class_id = cl.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all products:', error)
    throw error
  }
}

export async function createProduct(productData: any) {
  try {
    const result = await query(`
      INSERT INTO products (
        name, slug, description, short_description, price, sale_price, 
        image_url, status, featured, class_id, type, rank,
        requires_character_name, requires_shard
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      productData.name,
      productData.slug,
      productData.description || '',
      productData.short_description || '',
      productData.price,
      productData.sale_price || null,
      productData.image_url || '',
      productData.status || 'active',
      productData.featured || false,
      productData.class_id || null,
      productData.type || '',
      productData.rank || 0,
      productData.requires_character_name || false,
      productData.requires_shard || false
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    console.log('Database update - Product ID:', id)
    console.log('Database update - Product data:', JSON.stringify(productData, null, 2))
    
    const result = await query(`
      UPDATE products SET 
        name = $1,
        slug = $2,
        description = $3,
        short_description = $4,
        price = $5,
        sale_price = $6,
        image_url = $7,
        status = $8,
        featured = $9,
        class_id = $10,
        type = $11,
        rank = $12,
        requires_character_name = $13,
        requires_shard = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *
    `, [
      productData.name,
      productData.slug,
      productData.description || '',
      productData.short_description || '',
      productData.price,
      productData.sale_price || null,
      productData.image_url || '',
      productData.status || 'active',
      productData.featured || false,
      productData.class_id || null,
      productData.type || 'item',
      productData.rank || 0,
      productData.requires_character_name || false,
      productData.requires_shard || false,
      id
    ])
    
    console.log('Database update - Success, updated rows:', result.rowCount)
    return result.rows[0]
  } catch (error) {
    console.error('Database update - Error:', error)
    console.error('Database update - Error details:', (error as Error).message)
    throw error
  }
}



export async function updateProductCategories(productId: string, categoryIds: string[]) {
  try {
    // Start a transaction
    await query('BEGIN')
    
    // Delete existing categories for this product
    await query('DELETE FROM product_categories WHERE product_id = $1', [productId])
    
    // Insert new categories
    for (let i = 0; i < categoryIds.length; i++) {
      if (categoryIds[i] && categoryIds[i].trim() !== '') {
        await query(`
          INSERT INTO product_categories (product_id, category_id, sort_order, is_primary)
          VALUES ($1, $2, $3, $4)
        `, [productId, categoryIds[i], i, i === 0]) // First category is primary
      }
    }
    
    await query('COMMIT')
    return true
  } catch (error) {
    await query('ROLLBACK')
    console.error('Error updating product categories:', error)
    throw error
  }
}

export async function updateProductClasses(productId: string, classIds: string[]) {
  try {
    // Start a transaction
    await query('BEGIN')
    
    // Delete existing classes for this product
    await query('DELETE FROM product_classes WHERE product_id = $1', [productId])
    
    // Insert new classes
    for (let i = 0; i < classIds.length; i++) {
      if (classIds[i] && classIds[i].trim() !== '') {
        await query(`
          INSERT INTO product_classes (product_id, class_id, sort_order, is_primary)
          VALUES ($1, $2, $3, $4)
        `, [productId, classIds[i], i, i === 0]) // First class is primary
      }
    }
    
    await query('COMMIT')
    return true
  } catch (error) {
    await query('ROLLBACK')
    console.error('Error updating product classes:', error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    const result = await query(`
      DELETE FROM products 
      WHERE id = $1
      RETURNING id
    `, [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Admin functions for categories
export async function getAllCategories() {
  try {
    const result = await query(`
      SELECT 
        c.*,
        p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      ORDER BY c.name ASC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all categories:', error)
    throw error
  }
}

export async function createCategory(categoryData: any) {
  try {
    const result = await query(`
      INSERT INTO categories (
        name, slug, description, bottom_desc, image_url, parent_id, 
        sort_order, is_active, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      categoryData.name,
      categoryData.slug,
      categoryData.description || '',
      categoryData.bottom_desc || '',
      categoryData.image_url || '',
      categoryData.parent_id || null,
      categoryData.sort_order || 0,
      categoryData.is_active !== false,
      categoryData.meta_title || '',
      categoryData.meta_description || ''
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function updateCategory(id: string, categoryData: any) {
  try {
    const result = await query(`
      UPDATE categories SET 
        name = $1,
        slug = $2,
        description = $3,
        image_url = $4,
        parent_id = $5,
        sort_order = $6,
        is_active = $7,
        meta_title = $8,
        meta_description = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      categoryData.name,
      categoryData.slug,
      categoryData.description || '',
      categoryData.image_url || '',
      categoryData.parent_id || null,
      categoryData.sort_order || 0,
      categoryData.is_active !== false,
      categoryData.meta_title || '',
      categoryData.meta_description || '',
      id
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has child categories
    const childCheck = await query(`
      SELECT COUNT(*) as child_count FROM categories WHERE parent_id = $1
    `, [id])
    
    if (parseInt(childCheck.rows[0].child_count) > 0) {
      throw new Error('Cannot delete category with subcategories')
    }
    
    // Check if category has products
    const productCheck = await query(`
      SELECT COUNT(*) as product_count FROM product_categories WHERE category_id = $1
    `, [id])
    
    if (parseInt(productCheck.rows[0].product_count) > 0) {
      throw new Error('Cannot delete category with products')
    }
    
    const result = await query(`
      DELETE FROM categories 
      WHERE id = $1
      RETURNING id
    `, [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Admin functions for users
export async function getAllUsers() {
  try {
    const result = await query(`
      SELECT 
        u.id, 
        u.email, 
        u.username, 
        u.first_name, 
        u.last_name, 
        u.discord_username, 
        u.main_shard, 
        u.character_names, 
        u.status, 
        u.email_verified, 
        u.is_admin, 
        u.created_at, 
        u.updated_at, 
        u.last_login_at,
        u.total_points_earned,
        u.review_count,
        u.rating_count,
        COALESCE(up.referral_cash, 0) as referral_cash,
        COALESCE(up.current_points, 0) as current_points,
        COALESCE(up.lifetime_points, 0) as lifetime_points,
        COALESCE(up.points_spent, 0) as points_spent,
        urc.referral_code,
        (SELECT COUNT(*) FROM user_referrals WHERE referrer_id = u.id) as referral_count,
        (SELECT COUNT(*) FROM user_referrals WHERE referred_id = u.id) as referred_by_count
      FROM users u
      LEFT JOIN user_points up ON u.id = up.user_id
      LEFT JOIN user_referral_codes urc ON u.id = urc.user_id AND urc.is_active = true
      ORDER BY u.created_at DESC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all users:', error)
    throw error
  }
}

// Admin functions for orders
export async function getAllOrders() {
  try {
    const result = await query(`
      SELECT 
        o.*,
        u.email as user_email,
        u.username,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.email, u.username
      ORDER BY o.created_at DESC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

// Admin dashboard stats
export async function getDashboardStats() {
  try {
    const stats = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM products WHERE status = \'active\''),
      query('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURRENT_DATE'),
      query('SELECT COUNT(*) as count FROM categories WHERE is_active = true')
    ])
    
    return {
      totalUsers: parseInt(stats[0].rows[0].count),
      activeProducts: parseInt(stats[1].rows[0].count),
      todayOrders: parseInt(stats[2].rows[0].count),
      activeCategories: parseInt(stats[3].rows[0].count)
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

// Banner functions
export async function getAllBanners() {
  try {
    const result = await query(`
      SELECT * FROM banners 
      ORDER BY sort_order ASC, created_at DESC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all banners:', error)
    throw error
  }
}

export async function getActiveBanners(position?: string) {
  try {
    let whereClause = 'is_active = true'
    const params: any[] = []
    
    if (position) {
      whereClause += ' AND position = $1'
      params.push(position)
    }
    
    const result = await query(`
      SELECT * FROM banners 
      WHERE ${whereClause}
      ORDER BY sort_order ASC, created_at DESC
    `, params)
    return result.rows
  } catch (error) {
    console.error('Error fetching active banners:', error)
    throw error
  }
}

export async function createBanner(bannerData: any) {
  try {
    const result = await query(`
      INSERT INTO banners (
        title, subtitle, description, video_url, image_url, 
        button_text, button_url, position, is_active, sort_order,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      bannerData.title,
      bannerData.subtitle || '',
      bannerData.description || '',
      bannerData.video_url || '',
      bannerData.image_url || '',
      bannerData.button_text || '',
      bannerData.button_url || '',
      bannerData.position || 'homepage',
      bannerData.is_active !== false,
      bannerData.sort_order || 0,
      bannerData.created_at || new Date().toISOString(),
      bannerData.updated_at || new Date().toISOString()
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating banner:', error)
    throw error
  }
}

export async function updateBanner(id: string, bannerData: any) {
  try {
    const result = await query(`
      UPDATE banners SET 
        title = $1,
        subtitle = $2,
        description = $3,
        video_url = $4,
        image_url = $5,
        button_text = $6,
        button_url = $7,
        position = $8,
        is_active = $9,
        sort_order = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `, [
      bannerData.title,
      bannerData.subtitle || '',
      bannerData.description || '',
      bannerData.video_url || '',
      bannerData.image_url || '',
      bannerData.button_text || '',
      bannerData.button_url || '',
      bannerData.position || 'homepage',
      bannerData.is_active !== false,
      bannerData.sort_order || 0,
      id
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error updating banner:', error)
    throw error
  }
}

export async function deleteBanner(id: string) {
  try {
    const result = await query(`
      DELETE FROM banners 
      WHERE id = $1
      RETURNING id
    `, [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting banner:', error)
    throw error
  }
}

// Shard functions
export async function getShards() {
  try {
    const result = await query(`
      SELECT * FROM shards 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching shards:', error)
    throw error
  }
}

export async function getAllShards() {
  try {
    const result = await query(`
      SELECT * FROM shards 
      ORDER BY sort_order ASC, name ASC
    `)
    return result.rows
  } catch (error) {
    console.error('Error fetching all shards:', error)
    throw error
  }
}

export async function getShardById(id: string) {
  try {
    const result = await query('SELECT * FROM shards WHERE id = $1', [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching shard:', error)
    throw error
  }
}

export async function createShard(shardData: any) {
  try {
    const result = await query(`
      INSERT INTO shards (
        name, slug, is_active, sort_order, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `, [
      shardData.name,
      shardData.slug || shardData.name.toLowerCase().replace(/\s+/g, '-'),
      shardData.is_active !== false,
      shardData.sort_order || 0
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error creating shard:', error)
    throw error
  }
}

export async function updateShard(id: string, shardData: any) {
  try {
    const result = await query(`
      UPDATE shards SET 
        name = $1,
        slug = $2,
        is_active = $3,
        sort_order = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [
      shardData.name,
      shardData.slug || shardData.name.toLowerCase().replace(/\s+/g, '-'),
      shardData.is_active !== false,
      shardData.sort_order || 0,
      id
    ])
    return result.rows[0]
  } catch (error) {
    console.error('Error updating shard:', error)
    throw error
  }
}

export async function deleteShard(id: string) {
  try {
    const result = await query(`
      DELETE FROM shards 
      WHERE id = $1
      RETURNING id
    `, [id])
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting shard:', error)
    throw error
  }
}

// Daily Check-in Functions
export async function getUserDailyCheckinStatus(userId: string) {
  try {
    // Get today's date in the user's local timezone
    // This ensures consistency regardless of server timezone
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const today = `${year}-${month}-${day}` // YYYY-MM-DD format
    
    const result = await query(`
      SELECT 
        udc.*,
        CASE 
          WHEN udc.checkin_date = $2 THEN true 
          ELSE false 
        END as checked_in_today,
        CASE 
          WHEN udc.checkin_date = $2 THEN udc.points_earned 
          ELSE 0 
        END as today_points
      FROM user_daily_checkins udc
      WHERE udc.user_id = $1 AND udc.checkin_date = $2
    `, [userId, today])
    
    if (result.rows.length > 0) {
      return result.rows[0]
    }
    
    // Return default status if no check-in today
    return {
      checked_in_today: false,
      today_points: 0,
      checkin_date: today
    }
  } catch (error) {
    console.error('Error fetching daily check-in status:', error)
    throw error
  }
}

export async function getUserCheckinHistory(userId: string, limit: number = 30) {
  try {
    const result = await query(`
      SELECT 
        checkin_date,
        points_earned,
        created_at
      FROM user_daily_checkins
      WHERE user_id = $1
      ORDER BY checkin_date DESC
      LIMIT $2
    `, [userId, limit])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching check-in history:', error)
    throw error
  }
}

export async function performDailyCheckin(userId: string) {
  try {
    // Get today's date in the user's local timezone
    // This ensures consistency regardless of server timezone
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const today = `${year}-${month}-${day}` // YYYY-MM-DD format
    const pointsToAward = 10
    
    // Start transaction
    await query('BEGIN')
    
    try {
      // Check if user already checked in today
      const existingCheckin = await query(`
        SELECT id FROM user_daily_checkins 
        WHERE user_id = $1 AND checkin_date = $2
      `, [userId, today])
      
      if (existingCheckin.rows.length > 0) {
        await query('ROLLBACK')
        throw new Error('Already checked in today')
      }
      
      // Insert daily check-in record
      const checkinResult = await query(`
        INSERT INTO user_daily_checkins (user_id, checkin_date, points_earned)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [userId, today, pointsToAward])
      
      // Update user points
      await query(`
        UPDATE user_points 
        SET 
          current_points = current_points + $2,
          lifetime_points = lifetime_points + $2,
          updated_at = NOW()
        WHERE user_id = $1
      `, [userId, pointsToAward])
      
      // Update user total points earned
      await query(`
        UPDATE users 
        SET total_points_earned = COALESCE(total_points_earned, 0) + $2
        WHERE id = $1
      `, [userId, pointsToAward])
      
      await query('COMMIT')
      
      return {
        success: true,
        checkin: checkinResult.rows[0],
        points_awarded: pointsToAward
      }
      
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
    
  } catch (error) {
    console.error('Error performing daily check-in:', error)
    throw error
  }
}

export async function getCheckinStreak(userId: string) {
  try {
    // Get today's date in the user's local timezone
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const today = `${year}-${month}-${day}` // YYYY-MM-DD format
    
    const result = await query(`
      WITH checkin_dates AS (
        SELECT checkin_date
        FROM user_daily_checkins
        WHERE user_id = $1
        ORDER BY checkin_date DESC
      ),
      streak_calc AS (
        SELECT 
          checkin_date,
          ROW_NUMBER() OVER (ORDER BY checkin_date DESC) as rn,
          checkin_date + ROW_NUMBER() OVER (ORDER BY checkin_date DESC) as expected_date
        FROM checkin_dates
      )
      SELECT 
        COUNT(*) as current_streak
      FROM streak_calc
      WHERE expected_date = $2
    `, [userId, today])
    
    return result.rows[0]?.current_streak || 0
  } catch (error) {
    console.error('Error calculating check-in streak:', error)
    return 0
  }
}

export async function getCheckinTotals(userId: string) {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_checkins,
        SUM(points_earned) as total_points_from_checkins,
        MIN(checkin_date) as first_checkin_date,
        MAX(checkin_date) as last_checkin_date
      FROM user_daily_checkins
      WHERE user_id = $1
    `, [userId])
    
    return result.rows[0] || {
      total_checkins: 0,
      total_points_from_checkins: 0,
      first_checkin_date: null,
      last_checkin_date: null
    }
  } catch (error) {
    console.error('Error fetching check-in totals:', error)
    return {
      total_checkins: 0,
      total_points_from_checkins: 0,
      first_checkin_date: null,
      last_checkin_date: null
    }
  }
}

export async function getReferralPoints(userId: string) {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_referrals,
        COUNT(*) * 25 as total_points_from_referrals
      FROM user_referrals
      WHERE referrer_id = $1 AND reward_status = 'earned'
    `, [userId])
    
    return result.rows[0] || {
      total_referrals: 0,
      total_points_from_referrals: 0
    }
  } catch (error) {
    console.error('Error fetching referral points:', error)
    return {
      total_referrals: 0,
      total_points_from_referrals: 0
    }
  }
}

// Map and Plot Management Functions
export async function createMapTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS maps (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        map_file_url TEXT,
        map_file_size BIGINT,
        created_by UUID REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS plots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        map_id UUID REFERENCES maps(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        points_price INTEGER DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Create indexes for performance
    await query(`CREATE INDEX IF NOT EXISTS idx_plots_map_id ON plots(map_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_plots_location ON plots(latitude, longitude)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_maps_active ON maps(is_active) WHERE is_active = true`)

    return { success: true, message: 'Map and plot tables created successfully' }
  } catch (error) {
    console.error('Error creating map tables:', error)
    throw error
  }
}

export async function uploadMap(name: string, description: string, mapFileUrl: string, mapFileSize: number, createdBy: string) {
  try {
    const result = await query(`
      INSERT INTO maps (name, description, map_file_url, map_file_size, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, description, mapFileUrl, mapFileSize, createdBy])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error uploading map:', error)
    throw error
  }
}

export async function getAllMaps() {
  try {
    const result = await query(`
      SELECT 
        m.*,
        COUNT(p.id) as plot_count,
        u.username as created_by_name
      FROM maps m
      LEFT JOIN plots p ON m.id = p.map_id
      LEFT JOIN users u ON m.created_by = u.id
      WHERE m.is_active = true
      GROUP BY m.id, u.username
      ORDER BY m.created_at DESC
    `)
    
    return result.rows
  } catch (error) {
    console.error('Error fetching maps:', error)
    throw error
  }
}

export async function getMapById(mapId: string) {
  try {
    const result = await query(`
      SELECT 
        m.*,
        u.username as created_by_name
      FROM maps m
      LEFT JOIN users u ON m.created_by = u.id
      WHERE m.id = $1 AND m.is_active = true
    `, [mapId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching map:', error)
    throw error
  }
}

export async function getPlotsByMapId(mapId: string) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        u.username as created_by_name
      FROM plots p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.map_id = $1 AND p.is_available = true
      ORDER BY p.created_at ASC
    `, [mapId])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching plots:', error)
    throw error
  }
}

export async function createPlot(mapId: string, name: string, description: string, latitude: number, longitude: number, pointsPrice: number, createdBy: string) {
  try {
    const result = await query(`
      INSERT INTO plots (map_id, name, description, latitude, longitude, points_price, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [mapId, name, description, latitude, longitude, pointsPrice, createdBy])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error creating plot:', error)
    throw error
  }
}

export async function updatePlot(plotId: string, name: string, description: string, latitude: number, longitude: number, pointsPrice: number) {
  try {
    const result = await query(`
      UPDATE plots 
      SET name = $2, description = $3, latitude = $4, longitude = $5, points_price = $6, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [plotId, name, description, latitude, longitude, pointsPrice])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error updating plot:', error)
    throw error
  }
}

export async function deletePlot(plotId: string) {
  try {
    const result = await query(`
      DELETE FROM plots 
      WHERE id = $1
      RETURNING id
    `, [plotId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting plot:', error)
    throw error
  }
}

export async function deleteMap(mapId: string) {
  try {
    // First delete all plots associated with the map
    await query(`DELETE FROM plots WHERE map_id = $1`, [mapId])
    
    // Then delete the map
    const result = await query(`
      DELETE FROM maps 
      WHERE id = $1
      RETURNING id
    `, [mapId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting map:', error)
    throw error
  }
}

// Plot purchase functions
export async function getPlotById(plotId: string) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        m.name as map_name,
        m.slug as map_slug,
        m.map_file_url,
        u.username as created_by_name,
        o.username as owner_name
      FROM plots p
      LEFT JOIN maps m ON p.map_id = m.id
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN users o ON p.owner_id = o.id
      WHERE p.id = $1
    `, [plotId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching plot:', error)
    throw error
  }
}

export async function purchasePlot(plotId: string, userId: string) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Get plot details and check availability
    const plotResult = await client.query(`
      SELECT id, name, points_price, is_available, owner_id
      FROM plots 
      WHERE id = $1
    `, [plotId])
    
    if (plotResult.rows.length === 0) {
      throw new Error('Plot not found')
    }
    
    const plot = plotResult.rows[0]
    
    if (!plot.is_available) {
      throw new Error('Plot is not available for purchase')
    }
    
    if (plot.owner_id) {
      throw new Error('Plot is already owned')
    }
    
    // Check user has enough points
    const userPointsResult = await client.query(`
      SELECT current_points FROM user_points WHERE user_id = $1
    `, [userId])
    
    if (userPointsResult.rows.length === 0) {
      throw new Error('User points record not found')
    }
    
    const userPoints = userPointsResult.rows[0]
    
    if (userPoints.current_points < plot.points_price) {
      throw new Error('Insufficient points')
    }
    
    // Deduct points from user
    await client.query(`
      UPDATE user_points 
      SET current_points = current_points - $1, 
          points_spent = points_spent + $1,
          updated_at = NOW()
      WHERE user_id = $2
    `, [plot.points_price, userId])
    
    // Update plot ownership
    const updateResult = await client.query(`
      UPDATE plots 
      SET owner_id = $1, 
          purchased_at = NOW(),
          is_available = false,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [userId, plotId])
    
    await client.query('COMMIT')
    
    return updateResult.rows[0]
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error purchasing plot:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function getUserOwnedPlots(userId: string) {
  try {
    const result = await query(`
      SELECT 
        p.*,
        m.name as map_name,
        m.slug as map_slug
      FROM plots p
      LEFT JOIN maps m ON p.map_id = m.id
      WHERE p.owner_id = $1
      ORDER BY p.purchased_at DESC
    `, [userId])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching user owned plots:', error)
    throw error
  }
}

export default pool; 