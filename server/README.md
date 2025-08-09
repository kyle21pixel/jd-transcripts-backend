# JD Transcripts M-Pesa Server

## Quick Deploy to Railway

1. Fork this repository or upload to your GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select this repository
5. Railway will auto-deploy!

## Environment Variables

Add these in Railway → Variables:

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://jd-transcripts-live.surge.sh
CLIENT_URL=https://jd-transcripts-live.surge.sh
EMAIL_SERVICE=gmail
EMAIL_USER=benjaminoxy21@gmail.com
EMAIL_PASS=your_gmail_app_password
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=dpYvhXdYGQ8fVjkzEGjJqMjJrQVoM7wV
MPESA_CONSUMER_SECRET=2mAjXxPdQZGGGGGG
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_BASE_URL_SANDBOX=https://sandbox.safaricom.co.ke
```

## Server will be live at your Railway URL!