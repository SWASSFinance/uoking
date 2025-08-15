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
    const whereClause = parentId ? 'WHERE parent_id = $1' : 'WHERE parent_id IS NULL';
    const params = parentId ? [parentId] : [];
    const result = await query(`
      SELECT * FROM categories 
      ${whereClause} AND is_active = true 
      ORDER BY sort_order, name
    `, params);
    return result.rows;
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
      whereConditions.push(`p.category_id = $${++paramCount}`);
      params.push(filters.categoryId);
    }

    if (filters?.classId) {
      whereConditions.push(`p.class_id = $${++paramCount}`);
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
        c.name as category_name,
        c.slug as category_slug,
        cl.name as class_name,
        cl.slug as class_slug,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN classes cl ON p.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE ${whereClause}
      GROUP BY p.id, c.name, c.slug, cl.name, cl.slug
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
        c.name as category_name,
        c.slug as category_slug,
        cl.name as class_name,
        cl.slug as class_slug,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN classes cl ON p.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE p.slug = $1 AND p.status = 'active'
      GROUP BY p.id, c.name, c.slug, cl.name, cl.slug
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
        u.last_name
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = $1 AND pr.status = 'approved'
      ORDER BY pr.created_at DESC
    `, [productId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
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
        c.name as category_name,
        c.slug as category_slug,
        cl.name as class_name,
        cl.slug as class_slug,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count,
        ts_rank(
          to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.short_description, '')),
          plainto_tsquery('english', $1)
        ) as search_rank
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN classes cl ON p.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE 
        p.status = 'active' AND 
        (
          to_tsvector('english', p.name || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.short_description, '')) 
          @@ plainto_tsquery('english', $1)
          OR p.name ILIKE $2
          OR p.description ILIKE $2
        )
      GROUP BY p.id, c.name, c.slug, cl.name, cl.slug
      ORDER BY search_rank DESC, p.rank ASC, p.name ASC, p.featured DESC, p.created_at DESC
      LIMIT $3
    `, [searchTerm, `%${searchTerm}%`, limit]);
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
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN classes cl ON p.class_id = cl.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.status = 'approved'
      WHERE pc.category_id = $1 AND ${whereClause}
      GROUP BY p.id, c.name, c.slug, cl.name, cl.slug, pc.is_primary
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
      SELECT c.id, c.name, c.slug, pc.is_primary
      FROM product_categories pc
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.product_id = $1
      ORDER BY pc.is_primary DESC, c.name
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
        c.name as category_name,
        c.slug as category_slug,
        cl.name as class_name,
        cl.slug as class_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN classes cl ON p.class_id = cl.id
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
        image_url, status, featured, category_id, class_id, type, rank,
        requires_character_name, requires_shard
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
      productData.category_id || null,
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
        category_id = $10,
        class_id = $11,
        type = $12,
        rank = $13,
        requires_character_name = $14,
        requires_shard = $15,
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
      productData.category_id || null,
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
      SELECT COUNT(*) as product_count FROM products WHERE category_id = $1
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
      SELECT id, email, username, first_name, last_name, discord_username, main_shard, character_names, status, email_verified, is_admin, created_at, updated_at, last_login_at
      FROM users 
      ORDER BY created_at DESC
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

export default pool; 