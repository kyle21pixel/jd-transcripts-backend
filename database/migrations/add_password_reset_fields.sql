-- Add password reset fields to users table
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(64) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL,
ADD INDEX idx_reset_token (reset_token);