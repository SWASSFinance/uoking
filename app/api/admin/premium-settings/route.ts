import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { getPremiumSettings, updatePremiumSetting, query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query(`
      SELECT is_admin FROM users WHERE id = $1
    `, [session.user.id])

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const settings = await getPremiumSettings()

    return NextResponse.json({
      success: true,
      settings
    })

  } catch (error) {
    console.error('Error fetching premium settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch premium settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const userResult = await query(`
      SELECT is_admin FROM users WHERE id = $1
    `, [session.user.id])

    if (!userResult.rows[0]?.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const settings = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await updatePremiumSetting(key, value.toString())
    }

    return NextResponse.json({
      success: true,
      message: 'Premium settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating premium settings:', error)
    return NextResponse.json(
      { error: 'Failed to update premium settings' },
      { status: 500 }
    )
  }
}
