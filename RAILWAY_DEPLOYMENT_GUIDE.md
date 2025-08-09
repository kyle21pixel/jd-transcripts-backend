# Railway Deployment Guide for JD Legal Transcripts Backend

## 🚀 Quick Deployment Steps

### Step 1: Go to Railway
1. Visit **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up/Login (GitHub recommended)

### Step 2: Create New Project
1. Click **"Deploy from GitHub repo"** OR **"Empty Project"**
2. If using Empty Project, you'll upload files manually

### Step 3: Upload Your Backend Files
Upload these files from your `server` folder:
- `app.js` (main server file)
- `package.json` (dependencies)
- `railway-deploy.json` (Railway configuration)
- All folders: `routes/`, `models/`, `controllers/`, `middleware/`, `utils/`, `services/`

### Step 4: Set Environment Variables
In Railway dashboard, go to **Variables** tab and add these:

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

### Step 5: Deploy
1. Railway will automatically detect it's a Node.js project
2. It will run `npm install` and `npm start`
3. Your API will be available at: `https://your-project-name.railway.app`

### Step 6: Test Your API
Once deployed, test these endpoints:
- `GET https://your-project-name.railway.app/api/health` (should return OK)
- `POST https://your-project-name.railway.app/api/orders` (create order)
- `POST https://your-project-name.railway.app/api/email/contact` (contact form)

### Step 7: Update Frontend
Update your Netlify frontend to use the new Railway API URL instead of simulated functions.

## 📁 Files Ready for Deployment

Your server folder contains:
- ✅ `app.js` - Main server file
- ✅ `package.json` - Dependencies and scripts
- ✅ `railway-deploy.json` - Railway configuration
- ✅ `routes/` - All API routes (auth, orders, admin, etc.)
- ✅ `models/` - Database models
- ✅ `controllers/` - Business logic
- ✅ `middleware/` - Authentication & security
- ✅ `utils/` - Helper functions
- ✅ `services/` - Email and external services

## 🔧 What Railway Will Do
1. **Detect Node.js**: Automatically configure build
2. **Install Dependencies**: Run `npm install`
3. **Start Server**: Run `npm start` (which runs `node app.js`)
4. **Provide URL**: Give you a public URL for your API
5. **Auto-scaling**: Handle traffic automatically
6. **SSL**: Provide HTTPS automatically

## 🌐 After Deployment
Your backend will be live at: `https://your-project-name.railway.app`

API endpoints will be:
- `https://your-project-name.railway.app/api/health`
- `https://your-project-name.railway.app/api/orders`
- `https://your-project-name.railway.app/api/auth/login`
- `https://your-project-name.railway.app/api/email/contact`
- And all other routes...

## 🔗 Connect to Frontend
Once deployed, update your frontend JavaScript to call the Railway API:

```javascript
// Replace simulated API calls with real ones
const API_BASE_URL = 'https://your-project-name.railway.app/api';

// Example: Order submission
const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
});
```

## 🎉 Benefits You'll Get
- ✅ Real database storage (MongoDB)
- ✅ Email notifications working
- ✅ Admin dashboard functionality
- ✅ File upload handling
- ✅ Professional API endpoints
- ✅ Automatic scaling
- ✅ SSL/HTTPS security
- ✅ 99.9% uptime

Your Netlify frontend will remain unchanged and will now have a powerful backend!