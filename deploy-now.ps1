# Simplified Deployment Script for JD Reporting Company
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# 1. Deploy Frontend
Write-Host "📦 Preparing frontend files..." -ForegroundColor Blue

# Copy updated files to deploy-package directory
Copy-Item -Path "c:\Users\Kyle\jd 3\about.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\about.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\admin-dashboard.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\admin-dashboard.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\index.html" -Destination "c:\Users\Kyle\jd 3\deploy-package\index.html" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\styles.css" -Destination "c:\Users\Kyle\jd 3\deploy-package\styles.css" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\script.js" -Destination "c:\Users\Kyle\jd 3\deploy-package\script.js" -Force

Write-Host "✅ Frontend files prepared" -ForegroundColor Green

# 2. Deploy Backend
Write-Host "📦 Preparing backend files..." -ForegroundColor Blue

# Ensure database directory exists
New-Item -ItemType Directory -Path "c:\Users\Kyle\jd 3\railway-backend\database" -Force | Out-Null

# Copy database files to railway-backend
Copy-Item -Path "c:\Users\Kyle\jd 3\database\config.php" -Destination "c:\Users\Kyle\jd 3\railway-backend\database\config.php" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\database\setup.sql" -Destination "c:\Users\Kyle\jd 3\railway-backend\database\setup.sql" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\database\init.php" -Destination "c:\Users\Kyle\jd 3\railway-backend\database\init.php" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\database\manage.php" -Destination "c:\Users\Kyle\jd 3\railway-backend\database\manage.php" -Force
Copy-Item -Path "c:\Users\Kyle\jd 3\database\test-connection.php" -Destination "c:\Users\Kyle\jd 3\railway-backend\database\test-connection.php" -Force

Write-Host "✅ Backend files prepared" -ForegroundColor Green

# 3. Create deployment packages
Write-Host "📦 Creating deployment packages..." -ForegroundColor Blue

# Create frontend zip
Set-Location "c:\Users\Kyle\jd 3\deploy-package"
Compress-Archive -Path * -DestinationPath "c:\Users\Kyle\jd 3\jd-reporting-frontend.zip" -Force

# Create backend zip
Set-Location "c:\Users\Kyle\jd 3\railway-backend"
Compress-Archive -Path * -DestinationPath "c:\Users\Kyle\jd 3\jd-reporting-backend.zip" -Force

Write-Host "✅ Deployment packages created:" -ForegroundColor Green
Write-Host "   - Frontend: c:\Users\Kyle\jd 3\jd-reporting-frontend.zip" -ForegroundColor Cyan
Write-Host "   - Backend: c:\Users\Kyle\jd 3\jd-reporting-backend.zip" -ForegroundColor Cyan

# 4. Deployment instructions
Write-Host "`n📋 Deployment Instructions:" -ForegroundColor Yellow
Write-Host "1. Frontend Deployment (Netlify):" -ForegroundColor White
Write-Host "   - Go to https://app.netlify.com/" -ForegroundColor Cyan
Write-Host "   - Drag and drop the jd-reporting-frontend.zip file" -ForegroundColor Cyan
Write-Host "   - Wait for deployment to complete" -ForegroundColor Cyan

Write-Host "`n2. Backend Deployment (Railway):" -ForegroundColor White
Write-Host "   - Go to https://railway.app/" -ForegroundColor Cyan
Write-Host "   - Create a new project" -ForegroundColor Cyan
Write-Host "   - Choose 'Deploy from GitHub'" -ForegroundColor Cyan
Write-Host "   - Connect your GitHub repository" -ForegroundColor Cyan
Write-Host "   - Or use the Railway CLI with the following commands:" -ForegroundColor Cyan
Write-Host "     railway login" -ForegroundColor Cyan
Write-Host "     railway init" -ForegroundColor Cyan
Write-Host "     railway up" -ForegroundColor Cyan

Write-Host "`n3. Database Setup:" -ForegroundColor White
Write-Host "   - Access the database setup page at your-backend-url/database/init.php" -ForegroundColor Cyan
Write-Host "   - Follow the instructions to initialize the database" -ForegroundColor Cyan
Write-Host "   - Use the database management interface at your-backend-url/database/manage.php" -ForegroundColor Cyan

Write-Host "`n✅ Deployment preparation complete!" -ForegroundColor Green
Write-Host "🚀 Your updated JD Reporting Company website is ready for deployment" -ForegroundColor Green