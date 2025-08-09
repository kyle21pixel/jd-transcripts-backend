# Frontend Deployment Script
Write-Host "🚀 Deploying JD Transcripts Frontend..." -ForegroundColor Green

# Navigate to deploy directory
Set-Location "c:\Users\Kyle\jd 3\deploy"

# Check if netlify CLI is available
try {
    netlify --version
    Write-Host "✅ Netlify CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Deploy to Netlify
Write-Host "📤 Deploying to Netlify..." -ForegroundColor Blue
netlify deploy --prod --dir=. --open

Write-Host "✅ Frontend deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your site should open in browser automatically" -ForegroundColor Cyan