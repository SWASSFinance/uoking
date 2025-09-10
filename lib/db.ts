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
  } catch (error) {
    // Log the error with context
    console.error('Database query error:', {
      query: text,
      params: params,
      error: error instanceof Error ? error.message : error
    });
    throw error;
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
             playstyle, difficulty_level, is_active 
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

      // Check if this product is today's deal of the day
      const today = new Date().toISOString().split('T')[0];
      const dealResult = await query(`
        SELECT d.discount_percentage
        FROM deal_of_the_day d
        WHERE d.product_id = $1 
          AND d.start_date = $2 
          AND d.is_active = true
        LIMIT 1
      `, [product.id, today]);

      if (dealResult.rows && dealResult.rows.length > 0) {
        // This product is today's deal of the day
        const dealDiscount = parseFloat(dealResult.rows[0].discount_percentage);
        const originalPrice = parseFloat(product.price);
        const salePrice = originalPrice * (1 - dealDiscount / 100);
        
        // Update product with deal pricing
        product.sale_price = salePrice.toFixed(2);
        product.is_deal_of_the_day = true;
        product.deal_discount_percentage = dealDiscount;
      } else {
        // Check if it's a default deal (featured product with default discount)
        const settingsResult = await query(`
          SELECT setting_value FROM site_settings 
          WHERE setting_key = 'enable_deal_of_the_day'
        `);
        
        const isDealEnabled = settingsResult.rows?.[0]?.setting_value === 'true';
        
        if (isDealEnabled && product.featured) {
          // Check if there's no specific deal for today, use default discount
          const todayDealResult = await query(`
            SELECT id FROM deal_of_the_day 
            WHERE start_date = $1 AND is_active = true
            LIMIT 1
          `, [today]);

          if (!todayDealResult.rows || todayDealResult.rows.length === 0) {
            // No specific deal today, check if this featured product should get default discount
            const today = new Date();
            const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
            
            const countResult = await query(`
              SELECT COUNT(*) as count FROM products 
              WHERE status = 'active' AND featured = true
            `);
            
            const totalFeatured = parseInt(countResult.rows[0].count);
            const offset = dayOfYear % totalFeatured;
            
            // Get the product that should be today's default deal
            const defaultDealResult = await query(`
              SELECT p.id
              FROM products p
              WHERE p.status = 'active' 
                AND p.featured = true
              ORDER BY p.id
              LIMIT 1
              OFFSET $1
            `, [offset]);

            if (defaultDealResult.rows && defaultDealResult.rows.length > 0 && 
                defaultDealResult.rows[0].id === product.id) {
              // This is today's default deal product
              const premiumSettingsResult = await query(`
                SELECT setting_value FROM premium_settings 
                WHERE setting_key = 'deal_of_day_regular_discount'
              `);
              
              const defaultDiscount = premiumSettingsResult.rows?.[0]?.setting_value 
                ? parseFloat(premiumSettingsResult.rows[0].setting_value) 
                : 15;
              
              const originalPrice = parseFloat(product.price);
              const salePrice = originalPrice * (1 - defaultDiscount / 100);
              
              product.sale_price = salePrice.toFixed(2);
              product.is_deal_of_the_day = true;
              product.deal_discount_percentage = defaultDiscount;
            }
          }
        }
      }
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
        requires_character_name, requires_shard, admin_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
      productData.requires_shard || false,
      productData.admin_notes || ''
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
        admin_notes = $15,
        updated_at = NOW()
      WHERE id = $16
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
      productData.admin_notes || '',
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

export async function updateProductAdminNotes(id: string, adminNotes: string) {
  try {
    const result = await query(`
      UPDATE products SET 
        admin_notes = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [adminNotes, id])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error updating product admin notes:', error)
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
        u.first_name,
        u.last_name,
        g.name as gift_name,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN gifts g ON o.gift_id = g.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.email, u.username, u.first_name, u.last_name, g.name
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

// Trading Board Functions
export async function createTradingPost(postData: any) {
  try {
         const result = await query(`
       INSERT INTO trading_posts (
         user_id, title, description, item_name, price, currency, 
         shard, character_name, contact_info, is_plot_owner_verified
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *
     `, [
       postData.user_id,
       postData.title,
       postData.description,
       postData.item_name,
       postData.price,
       postData.currency || 'GOLD',
       postData.shard || null,
       postData.character_name || null,
       postData.contact_info || null,
       postData.is_plot_owner_verified || false
     ])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error creating trading post:', error)
    throw error
  }
}

export async function getTradingPosts(filters: any = {}) {
  try {
    let queryString = `
      SELECT 
        tp.*,
        u.username as author_name,
        u.email as author_email
      FROM trading_posts tp
      LEFT JOIN users u ON tp.user_id = u.id
      WHERE tp.status = 'active'
    `
    
    const queryParams: any[] = []
    let paramCount = 0
    
    if (filters.shard) {
      paramCount++
      queryString += ` AND tp.shard ILIKE $${paramCount}`
      queryParams.push(`%${filters.shard}%`)
    }
    
    if (filters.item_name) {
      paramCount++
      queryString += ` AND tp.item_name ILIKE $${paramCount}`
      queryParams.push(`%${filters.item_name}%`)
    }
    
    if (filters.min_price !== undefined) {
      paramCount++
      queryString += ` AND tp.price >= $${paramCount}`
      queryParams.push(filters.min_price)
    }
    
    if (filters.max_price !== undefined) {
      paramCount++
      queryString += ` AND tp.price <= $${paramCount}`
      queryParams.push(filters.max_price)
    }
    
    queryString += ` ORDER BY tp.created_at DESC`
    
    if (filters.limit) {
      paramCount++
      queryString += ` LIMIT $${paramCount}`
      queryParams.push(filters.limit)
    }
    
    const result = await query(queryString, queryParams)
    return result.rows
  } catch (error) {
    console.error('Error fetching trading posts:', error)
    throw error
  }
}

export async function getTradingPostById(postId: string) {
  try {
    const result = await query(`
      SELECT 
        tp.*,
        u.username as author_name,
        u.email as author_email
      FROM trading_posts tp
      LEFT JOIN users u ON tp.user_id = u.id
      WHERE tp.id = $1
    `, [postId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error fetching trading post:', error)
    throw error
  }
}

export async function updateTradingPost(postId: string, userId: string, updateData: any) {
  try {
         const result = await query(`
       UPDATE trading_posts SET 
         title = $1,
         description = $2,
         item_name = $3,
         price = $4,
         currency = $5,
         shard = $6,
         character_name = $7,
         contact_info = $8,
         status = $9,
         updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *
     `, [
       updateData.title,
       updateData.description,
       updateData.item_name,
       updateData.price,
       updateData.currency || 'GOLD',
       updateData.shard || null,
       updateData.character_name || null,
       updateData.contact_info || null,
       updateData.status || 'active',
       postId,
       userId
     ])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error updating trading post:', error)
    throw error
  }
}

export async function deleteTradingPost(postId: string, userId: string) {
  try {
    const result = await query(`
      DELETE FROM trading_posts 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [postId, userId])
    
    return result.rows[0]
  } catch (error) {
    console.error('Error deleting trading post:', error)
    throw error
  }
}

export async function getUserTradingPosts(userId: string) {
  try {
    const result = await query(`
      SELECT * FROM trading_posts 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching user trading posts:', error)
    throw error
  }
}

export async function isUserPlotOwner(userId: string) {
  try {
    const result = await query(`
      SELECT COUNT(*) as plot_count 
      FROM plots 
      WHERE owner_id = $1
    `, [userId])
    
    return parseInt(result.rows[0].plot_count) > 0
  } catch (error) {
    console.error('Error checking if user is plot owner:', error)
    throw error
  }
}

// Category Review Functions
export async function getCategoryReviews(categorySlug: string) {
  try {
    const result = await query(`
      SELECT 
        cr.*,
        u.username as user_username,
        u.email as user_email
      FROM category_reviews cr
      JOIN categories c ON cr.category_id = c.id
      JOIN users u ON cr.user_id = u.id
      WHERE c.slug = $1 AND cr.status = 'approved'
      ORDER BY cr.created_at DESC
    `, [categorySlug])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching category reviews:', error)
    throw error
  }
}

export async function createCategoryReview({
  categoryId,
  userId,
  rating,
  title,
  content,
  status = 'pending'
}: {
  categoryId: string
  userId: string
  rating: number
  title?: string | null
  content: string
  status?: string
}) {
  try {
    await query('BEGIN')
    
    // Check if user already reviewed this category
    const existingReview = await query(`
      SELECT id, status FROM category_reviews 
      WHERE category_id = $1 AND user_id = $2
    `, [categoryId, userId])
    
    if (existingReview.rows.length > 0) {
      await query('ROLLBACK')
      throw new Error('You have already reviewed this category. You cannot submit another review.')
    }

    // Check if user has too many pending reviews (rate limiting)
    const pendingReviewsCount = await query(`
      SELECT COUNT(*) as count FROM category_reviews 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    if (pendingReviewsCount.rows[0].count >= 5) {
      await query('ROLLBACK')
      throw new Error('You have reached the maximum limit of 5 pending category reviews. Please wait for your existing reviews to be approved before submitting more.')
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
      INSERT INTO category_reviews (category_id, user_id, rating, title, content, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [categoryId, userId, rating, title, content, status])
    
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
      SELECT COUNT(*) as count FROM category_reviews 
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
    console.error('Error creating category review:', error)
    throw error
  }
}

// Product Image Submission Functions
export async function getProductImageSubmissions(productId: string) {
  try {
    const result = await query(`
      SELECT 
        pis.*,
        u.username as user_username,
        u.email as user_email
      FROM product_image_submissions pis
      JOIN users u ON pis.user_id = u.id
      WHERE pis.product_id = $1 AND pis.status = 'approved'
      ORDER BY pis.created_at DESC
    `, [productId])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching product image submissions:', error)
    throw error
  }
}

export async function createProductImageSubmission({
  productId,
  userId,
  imageUrl,
  cloudinaryPublicId,
  status = 'pending'
}: {
  productId: string
  userId: string
  imageUrl: string
  cloudinaryPublicId?: string
  status?: string
}) {
  try {
    await query('BEGIN')
    
    // Check if user already submitted an image for this product
    const existingSubmission = await query(`
      SELECT id, status FROM product_image_submissions 
      WHERE product_id = $1 AND user_id = $2
    `, [productId, userId])
    
    if (existingSubmission.rows.length > 0) {
      await query('ROLLBACK')
      throw new Error('You have already submitted an image for this product. You cannot submit another image.')
    }

    // Check if user has too many pending image submissions (rate limiting)
    const pendingSubmissionsCount = await query(`
      SELECT COUNT(*) as count FROM product_image_submissions 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    if (pendingSubmissionsCount.rows[0].count >= 5) {
      await query('ROLLBACK')
      throw new Error('You have reached the maximum limit of 5 pending image submissions. Please wait for your existing submissions to be approved before submitting more.')
    }
    
    // Insert new image submission
    const result = await query(`
      INSERT INTO product_image_submissions (product_id, user_id, image_url, cloudinary_public_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [productId, userId, imageUrl, cloudinaryPublicId, status])
    
    // Get updated count of pending submissions
    const updatedPendingCount = await query(`
      SELECT COUNT(*) as count FROM product_image_submissions 
      WHERE user_id = $1 AND status = $2
    `, [userId, 'pending'])
    
    await query('COMMIT')
    return { 
      ...result.rows[0], 
      isNewSubmission: true,
      pendingSubmissionsCount: parseInt(updatedPendingCount.rows[0].count),
      remainingSubmissions: Math.max(0, 5 - parseInt(updatedPendingCount.rows[0].count))
    }
  } catch (error) {
    await query('ROLLBACK')
    console.error('Error creating product image submission:', error)
    throw error
  }
}

// Event Items Functions
export async function getEventItems(filters: {
  page?: number
  limit?: number
  season?: number
  shard?: string
  itemType?: string
  status?: string
  search?: string
} = {}) {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 20
    const offset = (page - 1) * limit

    // Build WHERE clause
    let whereConditions = []
    let queryParams = []
    let paramIndex = 1

    if (filters.season) {
      whereConditions.push(`season_number = $${paramIndex}`)
      queryParams.push(filters.season)
      paramIndex++
    }

    if (filters.shard) {
      whereConditions.push(`shard = $${paramIndex}`)
      queryParams.push(filters.shard)
      paramIndex++
    }

    if (filters.itemType) {
      whereConditions.push(`item_type = $${paramIndex}`)
      queryParams.push(filters.itemType)
      paramIndex++
    }

    if (filters.status) {
      whereConditions.push(`status = $${paramIndex}`)
      queryParams.push(filters.status)
      paramIndex++
    }

    if (filters.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      queryParams.push(`%${filters.search}%`)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM event_items
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = parseInt(countResult.rows[0].total)

    // Get items
    const itemsQuery = `
      SELECT 
        id, name, slug, description, season_number, season_name,
        event_year, event_type, shard, original_image_url, cloudinary_url,
        item_type, hue_number, graphic_number, status, rarity_level,
        created_at, updated_at
      FROM event_items
      ${whereClause}
      ORDER BY season_number DESC, name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    const itemsResult = await query(itemsQuery, [...queryParams, limit, offset])

    // Get unique values for filters
    const seasonsResult = await query(`
      SELECT DISTINCT season_number, season_name 
      FROM event_items 
      ORDER BY season_number DESC
    `)

    const shardsResult = await query(`
      SELECT DISTINCT shard 
      FROM event_items 
      ORDER BY shard
    `)

    const itemTypesResult = await query(`
      SELECT DISTINCT item_type 
      FROM event_items 
      WHERE item_type IS NOT NULL
      ORDER BY item_type
    `)

    return {
      items: itemsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        seasons: seasonsResult.rows,
        shards: shardsResult.rows.map(row => row.shard).filter(shard => shard != null),
        itemTypes: itemTypesResult.rows.map(row => row.item_type).filter(type => type != null)
      }
    }
  } catch (error) {
    console.error('Error fetching event items:', error)
    throw error
  }
}

// Skills functions
export async function getSkills(filters?: {
  category?: string;
  difficulty?: number;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let whereConditions = ['s.is_active = $1'];
    let params: any[] = [true];
    let paramCount = 1;

    if (filters?.category) {
      whereConditions.push(`s.category = $${++paramCount}`);
      params.push(filters.category);
    }

    if (filters?.difficulty) {
      whereConditions.push(`s.difficulty_level = $${++paramCount}`);
      params.push(filters.difficulty);
    }

    if (filters?.search) {
      whereConditions.push(`(s.name ILIKE $${++paramCount} OR s.description ILIKE $${++paramCount})`);
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.join(' AND ');
    const limitClause = filters?.limit ? `LIMIT $${++paramCount}` : '';
    const offsetClause = filters?.offset ? `OFFSET $${++paramCount}` : '';

    if (filters?.limit) params.push(filters.limit);
    if (filters?.offset) params.push(filters.offset);

    const result = await query(`
      SELECT 
        s.*,
        COUNT(str.id) as training_range_count
      FROM skills s
      LEFT JOIN skill_training_ranges str ON s.id = str.skill_id
      WHERE ${whereClause}
      GROUP BY s.id
      ORDER BY s.sort_order ASC, s.name ASC
      ${limitClause} ${offsetClause}
    `, params);

    return result.rows;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
}

export async function getSkillBySlug(slug: string) {
  try {
    const result = await query(`
      SELECT * FROM skills 
      WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    const skill = result.rows[0];
    if (skill) {
      // Get training ranges for this skill
      const trainingRangesResult = await query(`
        SELECT * FROM skill_training_ranges 
        WHERE skill_id = $1 
        ORDER BY sort_order ASC
      `, [skill.id]);
      
      skill.training_ranges = trainingRangesResult.rows;
    }
    
    return skill;
  } catch (error) {
    console.error('Error fetching skill:', error);
    throw error;
  }
}

export async function getSkillCategories() {
  try {
    const result = await query(`
      SELECT DISTINCT category, COUNT(*) as skill_count
      FROM skills 
      WHERE is_active = true 
      GROUP BY category 
      ORDER BY category
    `);
    // Convert skill_count to number since PostgreSQL returns it as string
    return result.rows.map(row => ({
      ...row,
      skill_count: parseInt(row.skill_count, 10)
    }));
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    throw error;
  }
}

// Admin functions for skills
export async function getAllSkills() {
  try {
    const result = await query(`
      SELECT 
        s.*,
        COUNT(str.id) as training_range_count
      FROM skills s
      LEFT JOIN skill_training_ranges str ON s.id = str.skill_id
      GROUP BY s.id
      ORDER BY s.sort_order ASC, s.name ASC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all skills:', error);
    throw error;
  }
}

export async function createSkill(skillData: any) {
  try {
    const result = await query(`
      INSERT INTO skills (
        name, slug, description, overview, training_guide, skill_bonuses,
        recommended_template, advanced_notes, category, difficulty_level,
        is_active, sort_order, meta_title, meta_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      skillData.name,
      skillData.slug,
      skillData.description || '',
      skillData.overview || '',
      skillData.training_guide || '',
      skillData.skill_bonuses || '',
      skillData.recommended_template || '',
      skillData.advanced_notes || '',
      skillData.category || 'general',
      skillData.difficulty_level || 1,
      skillData.is_active !== false,
      skillData.sort_order || 0,
      skillData.meta_title || '',
      skillData.meta_description || ''
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating skill:', error);
    throw error;
  }
}

export async function updateSkill(id: string, skillData: any) {
  try {
    const result = await query(`
      UPDATE skills SET 
        name = $1,
        slug = $2,
        description = $3,
        overview = $4,
        training_guide = $5,
        skill_bonuses = $6,
        recommended_template = $7,
        advanced_notes = $8,
        category = $9,
        difficulty_level = $10,
        is_active = $11,
        sort_order = $12,
        meta_title = $13,
        meta_description = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *
    `, [
      skillData.name,
      skillData.slug,
      skillData.description || '',
      skillData.overview || '',
      skillData.training_guide || '',
      skillData.skill_bonuses || '',
      skillData.recommended_template || '',
      skillData.advanced_notes || '',
      skillData.category || 'general',
      skillData.difficulty_level || 1,
      skillData.is_active !== false,
      skillData.sort_order || 0,
      skillData.meta_title || '',
      skillData.meta_description || '',
      id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
}

export async function deleteSkill(id: string) {
  try {
    const result = await query(`
      DELETE FROM skills 
      WHERE id = $1
      RETURNING id
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
}

// Training ranges functions
export async function getSkillTrainingRanges(skillId: string) {
  try {
    const result = await query(`
      SELECT * FROM skill_training_ranges 
      WHERE skill_id = $1 
      ORDER BY sort_order ASC
    `, [skillId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching skill training ranges:', error);
    throw error;
  }
}

export async function createSkillTrainingRange(trainingRangeData: any) {
  try {
    const result = await query(`
      INSERT INTO skill_training_ranges (
        skill_id, skill_range, suggested_targets, training_notes, sort_order
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      trainingRangeData.skill_id,
      trainingRangeData.skill_range,
      trainingRangeData.suggested_targets,
      trainingRangeData.training_notes || '',
      trainingRangeData.sort_order || 0
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating skill training range:', error);
    throw error;
  }
}

export async function updateSkillTrainingRange(id: string, trainingRangeData: any) {
  try {
    const result = await query(`
      UPDATE skill_training_ranges SET 
        skill_range = $1,
        suggested_targets = $2,
        training_notes = $3,
        sort_order = $4
      WHERE id = $5
      RETURNING *
    `, [
      trainingRangeData.skill_range,
      trainingRangeData.suggested_targets,
      trainingRangeData.training_notes || '',
      trainingRangeData.sort_order || 0,
      id
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating skill training range:', error);
    throw error;
  }
}

export async function deleteSkillTrainingRange(id: string) {
  try {
    const result = await query(`
      DELETE FROM skill_training_ranges 
      WHERE id = $1
      RETURNING id
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting skill training range:', error);
    throw error;
  }
}

export async function updateSkillTrainingRanges(skillId: string, trainingRanges: any[]) {
  try {
    // Start a transaction
    await query('BEGIN');
    
    // Delete existing training ranges for this skill
    await query('DELETE FROM skill_training_ranges WHERE skill_id = $1', [skillId]);
    
    // Insert new training ranges
    for (let i = 0; i < trainingRanges.length; i++) {
      const range = trainingRanges[i];
      if (range.skill_range && range.suggested_targets) {
        await query(`
          INSERT INTO skill_training_ranges (skill_id, skill_range, suggested_targets, training_notes, sort_order)
          VALUES ($1, $2, $3, $4, $5)
        `, [skillId, range.skill_range, range.suggested_targets, range.training_notes || '', i]);
      }
    }
    
    await query('COMMIT');
    return true;
  } catch (error) {
    await query('ROLLBACK');
    console.error('Error updating skill training ranges:', error);
    throw error;
  }
}

// Account upgrade functions
export async function upgradeUserAccount(userId: string) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const UPGRADE_COST = 2000
    
    // Check if user already has premium account
    const userResult = await client.query(`
      SELECT account_rank FROM users WHERE id = $1
    `, [userId])
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found')
    }
    
    if (userResult.rows[0].account_rank === 1) {
      throw new Error('User already has a premium account')
    }
    
    // Check user has enough points
    const userPointsResult = await client.query(`
      SELECT current_points FROM user_points WHERE user_id = $1
    `, [userId])
    
    if (userPointsResult.rows.length === 0) {
      throw new Error('User points record not found')
    }
    
    const userPoints = userPointsResult.rows[0]
    
    if (userPoints.current_points < UPGRADE_COST) {
      throw new Error('Insufficient points')
    }
    
    // Deduct points from user
    await client.query(`
      UPDATE user_points 
      SET current_points = current_points - $1, 
          points_spent = points_spent + $1,
          updated_at = NOW()
      WHERE user_id = $2
    `, [UPGRADE_COST, userId])
    
    // Upgrade user account
    const updateResult = await client.query(`
      UPDATE users 
      SET account_rank = 1, 
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [userId])
    
    await client.query('COMMIT')
    
    return {
      user: updateResult.rows[0],
      pointsSpent: UPGRADE_COST,
      newPointsBalance: userPoints.current_points - UPGRADE_COST
    }
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error upgrading user account:', error)
    throw error
  } finally {
    client.release()
  }
}

// Premium settings functions
export async function getPremiumSettings() {
  try {
    const result = await query(`
      SELECT setting_key, setting_value, description 
      FROM premium_settings 
      ORDER BY setting_key
    `)
    
    const settings: Record<string, any> = {}
    result.rows.forEach(row => {
      // Convert numeric values
      if (['premium_discount_percentage', 'deal_of_day_regular_discount', 'deal_of_day_premium_discount', 'prize_amount', 'winners_count'].includes(row.setting_key)) {
        settings[row.setting_key] = parseFloat(row.setting_value)
      } else if (row.setting_key === 'contest_enabled') {
        settings[row.setting_key] = row.setting_value === 'true'
      } else {
        settings[row.setting_key] = row.setting_value
      }
    })
    
    return settings
  } catch (error) {
    console.error('Error fetching premium settings:', error)
    throw error
  }
}

export async function updatePremiumSetting(key: string, value: string) {
  try {
    const result = await query(`
      UPDATE premium_settings 
      SET setting_value = $1, updated_at = NOW()
      WHERE setting_key = $2
      RETURNING *
    `, [value, key])
    
    if (result.rows.length === 0) {
      throw new Error(`Setting ${key} not found`)
    }
    
    return result.rows[0]
  } catch (error) {
    console.error('Error updating premium setting:', error)
    throw error
  }
}

export async function getContestWinners(limit: number = 10) {
  try {
    const result = await query(`
      SELECT 
        cw.*,
        u.first_name,
        u.last_name,
        u.email
      FROM contest_winners cw
      JOIN users u ON cw.user_id = u.id
      ORDER BY cw.contest_period DESC, cw.awarded_at DESC
      LIMIT $1
    `, [limit])
    
    return result.rows
  } catch (error) {
    console.error('Error fetching contest winners:', error)
    throw error
  }
}

export async function selectContestWinners() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    // Get current contest period (bi-weekly)
    const now = new Date()
    const year = now.getFullYear()
    const week = Math.ceil((now.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
    const biWeek = Math.ceil(week / 2)
    const contestPeriod = `${year}-${biWeek.toString().padStart(2, '0')}`
    
    // Check if winners already selected for this period
    const existingWinners = await client.query(`
      SELECT COUNT(*) as count FROM contest_winners WHERE contest_period = $1
    `, [contestPeriod])
    
    if (parseInt(existingWinners.rows[0].count) > 0) {
      throw new Error(`Winners already selected for contest period ${contestPeriod}`)
    }
    
    // Get premium users (account_rank = 1)
    const premiumUsers = await client.query(`
      SELECT id, first_name, last_name, email 
      FROM users 
      WHERE account_rank = 1 
      ORDER BY RANDOM()
    `)
    
    if (premiumUsers.rows.length === 0) {
      throw new Error('No premium users found for contest')
    }
    
    // Get contest settings
    const settings = await client.query(`
      SELECT setting_key, setting_value 
      FROM premium_settings 
      WHERE setting_key IN ('contest_prize_amount', 'contest_winners_count')
    `)
    
    const settingsMap: Record<string, any> = {}
    settings.rows.forEach(row => {
      if (row.setting_key === 'contest_prize_amount') {
        settingsMap.prizeAmount = parseFloat(row.setting_value)
      } else if (row.setting_key === 'contest_winners_count') {
        settingsMap.winnersCount = parseInt(row.setting_value)
      }
    })
    
    const prizeAmount = settingsMap.prizeAmount || 50
    const winnersCount = Math.min(settingsMap.winnersCount || 2, premiumUsers.rows.length)
    
    const winners = []
    
    // Select winners and award prizes
    for (let i = 0; i < winnersCount; i++) {
      const winner = premiumUsers.rows[i]
      
      // Add to contest winners table
      await client.query(`
        INSERT INTO contest_winners (user_id, contest_period, prize_amount)
        VALUES ($1, $2, $3)
      `, [winner.id, contestPeriod, prizeAmount])
      
      // Add cashback to user's balance
      await client.query(`
        UPDATE user_points 
        SET referral_cash = referral_cash + $1, updated_at = NOW()
        WHERE user_id = $2
      `, [prizeAmount, winner.id])
      
      winners.push({
        ...winner,
        prize_amount: prizeAmount,
        contest_period: contestPeriod
      })
    }
    
    await client.query('COMMIT')
    
    return {
      contest_period: contestPeriod,
      winners: winners,
      total_prize_amount: prizeAmount * winnersCount
    }
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error selecting contest winners:', error)
    throw error
  } finally {
    client.release()
  }
}

export default pool; 