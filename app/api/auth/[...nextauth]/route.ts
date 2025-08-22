import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Credentials from "next-auth/providers/credentials"
import { query } from '@/lib/db'
import { getUserReferralCode } from '@/lib/referral'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from database
          const userResult = await query(`
            SELECT id, email, username, password_hash, first_name, last_name, is_admin, status
            FROM users WHERE email = $1
          `, [credentials.email])

          if (!userResult.rows || userResult.rows.length === 0) {
            return null
          }

          const user = userResult.rows[0]

          // Check if user is active
          if (user.status !== 'active') {
            return null
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash)
          
          if (!isValidPassword) {
            return null
          }

          // Update last login
          await query(`
            UPDATE users SET last_login_at = NOW() WHERE id = $1
          `, [user.id])

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
            status: user.status
          }
        } catch (error) {
          console.error('Error in credentials authorize:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Skip this callback for credentials provider
      if (account?.provider === 'credentials') {
        return true
      }

      try {
        // Check if user already exists
        const existingUser = await query(`
          SELECT id, email FROM users WHERE email = $1
        `, [user.email])

        if (existingUser.rows && existingUser.rows.length > 0) {
          // User exists, update last login and profile image if provided
          const userId = existingUser.rows[0].id
          
          // Update Discord information if signing in with Discord
          if (account?.provider === 'discord' && profile) {
            const discordUsername = (profile as any).username
            const discordId = (profile as any).id
            
            await query(`
              UPDATE users 
              SET 
                discord_username = $1,
                discord_id = $2,
                last_login_at = NOW()
              WHERE id = $3
            `, [discordUsername, discordId, userId])
          } else {
            await query(`
              UPDATE users SET last_login_at = NOW() WHERE id = $1
            `, [userId])
          }
          
          if (user.image) {
            await query(`
              INSERT INTO user_profiles (user_id, profile_image_url, updated_at)
              VALUES ($1, $2, NOW())
              ON CONFLICT (user_id) DO UPDATE SET
                profile_image_url = EXCLUDED.profile_image_url,
                updated_at = NOW()
            `, [userId, user.image])
          }

          return true
        }

        // Create new user
        const username = (user.email?.split('@')[0] || 'user') + Math.floor(Math.random() * 1000)
        const firstName = user.name?.split(' ')[0] || ''
        const lastName = user.name?.split(' ').slice(1).join(' ') || ''
        
        let discordUsername = null
        let discordId = null
        if (account?.provider === 'discord' && profile) {
          discordUsername = (profile as any).username
          discordId = (profile as any).id
        }

        const newUser = await query(`
          INSERT INTO users (
            email, 
            username, 
            password_hash, 
            first_name, 
            last_name, 
            discord_username,
            discord_id,
            status,
            email_verified,
            created_at,
            updated_at,
            last_login_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
          RETURNING id
        `, [
          user.email, 
          username, 
          'oauth_user', // Placeholder for OAuth users
          firstName, 
          lastName, 
          discordUsername,
          discordId,
          'active',
          true // OAuth users are pre-verified
        ])

        if (newUser.rows && newUser.rows.length > 0) {
          const userId = newUser.rows[0].id

          // Save profile image URL if provided
          if (user.image) {
            await query(`
              INSERT INTO user_profiles (user_id, profile_image_url, created_at, updated_at)
              VALUES ($1, $2, NOW(), NOW())
            `, [userId, user.image])
          }

          // Create referral code for new user
          try {
            await getUserReferralCode(userId)
          } catch (error) {
            console.error('Failed to create referral code for OAuth user:', error)
          }

          // Send welcome email using existing email library
          try {
            const { sendRegistrationEmail } = await import('@/lib/email')
            await sendRegistrationEmail({
              email: user.email!,
              name: firstName,
              characterName: firstName || 'there'
            })
            console.log('Welcome email sent successfully to:', user.email)
          } catch (error) {
            console.error('Failed to send welcome email:', error)
          }
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Get user data from database
        const userResult = await query(`
          SELECT 
            u.id, u.username, u.first_name, u.last_name, u.is_admin, u.status,
            u.discord_username, u.discord_id,
            up.profile_image_url
          FROM users u
          LEFT JOIN user_profiles up ON u.id = up.user_id
          WHERE u.email = $1
        `, [session.user.email])

        if (userResult.rows && userResult.rows.length > 0) {
          const user = userResult.rows[0]
          session.user.id = user.id
          session.user.username = user.username
          session.user.firstName = user.first_name
          session.user.lastName = user.last_name
          session.user.isAdmin = user.is_admin
          session.user.status = user.status
          session.user.image = user.profile_image_url || session.user.image
          session.user.discordUsername = user.discord_username
          session.user.discordId = user.discord_id
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export const { GET, POST } = handlers 