#!/bin/bash

# JD Reporting Company API Deployment Script
# This script helps deploy your backend API to Railway

echo "🚀 JD Reporting Company API Deployment"
echo "==========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test || echo "Tests failed, but continuing deployment"

# Build/prepare for production
echo "🔨 Preparing for production..."
export NODE_ENV=production

# Deploy to Railway
echo "🚄 Deploying to Railway..."
echo "Make sure you have Railway CLI installed and logged in"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway if not already logged in
railway whoami &> /dev/null || railway login

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment process completed!"
echo "📋 Don't forget to:"
echo "   - Verify the deployment in Railway dashboard"
echo "   - Update frontend API URLs if needed"
echo "   - Test API endpoints"
echo "   - Set up monitoring"
echo ""
echo "Your API should be available at: https://jd-transcripts-server-production.railway.app"