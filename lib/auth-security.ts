/**
 * Auth Security Utilities
 * 
 * This module provides secure session validation utilities to ensure
 * users can only access their own data and prevent any cross-user data leakage.
 */

import { auth } from '@/app/api/auth/[...nextauth]/route'
import { query } from '@/lib/db'

export interface ValidatedUser {
  id: string
  email: string
  username: string
  isAdmin: boolean
  status: string
}

/**
 * Validates the current session and returns validated user information
 * This ensures the session is valid and the user exists in the database
 * 
 * @throws {Error} If session is invalid or user not found
 * @returns {Promise<ValidatedUser>} Validated user information
 */
export async function validateSession(): Promise<ValidatedUser> {
  const session = await auth()
  
  console.log('=== validateSession called ===')
  console.log('Session data:', {
    hasSession: !!session,
    userEmail: session?.user?.email,
    userId: session?.user?.id,
    userName: session?.user?.username,
    userFirstName: session?.user?.firstName,
    userLastName: session?.user?.lastName
  })
  
  // Check if session exists and has required fields
  if (!session?.user?.email) {
    console.log('ERROR: No valid session found')
    throw new Error('UNAUTHORIZED: No valid session found')
  }

  // Always verify against database to prevent stale sessions
  // This ensures we're getting the most up-to-date user information
  // ORDER BY created_at DESC to get the most recent user if duplicates exist
  const queryText = `
    SELECT id, email, username, is_admin, status
    FROM users 
    WHERE email = $1
    ORDER BY created_at DESC
    LIMIT 1
  `
  
  console.log('validateSession query:', queryText)
  console.log('validateSession parameters:', [session.user.email])
  
  const userResult = await query(queryText, [session.user.email])
  
  console.log('validateSession result:', {
    rowCount: userResult.rows?.length || 0,
    userData: userResult.rows?.[0] ? {
      id: userResult.rows[0].id,
      email: userResult.rows[0].email,
      username: userResult.rows[0].username,
      is_admin: userResult.rows[0].is_admin,
      status: userResult.rows[0].status
    } : null
  })

  // Check if there are multiple users with this email
  const allUsersWithEmail = await query(`
    SELECT id, email, username, first_name, last_name, created_at, status
    FROM users 
    WHERE email = $1
    ORDER BY created_at DESC
  `, [session.user.email])
  
  console.log('All users with email', session.user.email, ':', allUsersWithEmail.rows)

  if (!userResult.rows || userResult.rows.length === 0) {
    throw new Error('USER_NOT_FOUND: User does not exist in database')
  }

  const user = userResult.rows[0]

  // Verify user account is active
  if (user.status !== 'active') {
    throw new Error('ACCOUNT_INACTIVE: User account is not active')
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    isAdmin: user.is_admin,
    status: user.status
  }
}

/**
 * Validates session and ensures the user is an admin
 * 
 * @throws {Error} If session is invalid or user is not an admin
 * @returns {Promise<ValidatedUser>} Validated admin user information
 */
export async function validateAdminSession(): Promise<ValidatedUser> {
  const user = await validateSession()
  
  if (!user.isAdmin) {
    throw new Error('FORBIDDEN: Admin access required')
  }

  return user
}

/**
 * Validates that a resource belongs to the authenticated user
 * Use this to verify ownership before returning or modifying data
 * 
 * @param userId - The user ID from the session
 * @param resourceUserId - The user ID associated with the resource
 * @throws {Error} If the user doesn't own the resource
 */
export function validateResourceOwnership(userId: string, resourceUserId: string): void {
  if (userId !== resourceUserId) {
    throw new Error('FORBIDDEN: You do not have access to this resource')
  }
}

/**
 * Error response helper for authentication errors
 */
export function getAuthErrorResponse(error: Error): { message: string; statusCode: number } {
  const message = error.message

  if (message.startsWith('UNAUTHORIZED')) {
    return { message: 'Unauthorized', statusCode: 401 }
  }
  
  if (message.startsWith('FORBIDDEN')) {
    return { message: 'Forbidden', statusCode: 403 }
  }
  
  if (message.startsWith('USER_NOT_FOUND')) {
    return { message: 'User not found', statusCode: 404 }
  }

  if (message.startsWith('ACCOUNT_INACTIVE')) {
    return { message: 'Account is inactive', statusCode: 403 }
  }

  // Generic error
  return { message: 'Authentication error', statusCode: 401 }
}

