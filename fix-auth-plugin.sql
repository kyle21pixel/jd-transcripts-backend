-- Fix MySQL Authentication Plugin Issue
-- Run this in MySQL safe mode

USE mysql;

-- Update root user to use mysql_native_password plugin
UPDATE user SET plugin='mysql_native_password' WHERE User='root';

-- Set the password using the native password hashing
UPDATE user SET authentication_string=PASSWORD('Kyle.21.Nov') WHERE User='root';

-- Grant privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify the changes
SELECT User, Host, plugin, authentication_string FROM user WHERE User='root';

\q