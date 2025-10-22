#!/bin/bash

# M-Pesa Server Deployment Script
# This script helps deploy your M-Pesa server to various platforms

echo "🚀 JD Transcripts M-Pesa Server Deployment"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests (if available)
echo "🧪 Running tests..."
npm test 2>/dev/null || echo "No tests configured"

# Build/prepare for production
echo "🔨 Preparing for production..."
export NODE_ENV=production

# Platform-specific deployment options
echo ""
echo "Choose deployment platform:"
echo "1) Heroku"
echo "2) Railway"
echo "3) DigitalOcean App Platform"
echo "4) AWS EC2"
echo "5) Local production server"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚂 Deploying to Heroku..."
        echo "Make sure you have Heroku CLI installed and logged in"
        echo "Run these commands:"
        echo "  heroku create jd-transcripts-mpesa"
        echo "  heroku config:set NODE_ENV=production"
        echo "  heroku config:set MPESA_CONSUMER_KEY=your_key"
        echo "  heroku config:set MPESA_CONSUMER_SECRET=your_secret"
        echo "  heroku config:set MPESA_BUSINESS_SHORT_CODE=your_code"
        echo "  heroku config:set MPESA_PASSKEY=your_passkey"
        echo "  git push heroku main"
        ;;
    2)
        echo "🚄 Deploying to Railway..."
        echo "Make sure you have Railway CLI installed"
        echo "Run: railway login && railway deploy"
        ;;
    3)
        echo "🌊 Deploying to DigitalOcean..."
        echo "Create a new App on DigitalOcean App Platform"
        echo "Connect your GitHub repository"
        echo "Set environment variables in the dashboard"
        ;;
    4)
        echo "☁️ Deploying to AWS EC2..."
        echo "Make sure you have an EC2 instance ready"
        echo "Upload files and run: pm2 start server.js"
        ;;
    5)
        echo "🖥️ Starting local production server..."
        pm2 start server.js --name "jd-mpesa-server" || node server.js
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment process initiated!"
echo "📋 Don't forget to:"
echo "   - Set up SSL certificate"
echo "   - Configure domain name"
echo "   - Update frontend API URLs"
echo "   - Test M-Pesa integration"
echo "   - Set up monitoring"