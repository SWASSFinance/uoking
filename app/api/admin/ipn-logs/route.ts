import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const txnId = searchParams.get('txn_id')
    const orderId = searchParams.get('order_id')
    
    let whereClause = 'WHERE 1=1'
    const params: any[] = []
    let paramIndex = 1
    
    if (status) {
      whereClause += ` AND processing_status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }
    
    if (txnId) {
      whereClause += ` AND txn_id = $${paramIndex}`
      params.push(txnId)
      paramIndex++
    }
    
    if (orderId) {
      whereClause += ` AND custom = $${paramIndex}`
      params.push(orderId)
      paramIndex++
    }
    
    const result = await query(`
      SELECT 
        id,
        payment_status,
        txn_id,
        receiver_email,
        custom,
        mc_gross,
        mc_currency,
        verification_status,
        processing_status,
        error_message,
        order_id,
        order_status,
        received_at,
        processed_at,
        raw_body,
        headers,
        user_agent,
        ip_address
      FROM paypal_ipn_logs 
      ${whereClause}
      ORDER BY received_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...params, limit, offset])
    
    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM paypal_ipn_logs 
      ${whereClause}
    `, params)
    
    return NextResponse.json({
      logs: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit,
        offset
      }
    })
    
  } catch (error) {
    console.error('Error fetching IPN logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch IPN logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ipnLogId } = body
    
    if (!ipnLogId) {
      return NextResponse.json(
        { error: 'IPN log ID is required' },
        { status: 400 }
      )
    }
    
    // Get the IPN log data
    const logResult = await query(`
      SELECT * FROM paypal_ipn_logs WHERE id = $1
    `, [ipnLogId])
    
    if (!logResult.rows || logResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'IPN log not found' },
        { status: 404 }
      )
    }
    
    const ipnLog = logResult.rows[0]
    
    // Replay the IPN by making a request to the IPN endpoint
    const replayResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/paypal/ipn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': ipnLog.user_agent || 'IPN-Replay/1.0'
      },
      body: ipnLog.raw_body
    })
    
    const replayResult = await replayResponse.text()
    
    return NextResponse.json({
      success: true,
      originalLog: ipnLog,
      replayResponse: {
        status: replayResponse.status,
        statusText: replayResponse.statusText,
        body: replayResult
      }
    })
    
  } catch (error) {
    console.error('Error replaying IPN:', error)
    return NextResponse.json(
      { error: 'Failed to replay IPN' },
      { status: 500 }
    )
  }
}
