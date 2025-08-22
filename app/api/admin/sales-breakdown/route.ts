import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userResult = await query(`
      SELECT id, is_admin FROM users WHERE email = $1
    `, [session.user.email])

    if (!userResult.rows || userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!userResult.rows[0].is_admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get daily sales (last 7 days)
    const dailySales = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `)

    // Get weekly sales (last 8 weeks)
    const weeklySales = await query(`
      SELECT 
        DATE_TRUNC('week', created_at) as week_start,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '8 weeks'
      GROUP BY DATE_TRUNC('week', created_at)
      ORDER BY week_start DESC
    `)

    // Get monthly sales (last 12 months)
    const monthlySales = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month_start,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month_start DESC
    `)

    // Get today's sales
    const todaySales = await query(`
      SELECT 
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE DATE(created_at) = CURRENT_DATE
    `)

    // Get this week's sales
    const thisWeekSales = await query(`
      SELECT 
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
    `)

    // Get this month's sales
    const thisMonthSales = await query(`
      SELECT 
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales,
        SUM(CASE WHEN payment_status = 'completed' THEN total_amount ELSE 0 END) as completed_sales
      FROM orders 
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    `)

    return NextResponse.json({
      daily: dailySales.rows || [],
      weekly: weeklySales.rows || [],
      monthly: monthlySales.rows || [],
      today: todaySales.rows[0] || { order_count: 0, total_sales: 0, completed_sales: 0 },
      thisWeek: thisWeekSales.rows[0] || { order_count: 0, total_sales: 0, completed_sales: 0 },
      thisMonth: thisMonthSales.rows[0] || { order_count: 0, total_sales: 0, completed_sales: 0 }
    })

  } catch (error) {
    console.error('Error fetching sales breakdown:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales breakdown' },
      { status: 500 }
    )
  }
}
