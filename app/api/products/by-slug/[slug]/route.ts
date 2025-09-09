import { NextResponse } from 'next/server'
import { getProductBySlug, getProductReviews, query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Check if user is premium
    const session = await auth()
    let isPremiumUser = false
    
    if (session?.user?.email) {
      const userResult = await query(`
        SELECT account_rank FROM users WHERE email = $1
      `, [session.user.email])
      isPremiumUser = userResult.rows[0]?.account_rank === 1
    }
    
    // Fetch product and reviews
    const [product, reviews] = await Promise.all([
      getProductBySlug(slug),
      getProductBySlug(slug).then(product => 
        product ? getProductReviews(product.id) : []
      )
    ])

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Apply premium discount to deal of the day if user is premium
    if (product.is_deal_of_the_day && isPremiumUser) {
      // Get premium discount settings
      const premiumSettingsResult = await query(`
        SELECT setting_key, setting_value FROM premium_settings 
        WHERE setting_key IN ('deal_of_day_regular_discount', 'deal_of_day_premium_discount')
      `)
      
      const premiumSettings: Record<string, number> = {}
      premiumSettingsResult.rows.forEach(row => {
        premiumSettings[row.setting_key] = parseFloat(row.setting_value)
      })
      
      const premiumDiscount = premiumSettings.deal_of_day_premium_discount || 25
      const originalPrice = parseFloat(product.price)
      const salePrice = originalPrice * (1 - premiumDiscount / 100)
      
      // Update product with premium deal pricing
      product.sale_price = salePrice.toFixed(2)
      product.deal_discount_percentage = premiumDiscount
      product.is_premium_user = true
    }

    return NextResponse.json({
      product,
      reviews
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
