// OPTIMIZED: Product query functions to reduce database load
import { query } from './db'

/**
 * OPTIMIZED getProducts - eliminates expensive STRING_AGG operations
 * Instead of complex JOINs with aggregations, we:
 * 1. Get products with simple query
 * 2. Fetch related data separately with indexed queries
 * 3. Combine results in application layer
 * 
 * This reduces database CPU significantly!
 */
export async function getProductsOptimized(filters?: {
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

    // Step 1: Get products with basic info only - MUCH FASTER!
    const productsResult = await query(`
      SELECT 
        p.id, p.name, p.slug, p.description, p.price, p.stock_quantity,
        p.image_url, p.featured, p.type, p.rank, p.status, p.created_at,
        p.sale_price, p.game_item_id
      FROM products p
      WHERE ${whereClause}
      ORDER BY p.rank ASC, p.name ASC, p.featured DESC, p.created_at DESC
      ${limitClause} ${offsetClause}
    `, params);

    const products = productsResult.rows;

    if (products.length === 0) {
      return products;
    }

    const productIds = products.map(p => p.id);

    // Step 2: Get all review stats in one query (indexed on product_id + status)
    const reviewStats = await query(`
      SELECT 
        product_id,
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(id) as review_count
      FROM product_reviews
      WHERE product_id = ANY($1) AND status = 'approved'
      GROUP BY product_id
    `, [productIds]);

    // Step 3: Get all categories in one query (indexed on product_id)
    const categoriesResult = await query(`
      SELECT 
        pc.product_id,
        c.id, c.name, c.slug
      FROM product_categories pc
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.product_id = ANY($1)
      ORDER BY pc.is_primary DESC, c.name
    `, [productIds]);

    // Step 4: Get all classes in one query (indexed on product_id)
    const classesResult = await query(`
      SELECT 
        pcl.product_id,
        cl.id, cl.name, cl.slug
      FROM product_classes pcl
      JOIN classes cl ON pcl.class_id = cl.id
      WHERE pcl.product_id = ANY($1)
      ORDER BY cl.name
    `, [productIds]);

    // Step 5: Combine all data in memory (very fast)
    const reviewsMap = new Map(reviewStats.rows.map(r => [r.product_id, r]));
    const categoriesMap = new Map<string, any[]>();
    const classesMap = new Map<string, any[]>();

    categoriesResult.rows.forEach(cat => {
      if (!categoriesMap.has(cat.product_id)) {
        categoriesMap.set(cat.product_id, []);
      }
      categoriesMap.get(cat.product_id)!.push(cat);
    });

    classesResult.rows.forEach(cls => {
      if (!classesMap.has(cls.product_id)) {
        classesMap.set(cls.product_id, []);
      }
      classesMap.get(cls.product_id)!.push(cls);
    });

    // Enrich products with related data
    return products.map(product => {
      const reviews = reviewsMap.get(product.id) || { avg_rating: 0, review_count: 0 };
      const categories = categoriesMap.get(product.id) || [];
      const classes = classesMap.get(product.id) || [];

      return {
        ...product,
        avg_rating: reviews.avg_rating,
        review_count: reviews.review_count,
        category_names: categories.map(c => c.name).join(', '),
        category_ids: categories.map(c => c.id).join(','),
        class_names: classes.map(c => c.name).join(', '),
        class_ids: classes.map(c => c.id).join(','),
        categories,
        classes
      };
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

