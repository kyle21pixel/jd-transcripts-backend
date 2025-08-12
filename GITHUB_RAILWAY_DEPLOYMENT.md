# Deploying to Railway from GitHub Repository

## 🚀 Deploy Backend to Railway from GitHub

Follow these steps to deploy your updated backend code to Railway directly from your GitHub repository:

### Step 1: Connect Railway to GitHub Repository

1. Log in to your [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your GitHub repository: `kyle21pixel/jd-transcripts-backend`
4. Choose the `main` branch (which now contains all your updates)
5. Railway will automatically detect it's a Node.js project

### Step 2: Configure Deployment Settings

1. In the project settings, set the following:
   - Root Directory: `railway-backend` (if your backend code is in this subdirectory)
   - Start Command: `node app.js`

### Step 3: Set Environment Variables

Make sure to set these updated environment variables in Railway dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://jdtranscripts:JDTranscripts2025@cluster0.mongodb.net/jd-transcripts?retryWrites=true&w=majority
JWT_SECRET=jd-reporting-company-super-secret-jwt-key-2025-production-secure
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=admin@jdreporting.org
EMAIL_PASS=jdtranscripts2025app
ADMIN_EMAIL=admin@jdreporting.org
FRONTEND_URL=https://jd-reporting-company.netlify.app
CORS_ORIGIN=https://jd-reporting-company.netlify.app
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads
BCRYPT_ROUNDS=12
SESSION_SECRET=jd-transcripts-session-secret-2025
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Step 4: Deploy and Monitor

1. Click "Deploy" to start the deployment process
2. Railway will automatically build and deploy your application
3. Monitor the deployment logs for any errors
4. Once deployed, Railway will provide you with a URL for your backend API

## 🔄 Continuous Deployment

With GitHub integration, Railway will automatically redeploy your application whenever you push changes to the main branch. This ensures your production environment always stays up-to-date with your latest code.

## 🔍 Verify the Deployment

After deployment is complete:

1. Visit your Railway app's health check endpoint: `https://your-railway-url.up.railway.app/api/health`
2. Verify that the response shows "JD Reporting Company API is running"
3. Test the admin login functionality to ensure it works with the updated configuration
4. Check that email notifications are being sent from the new email address

## 🚨 Important Notes

- If you encounter any issues during deployment, check the Railway logs for error messages
- Make sure all environment variables are correctly set
- If you need to make additional changes, simply push them to your GitHub repository and Railway will automatically redeploy

Your backend should now be fully deployed with the updated company name and email domain!