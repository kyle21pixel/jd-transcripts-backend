# 🚀 Manual Railway Deployment (Super Easy!)

Since CLI login had issues, let's use the web interface - it's actually easier!

## Step 1: Go to Railway
1. **Visit:** https://railway.app
2. **Click:** "Start a New Project"
3. **Login with GitHub** (or email)

## Step 2: Create Empty Project
1. **Click:** "Empty Project"
2. **Click:** "Add Service" → "Empty Service"

## Step 3: Upload Your Server Files
In Railway dashboard:
1. **Click:** "Deploy" tab
2. **Drag and drop** your entire `server` folder OR
3. **Click:** "Browse files" and select these files from your `server` folder:

### Required Files to Upload:
- `app.js` (main server file)
- `package.json` (dependencies)
- `package-lock.json` (lock file)
- `controllers/` folder (entire folder)
- `routes/` folder (entire folder)
- `models/` folder (entire folder)
- `middleware/` folder (entire folder)
- `utils/` folder (entire folder)
- `services/` folder (entire folder)

### DON'T Upload:
- `node_modules/` (Railway will install automatically)
- `.env` files (we'll set these as variables)

## Step 4: Set Environment Variables
In Railway dashboard:
1. **Click:** "Variables" tab
2. **Add these variables one by one:**

```
MONGODB_URI=mongodb+srv://jdtranscripts:JDTranscripts2025@cluster0.mongodb.net/jd-transcripts?retryWrites=true&w=majority
JWT_SECRET=jd-legal-transcripts-super-secret-jwt-key-2025-production-secure
JWT_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USER=admin@jdlegaltranscripts.com
EMAIL_PASS=jdtranscripts2025app
ADMIN_EMAIL=admin@jdlegaltranscripts.com
FRONTEND_URL=https://sensational-tartufo-6888eb.netlify.app
CORS_ORIGIN=https://sensational-tartufo-6888eb.netlify.app
NODE_ENV=production
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads
BCRYPT_ROUNDS=12
SESSION_SECRET=jd-transcripts-session-secret-2025
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## Step 5: Deploy
1. Railway will automatically detect Node.js
2. It will run `npm install` and `npm start`
3. Your API will be live!

## Step 6: Get Your API URL
1. In Railway dashboard, you'll see your live URL
2. It will be something like: `https://your-project-name.railway.app`
3. Test it: `https://your-project-name.railway.app/api/health`

## 🎉 That's It!
Your backend will be live and ready to connect to your Netlify frontend!

## Next Steps:
1. Test your API endpoints
2. Update your frontend to use the new Railway URL
3. Enjoy your fully functional backend! 🚀

---

**This method is actually easier than CLI - just drag, drop, and deploy!**