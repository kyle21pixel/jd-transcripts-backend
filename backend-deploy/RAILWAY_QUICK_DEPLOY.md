# 🚂 QUICK RAILWAY DEPLOYMENT GUIDE

## ⚡ Deploy in 15 Minutes!

### Step 1: Sign Up (2 minutes)
1. Go to https://railway.app/
2. Click "Login" → Sign up with GitHub
3. Get $5 free credit (no credit card needed!)

### Step 2: Deploy MySQL (3 minutes)
1. Click "New Project"
2. Select "Provision MySQL"
3. Wait 30 seconds for deployment
4. MySQL is now running! ✅

### Step 3: Get Database Credentials (2 minutes)
1. Click on your MySQL service
2. Click "Variables" tab
3. **Copy these 5 values:**
   ```
   MYSQLHOST: [copy this]
   MYSQLPORT: [copy this]
   MYSQLDATABASE: [copy this]
   MYSQLUSER: [copy this]
   MYSQLPASSWORD: [copy this]
   ```

### Step 4: Import Database (3 minutes)
1. Still in MySQL service, click "Data" tab
2. Click "+ Query" button
3. **Open file:** `database-schema.sql` from this folder
4. **Copy entire content** and paste in query window
5. Click "Run"
6. ✅ Database tables created with sample users!

### Step 5: Deploy PHP Backend (3 minutes)
1. Click "New" button → "Empty Service"
2. Click "Deploy from local directory"
3. **Select this entire `backend-deploy` folder**
4. Railway will auto-detect PHP and deploy
5. Wait 1-2 minutes

### Step 6: Add Environment Variables (2 minutes)
1. Click on your PHP service
2. Go to "Variables" tab
3. Click "New Variable" and add these:

```
ENVIRONMENT = production

DB_HOST = [paste MYSQLHOST from Step 3]
DB_PORT = [paste MYSQLPORT from Step 3]
DB_NAME = [paste MYSQLDATABASE from Step 3]
DB_USER = [paste MYSQLUSER from Step 3]
DB_PASS = [paste MYSQLPASSWORD from Step 3]

FRONTEND_URL = https://your-site.netlify.app
```
(Use your actual Netlify URL for FRONTEND_URL)

### Step 7: Get Your Backend URL ✅
1. Click "Settings" tab in your PHP service
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Copy your URL: `https://your-app-name.railway.app`

### Step 8: Test Your API 🧪
Open in browser:
```
https://your-app-name.railway.app/
```

You should see:
```json
{
  "success": true,
  "message": "JD Reporting Company API",
  "version": "1.0.0",
  "status": "online"
}
```

✅ **Backend is LIVE!**

---

## 🔗 Connect Frontend to Backend

Now update your frontend files with the new backend URL:

### Files to Update in `netlify-deploy` folder:

1. **admin-panel/assets/js/admin-common.js**
   ```javascript
   const API_BASE = 'https://your-app-name.railway.app/api';
   ```

2. **transcriber-panel/assets/js/transcriber-common.js**
   ```javascript
   const API_BASE = 'https://your-app-name.railway.app/api';
   ```

3. **login-admin.html**
   ```javascript
   const API_BASE = 'https://your-app-name.railway.app/api/auth.php';
   ```

4. **transcriber-login.html**
   ```javascript
   const API_BASE = 'https://your-app-name.railway.app/api/auth.php';
   ```

5. **order-form.html**
   ```javascript
   const API_URL = 'https://your-app-name.railway.app/api/orders.php';
   ```

6. **track-order.html**
   ```javascript
   const API_URL = 'https://your-app-name.railway.app/api/orders.php';
   ```

### Then Redeploy to Netlify:
1. Drag updated `netlify-deploy` folder to Netlify
2. Wait 30 seconds
3. Test your website!

---

## ✅ Final Testing

Test these features on your live website:

- [ ] Submit an order (order-form.html)
- [ ] Check if order saves
- [ ] Login as admin (admin / admin.1.pass)
- [ ] View orders in admin dashboard
- [ ] Login as transcriber (transcriber1 / trans.1.pass)
- [ ] View available orders
- [ ] Track an order

---

## 💰 Railway Costs

- **Free:** $5 credit (lasts ~1 month for small sites)
- **After credit:** ~$5-10/month depending on usage
- **Can add credit card** for uninterrupted service

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check your environment variables
- Make sure all 5 DB variables are set correctly
- Values should NOT have quotes

### "CORS Error"
- Update FRONTEND_URL variable to match Netlify URL exactly
- Include https:// and no trailing slash

### "Service won't start"
- Check "Deployments" tab for error logs
- Railway needs index.php in root folder (✅ included)

---

## 📊 Your Railway Dashboard

```
Project: jd-reporting-company
├── MySQL Service
│   └── Database: jd_reporting_company
│       ├── 3 tables created
│       └── 5 users added
└── PHP Backend Service
    └── URL: https://your-app.railway.app
```

---

## 🎉 Done!

Your backend is now:
- ✅ Running on Railway
- ✅ Connected to MySQL
- ✅ Accessible via HTTPS
- ✅ Ready for your frontend

**Backend URL:** (Write it here)
`https://__________________________________.railway.app`

**Database:** Hosted on Railway
**Users:** admin / admin.1.pass
**Status:** LIVE 🚀

---

**Need Help?**
- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Check deployment logs in Railway dashboard
