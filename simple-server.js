// Simple Node.js server to serve WordPress files
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const WORDPRESS_PATH = 'C:\\xampp\\htdocs\\jd-transcripts';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.php': 'text/html'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root
  if (pathname === '/') {
    pathname = '/index.php';
  }
  
  // Handle WordPress API routes
  if (pathname.startsWith('/wp-json/jd-api/v1/')) {
    // Mock API responses for testing
    const endpoint = pathname.replace('/wp-json/jd-api/v1/', '');
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    if (req.method === 'OPTIONS') {
      res.end();
      return;
    }
    
    // Mock responses
    if (endpoint === 'transcribers') {
      res.end(JSON.stringify({
        success: true,
        data: [
          {
            transcriberID: 'TR001',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            specialization: 'Legal Transcription',
            hourlyRate: 25,
            availability: 'available'
          },
          {
            transcriberID: 'TR002',
            name: 'Michael Chen',
            email: 'michael@example.com',
            specialization: 'Medical Transcription',
            hourlyRate: 30,
            availability: 'available'
          }
        ]
      }));
      return;
    }
    
    if (endpoint === 'careers/positions') {
      res.end(JSON.stringify({
        success: true,
        data: [
          {
            id: 1,
            title: 'Legal Transcriptionist',
            description: 'We are seeking an experienced legal transcriptionist.',
            type: 'full-time',
            location: 'remote'
          }
        ]
      }));
      return;
    }
    
    if (endpoint === 'orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const orderData = JSON.parse(body);
        res.end(JSON.stringify({
          success: true,
          message: 'Order created successfully',
          data: {
            orderId: 'JD' + Date.now(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        }));
      });
      return;
    }
    
    // Default API response
    res.end(JSON.stringify({
      success: true,
      message: 'API endpoint working',
      endpoint: endpoint
    }));
    return;
  }
  
  // Serve static files
  const filePath = path.join(WORDPRESS_PATH, pathname);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>WordPress Setup Required</title></head>
          <body>
            <h1>WordPress Backend Ready!</h1>
            <p>Your WordPress backend is ready to be configured.</p>
            <h2>API Endpoints Available:</h2>
            <ul>
              <li><a href="/wp-json/jd-api/v1/transcribers">GET /wp-json/jd-api/v1/transcribers</a></li>
              <li><a href="/wp-json/jd-api/v1/careers/positions">GET /wp-json/jd-api/v1/careers/positions</a></li>
              <li>POST /wp-json/jd-api/v1/orders</li>
            </ul>
            <h2>Next Steps:</h2>
            <ol>
              <li>Install XAMPP properly from <a href="https://www.apachefriends.org/download.html">here</a></li>
              <li>Or use this mock server for frontend testing</li>
              <li>Update your frontend to use: <code>http://localhost:3000/wp-json/jd-api/v1</code></li>
            </ol>
          </body>
        </html>
      `);
      return;
    }
    
    // Get file extension
    const ext = path.parse(filePath).ext;
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('JD Transcripts Mock WordPress Server');
  console.log('========================================');
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('API Endpoints:');
  console.log(`- GET  http://localhost:${PORT}/wp-json/jd-api/v1/transcribers`);
  console.log(`- GET  http://localhost:${PORT}/wp-json/jd-api/v1/careers/positions`);
  console.log(`- POST http://localhost:${PORT}/wp-json/jd-api/v1/orders`);
  console.log('');
  console.log(`Update your frontend API URL to: http://localhost:${PORT}/wp-json/jd-api/v1`);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});