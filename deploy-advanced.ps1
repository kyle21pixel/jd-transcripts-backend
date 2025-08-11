# Deploy Advanced JD Transcripts to Railway
Write-Host "🚀 Deploying Advanced JD Transcripts to Railway..." -ForegroundColor Green

# Copy the advanced app to replace the current one
Write-Host "📁 Updating Railway app file..." -ForegroundColor Yellow
Copy-Item "server\app-advanced.js" "server\app-railway.js" -Force

# Update package.json to use the advanced app
Write-Host "📦 Updating package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "server\package.json" | ConvertFrom-Json
$packageJson.main = "app-railway.js"
$packageJson.scripts.start = "node app-railway.js"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "server\package.json"

Write-Host "✅ Files updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add these environment variables to Railway:" -ForegroundColor White
Write-Host "   - MONGODB_URI (get from MongoDB Atlas)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (generate a secure random string)" -ForegroundColor Gray
Write-Host "   - EMAIL_USER (your Gmail address)" -ForegroundColor Gray
Write-Host "   - EMAIL_PASS (Gmail app password)" -ForegroundColor Gray
Write-Host "   - ADMIN_EMAIL (admin@jdlegaltranscripts.com)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Railway will auto-deploy the changes" -ForegroundColor White
Write-Host "3. Run setup-admin.js to create admin user" -ForegroundColor White
Write-Host "4. Access admin dashboard at your-site.com/admin-dashboard.html" -ForegroundColor White
Write-Host ""
Write-Host "📧 Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "   Email: admin@jdlegaltranscripts.com" -ForegroundColor Gray
Write-Host "   Password: admin123" -ForegroundColor Gray
Write-Host "   ⚠️  Change password after first login!" -ForegroundColor Red