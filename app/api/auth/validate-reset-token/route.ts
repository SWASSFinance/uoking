import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Get all active reset tokens for this token
    const [resetTokens] = await db.execute(
      'SELECT prt.id, prt.user_id, prt.token_hash, prt.expires_at, prt.used_at, u.email FROM password_reset_tokens prt JOIN users u ON prt.user_id = u.id WHERE prt.used_at IS NULL',
      []
    )

    if (!Array.isArray(resetTokens) || resetTokens.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find the matching token by comparing hashes
    let validToken = null
    for (const resetToken of resetTokens) {
      const isValid = await bcrypt.compare(token, resetToken.token_hash)
      if (isValid) {
        validToken = resetToken
        break
      }
    }

    if (!validToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    const now = new Date()
    const expiryDate = new Date(validToken.expires_at)

    if (now > expiryDate) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Token is valid' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Validate reset token error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
