# 🚀 SIMPLEST Railway Deployment (2 Minutes)

## Just Run This One Command!

I've created an automated script that does everything for you. Just run this:

```powershell
cd "c:\Users\Kyle\jd 3"
.\AUTO_DEPLOY_RAILWAY.ps1
```

## What The Script Does Automatically:

1. ✅ **Installs Railway CLI** (if needed)
2. ✅ **Navigates to your server folder**
3. ✅ **Checks git repository** (already ready!)
4. 🌐 **Opens browser for Railway login** (you just click "Login")
5. ✅ **Creates Railway project**
6. ✅ **Sets all environment variables**
7. ✅ **Deploys your backend**
8. ✅ **Gets your live API URL**
9. ✅ **Saves URL for frontend integration**

## Your Part (30 seconds):

1. **Run the script** ⬆️
2. **Click "Login with GitHub"** when browser opens
3. **Wait for deployment** (script does everything else)
4. **Get your live API URL!** 🎉

## Alternative: Manual Railway (if script doesn't work)

If the automated script has issues, here's the manual way:

### Step 1: Go to Railway
- Visit: **https://railway.app**
- Click: **"Start a New Project"**
- Login with GitHub

### Step 2: Deploy
- Click: **"Deploy from GitHub repo"** OR **"Empty Project"**
- If Empty Project: Upload your `server` folder
- If GitHub: First push your code to GitHub

### Step 3: Environment Variables
Copy these to Railway's Variables section:
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
```

## 🎯 Result:

Your API will be live at: `https://your-project.railway.app`

Test endpoints:
- `GET /api/health` - Health check
- `POST /api/orders` - Create orders
- `POST /api/email/contact` - Contact form

## 🔗 Frontend Integration:

After deployment, I'll help you update your Netlify frontend to use the real API!

---

**Try the automated script first - it should handle everything! 🚀**