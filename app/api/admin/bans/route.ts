import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!adminResult.rows || adminResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!adminResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // 'banned_users', 'ban_history', 'banned_emails', 'banned_ips', 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let result: any = {}

    if (type === 'banned_users' || type === 'all') {
      // Get currently banned users
      const bannedUsersResult = await query(`
        SELECT 
          u.id, u.email, u.username, u.status, u.banned_at, u.ban_reason, 
          u.ban_expires_at, u.is_permanently_banned,
          a.email as banned_by_email,
          up.last_ip_address
        FROM users u
        LEFT JOIN users a ON u.banned_by = a.id
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.status = 'banned'
        ORDER BY u.banned_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])

      const totalBannedUsersResult = await query(`
        SELECT COUNT(*) as count FROM users WHERE status = 'banned'
      `)

      result.bannedUsers = {
        users: bannedUsersResult.rows,
        total: parseInt(totalBannedUsersResult.rows[0].count),
        page,
        limit
      }
    }

    if (type === 'ban_history' || type === 'all') {
      // Get ban history
      const banHistoryResult = await query(`
        SELECT 
          bh.id, bh.action, bh.reason, bh.ban_type, bh.expires_at, bh.created_at,
          u.email as user_email, u.username as user_username,
          a.email as admin_email
        FROM ban_history bh
        LEFT JOIN users u ON bh.user_id = u.id
        LEFT JOIN users a ON bh.banned_by = a.id
        ORDER BY bh.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])

      const totalBanHistoryResult = await query(`
        SELECT COUNT(*) as count FROM ban_history
      `)

      result.banHistory = {
        history: banHistoryResult.rows,
        total: parseInt(totalBanHistoryResult.rows[0].count),
        page,
        limit
      }
    }

    if (type === 'banned_emails' || type === 'all') {
      // Get banned emails
      const bannedEmailsResult = await query(`
        SELECT 
          be.id, be.email, be.reason, be.is_permanent, be.expires_at, be.created_at,
          a.email as banned_by_email
        FROM banned_emails be
        LEFT JOIN users a ON be.banned_by = a.id
        WHERE be.is_permanent = true OR be.expires_at IS NULL OR be.expires_at > NOW()
        ORDER BY be.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])

      const totalBannedEmailsResult = await query(`
        SELECT COUNT(*) as count FROM banned_emails 
        WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()
      `)

      result.bannedEmails = {
        emails: bannedEmailsResult.rows,
        total: parseInt(totalBannedEmailsResult.rows[0].count),
        page,
        limit
      }
    }

    if (type === 'banned_ips' || type === 'all') {
      // Get banned IPs
      const bannedIPsResult = await query(`
        SELECT 
          bi.id, bi.ip_address, bi.reason, bi.is_permanent, bi.expires_at, bi.created_at,
          a.email as banned_by_email
        FROM banned_ips bi
        LEFT JOIN users a ON bi.banned_by = a.id
        WHERE bi.is_permanent = true OR bi.expires_at IS NULL OR bi.expires_at > NOW()
        ORDER BY bi.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset])

      const totalBannedIPsResult = await query(`
        SELECT COUNT(*) as count FROM banned_ips 
        WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()
      `)

      result.bannedIPs = {
        ips: bannedIPsResult.rows,
        total: parseInt(totalBannedIPsResult.rows[0].count),
        page,
        limit
      }
    }

    // Get summary statistics
    const statsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'banned') as total_banned_users,
        (SELECT COUNT(*) FROM banned_emails WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()) as total_banned_emails,
        (SELECT COUNT(*) FROM banned_ips WHERE is_permanent = true OR expires_at IS NULL OR expires_at > NOW()) as total_banned_ips,
        (SELECT COUNT(*) FROM ban_history WHERE action = 'banned' AND created_at >= NOW() - INTERVAL '7 days') as bans_last_7_days,
        (SELECT COUNT(*) FROM ban_history WHERE action = 'unbanned' AND created_at >= NOW() - INTERVAL '7 days') as unbans_last_7_days
    `)

    result.stats = statsResult.rows[0]

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error fetching ban data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
