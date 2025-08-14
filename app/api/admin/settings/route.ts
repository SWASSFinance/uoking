import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Fetch all settings from the database
    const result = await query(`
      SELECT setting_key, setting_value, setting_type 
      FROM site_settings 
      ORDER BY setting_key
    `)
    
    if (!result.rows) {
      throw new Error('Failed to fetch settings')
    }

    // Convert database rows to settings object
    const settings: any = {}
    result.rows.forEach((row: any) => {
      let value: any = row.setting_value
      
      // Convert value based on type
      if (row.setting_type === 'boolean') {
        value = value === 'true'
      } else if (row.setting_type === 'number') {
        value = parseFloat(value) || 0
      } else if (row.setting_type === 'json') {
        try {
          value = JSON.parse(value)
        } catch {
          value = null
        }
      }
      
      settings[row.setting_key] = value
    })
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update each setting in the database
    for (const [key, value] of Object.entries(body)) {
      let settingValue = value
      let settingType = 'string'
      
      // Determine the type and convert value
      if (typeof value === 'boolean') {
        settingValue = value.toString()
        settingType = 'boolean'
      } else if (typeof value === 'number') {
        settingValue = value.toString()
        settingType = 'number'
      } else if (typeof value === 'object') {
        settingValue = JSON.stringify(value)
        settingType = 'json'
      }
      
      // Use UPSERT to insert or update
      await query(`
        INSERT INTO site_settings (setting_key, setting_value, setting_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (setting_key) 
        DO UPDATE SET 
          setting_value = EXCLUDED.setting_value,
          setting_type = EXCLUDED.setting_type,
          updated_at = NOW()
      `, [key, settingValue, settingType])
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully' 
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
} 