# Start JD Reporting System Setup
Write-Host "Starting JD Reporting System Setup..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js version $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Setup environment variables if .env doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=jd_reporting
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath .env -Encoding UTF8
}

# Initialize database
Write-Host "Initializing database..." -ForegroundColor Yellow
node database/init.js

# Start the server
Write-Host "Starting the server..." -ForegroundColor Green
npm start