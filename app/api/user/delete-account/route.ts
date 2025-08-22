import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function DELETE(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth()
    
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
      
      // IMPORTANT: Keep all orders and order items for business/legal reasons
      // Instead of deleting orders, we'll mark the user as deleted
      
      // Finally, mark the user as deleted instead of actually deleting them
      // Note: We'll use 'banned' status since 'deleted' isn't in the enum, but this preserves the data
      await query(`
        UPDATE users 
        SET 
          status = 'banned',
          email = CONCAT('deleted_', id, '_', EXTRACT(EPOCH FROM NOW())::bigint, '@deleted.com'),
          username = CONCAT('deleted_user_', id),
          first_name = 'Deleted',
          last_name = 'User',
          character_names = NULL,
          discord_username = NULL,
          updated_at = NOW()
        WHERE id = $1
      `, [userId])
      
      // Commit the transaction
      await query('COMMIT')
      
      return NextResponse.json(
        { 
          success: true,
          message: 'Account deactivated successfully. Your order history has been preserved for business records.'
        },
        { status: 200 }
      )
      
    } catch (error) {
      // Rollback the transaction if any error occurs
      await query('ROLLBACK')
      throw error
    }
    
  } catch (error) {
    console.error('Error deleting account:', error)
    
    // Check if it's a database constraint error
    if (error instanceof Error) {
      const errorMessage = error.message
      
      // Handle specific database errors
      if (errorMessage.includes('foreign key constraint')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Cannot delete account: User has active orders or other related data',
            details: 'Please contact support to delete your account'
          },
          { status: 400 }
        )
      }
      
      if (errorMessage.includes('duplicate key')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Database constraint violation',
            details: errorMessage
          },
          { status: 400 }
        )
      }
      
      // For other database errors, return more details in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Database error occurred',
            details: errorMessage,
            type: 'database_error'
          },
          { status: 500 }
        )
      }
    }
    
    // Generic error for production
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete account',
        details: 'An unexpected error occurred. Please try again or contact support.'
      },
      { status: 500 }
    )
  }
}
