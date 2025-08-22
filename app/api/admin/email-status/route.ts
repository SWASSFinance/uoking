import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Check Resend configuration
    const resendApiKey = process.env.RESEND_API_KEY
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const nodeEnv = process.env.NODE_ENV

    return NextResponse.json({
      resendConfigured: !!resendApiKey,
      resendApiKeyLength: resendApiKey ? resendApiKey.length : 0,
      baseUrl: baseUrl || 'Not set',
      environment: nodeEnv || 'development',
      fromEmail: 'noreply@uoking.com'
    })

  } catch (error) {
    console.error('Error checking email status:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to check email status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
