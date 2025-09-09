import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    // Check if user is premium
    const session = await auth()
    let isPremiumUser = false
    
    if (session?.user?.email) {
      const userResult = await query(`
        SELECT account_rank FROM users WHERE email = $1
      `, [session.user.email])
      isPremiumUser = userResult.rows[0]?.account_rank === 1
    }

    // First check if deal of the day is enabled
    const settingsResult = await query(`
      SELECT setting_value FROM site_settings 
      WHERE setting_key = 'enable_deal_of_the_day'
    `)
    
    const isEnabled = settingsResult.rows?.[0]?.setting_value === 'true'
    
    if (!isEnabled) {
      return NextResponse.json({ deal: null, enabled: false })
    }

    // Get premium discount settings
    const premiumSettingsResult = await query(`
      SELECT setting_key, setting_value FROM premium_settings 
      WHERE setting_key IN ('deal_of_day_regular_discount', 'deal_of_day_premium_discount')
    `)
    
    const premiumSettings: Record<string, number> = {}
    premiumSettingsResult.rows.forEach(row => {
      premiumSettings[row.setting_key] = parseFloat(row.setting_value)
    })
    
    const regularDiscount = premiumSettings.deal_of_day_regular_discount || 15
    const premiumDiscount = premiumSettings.deal_of_day_premium_discount || 25

    // Get today's date
    const today = new Date().toISOString().split('T')[0]
    
    // Fetch today's deal
    const result = await query(`
      SELECT 
        d.id,
        d.discount_percentage,
        d.start_date,
        d.end_date,
        p.id as product_id,
        p.name,
        p.slug,
        p.price,
        p.image_url,
        p.short_description
      FROM deal_of_the_day d
      JOIN products p ON d.product_id = p.id
      WHERE d.start_date = $1 
        AND d.is_active = true
        AND p.status = 'active'
      ORDER BY d.created_at DESC
      LIMIT 1
    `, [today])

    if (!result.rows || result.rows.length === 0) {
      // If no deal for today, get a deterministic featured product based on today's date
      const today = new Date()
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
      
      // First get the count of featured products
      const countResult = await query(`
        SELECT COUNT(*) as count FROM products 
        WHERE status = 'active' AND featured = true
      `)
      
      const totalFeatured = parseInt(countResult.rows[0].count)
      
      if (totalFeatured === 0) {
        return NextResponse.json({ deal: null, enabled: true })
      }
      
      // Use day of year to select a consistent product for the day
      const offset = dayOfYear % totalFeatured
      
      const randomProductResult = await query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.price,
          p.image_url,
          p.short_description
        FROM products p
        WHERE p.status = 'active' 
          AND p.featured = true
        ORDER BY p.id
        LIMIT 1
        OFFSET $1
      `, [offset])

      if (randomProductResult.rows && randomProductResult.rows.length > 0) {
        const product = randomProductResult.rows[0]
        const discountPercentage = isPremiumUser ? premiumDiscount : regularDiscount
        const originalPrice = parseFloat(product.price)
        const salePrice = originalPrice * (1 - discountPercentage / 100)
        
        return NextResponse.json({
          deal: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: originalPrice,
            sale_price: salePrice,
            image_url: product.image_url,
            short_description: product.short_description,
            discount_percentage: discountPercentage
          },
          enabled: true,
          isDefault: true,
          isPremiumUser: isPremiumUser
        })
      }
      
      return NextResponse.json({ deal: null, enabled: true })
    }

    const dealData = result.rows[0]
    const originalPrice = parseFloat(dealData.price)
    
    // Use premium discount if user is premium, otherwise use the deal's discount
    const baseDiscountPercentage = parseFloat(dealData.discount_percentage)
    const discountPercentage = isPremiumUser ? premiumDiscount : baseDiscountPercentage
    const salePrice = originalPrice * (1 - discountPercentage / 100)

    return NextResponse.json({
      deal: {
        id: dealData.product_id,
        name: dealData.name,
        slug: dealData.slug,
        price: originalPrice,
        sale_price: salePrice,
        image_url: dealData.image_url,
        short_description: dealData.short_description,
        discount_percentage: discountPercentage
      },
      enabled: true,
      isDefault: false,
      isPremiumUser: isPremiumUser
    })

  } catch (error) {
    console.error('Error fetching deal of the day:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal of the day' },
      { status: 500 }
    )
  }
} 