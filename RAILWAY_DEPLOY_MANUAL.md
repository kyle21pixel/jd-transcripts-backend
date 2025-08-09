# Manual Railway Deployment Guide

## 🚀 Quick Deploy Steps

### Option 1: Using Railway CLI (Recommended)
1. **Install Railway CLI:**
   ```powershell
   npm install -g @railway/cli
   ```

2. **Login to Railway:**
   ```powershell
   railway login
   ```

3. **Deploy from server folder:**
   ```powershell
   cd "c:\Users\Kyle\jd 3\server"
   railway up
   ```

### Option 2: Manual Upload via Web Interface

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Click "New Project"
   - Select "Empty Project"

2. **Upload Your Files:**
   Upload these files from your `server` folder:
   ```
   ✅ package.json
   ✅ app.js
   ✅ railway.json
   ✅ Dockerfile (optional)
   ✅ .env (create new with environment variables)
   ✅ routes/ folder (all route files)
   ```

3. **Set Environment Variables:**
   In Railway dashboard, go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
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

4. **Deploy:**
   - Railway will automatically detect Node.js
   - It will run `npm install` and `npm start`
   - Your app will be live at: `https://your-project-name.railway.app`

## 🔧 Troubleshooting Common Issues

### Issue 1: "Build Failed"
**Solution:** Check that package.json has correct dependencies:
```json
{
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  }
}
```

### Issue 2: "Health Check Failed"
**Solution:** Ensure your app responds to `/api/health`:
- Test locally: `http://localhost:5000/api/health`
- Should return: `{"status": "OK"}`

### Issue 3: "Port Binding Error"
**Solution:** Use Railway's PORT environment variable:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Issue 4: "Module Not Found"
**Solution:** Check all route files exist:
```
server/
├── routes/
│   ├── auth.js ✅
│   ├── order.js ✅
│   ├── admin.js ✅
│   ├── careers.js ✅
│   ├── transcribers.js ✅
│   └── email.js ✅
```

## 🧪 Testing Your Deployment

Once deployed, test these endpoints:

1. **Health Check:**
   ```
   GET https://your-app.railway.app/api/health
   ```

2. **Root Endpoint:**
   ```
   GET https://your-app.railway.app/
   ```

3. **Order Creation:**
   ```
   POST https://your-app.railway.app/api/orders
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "service": "legal",
     "turnaround": "standard"
   }
   ```

4. **Contact Form:**
   ```
   POST https://your-app.railway.app/api/email/contact
   Content-Type: application/json
   
   {
     "name": "Test User",
     "email": "test@example.com",
     "message": "Test message"
   }
   ```

## 🎉 Success Indicators

✅ **Deployment Successful** when you see:
- Build logs show "npm install" completed
- App starts with "Server running on port XXXX"
- Health check returns 200 OK
- All API endpoints respond correctly

## 🔗 Next Steps After Deployment

1. **Copy your Railway URL** (e.g., `https://your-app.railway.app`)
2. **Update your frontend** to use this URL instead of mock data
3. **Test all functionality** end-to-end
4. **Monitor logs** in Railway dashboard for any issues

Your backend is now live and ready to handle real requests! 🚀