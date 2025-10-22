-- MySQL Root Password Reset Script
-- Run this in MySQL command line after starting MySQL in safe mode

USE mysql;

-- Reset root password to empty (for XAMPP compatibility)
UPDATE user SET authentication_string = '' WHERE User = 'root';
UPDATE user SET plugin = '' WHERE User = 'root';

-- Alternative: Set a specific password (uncomment and modify if needed)
-- UPDATE user SET authentication_string = PASSWORD('your_new_password') WHERE User = 'root';
-- UPDATE user SET plugin = 'mysql_native_password' WHERE User = 'root';

-- Grant all privileges to root
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit
\q