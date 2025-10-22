# Start the live server for local development

Write-Host "🚀 Starting development server..." -ForegroundColor Green

# Install live-server if not already installed
if (!(Get-Command live-server -ErrorAction SilentlyContinue)) {
    Write-Host "Installing live-server..." -ForegroundColor Cyan
    npm install -g live-server
}

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoProfile -Command npm run dev"

# Start frontend live server
Write-Host "Starting frontend live server..." -ForegroundColor Cyan
live-server --port=5500 --open=index.html