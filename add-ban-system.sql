-- Add ban system to UO King database
-- This migration adds comprehensive user banning functionality

-- Add ban-related fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_permanently_banned BOOLEAN DEFAULT false;

-- Create banned emails table
CREATE TABLE IF NOT EXISTS banned_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    banned_by UUID REFERENCES users(id),
    reason TEXT,
    is_permanent BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create banned IPs table
CREATE TABLE IF NOT EXISTS banned_ips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    banned_by UUID REFERENCES users(id),
    reason TEXT,
    is_permanent BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ban history table for audit trail
CREATE TABLE IF NOT EXISTS ban_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    banned_by UUID REFERENCES users(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('banned', 'unbanned', 'suspended', 'unsuspended')),
    reason TEXT,
    ban_type VARCHAR(20) CHECK (ban_type IN ('email', 'ip', 'account', 'temporary', 'permanent')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_banned_at ON users(banned_at);
CREATE INDEX IF NOT EXISTS idx_users_banned_by ON users(banned_by);
CREATE INDEX IF NOT EXISTS idx_users_is_permanently_banned ON users(is_permanently_banned);
CREATE INDEX IF NOT EXISTS idx_banned_emails_email ON banned_emails(email);
CREATE INDEX IF NOT EXISTS idx_banned_emails_expires_at ON banned_emails(expires_at);
CREATE INDEX IF NOT EXISTS idx_banned_ips_ip_address ON banned_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_banned_ips_expires_at ON banned_ips(expires_at);
CREATE INDEX IF NOT EXISTS idx_ban_history_user_id ON ban_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ban_history_created_at ON ban_history(created_at);

-- Add trigger to automatically update user status when banned
CREATE OR REPLACE FUNCTION update_user_status_on_ban()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.banned_at IS NOT NULL AND OLD.banned_at IS NULL THEN
        -- User is being banned
        NEW.status = 'banned';
        
        -- Insert into ban history
        INSERT INTO ban_history (user_id, banned_by, action, reason, ban_type, expires_at)
        VALUES (
            NEW.id,
            NEW.banned_by,
            'banned',
            NEW.ban_reason,
            CASE 
                WHEN NEW.is_permanently_banned THEN 'permanent'
                WHEN NEW.ban_expires_at IS NOT NULL THEN 'temporary'
                ELSE 'account'
            END,
            NEW.ban_expires_at
        );
    ELSIF NEW.banned_at IS NULL AND OLD.banned_at IS NOT NULL THEN
        -- User is being unbanned
        NEW.status = 'active';
        
        -- Insert into ban history
        INSERT INTO ban_history (user_id, banned_by, action, reason, ban_type)
        VALUES (
            NEW.id,
            NEW.banned_by,
            'unbanned',
            'User unbanned by admin',
            'account'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_user_status_on_ban ON users;
CREATE TRIGGER trigger_update_user_status_on_ban
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_user_status_on_ban();

-- Function to check if email is banned
CREATE OR REPLACE FUNCTION is_email_banned(email_address VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    banned_record RECORD;
BEGIN
    SELECT * INTO banned_record 
    FROM banned_emails 
    WHERE email = LOWER(email_address)
    AND (is_permanent = true OR expires_at IS NULL OR expires_at > NOW());
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to check if IP is banned
CREATE OR REPLACE FUNCTION is_ip_banned(ip_addr INET)
RETURNS BOOLEAN AS $$
DECLARE
    banned_record RECORD;
BEGIN
    SELECT * INTO banned_record 
    FROM banned_ips 
    WHERE ip_address = ip_addr
    AND (is_permanent = true OR expires_at IS NULL OR expires_at > NOW());
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to ban a user (comprehensive)
CREATE OR REPLACE FUNCTION ban_user(
    target_user_id UUID,
    admin_user_id UUID,
    ban_reason_text TEXT,
    ban_duration_days INTEGER DEFAULT NULL,
    ban_email BOOLEAN DEFAULT true,
    ban_ip BOOLEAN DEFAULT true
)
RETURNS JSON AS $$
DECLARE
    target_user RECORD;
    target_ip INET;
    ban_expiry TIMESTAMP WITH TIME ZONE;
    result JSON;
BEGIN
    -- Get target user info
    SELECT * INTO target_user FROM users WHERE id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Calculate ban expiry
    IF ban_duration_days IS NULL OR ban_duration_days <= 0 THEN
        ban_expiry := NULL; -- Permanent ban
    ELSE
        ban_expiry := NOW() + (ban_duration_days || ' days')::INTERVAL;
    END IF;
    
    -- Update user record
    UPDATE users SET
        banned_at = NOW(),
        banned_by = admin_user_id,
        ban_reason = ban_reason_text,
        ban_expires_at = ban_expiry,
        is_permanently_banned = (ban_duration_days IS NULL OR ban_duration_days <= 0)
    WHERE id = target_user_id;
    
    -- Ban email if requested
    IF ban_email THEN
        INSERT INTO banned_emails (email, banned_by, reason, is_permanent, expires_at)
        VALUES (
            LOWER(target_user.email),
            admin_user_id,
            ban_reason_text,
            (ban_duration_days IS NULL OR ban_duration_days <= 0),
            ban_expiry
        )
        ON CONFLICT (email) DO UPDATE SET
            banned_at = NOW(),
            banned_by = admin_user_id,
            reason = ban_reason_text,
            is_permanent = (ban_duration_days IS NULL OR ban_duration_days <= 0),
            expires_at = ban_expiry;
    END IF;
    
    -- Ban IP if requested (get from user_profiles)
    IF ban_ip THEN
        SELECT last_ip_address INTO target_ip 
        FROM user_profiles 
        WHERE user_id = target_user_id;
        
        IF target_ip IS NOT NULL THEN
            INSERT INTO banned_ips (ip_address, banned_by, reason, is_permanent, expires_at)
            VALUES (
                target_ip,
                admin_user_id,
                ban_reason_text,
                (ban_duration_days IS NULL OR ban_duration_days <= 0),
                ban_expiry
            )
            ON CONFLICT (ip_address) DO UPDATE SET
                banned_at = NOW(),
                banned_by = admin_user_id,
                reason = ban_reason_text,
                is_permanent = (ban_duration_days IS NULL OR ban_duration_days <= 0),
                expires_at = ban_expiry;
        END IF;
    END IF;
    
    RETURN json_build_object(
        'success', true,
        'message', 'User banned successfully',
        'user_id', target_user_id,
        'email_banned', ban_email,
        'ip_banned', ban_ip AND target_ip IS NOT NULL,
        'expires_at', ban_expiry
    );
END;
$$ LANGUAGE plpgsql;

-- Function to unban a user
CREATE OR REPLACE FUNCTION unban_user(
    target_user_id UUID,
    admin_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    target_user RECORD;
    result JSON;
BEGIN
    -- Get target user info
    SELECT * INTO target_user FROM users WHERE id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user record
    UPDATE users SET
        banned_at = NULL,
        banned_by = NULL,
        ban_reason = NULL,
        ban_expires_at = NULL,
        is_permanently_banned = false,
        status = 'active'
    WHERE id = target_user_id;
    
    -- Remove from banned emails
    DELETE FROM banned_emails WHERE email = LOWER(target_user.email);
    
    -- Remove from banned IPs (get IP from user_profiles)
    DELETE FROM banned_ips 
    WHERE ip_address = (
        SELECT last_ip_address 
        FROM user_profiles 
        WHERE user_id = target_user_id
    );
    
    RETURN json_build_object(
        'success', true,
        'message', 'User unbanned successfully',
        'user_id', target_user_id
    );
END;
$$ LANGUAGE plpgsql;
