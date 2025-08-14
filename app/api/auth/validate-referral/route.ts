import { NextRequest, NextResponse } from 'next/server'
import { validateReferralCode } from '@/lib/referral'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    const referral = await validateReferralCode(code)

    if (!referral) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      valid: true,
      referrer: {
        username: referral.username
      }
    })

  } catch (error) {
    console.error('Error validating referral code:', error)
    return NextResponse.json(
      { error: 'Failed to validate referral code' },
      { status: 500 }
    )
  }
} 