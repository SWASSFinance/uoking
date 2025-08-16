# Discord Integration

This document explains the Discord integration features in the UOKing platform.

## Features

### 1. Discord OAuth Authentication
- Users can sign up/login using their Discord account
- Discord username and ID are automatically stored
- Profile image from Discord is synced

### 2. Discord Account Linking
- Users who registered with email/Google can link their Discord account
- Links Discord username, ID, and profile image
- Prevents duplicate Discord accounts

### 3. Profile Enhancement
- Shows Discord connection status in user profile
- Displays Discord username when connected
- Option to link Discord account if not connected

## How It Works

### Discord OAuth Sign Up/Login
1. User clicks "Sign in with Discord"
2. Discord OAuth flow handles authentication
3. System stores:
   - Discord username (`discord_username`)
   - Discord ID (`discord_id`) 
   - Profile image URL
4. User is logged in and redirected

### Discord Account Linking
1. User goes to Account → Profile page
2. If Discord not connected, shows "Link Discord" button
3. Clicking button redirects to Discord OAuth
4. After OAuth, Discord info is linked to existing account
5. Profile image and username are updated

### Database Schema
```sql
-- Users table has these Discord fields:
discord_username VARCHAR(50)  -- Discord username (e.g., "john_doe")
discord_id VARCHAR(50)        -- Discord user ID (e.g., "123456789012345678")
```

## User Experience

### For Discord OAuth Users
- ✅ Discord username and ID automatically stored
- ✅ Profile image synced from Discord
- ✅ No additional setup needed

### For Email/Google Users
- 📋 Profile page shows Discord connection status
- 🔗 "Link Discord" button to connect account
- 🎯 After linking, profile image and username updated
- 📱 Discord info displayed in profile

## Technical Implementation

### Files Modified/Created
1. **Database Migration** (`add-discord-id-field.sql`)
   - Adds `discord_id` column to users table
   - Creates index for performance

2. **NextAuth Configuration** (`app/api/auth/[...nextauth]/route.ts`)
   - Stores Discord ID and username during OAuth
   - Updates existing users when they sign in with Discord
   - Includes Discord info in session

3. **Type Definitions** (`types/next-auth.d.ts`)
   - Adds Discord fields to session and user types

4. **Account Page** (`app/account/page.tsx`)
   - Shows Discord connection status
   - Provides Discord linking functionality
   - Displays Discord username when connected

5. **API Endpoint** (`app/api/user/link-discord/route.ts`)
   - Handles Discord account linking
   - Prevents duplicate Discord accounts
   - Updates profile image

## Benefits

### For Users
- 🔐 Secure authentication via Discord
- 🖼️ Automatic profile image sync
- 🔗 Easy account linking
- 👤 Consistent username across platforms

### For Platform
- 📊 Better user identification
- 🎯 Discord integration for community features
- 🔍 Unique Discord ID for user tracking
- 🖼️ Higher quality profile images

## Setup Requirements

### Environment Variables
```env
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### Discord Application Setup
1. Create Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add OAuth2 redirect URL: `https://yourdomain.com/api/auth/callback/discord`
3. Copy Client ID and Client Secret to environment variables

## Usage Examples

### Check if User Has Discord
```typescript
if (session?.user?.discordId) {
  console.log('User has Discord:', session.user.discordUsername);
}
```

### Link Discord Account
```typescript
// Redirect to Discord OAuth
window.location.href = '/api/auth/signin?provider=discord&callbackUrl=' + encodeURIComponent(window.location.href);
```

### Get Discord Info
```typescript
const discordUsername = session?.user?.discordUsername;
const discordId = session?.user?.discordId;
```

## Future Enhancements

- Discord role synchronization
- Discord server member verification
- Discord webhook notifications
- Discord bot integration for order updates 