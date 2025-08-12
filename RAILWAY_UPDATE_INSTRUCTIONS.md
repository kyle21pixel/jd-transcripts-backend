# Railway Environment Variables Update Instructions

## 🔄 Update Environment Variables in Railway Dashboard

Follow these steps to update the environment variables in your Railway project to reflect the company name change from "JD Legal Transcripts" to "JD Reporting Company" and update the email domain:

1. Log in to your [Railway Dashboard](https://railway.app/dashboard)
2. Select your backend project
3. Go to the "Variables" tab
4. Update the following environment variables:

| Variable | Old Value | New Value |
|----------|-----------|-----------|
| JWT_SECRET | jd-legal-transcripts-super-secret-jwt-key-2025-production-secure | jd-reporting-company-super-secret-jwt-key-2025-production-secure |
| EMAIL_USER | admin@jdlegaltranscripts.com | admin@jdreporting.org |
| ADMIN_EMAIL | admin@jdlegaltranscripts.com | admin@jdreporting.org |
| FRONTEND_URL | (your current Netlify URL) | https://jd-reporting-company.netlify.app |
| CORS_ORIGIN | (your current Netlify URL) | https://jd-reporting-company.netlify.app |

5. Click "Save Changes" to apply the updates
6. Restart your Railway service to ensure the changes take effect

## 🔍 Verify the Changes

After updating the environment variables:

1. Visit your Railway app's health check endpoint: `https://your-railway-url.up.railway.app/api/health`
2. Verify that the response shows "JD Reporting Company API is running"
3. Test the admin login functionality to ensure it works with the updated configuration
4. Check that email notifications are being sent from the new email address

## 🚨 Important Notes

- These changes will take effect immediately after saving and restarting the service
- If you're using a custom domain, make sure to update any DNS records if needed
- Monitor the Railway logs for any errors after making these changes

Your backend should now be fully updated to use the new company name and email domain!