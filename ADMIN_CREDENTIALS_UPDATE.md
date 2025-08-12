# Admin Credentials Update Instructions

## 🔑 Current Login Credentials

The following login credentials should work with your application:

- **Admin:** `jd.admin` / `admin123`
- **Manager:** `jd.manager` / `manager123`
- **Supervisor:** `jd.supervisor` / `super123`

## 🔄 If Credentials Are Not Working

If the above credentials are not working, follow these steps to update the admin user emails in the database:

### Option 1: Run the Update Script on Railway

1. Go to your [Railway Dashboard](https://railway.app/dashboard)
2. Select your backend project
3. Go to the "Deployments" tab
4. Click on "Shell" to open a terminal
5. Run the following command:
   ```
   node update-admin-emails.js
   ```
6. This script will update all admin email addresses from `@jdlegaltranscripts.com` to `@jdreporting.org`
7. Try logging in again with the credentials above

### Option 2: Create New Admin Users

If Option 1 doesn't work, you can create new admin users:

1. Go to your [Railway Dashboard](https://railway.app/dashboard)
2. Select your backend project
3. Go to the "Deployments" tab
4. Click on "Shell" to open a terminal
5. Run the following command:
   ```
   node setup-admin.js
   ```
6. This will create new admin users with the updated email addresses
7. Try logging in with the credentials above

### Option 3: Manual Database Update

If neither Option 1 nor Option 2 works, you can manually update the database:

1. Go to your MongoDB Atlas dashboard
2. Navigate to your database (jd-transcripts)
3. Open the "users" collection
4. Find the admin users and update their email addresses to use `@jdreporting.org` domain
5. Make sure the passwords are properly hashed (do not directly edit passwords)

## 🔐 Admin Login URLs

- **Admin Login Page:** https://jd-reporting-company.netlify.app/admin-login-new.html
- **Admin Dashboard:** https://jd-reporting-company.netlify.app/admin-dashboard-new.html

## 🚨 Security Notes

- After successfully logging in, it's recommended to change the default passwords
- Make sure to keep your admin credentials secure
- Consider implementing two-factor authentication for additional security

If you continue to experience issues with admin login, please check the Railway logs for any error messages that might provide additional information.