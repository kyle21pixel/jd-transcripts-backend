# Quick Deploy - Alternative Method
# Uses Vercel for backend and Netlify for frontend

Write-Host "⚡ Quick Deploy - JD Transcripts" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Install CLI tools
Write-Host "`n🔧 Installing deployment tools..." -ForegroundColor Green
npm install -g vercel netlify-cli

# Deploy Backend to Vercel
Write-Host "`n🚀 Deploying Backend to Vercel..." -ForegroundColor Green
Set-Location "c:\Users\Kyle\jd 3\server"
npm install

Write-Host "🔐 Login to Vercel when prompted..." -ForegroundColor Yellow
vercel login
vercel --prod

# Deploy Frontend to Netlify
Write-Host "`n🌐 Deploying Frontend to Netlify..." -ForegroundColor Green
Set-Location "c:\Users\Kyle\jd 3\deploy"

Write-Host "🔐 Login to Netlify when prompted..." -ForegroundColor Yellow
netlify login
netlify deploy --prod --dir=. --open

Write-Host "`n🎉 QUICK DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "✅ Backend: Vercel" -ForegroundColor Cyan
Write-Host "✅ Frontend: Netlify" -ForegroundColor Cyan