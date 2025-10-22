# JD Transcripts - Deploy to Netlify and Railway
# This script prepares the deployment packages for Netlify and Railway

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JD Transcripts - Deployment Script  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Prepare the Netlify deployment package
Write-Host "Step 1: Preparing Netlify deployment package..." -ForegroundColor Yellow

# Create deploy-package directory if it doesn't exist
if (-not (Test-Path -Path "c:\Users\Kyle\jd 3\deploy-package")) {
    New-Item -ItemType Directory -Path "c:\Users\Kyle\jd 3\deploy-package" -Force
}

# Copy HTML files
Write-Host "  - Copying HTML files..." -ForegroundColor Gray
Copy-Item -Path "c:\Users\Kyle\jd 3\index.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\index.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\about.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\about.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\contact.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\contact.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\order.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\order.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\track-order.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\track-order.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\careers.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\careers.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\admin-login-new.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\admin-login-new.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\admin-dashboard-new.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\admin-dashboard-new.html" -Force

# Copy CSS and JS files
Write-Host "  - Copying CSS and JS files..." -ForegroundColor Gray
Copy-Item -Path "c:\Users\Kyle\jd 3\styles.css" -Destination "c:\Users\Kyle\jd 3\deploy-package\styles.css" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\script.js" -Destination "c:\Users\Kyle\jd 3\deploy-package\script.js" -Force

# Copy Netlify configuration files
Write-Host "  - Copying Netlify configuration files..." -ForegroundColor Gray
Copy-Item -Path "c:\Users\Kyle\jd 3\netlify.toml" -Destination "c:\Users\Kyle\jd 3\deploy-package\netlify.toml" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\_redirects" -Destination "c:\Users\Kyle\jd 3\deploy-package\_redirects" -Force

# Update API URLs in JavaScript files
Write-Host "  - Updating API URLs in JavaScript files..." -ForegroundColor Gray
$scriptContent = Get-Content -Path "c:\Users\Kyle\jd 3\deploy-package\script.js" -Raw
$scriptContent = $scriptContent -replace "https://jd-transcripts-backend-production.up.railway.app", "https://jd-transcripts-server-production.railway.app"
Set-Content -Path "c:\Users\Kyle\jd 3\deploy-package\script.js" -Value $scriptContent

$adminLoginContent = Get-Content -Path "c:\Users\Kyle\jd 3\deploy-package\admin-login-new.html" -Raw
$adminLoginContent = $adminLoginContent -replace "https://jd-transcripts-backend-production.up.railway.app", "https://jd-transcripts-server-production.railway.app"
Set-Content -Path "c:\Users\Kyle\jd 3\deploy-package\admin-login-new.html" -Value $adminLoginContent

$trackOrderContent = Get-Content -Path "c:\Users\Kyle\jd 3\deploy-package\track-order.html" -Raw
$trackOrderContent = $trackOrderContent -replace "https://jd-transcripts-backend-production.up.railway.app", "https://jd-transcripts-server-production.railway.app"
Set-Content -Path "c:\Users\Kyle\jd 3\deploy-package\track-order.html" -Value $trackOrderContent

Write-Host "Netlify deployment package prepared successfully!" -ForegroundColor Green
Write-Host "Package location: c:\Users\Kyle\jd 3\deploy-package\" -ForegroundColor Green
Write-Host ""

# Step 2: Prepare the Railway deployment package
Write-Host "Step 2: Preparing Railway deployment package..." -ForegroundColor Yellow

# Update CORS settings in app.js
Write-Host "  - Updating CORS settings in app.js..." -ForegroundColor Gray
$appJsContent = Get-Content -Path "c:\Users\Kyle\jd 3\railway-backend\app.js" -Raw
if (-not ($appJsContent -match "https://jd-transcripts.netlify.app")) {
    $appJsContent = $appJsContent -replace "app.use\(cors\(\{[\s\S]*?\}\)\);", @"
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5500',
        'https://sensational-tartufo-6888eb.netlify.app',
        'https://jd-transcripts.netlify.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
"@
    Set-Content -Path "c:\Users\Kyle\jd 3\railway-backend\app.js" -Value $appJsContent
}

# Update environment variables
Write-Host "  - Updating environment variables..." -ForegroundColor Gray
$envContent = Get-Content -Path "c:\Users\Kyle\jd 3\railway-backend\.env.railway" -Raw
$envContent = $envContent -replace "FRONTEND_URL=https://sensational-tartufo-6888eb.netlify.app", "FRONTEND_URL=https://jd-transcripts.netlify.app"
$envContent = $envContent -replace "CORS_ORIGIN=https://sensational-tartufo-6888eb.netlify.app", "CORS_ORIGIN=https://jd-transcripts.netlify.app"
Set-Content -Path "c:\Users\Kyle\jd 3\railway-backend\.env.railway" -Value $envContent

Write-Host "Railway deployment package prepared successfully!" -ForegroundColor Green
Write-Host "Package location: c:\Users\Kyle\jd 3\railway-backend\" -ForegroundColor Green
Write-Host ""

# Step 3: Open deployment instructions
Write-Host "Step 3: Opening deployment instructions..." -ForegroundColor Yellow
Start-Process "c:\Users\Kyle\jd 3\DEPLOYMENT_STEPS.md"

# Step 4: Open deployment folders
Write-Host "Step 4: Opening deployment folders..." -ForegroundColor Yellow
Start-Process "c:\Users\Kyle\jd 3\deploy-package"
Start-Process "c:\Users\Kyle\jd 3\railway-backend"

# Step 5: Open deployment websites
Write-Host "Step 5: Opening deployment websites..." -ForegroundColor Yellow
Start-Process "https://app.netlify.com/drop"
Start-Process "https://railway.app/new"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment preparation complete!  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Deploy the backend to Railway using the railway-backend folder" -ForegroundColor White
Write-Host "2. Deploy the frontend to Netlify by dragging the deploy-package folder to the Netlify drop zone" -ForegroundColor White
Write-Host "3. Follow the detailed instructions in the DEPLOYMENT_STEPS.md file" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")