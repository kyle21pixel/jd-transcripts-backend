# JD Reporting Company - Deployment Instructions

## 🚀 Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. Go to [Netlify](https://www.netlify.com/)
2. Sign up or log in to your account
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the entire `deploy-package` folder from:
   ```
   c:\Users\Kyle\jd 3\deploy-package\
   ```
5. Wait for deployment to complete
6. Your site will get a URL like: `https://amazing-name-123456.netlify.app`

### Step 2: Custom Domain (Optional)
1. In Netlify dashboard, go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `jdreporting.org`)
4. Follow DNS configuration instructions

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [Railway](https://railway.app/)
2. Sign up or log in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Upload the `railway-backend` folder or connect your GitHub repo
5. Railway will automatically detect it's a Node.js project

### Step 2: Environment Variables
Set these environment variables in Railway dashboard:

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

### Step 3: Update Frontend URL
After getting your Railway backend URL:
1. Update `FRONTEND_URL` in Railway environment variables
2. Update the frontend code to use your Railway URL

## 🔐 Admin Credentials

### Working Login Credentials:
- **Admin:** `jd.admin` / `admin123`
- **Manager:** `jd.manager` / `manager123`
- **Supervisor:** `jd.supervisor` / `super123`

## 📱 URLs After Deployment

### Frontend URLs:
- **Main Site:** `https://your-netlify-url.netlify.app`
- **Admin Login:** `https://your-netlify-url.netlify.app/admin`
- **Dashboard:** `https://your-netlify-url.netlify.app/dashboard`

### Backend URLs:
- **API Base:** `https://your-railway-url.up.railway.app`
- **Health Check:** `https://your-railway-url.up.railway.app/api/health`
- **Login API:** `https://your-railway-url.up.railway.app/api/auth/login`

## 🔄 After Deployment

1. **Test the health check:** Visit your Railway URL + `/api/health`
2. **Test the frontend:** Visit your Netlify URL
3. **Test admin login:** Go to `/admin` and use the credentials above
4. **Update environment variables:** Replace placeholder URLs with actual deployment URLs

## 📝 Files Ready for Deployment

### Frontend Package: `c:\Users\Kyle\jd 3\deploy-package\`
- ✅ index.html (main website)
- ✅ admin-login-new.html (admin login)
- ✅ admin-dashboard-new.html (admin dashboard)
- ✅ netlify.toml (configuration)
- ✅ _redirects (URL redirects)

### Backend Package: `c:\Users\Kyle\jd 3\railway-backend\`
- ✅ app.js (main server)
- ✅ package.json (dependencies)
- ✅ All routes and controllers
- ✅ railway.json (Railway configuration)
- ✅ Procfile (process configuration)

## 🚨 Important Notes

1. **Update CORS origins** in Railway after getting Netlify URL
2. **Test all functionality** after deployment
3. **Monitor logs** in both Netlify and Railway dashboards
4. **Set up custom domains** if needed
5. **Enable HTTPS** (automatic on both platforms)

## 🆘 Troubleshooting

### If admin login doesn't work:
1. Check Railway logs for backend errors
2. Verify environment variables are set correctly
3. Test API health endpoint
4. Check browser console for CORS errors

### If site doesn't load:
1. Check Netlify deploy logs
2. Verify all files are uploaded correctly
3. Check _redirects file is working
4. Test individual pages directly

Your website is now ready for deployment! 🎉