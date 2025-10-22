#!/usr/bin/env node

/**
 * Security Check Script for JD Reporting Application
 * Run with: node check-security.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 JD Reporting Security Check\n');

// Check for .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  WARNING: .env file exists and may contain sensitive data');
    console.log('   Make sure .env is in .gitignore and not committed to version control\n');
} else {
    console.log('✅ .env file not found (good for security)\n');
}

// Check for hardcoded passwords in code
const checkForHardcodedPasswords = () => {
    const files = [
        'app-real.js',
        'routes/auth.js',
        'controllers/emailController.js',
        'package.json'
    ];

    let foundIssues = false;

    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            const passwordPatterns = [
                /password.*123/i,
                /admin.*123/i,
                /your-app-password/i,
                /your-gmail/i
            ];

            passwordPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    console.log(`❌ SECURITY ISSUE: Potential hardcoded password found in ${file}`);
                    foundIssues = true;
                }
            });
        }
    });

    if (!foundIssues) {
        console.log('✅ No obvious hardcoded passwords found\n');
    } else {
        console.log('');
    }
};

checkForHardcodedPasswords();

// Check file permissions (basic check)
console.log('🔧 Recommendations:');
console.log('1. Ensure .env files are not committed to version control');
console.log('2. Use strong, unique passwords for all services');
console.log('3. Enable 2FA on email accounts used for notifications');
console.log('4. Regularly rotate API keys and database credentials');
console.log('5. Use HTTPS in production');
console.log('6. Implement rate limiting for authentication endpoints');
console.log('7. Set up monitoring and alerting for suspicious activity');
console.log('\n✅ Security check complete\n');