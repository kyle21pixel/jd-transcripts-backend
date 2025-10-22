#!/bin/bash

# Deploy JD Reporting Company frontend to Netlify

echo "Deploying frontend to Netlify..."

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
  echo "Installing Netlify CLI..."
  npm install -g netlify-cli
fi

# Deploy to Netlify
netlify deploy --prod

echo "Frontend deployed to Netlify."
echo "Visit your site at: https://jd-reporting-company.netlify.app"