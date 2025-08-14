import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { processReferral } from '@/lib/referral'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      characterName,
      email,
      password,
      agreeToTerms,
      agreeToMarketing,
      referralCode
    } = body

    // Validate required fields
    if (!characterName || !email || !password || !agreeToTerms) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await query(`
      SELECT id FROM users WHERE email = $1
    `, [email])

    if (existingUser.rows && existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Generate username from email
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000)

    // Create user
    const userResult = await query(`
      INSERT INTO users (
        email, 
        username, 
        password_hash, 
        first_name, 
        last_name, 
        discord_username,
        character_names,
        status,
        email_verified,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING id, email, username, first_name, last_name, character_names
    `, [email, username, passwordHash, characterName, '', null, [characterName], 'active', false])

    if (!userResult.rows || userResult.rows.length === 0) {
      throw new Error('Failed to create user')
    }

    const newUser = userResult.rows[0]

    // Process referral if provided
    if (referralCode) {
      try {
        await processReferral(referralCode, newUser.id)
      } catch (referralError) {
        console.error('Referral processing failed:', referralError)
        // Don't fail the signup if referral fails
      }
    }

    // Create user's referral code
    try {
      const { getUserReferralCode } = await import('@/lib/referral')
      await getUserReferralCode(newUser.id)
    } catch (referralError) {
      console.error('Failed to create user referral code:', referralError)
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        characterName: newUser.first_name,
        characterNames: newUser.character_names
      }
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
} 