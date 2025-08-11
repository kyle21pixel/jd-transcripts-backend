# Deploy Complete Advanced JD Transcripts System
Write-Host "🚀 Deploying Complete Advanced JD Transcripts System..." -ForegroundColor Green

# Copy the complete app to Railway
Write-Host "📁 Updating Railway app with complete version..." -ForegroundColor Yellow
Copy-Item "server\app-complete.js" "server\app-railway.js" -Force

Write-Host "✅ Complete system deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 ADVANCED FEATURES INCLUDED:" -ForegroundColor Cyan
Write-Host "✅ Database Storage (MongoDB)" -ForegroundColor Green
Write-Host "✅ Email Notifications (Gmail)" -ForegroundColor Green
Write-Host "✅ File Upload & Cloud Storage (AWS S3)" -ForegroundColor Green
Write-Host "✅ Admin Dashboard" -ForegroundColor Green
Write-Host "✅ JWT Authentication" -ForegroundColor Green
Write-Host "✅ Payment Integration (Stripe)" -ForegroundColor Green
Write-Host "✅ Real-time Notifications" -ForegroundColor Green
Write-Host "✅ Advanced Analytics" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 REQUIRED ENVIRONMENT VARIABLES:" -ForegroundColor Yellow
Write-Host "Core Variables:" -ForegroundColor White
Write-Host "  MONGODB_URI - MongoDB Atlas connection string" -ForegroundColor Gray
Write-Host "  JWT_SECRET - Secure random string (32+ characters)" -ForegroundColor Gray
Write-Host "  EMAIL_USER - Gmail address" -ForegroundColor Gray
Write-Host "  EMAIL_PASS - Gmail app password" -ForegroundColor Gray
Write-Host "  ADMIN_EMAIL - Admin notification email" -ForegroundColor Gray
Write-Host ""
Write-Host "Optional (for full features):" -ForegroundColor White
Write-Host "  STRIPE_SECRET_KEY - Stripe payment processing" -ForegroundColor Gray
Write-Host "  STRIPE_WEBHOOK_SECRET - Stripe webhook verification" -ForegroundColor Gray
Write-Host "  AWS_ACCESS_KEY_ID - AWS S3 file storage" -ForegroundColor Gray
Write-Host "  AWS_SECRET_ACCESS_KEY - AWS S3 credentials" -ForegroundColor Gray
Write-Host "  AWS_BUCKET_NAME - S3 bucket name" -ForegroundColor Gray
Write-Host "  AWS_REGION - AWS region (default: us-east-1)" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 LIVE URLS:" -ForegroundColor Cyan
Write-Host "  Website: https://jd-reporting-company.netlify.app/" -ForegroundColor Blue
Write-Host "  Admin: https://jd-reporting-company.netlify.app/admin-dashboard.html" -ForegroundColor Blue
Write-Host "  API: https://jd-transcripts-backend-production.up.railway.app/" -ForegroundColor Blue
Write-Host ""
Write-Host "👨‍💼 DEFAULT ADMIN CREDENTIALS:" -ForegroundColor Yellow
Write-Host "  Email: admin@jdlegaltranscripts.com" -ForegroundColor Gray
Write-Host "  Password: admin123" -ForegroundColor Gray
Write-Host "  ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!" -ForegroundColor Red
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Add environment variables to Railway" -ForegroundColor White
Write-Host "2. Railway will auto-deploy the new version" -ForegroundColor White
Write-Host "3. Run: node server/setup-admin.js (to create admin user)" -ForegroundColor White
Write-Host "4. Test all features on your live site" -ForegroundColor White
Write-Host "5. Configure Stripe webhooks (if using payments)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 TESTING CHECKLIST:" -ForegroundColor Green
Write-Host "□ Order submission works" -ForegroundColor Gray
Write-Host "□ Email notifications received" -ForegroundColor Gray
Write-Host "□ Admin dashboard login" -ForegroundColor Gray
Write-Host "□ Order management functions" -ForegroundColor Gray
Write-Host "□ File upload works" -ForegroundColor Gray
Write-Host "□ Payment processing (if enabled)" -ForegroundColor Gray
Write-Host ""
Write-Host "🚨 TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "- Check Railway deployment logs for errors" -ForegroundColor Gray
Write-Host "- Verify all environment variables are set" -ForegroundColor Gray
Write-Host "- Test API endpoints individually" -ForegroundColor Gray
Write-Host "- Check browser console for frontend errors" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Your professional transcription service is ready!" -ForegroundColor Green