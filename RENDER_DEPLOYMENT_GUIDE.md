# 🚀 Deploy to Render - Step by Step Guide

## ✅ Your Backend is Ready for Render!

### **Step 1: Sign Up / Login to Render**
1. Go to **https://render.com**
2. Click **"Get Started"** or **"Sign In"**
3. Sign in with your **GitHub** account (easiest option)
4. Authorize Render to access your GitHub repos

---

### **Step 2: Create a New Web Service**
1. On Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: **`kyle21pixel/jd-transcripts-backend`**
5. Click **"Connect"**

---

### **Step 3: Configure Your Service**

Render will show you a configuration form. Fill it in:

**Name:** `jd-transcripts-backend` (or any name you like)

**Region:** Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`)

**Branch:** `main`

**Root Directory:** Leave blank (or `.` if required)

**Runtime:** `Node`

**Build Command:** 
```
npm install
```

**Start Command:** 
```
node backend-server.js
```

**Instance Type:** Select **"Free"** ⚡

---

### **Step 4: Add Environment Variables**

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |

*(Add more later if needed for database, email, etc.)*

---

### **Step 5: Deploy!**

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your backend
3. You'll see logs in real-time
4. Wait 2-5 minutes for first deployment

---

### **Step 6: Get Your Backend URL**

Once deployed (status shows "Live" with green dot):

1. Your backend URL will be at the top of the page
2. It will look like: `https://jd-transcripts-backend.onrender.com`
3. Click to test it!

---

### **Step 7: Test Your Backend**

Visit your URL to make sure it works:
```
https://your-app-name.onrender.com/
```

You should see your backend responding!

---

## 🎯 **Render Free Tier Benefits:**

✅ **750 hours/month free** (enough for one service 24/7)
✅ **Automatic SSL/HTTPS**
✅ **Auto-deploy on git push**
✅ **Build & deploy logs**
✅ **Custom domains** (if you have one)
✅ **No credit card required** for free tier

---

## ⚠️ **Important Notes:**

1. **Free tier sleeps after 15 min of inactivity**
   - First request after sleep takes ~30 seconds to wake up
   - Upgrade to paid tier ($7/month) for always-on

2. **Automatic Deployments**
   - Every time you push to GitHub, Render auto-deploys
   - No manual deployment needed!

3. **Environment Variables**
   - Add more env vars anytime in service settings
   - Click "Environment" tab → "Add Environment Variable"

---

## 🔗 **Next Steps After Deployment:**

1. **Copy your Render URL** (e.g., `https://jd-transcripts-backend.onrender.com`)
2. **Update your frontend** to use this URL
3. **Test all API endpoints**
4. **Add more environment variables** if needed (database, email, etc.)

---

## 📝 **Need to Add Database Later?**

Render offers free PostgreSQL databases:
1. Click **"New +"** → **"PostgreSQL"**
2. Select **"Free"** tier
3. Connect it to your web service via environment variables

---

## 🆘 **Troubleshooting:**

**Build Failed?**
- Check build logs for errors
- Make sure `package.json` has all dependencies
- Verify `node` version compatibility

**Service Won't Start?**
- Check if start command is correct: `node backend-server.js`
- Verify PORT environment variable is set
- Check deploy logs for error messages

**Can't Access Service?**
- Make sure deployment status is "Live" (green)
- Check if app is listening on `process.env.PORT`
- Try accessing `/health` or `/` endpoint

---

## 🎉 **You're All Set!**

Your backend will be live at: `https://your-app-name.onrender.com`

Update your frontend to use this URL and you're ready to go! 🚀
