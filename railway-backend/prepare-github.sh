#!/bin/bash

# Create a new GitHub repository for JD Reporting Company API

echo "Preparing repository for GitHub..."

# Initialize git if not already initialized
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized."
else
  echo "Git repository already exists."
fi

# Create .gitignore file
cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build files
dist/
build/

# Logs
logs/
*.log

# Coverage directory
coverage/

# Temporary files
tmp/
temp/
uploads/*
!uploads/.gitkeep

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.sublime-project
*.sublime-workspace
EOL

echo ".gitignore file created."

# Create uploads directory with .gitkeep
mkdir -p uploads
touch uploads/.gitkeep
echo "Uploads directory created with .gitkeep file."

# Create a sample .env.example file
cat > .env.example << EOL
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/jd-transcripts

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
ADMIN_EMAIL=admin@example.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=100MB
UPLOAD_PATH=./uploads

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Sentry
SENTRY_DSN=your_sentry_dsn
EOL

echo ".env.example file created."

# Add all files to git
git add .

# Commit changes
git commit -m "Initial commit for JD Reporting Company API"

echo "Repository prepared for GitHub."
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands:"
echo "   git remote add origin https://github.com/your-username/jd-reporting-api.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo "3. Set up the following secrets in your GitHub repository:"
echo "   - RAILWAY_TOKEN"
echo "   - SLACK_WEBHOOK_URL (optional)"
echo "4. Deploy to Railway using GitHub Actions"