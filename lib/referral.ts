// Referral System Utilities

import { query } from '@/lib/db'

// Generate a unique referral code
export async function generateReferralCode(userId: string): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code: string
  let isUnique = false
  
  while (!isUnique) {
    // Generate a 6-character code
    code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    // Check if code is unique
    const result = await query(`
      SELECT id FROM user_referral_codes 
      WHERE referral_code = $1
    `, [code])
    
    if (!result.rows || result.rows.length === 0) {
      isUnique = true
    }
  }
  
  return code!
}

// Create or get user's referral code
export async function getUserReferralCode(userId: string) {
  // Check if user already has a referral code
  const existingResult = await query(`
    SELECT * FROM user_referral_codes 
    WHERE user_id = $1
  `, [userId])
  
  if (existingResult.rows && existingResult.rows.length > 0) {
    return existingResult.rows[0]
  }
  
  // Generate new referral code
  const referralCode = await generateReferralCode(userId)
  
  const result = await query(`
    INSERT INTO user_referral_codes (user_id, referral_code)
    VALUES ($1, $2)
    RETURNING *
  `, [userId, referralCode])
  
  return result.rows[0]
}

// Validate referral code
export async function validateReferralCode(code: string) {
  const result = await query(`
    SELECT urc.*, u.username 
    FROM user_referral_codes urc
    JOIN users u ON urc.user_id = u.id
    WHERE urc.referral_code = $1 AND urc.is_active = true
  `, [code])
  
  return result.rows && result.rows.length > 0 ? result.rows[0] : null
}

// Process referral when user signs up
export async function processReferral(referralCode: string, newUserId: string) {
  const referrer = await validateReferralCode(referralCode)
  
  if (!referrer) {
    throw new Error('Invalid referral code')
  }
  
  // Check if user was already referred
  const existingReferral = await query(`
    SELECT id FROM user_referrals 
    WHERE referred_id = $1
  `, [newUserId])
  
  if (existingReferral.rows && existingReferral.rows.length > 0) {
    throw new Error('User already has a referrer')
  }
  
  // Create referral relationship
  await query(`
    INSERT INTO user_referrals (referrer_id, referred_id, referral_code)
    VALUES ($1, $2, $3)
  `, [referrer.user_id, newUserId, referralCode])
  
  // Update referrer's total referrals
  await query(`
    UPDATE user_referral_codes 
    SET total_referrals = total_referrals + 1
    WHERE user_id = $1
  `, [referrer.user_id])
  
  return referrer
}

// Process cashback for completed order
export async function processOrderCashback(orderId: string, userId: string, orderTotal: number) {
  // Get cashback settings
  const settingsResult = await query(`
    SELECT setting_value FROM site_settings 
    WHERE setting_key = 'customer_cashback_percentage'
  `)
  
  const cashbackPercentage = parseFloat(settingsResult.rows[0]?.setting_value || '5')
  const cashbackAmount = (orderTotal * cashbackPercentage) / 100
  
  // Get expiry days
  const expiryResult = await query(`
    SELECT setting_value FROM site_settings 
    WHERE setting_key = 'cashback_expiry_days'
  `)
  
  const expiryDays = parseInt(expiryResult.rows[0]?.setting_value || '365')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiryDays)
  
  // Create cashback transaction
  await query(`
    INSERT INTO cashback_transactions (user_id, order_id, transaction_type, amount, description, expires_at)
    VALUES ($1, $2, 'earned', $3, $4, $5)
  `, [userId, orderId, cashbackAmount, `Cashback from order #${orderId}`, expiresAt])
  
  // Update user's cashback balance
  await query(`
    INSERT INTO user_cashback_balances (user_id, balance, total_earned)
    VALUES ($1, $2, $2)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      balance = user_cashback_balances.balance + $2,
      total_earned = user_cashback_balances.total_earned + $2
  `, [userId, cashbackAmount])
  
  // Check if this is the first order for a referred user
  const referralResult = await query(`
    SELECT * FROM user_referrals 
    WHERE referred_id = $1 AND first_order_completed = false
  `, [userId])
  
  if (referralResult.rows && referralResult.rows.length > 0) {
    const referral = referralResult.rows[0]
    
    // Mark first order as completed
    await query(`
      UPDATE user_referrals 
      SET first_order_completed = true, first_order_id = $1
      WHERE id = $2
    `, [orderId, referral.id])
    
    // Process referrer bonus
    await processReferrerBonus(referral.referrer_id, orderTotal, referral.referral_code)
  }
  
  return cashbackAmount
}

// Process referrer bonus
async function processReferrerBonus(referrerId: string, orderTotal: number, referralCode: string) {
  // Get referrer bonus percentage
  const settingsResult = await query(`
    SELECT setting_value FROM site_settings 
    WHERE setting_key = 'referrer_bonus_percentage'
  `)
  
  const bonusPercentage = parseFloat(settingsResult.rows[0]?.setting_value || '2.5')
  const bonusAmount = (orderTotal * bonusPercentage) / 100
  
  // Get expiry days
  const expiryResult = await query(`
    SELECT setting_value FROM site_settings 
    WHERE setting_key = 'cashback_expiry_days'
  `)
  
  const expiryDays = parseInt(expiryResult.rows[0]?.setting_value || '365')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiryDays)
  
  // Create referrer bonus transaction
  await query(`
    INSERT INTO cashback_transactions (user_id, transaction_type, amount, description, referral_code_used, expires_at)
    VALUES ($1, 'referral_bonus', $2, $3, $4, $5)
  `, [referrerId, bonusAmount, `Referral bonus from code ${referralCode}`, referralCode, expiresAt])
  
  // Update referrer's cashback balance
  await query(`
    INSERT INTO user_cashback_balances (user_id, balance, total_earned)
    VALUES ($1, $2, $2)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      balance = user_cashback_balances.balance + $2,
      total_earned = user_cashback_balances.total_earned + $2
  `, [referrerId, bonusAmount])
  
  // Update referrer's total earnings
  await query(`
    UPDATE user_referral_codes 
    SET total_earnings = total_earnings + $1
    WHERE user_id = $2
  `, [bonusAmount, referrerId])
  
  // Mark referrer bonus as paid
  await query(`
    UPDATE user_referrals 
    SET referrer_bonus_paid = true
    WHERE referrer_id = $1 AND referrer_bonus_paid = false
  `, [referrerId])
}

// Get user's cashback balance
export async function getUserCashbackBalance(userId: string) {
  const result = await query(`
    SELECT * FROM user_cashback_balances 
    WHERE user_id = $1
  `, [userId])
  
  if (result.rows && result.rows.length > 0) {
    return result.rows[0]
  }
  
  // Create balance record if it doesn't exist
  const createResult = await query(`
    INSERT INTO user_cashback_balances (user_id, balance, total_earned, total_used)
    VALUES ($1, 0, 0, 0)
    RETURNING *
  `, [userId])
  
  return createResult.rows[0]
}

// Get user's referral statistics
export async function getUserReferralStats(userId: string) {
  const result = await query(`
    SELECT 
      urc.total_referrals,
      urc.total_earnings,
      urc.referral_code,
      COUNT(ur.id) as active_referrals
    FROM user_referral_codes urc
    LEFT JOIN user_referrals ur ON urc.user_id = ur.referrer_id
    WHERE urc.user_id = $1
    GROUP BY urc.id, urc.total_referrals, urc.total_earnings, urc.referral_code
  `, [userId])
  
  return result.rows && result.rows.length > 0 ? result.rows[0] : null
} 