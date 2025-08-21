import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from session
    const userResult = await query('SELECT id FROM users WHERE email = $1', [session.user.email])
    
    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

    // Start a transaction to delete all user-related data
    await query('BEGIN')

    try {
      // Delete user-related data in the correct order (respecting foreign key constraints)
      
      // Delete cart items
      await query('DELETE FROM cart_items WHERE user_id = $1', [userId])
      
      // Delete product reviews
      await query('DELETE FROM product_reviews WHERE user_id = $1', [userId])
      
      // Delete user points
      await query('DELETE FROM user_points WHERE user_id = $1', [userId])
      
      // Delete user sessions
      await query('DELETE FROM user_sessions WHERE user_id = $1', [userId])
      
      // Delete password reset tokens
      await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId])
      
      // Delete referral relationships
      await query('DELETE FROM user_referrals WHERE referrer_id = $1 OR referred_id = $1', [userId])
      
      // Delete orders and order items
      const orderResult = await query('SELECT id FROM orders WHERE user_id = $1', [userId])
      for (const order of orderResult.rows) {
        await query('DELETE FROM order_items WHERE order_id = $1', [order.id])
      }
      await query('DELETE FROM orders WHERE user_id = $1', [userId])
      
      // Finally, delete the user
      await query('DELETE FROM users WHERE id = $1', [userId])
      
      // Commit the transaction
      await query('COMMIT')
      
      return NextResponse.json(
        { message: 'Account deleted successfully' },
        { status: 200 }
      )
      
    } catch (error) {
      // Rollback the transaction if any error occurs
      await query('ROLLBACK')
      throw error
    }
    
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
}
