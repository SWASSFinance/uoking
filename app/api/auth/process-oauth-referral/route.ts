import { NextRequest, NextResponse } from 'next/server'
import { processReferral } from '@/lib/referral'

export async function POST(request: NextRequest) {
  try {
    const { referralCode, userId } = await request.json()
    
    if (!referralCode || !userId) {
      return NextResponse.json(
        { error: 'Missing referral code or user ID' },
        { status: 400 }
      )
    }

    // Process referral
    await processReferral(referralCode, userId)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to process OAuth referral:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process referral' },
      { status: 500 }
    )
  }
}
