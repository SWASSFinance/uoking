import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const usersResult = await query(
      'SELECT id, email, first_name FROM users WHERE email = $1',
      [email]
    )

    if (!usersResult.rows || usersResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, you will receive a password reset link.' },
        { status: 200 }
      )
    }

    const user = usersResult.rows[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenHash = await bcrypt.hash(resetToken, 12)
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in password_reset_tokens table
    await query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetTokenHash, resetTokenExpiry]
    )

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://uoking.com'}/reset-password?token=${resetToken}`

    // Send password reset email
    try {
      await sendEmail(email, 'passwordReset', {
        name: user.first_name || 'User',
        email: user.email,
        resetUrl: resetUrl
      }, {
        from: 'UO King <noreply@uoking.com>',
        replyTo: 'support@uoking.com'
      })

      console.log('Password reset email sent successfully to:', email)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      
      // Remove the reset token if email failed
      await query(
        'DELETE FROM password_reset_tokens WHERE user_id = $1 AND token_hash = $2',
        [user.id, resetTokenHash]
      )

      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, you will receive a password reset link.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
