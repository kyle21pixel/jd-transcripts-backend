# 🚀 **JD TRANSCRIPTS - LIVE DEPLOYMENT GUIDE**

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **1. 🔧 Deploy Backend Server (Railway)**

#### **A. Create Railway Account & Deploy:**
1. **Go to:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select:** `jd 3/server` folder
5. **Railway will auto-deploy** the Node.js app

#### **B. Set Environment Variables in Railway:**
Go to your Railway project → **Variables** tab → Add these:

```env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_BUSINESS_SHORT_CODE=your_business_shortcode
MPESA_PASSKEY=your_production_passkey

PORT=3000
NODE_ENV=production

FRONTEND_URL=https://jd-transcripts-live.surge.sh
CLIENT_URL=https://jd-transcripts-live.surge.sh

EMAIL_SERVICE=gmail
EMAIL_USER=benjaminoxy21@gmail.com
EMAIL_PASS=your_gmail_app_password

JWT_SECRET=your_super_secure_jwt_secret_here_production
API_KEY=your_production_api_key

MPESA_BASE_URL_PRODUCTION=https://api.safaricom.co.ke
MPESA_CALLBACK_URL=https://your-railway-domain.railway.app/api/mpesa/callback
MPESA_TIMEOUT_URL=https://your-railway-domain.railway.app/api/mpesa/timeout
```

#### **C. Get Your Railway Domain:**
After deployment, Railway will give you a domain like:
`https://jd-transcripts-server-production.railway.app`

---

### **2. 📱 Get M-Pesa Production Credentials**

#### **A. Safaricom Developer Portal:**
1. **Go to:** https://developer.safaricom.co.ke
2. **Create account** and **login**
3. **Create new app** → Select **"Lipa Na M-Pesa Online"**
4. **Get credentials:**
   - Consumer Key
   - Consumer Secret
   - Business Short Code
   - Passkey

#### **B. Test Credentials (For Testing):**
```
Consumer Key: dpYvhXdYGQ8fVjkzEGjJqMjJrQVoM7wV
Consumer Secret: 2mAjXxPdQZGGGGGG
Business Short Code: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

---

### **3. 📧 Setup Gmail App Password**

#### **A. Enable 2-Factor Authentication:**
1. **Go to:** https://myaccount.google.com/security
2. **Enable 2-Step Verification**

#### **B. Create App Password:**
1. **Go to:** https://myaccount.google.com/apppasswords
2. **Select app:** Mail
3. **Select device:** Other (Custom name)
4. **Enter:** "JD Transcripts Server"
5. **Copy the 16-character password**

---

### **4. 🌐 Update Frontend with Server URL**

Replace `https://your-server-domain.railway.app` in these files with your actual Railway domain:

#### **A. Update script.js:**
```javascript
const serverUrl = 'https://jd-transcripts-server-production.railway.app';
```

#### **B. Update admin.html:**
```javascript
const serverUrl = 'https://jd-transcripts-server-production.railway.app';
```

---

### **5. 🚀 Deploy Updated Frontend**

```bash
cd "c:\Users\Kyle\jd 3\deploy"
surge . jd-transcripts-live.surge.sh
```

---

## 🧪 **TESTING CHECKLIST**

### **✅ Backend Server Tests:**
1. **Server Health:** `https://your-railway-domain.railway.app/`
2. **Orders API:** `https://your-railway-domain.railway.app/api/orders`
3. **M-Pesa API:** `https://your-railway-domain.railway.app/api/mpesa/pay`

### **✅ Frontend Tests:**
1. **Main Website:** https://jd-transcripts-live.surge.sh
2. **Order Form:** Fill and submit with real phone number
3. **M-Pesa Payment:** Should send real STK push
4. **Admin Panel:** https://jd-transcripts-live.surge.sh/admin.html

### **✅ Email Tests:**
1. **Order Notification:** Check benjaminoxy21@gmail.com
2. **Payment Confirmation:** Check after successful payment

---

## 🔧 **TROUBLESHOOTING**

### **❌ M-Pesa Not Working:**
- Check environment variables in Railway
- Verify M-Pesa credentials are correct
- Check callback URLs match Railway domain

### **❌ Emails Not Sending:**
- Verify Gmail app password is correct
- Check EMAIL_USER and EMAIL_PASS in Railway

### **❌ Admin Panel Empty:**
- Check server URL in admin.html
- Verify Railway server is running
- Check browser console for errors

---

## 📱 **REAL PHONE NUMBER TESTING**

### **Test with Real Kenyan Numbers:**
```
Format: 254712345678
Examples:
- 254712345678 (Safaricom)
- 254722123456 (Safaricom)
- 254733456789 (Airtel)
```

### **M-Pesa Test Process:**
1. **Enter real Kenyan phone number**
2. **Submit order**
3. **Check phone for STK push notification**
4. **Enter M-Pesa PIN**
5. **Payment processes in real-time**
6. **Email confirmation sent**

---

## 🎯 **FINAL DEPLOYMENT STEPS**

### **1. Deploy Server to Railway**
### **2. Update Frontend URLs**
### **3. Deploy Frontend to Surge**
### **4. Test with Real Phone Numbers**
### **5. Verify Email Notifications**

**Your system will be 100% live and functional!** 🚀📱✅