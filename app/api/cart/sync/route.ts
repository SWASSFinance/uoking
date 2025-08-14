import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { query } from '@/lib/db'
import { Cart } from '@/lib/cart'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    
    if (!token?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const cart: Cart = await request.json()

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Get user ID
    const userResult = await query(`
      SELECT id FROM users WHERE email = $1
    `, [token.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

    // Generate order number
    const orderNumber = `UOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const orderResult = await query(`
      INSERT INTO orders (
        user_id, 
        order_number, 
        status, 
        subtotal,
        total_amount, 
        currency,
        payment_status,
        delivery_status,
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id
    `, [userId, orderNumber, 'pending', cart.total, cart.total, 'USD', 'pending', 'pending'])

    if (!orderResult.rows || orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    const orderId = orderResult.rows[0].id

    // Insert cart items
    for (const item of cart.items) {
      await query(`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          unit_price,
          total_price,
          product_snapshot,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `, [
        orderId,
        item.id,
        item.name,
        item.quantity,
        item.price,
        item.price * item.quantity,
        JSON.stringify({
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          category: item.category
        })
      ])
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Cart synced successfully'
    })

  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json(
      { error: 'Failed to sync cart' },
      { status: 500 }
    )
  }
} 