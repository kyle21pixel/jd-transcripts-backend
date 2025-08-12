# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for your JD Legal Transcripts application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed
3. Your existing JD Legal Transcripts application

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `jd-legal-transcripts`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

## Step 3: Set Up Environment Variables

### Backend (.env file in server/ directory)
```env
# Add these to your server/.env file
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Frontend (.env file in client/ directory)
```env
# Add these to your client/.env file
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase-schema.sql` file
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema
5. Verify that all tables were created successfully

## Step 5: Set Up Storage Buckets

1. In your Supabase dashboard, go to Storage
2. Create the following buckets:
   - `audio-files` (for uploaded audio files)
   - `transcripts` (for completed transcription files)
   - `documents` (for additional documents)

### Configure Storage Policies

For each bucket, set up the following policies:

#### audio-files bucket policies:
1. **Upload Policy**:
   - Policy name: "Users can upload files"
   - Allowed operation: INSERT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'audio-files'`

2. **Select Policy**:
   - Policy name: "Users can view their own files"
   - Allowed operation: SELECT
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'audio-files'`

3. **Delete Policy**:
   - Policy name: "Users can delete their own files"
   - Allowed operation: DELETE
   - Target roles: authenticated
   - Policy definition: `bucket_id = 'audio-files'`

## Step 6: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - **Site URL**: Your frontend URL (e.g., `http://localhost:3000` for development)
   - **Redirect URLs**: Add your frontend URL
   - **Email Templates**: Customize if needed

### Enable Email Confirmation (Optional)
1. Go to Authentication > Settings
2. Toggle "Enable email confirmations"
3. Users will need to confirm their email before accessing the app

## Step 7: Test the Integration

### Backend Test
1. Start your backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Test the Supabase connection:
   ```bash
   curl http://localhost:5000/api/supabase/test
   ```

### Frontend Test
1. Start your React app:
   ```bash
   cd client
   npm start
   ```

2. Try to:
   - Sign up for a new account
   - Sign in with existing credentials
   - Create a new order
   - Upload files

## Step 8: Production Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

**Backend (Railway/Heroku/etc.)**:
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Frontend (Netlify/Vercel/etc.)**:
```
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Update Site URL for Production
1. In Supabase dashboard, go to Authentication > Settings
2. Update Site URL to your production frontend URL
3. Add production URL to Redirect URLs

## Features Included

### Authentication
- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Row Level Security (RLS) policies

### Order Management
- ✅ Create new transcription orders
- ✅ View user's orders
- ✅ Update order status
- ✅ Real-time order updates
- ✅ File upload integration

### File Storage
- ✅ Secure file uploads to Supabase Storage
- ✅ File download with signed URLs
- ✅ File deletion
- ✅ Multiple file formats support

### Real-time Features
- ✅ Real-time order status updates
- ✅ Live notifications
- ✅ Automatic UI updates

### Admin Features
- ✅ Admin user management
- ✅ Order oversight
- ✅ System analytics
- ✅ Audit logging

## API Endpoints

### Authentication
- `POST /api/supabase/auth/signup` - User registration
- `POST /api/supabase/auth/signin` - User login
- `POST /api/supabase/auth/signout` - User logout
- `POST /api/supabase/auth/reset-password` - Password reset

### Orders
- `GET /api/supabase/orders` - Get user orders
- `POST /api/supabase/orders` - Create new order
- `GET /api/supabase/orders/:id` - Get specific order
- `PUT /api/supabase/orders/:id` - Update order
- `DELETE /api/supabase/orders/:id` - Delete order

### File Management
- `POST /api/supabase/upload` - Upload files
- `GET /api/supabase/download/:bucket/:path` - Download files
- `DELETE /api/supabase/files/:bucket/:path` - Delete files
- `GET /api/supabase/signed-url/:bucket/:path` - Get signed URL

### Admin
- `GET /api/supabase/admin/users` - List all users
- `POST /api/supabase/admin/users` - Create user
- `DELETE /api/supabase/admin/users/:id` - Delete user

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your environment variables are set correctly
   - Ensure you're using the correct keys (anon key for frontend, service role for backend)

2. **"Row Level Security policy violation"**
   - Check that RLS policies are set up correctly
   - Ensure user is authenticated when accessing protected resources

3. **File upload fails**
   - Check storage bucket policies
   - Verify bucket names match your configuration
   - Ensure file size is within limits

4. **Real-time updates not working**
   - Check that you have proper subscriptions set up
   - Verify RLS policies allow the user to see the data

### Getting Help

1. Check Supabase documentation: https://supabase.com/docs
2. Review the console logs for detailed error messages
3. Check the Supabase dashboard logs
4. Verify your database schema matches the expected structure

## Security Best Practices

1. **Never expose service role key in frontend code**
2. **Use Row Level Security policies** to protect data
3. **Validate all inputs** on both frontend and backend
4. **Use HTTPS** in production
5. **Regularly rotate API keys**
6. **Monitor usage** in Supabase dashboard
7. **Set up proper CORS** policies
8. **Use signed URLs** for sensitive file access

## Next Steps

1. **Customize the UI** to match your brand
2. **Add more features** like notifications, analytics
3. **Set up monitoring** and error tracking
4. **Implement automated backups**
5. **Add payment integration** if needed
6. **Set up CI/CD pipeline** for deployments

## Support

If you need help with the Supabase integration:
1. Check this guide first
2. Review the code comments
3. Test individual components
4. Check Supabase dashboard for errors
5. Consult Supabase documentation

Your Supabase integration is now complete! 🎉