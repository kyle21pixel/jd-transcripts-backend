# Build and deploy both frontend and backend

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Step 1: Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install

# Step 2: Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path client
npm install

# Step 3: Build frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

# Step 4: Copy frontend build to backend
Write-Host "Copying frontend build to backend..." -ForegroundColor Cyan
Set-Location -Path ..
if (!(Test-Path -Path "public")) {
    New-Item -ItemType Directory -Path "public"
}
Copy-Item -Path "client/build/*" -Destination "public" -Recurse -Force

# Step 5: Create production env file if it doesn't exist
Write-Host "Setting up environment variables..." -ForegroundColor Cyan
if (!(Test-Path -Path ".env")) {
    Copy-Item -Path ".env.example" -Destination ".env"
}

# Step 6: Initialize database
Write-Host "Initializing database..." -ForegroundColor Cyan
node src/scripts/initDb.js

# Step 7: Start the application
Write-Host "Starting the application..." -ForegroundColor Green
npm start