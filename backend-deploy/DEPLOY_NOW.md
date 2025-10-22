# 🚂 Deploy Backend to Railway - Step by Step

## 🎯 What We're Deploying

1. **MySQL Database** - All your orders and users
2. **PHP Backend API** - All 4 API endpoints (38+ routes)
3. **Connect to Frontend** - Update Netlify to use Railway backend

---

## 📋 STEP 1: Create Railway Account (2 minutes)

1. Open browser and go to: **https://railway.app/**
2. Click **"Login"** (top right)
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub
5. ✅ You're in! You get **$5 free credit** (no credit card needed)

---

## 📋 STEP 2: Deploy MySQL Database (3 minutes)

1. Click **"New Project"** button (big purple button)
2. Select **"Provision MySQL"**
3. Wait 30-60 seconds... MySQL is deploying! ⏳
4. ✅ MySQL is now running!

### Get Database Credentials:

1. Click on the **MySQL service** (purple database icon)
2. Click **"Variables"** tab
3. **COPY THESE 5 VALUES** (we'll need them):

```
MYSQLHOST: _______________________________
MYSQLPORT: _______________________________
MYSQLDATABASE: ____________________________
MYSQLUSER: ________________________________
MYSQLPASSWORD: ____________________________
```

**💡 Tip:** Keep this tab open! You'll need these values in Step 4.

---

## 📋 STEP 3: Import Database Schema (3 minutes)

Now we need to create the tables and add sample users.

### Option A: Using Railway Query Tab (Easy)

1. Still in your MySQL service, click **"Data"** tab
2. Click **"Query"** button (top right)
3. Open this file on your computer:
   ```
   c:\Users\kyle\Desktop\kyle\Kyle\jd 3\backend-deploy\database-schema.sql
   ```
4. **Copy the ENTIRE contents** of that file
5. **Paste** it into the Railway query window
6. Click **"Run"** button
7. ✅ You should see: "3 tables created, 5 users inserted"

### Option B: Using MySQL Client (Advanced)

```bash
# From your computer
cd "c:\Users\kyle\Desktop\kyle\Kyle\jd 3\backend-deploy"

# Connect to Railway MySQL
mysql -h [MYSQLHOST] -P [MYSQLPORT] -u [MYSQLUSER] -p[MYSQLPASSWORD] [MYSQLDATABASE] < database-schema.sql
```

---

## 📋 STEP 4: Deploy PHP Backend (5 minutes)

### 4.1: Prepare Backend Folder

1. Go to your backend folder:
   ```
   c:\Users\kyle\Desktop\kyle\Kyle\jd 3\backend-deploy
   ```

2. **Right-click** on the `backend-deploy` folder
3. Select **"Send to"** → **"Compressed (zipped) folder"**
4. Name it: `backend-deploy.zip`

### 4.2: Deploy to Railway

1. Back in Railway, click **"New"** button (in your project)
2. Select **"Empty Service"**
3. Click **"Deploy from local directory"**
4. **Upload your `backend-deploy.zip`** or select the folder
5. Railway will detect PHP and start deploying... ⏳
6. Wait 2-3 minutes for deployment

### 4.3: Generate Domain

1. Click on your **PHP service**
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. ✅ Copy your URL: `https://your-backend-name.railway.app`

**Write it here:**
```
Backend URL: https://________________________________.railway.app
```

---

## 📋 STEP 5: Configure Environment Variables (3 minutes)

Your backend needs to know how to connect to the database.

1. Click on your **PHP service**
2. Go to **"Variables"** tab
3. Click **"New Variable"** button
4. Add these one by one:

### Variable 1:
```
Name: ENVIRONMENT
Value: production
```

### Variable 2:
```
Name: DB_HOST
Value: [paste MYSQLHOST from Step 2]
```

### Variable 3:
```
Name: DB_PORT
Value: [paste MYSQLPORT from Step 2]
```

### Variable 4:
```
Name: DB_NAME
Value: [paste MYSQLDATABASE from Step 2]
```

### Variable 5:
```
Name: DB_USER
Value: [paste MYSQLUSER from Step 2]
```

### Variable 6:
```
Name: DB_PASS
Value: [paste MYSQLPASSWORD from Step 2]
```

### Variable 7:
```
Name: FRONTEND_URL
Value: https://chic-piroshki-394c40.netlify.app
```

5. ✅ All variables added! Railway will automatically restart your service.

---

## 📋 STEP 6: Test Your Backend (2 minutes)

Let's make sure it's working!

### Test 1: API Status
Open in browser:
```
https://your-backend-name.railway.app/
```

**Expected result:**
```json
{
  "success": true,
  "message": "JD Reporting Company API",
  "version": "1.0.0",
  "status": "online"
}
```

✅ If you see this, your backend is LIVE! 🎉

### Test 2: Test Login API
Open in browser:
```
https://your-backend-name.railway.app/api/auth.php?action=check
```

**Expected result:** Some JSON response (even if it says not logged in)

---

## 📋 STEP 7: Update Frontend API URLs (10 minutes)

Now we need to tell your Netlify frontend to use the Railway backend.

### Files to Update:

Go to: `c:\Users\kyle\Desktop\kyle\Kyle\jd 3\netlify-deploy\`

**Update these 6 files:**

#### 1. `admin-panel/assets/js/admin-common.js`

Find this line (around line 2):
```javascript
const API_BASE = 'http://localhost:8080/jd%203/php_backend/api';
```

Change to:
```javascript
const API_BASE = 'https://your-backend-name.railway.app/api';
```

#### 2. `transcriber-panel/assets/js/transcriber-common.js`

Same change:
```javascript
const API_BASE = 'https://your-backend-name.railway.app/api';
```

#### 3. `login-admin.html`

Find (around line 165):
```javascript
const API_BASE = 'http://localhost:8080/jd%203/php_backend/api/auth.php';
```

Change to:
```javascript
const API_BASE = 'https://your-backend-name.railway.app/api/auth.php';
```

#### 4. `transcriber-login.html`

Same change as above.

#### 5. `order-form.html`

Find:
```javascript
const API_URL = 'http://localhost:8080/jd%203/php_backend/api/orders.php';
```

Change to:
```javascript
const API_URL = 'https://your-backend-name.railway.app/api/orders.php';
```

#### 6. `track-order.html`

Same change as order-form.html.

---

## 📋 STEP 8: Redeploy Frontend to Netlify (2 minutes)

1. Go to: **https://app.netlify.com/**
2. Find your site: **chic-piroshki-394c40**
3. Click **"Deploys"** tab
4. **Drag the entire `netlify-deploy` folder** again
5. Wait 30-60 seconds
6. ✅ New version is live!

---

## 📋 STEP 9: Test Everything! (5 minutes)

### Test Order Submission:
1. Go to: `https://chic-piroshki-394c40.netlify.app/order-form.html`
2. Fill out the form
3. Click Submit
4. ✅ Should see success message!

### Test Admin Login:
1. Go to: `https://chic-piroshki-394c40.netlify.app/login-admin.html`
2. Username: `admin`
3. Password: `admin.1.pass`
4. Click Login
5. ✅ Should redirect to admin dashboard!

### Test Admin Dashboard:
1. Should see dashboard with stats
2. Click "Orders" - should see your test order!
3. Click "Transcribers" - should see 4 transcribers
4. ✅ Everything works!

### Test Transcriber Login:
1. Go to: `https://chic-piroshki-394c40.netlify.app/transcriber-login.html`
2. Username: `transcriber1`
3. Password: `trans.1.pass`
4. Click Login
5. ✅ Should redirect to transcriber dashboard!

---

## ✅ DONE! Your Full Stack App is LIVE!

🎉 **Congratulations!** You've successfully deployed:

- ✅ Frontend on Netlify (with beautiful styling)
- ✅ Backend API on Railway
- ✅ MySQL Database on Railway
- ✅ Full authentication system
- ✅ Admin dashboard working
- ✅ Transcriber dashboard working
- ✅ Order management system

### Your Live URLs:

**Frontend:** https://chic-piroshki-394c40.netlify.app
**Backend:** https://your-backend-name.railway.app
**Admin Login:** https://chic-piroshki-394c40.netlify.app/login-admin.html

---

## 🆘 Troubleshooting

### Backend shows "Database connection failed"
- Check environment variables are set correctly
- Make sure DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS are correct
- Railway MySQL service must be running

### Frontend can't connect to backend
- Check API URLs are updated in all 6 files
- Make sure FRONTEND_URL is set in Railway variables
- Check browser console for CORS errors

### Login doesn't work
- Check auth.php endpoint: `your-backend.railway.app/api/auth.php?action=check`
- Verify users exist in database
- Check Railway logs for errors

### No data in dashboard
- Test backend endpoint directly in browser
- Check Railway logs for database errors
- Verify tables were created in Step 3

---

## 💰 Railway Costs

- **Free:** $5 credit (lasts ~1 month for small sites)
- **After free credit:** ~$5-10/month
- **Can pause services** when not in use
- **Add credit card** for uninterrupted service

---

**Created:** October 21, 2025
**Status:** Ready to Deploy! 🚀
