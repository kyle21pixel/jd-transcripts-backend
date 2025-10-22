const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from current directory
app.use(express.static('.'));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
    // If the request is for a specific HTML file, serve it
    if (req.path.endsWith('.html')) {
        res.sendFile(path.join(__dirname, req.path));
    } else {
        // Otherwise serve index.html
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log('🌐 JD Transcripts Frontend Server Started!');
    console.log('=========================================');
    console.log(`📍 Frontend URL: http://localhost:${PORT}`);
    console.log(`📝 Order Form: http://localhost:${PORT}/order.html`);
    console.log(`🔧 Admin Dashboard: http://localhost:${PORT}/admin-dashboard-new.html`);
    console.log('=========================================');
    console.log('🎯 Test the complete system:');
    console.log('1. Go to order form and submit an order');
    console.log('2. Go to admin dashboard and login (admin/admin123)');
    console.log('3. View the submitted order in the dashboard');
    console.log('=========================================');
});