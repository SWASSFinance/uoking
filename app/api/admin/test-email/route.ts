import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email, template, customSubject, customMessage } = body

    // Validate required fields
    if (!email || !template) {
      return NextResponse.json(
        { error: 'Email and template are required' },
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

    // Import email functions
    const { sendEmail } = await import('@/lib/email')

    // Prepare test data based on template
    let testData: any = {}
    let subject = customSubject

    switch (template) {
      case 'registration':
        const userId = Math.random().toString(36).substring(2, 8).toUpperCase()
        testData = {
          name: 'Test User',
          email: email,
          characterName: 'TestCharacter',
          userId: userId
        }
        if (!subject) subject = `Test Welcome Email - UO King (User ID: ${userId})`
        break

      case 'orderConfirmation':
        const orderId = `TEST-${Date.now().toString().slice(-6)}`
        testData = {
          orderId: orderId,
          customerName: 'Test Customer',
          email: email,
          total: 49.99,
          items: [
            { name: 'Test Item 1', quantity: 1, price: 29.99 },
            { name: 'Test Item 2', quantity: 1, price: 20.00 }
          ],
          deliveryCharacter: 'TestCharacter',
          shard: 'Atlantic'
        }
        if (!subject) subject = `Test Order Confirmation - UO King (Order #${orderId})`
        break

      case 'orderCompleted':
        const completedOrderId = `TEST-${Date.now().toString().slice(-6)}`
        testData = {
          orderId: completedOrderId,
          customerName: 'Test Customer',
          email: email,
          deliveryCharacter: 'TestCharacter',
          shard: 'Atlantic'
        }
        if (!subject) subject = `Test Order Completed - UO King (Order #${completedOrderId})`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid template specified' },
          { status: 400 }
        )
    }

    // Add custom message if provided
    if (customMessage) {
      testData.customMessage = customMessage
    }

    // Send the test email
    const result = await sendEmail(email, template as any, testData, {
      from: 'UO King <noreply@uoking.com>',
      replyTo: 'support@uoking.com',
      subject: subject
    })

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      template,
      messageId: result.messageId,
      details: result
    })

  } catch (error) {
    console.error('Error sending test email:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
