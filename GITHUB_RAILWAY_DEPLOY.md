# GitHub + Railway Deployment Guide

## 🚀 Deploy Your Backend via GitHub to Railway

### Step 1: Push Your Code to GitHub

1. **Initialize Git Repository (if not already done):**
   ```powershell
   cd "c:\Users\Kyle\jd 3"
   git init
   git add .
   git commit -m "Initial commit - JD Legal Transcripts backend"
   ```

2. **Create GitHub Repository:**
   - Go to https://github.com
   - Click "New Repository"
   - Name it: `jd-legal-transcripts-backend`
   - Make it Public or Private (your choice)
   - Don't initialize with README (since you already have files)
   - Click "Create Repository"

3. **Connect Local Repo to GitHub:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/jd-legal-transcripts-backend.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Railway from GitHub

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Click "New Project"

2. **Deploy from GitHub:**
   - Click "Deploy from GitHub repo"
   - Select your repository: `jd-legal-transcripts-backend`
   - Railway will automatically detect it's a Node.js project

3. **Configure Root Directory:**
   - In Railway dashboard, go to Settings
   - Set "Root Directory" to: `server`
   - This tells Railway to deploy from the server folder

### Step 3: Set Environment Variables

In Railway dashboard, go to **Variables** tab and add these:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://jdtranscripts:JDTranscripts2025@cluster0.mongodb.net/jd-transcripts?retryWrites=true&w=majority
JWT_SECRET=jd-legal-transcripts-super-secret-jwt-key-2025-production-secure
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=admin@jdlegaltranscripts.com
EMAIL_PASS=jdtranscripts2025app
ADMIN_EMAIL=admin@jdlegaltranscripts.com
FRONTEND_URL=https://sensational-tartufo-6888eb.netlify.app
CORS_ORIGIN=https://sensational-tartufo-6888eb.netlify.app
```

### Step 4: Deploy!

- Railway will automatically:
  - Detect Node.js project
  - Run `npm install` in the server folder
  - Start your app with `npm start`
  - Provide you with a live URL

### Step 5: Test Your Deployment

Once deployed, you'll get a URL like: `https://your-app-name.railway.app`

Test these endpoints:
- `GET https://your-app-name.railway.app/` (should show API info)
- `GET https://your-app-name.railway.app/api/health` (should return OK)
- `POST https://your-app-name.railway.app/api/orders` (test order creation)

## 🔧 Benefits of GitHub Deployment

✅ **Automatic Deployments** - Push to GitHub = Auto deploy to Railway
✅ **Version Control** - Track all changes
✅ **Rollback Capability** - Easy to revert if needed
✅ **Team Collaboration** - Others can contribute
✅ **Build Logs** - See exactly what's happening during deployment

## 🚨 Important Files for Railway

Make sure these files are in your `server` folder:
- ✅ `package.json` (with correct start script)
- ✅ `app.js` (main server file)
- ✅ `railway.json` (Railway configuration)
- ✅ All `routes/` folder files
- ✅ `.gitignore` (to exclude node_modules, .env)

## 🎯 Quick Commands Summary

```powershell
# Navigate to project
cd "c:\Users\Kyle\jd 3"

# Initialize git (if needed)
git init
git add .
git commit -m "Backend ready for deployment"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jd-legal-transcripts-backend.git
git push -u origin main

# Then go to Railway dashboard and deploy from GitHub!
```

This approach is much more reliable than CLI deployment and gives you automatic deployments whenever you push changes to GitHub! 🚀