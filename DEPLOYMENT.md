# Deployment Guide

This guide will help you deploy your full-stack application to free cloud hosting platforms.

## Architecture
- **Backend**: Node.js/Express API (deploy to Railway)
- **Frontend**: React application (deploy to Vercel)
- **Database**: MongoDB Atlas (already configured)

## Prerequisites
1. Git repository (GitHub, GitLab, or Bitbucket)
2. Railway account (https://railway.app)
3. Vercel account (https://vercel.com)

## Step 1: Deploy Backend to Railway

### 1.1 Prepare Your Repository
1. Make sure your code is in a Git repository
2. Push your latest changes to GitHub/GitLab

### 1.2 Deploy to Railway
1. Go to https://railway.app and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect your Node.js app in the `server` folder
5. Set the following environment variables in Railway:
   ```
   MONGO_URI=mongodb+srv://Admin:admin%2F123.Main@cluster0.y38qb7g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=mysecretkey123456789
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```
6. Railway will automatically deploy your backend
7. Note the Railway URL (e.g., `https://your-app-name.railway.app`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Environment Variables
1. Update `client/.env` with your Railway backend URL:
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```

### 2.2 Deploy to Vercel
1. Go to https://vercel.com and sign up/login
2. Click "New Project" → Import your Git repository
3. Set the root directory to `client`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-app-name.railway.app
   ```
5. Deploy the project
6. Note the Vercel URL (e.g., `https://your-app.vercel.app`)

### 2.3 Update Backend CORS
1. Go back to Railway dashboard
2. Update the `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Redeploy the backend

## Step 3: Test Your Deployment

1. Visit your Vercel frontend URL
2. Test the admin login functionality
3. Check that API calls work correctly
4. Monitor Railway logs for any backend issues

## Alternative Deployment Options

### Option 1: Deploy Both to Railway
- Deploy backend as above
- Deploy frontend as a separate Railway service
- Set build command: `npm run build`
- Set start command: `npx serve -s build`

### Option 2: Deploy to Render (Free Alternative)
- Backend: https://render.com (similar to Railway)
- Frontend: Can also be deployed to Render

### Option 3: Deploy to Netlify (Frontend)
- Alternative to Vercel for frontend hosting
- Similar deployment process

## Environment Variables Summary

### Backend (Railway)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-domain.railway.app
```

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure CLIENT_URL in backend matches your frontend domain
2. **API Not Found**: Verify REACT_APP_API_URL is correct
3. **Database Connection**: Check MongoDB Atlas whitelist (allow all IPs: 0.0.0.0/0)
4. **Build Failures**: Check Node.js version compatibility

### Logs:
- Railway: Check deployment logs in Railway dashboard
- Vercel: Check function logs in Vercel dashboard

## Security Notes
1. Never commit `.env` files to Git
2. Use strong JWT secrets in production
3. Configure proper CORS origins
4. Set up proper MongoDB user permissions

## Next Steps
1. Set up custom domains
2. Configure SSL certificates (automatic on Vercel/Railway)
3. Set up monitoring and analytics
4. Configure CI/CD pipelines