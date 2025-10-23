import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateAdminSession } from '@/lib/auth-security'

export async function GET(request: NextRequest) {
  try {
    // Validate admin session
    await validateAdminSession()

    // Find all emails that have multiple users
    const duplicateEmails = await query(`
      SELECT 
        email, 
        COUNT(*) as user_count,
        ARRAY_AGG(id ORDER BY created_at DESC) as user_ids,
        ARRAY_AGG(username ORDER BY created_at DESC) as usernames,
        ARRAY_AGG(first_name ORDER BY created_at DESC) as first_names,
        ARRAY_AGG(last_name ORDER BY created_at DESC) as last_names,
        ARRAY_AGG(created_at ORDER BY created_at DESC) as created_dates,
        ARRAY_AGG(status ORDER BY created_at DESC) as statuses
      FROM users 
      WHERE email IS NOT NULL
      GROUP BY email 
      HAVING COUNT(*) > 1
      ORDER BY user_count DESC, email
    `)

    // Get detailed info for each duplicate email
    const detailedDuplicates = []
    for (const duplicate of duplicateEmails.rows) {
      const userDetails = await query(`
        SELECT 
          id, email, username, first_name, last_name, 
          created_at, status, is_admin, last_login_at,
          discord_username, main_shard, character_names
        FROM users 
        WHERE email = $1
        ORDER BY created_at DESC
      `, [duplicate.email])
      
      detailedDuplicates.push({
        email: duplicate.email,
        userCount: duplicate.user_count,
        users: userDetails.rows
      })
    }

    return NextResponse.json({
      success: true,
      duplicateCount: duplicateEmails.rows.length,
      duplicates: detailedDuplicates
    })

  } catch (error) {
    console.error('Error checking duplicate emails:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check duplicate emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
