-- Add email tracking columns to paypal_ipn_logs table
-- These columns will track whether emails were sent successfully

ALTER TABLE paypal_ipn_logs 
ADD COLUMN email_sent BOOLEAN DEFAULT false,
ADD COLUMN email_message_id VARCHAR(255),
ADD COLUMN email_error TEXT;

-- Add comment to document the columns purpose
COMMENT ON COLUMN paypal_ipn_logs.email_sent IS 'Whether order confirmation email was sent successfully';
COMMENT ON COLUMN paypal_ipn_logs.email_message_id IS 'Resend message ID if email was sent successfully';
COMMENT ON COLUMN paypal_ipn_logs.email_error IS 'Error message if email sending failed';
