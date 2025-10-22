// Simple API server for JD Transcripts
const http = require('http');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Parse URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root request
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>JD Transcripts API Server</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            h1 { color: #2c3e50; }
            .endpoint { background: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 4px solid #007cba; }
            .status { color: #27ae60; font-weight: bold; }
            a { color: #007cba; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>🚀 JD Transcripts API Server</h1>
          <p class="status">✅ Server is running successfully!</p>
          
          <h2>📡 Available API Endpoints</h2>
          
          <div class="endpoint">
            <strong>GET</strong> <a href="/wp-json/jd-api/v1/transcribers">/wp-json/jd-api/v1/transcribers</a>
            <br><small>Returns list of available transcribers</small>
          </div>
          
          <div class="endpoint">
            <strong>GET</strong> <a href="/wp-json/jd-api/v1/careers/positions">/wp-json/jd-api/v1/careers/positions</a>
            <br><small>Returns available job positions</small>
          </div>
          
          <div class="endpoint">
            <strong>POST</strong> /wp-json/jd-api/v1/orders
            <br><small>Create a new transcription order</small>
          </div>
          
          <div class="endpoint">
            <strong>GET</strong> <a href="/wp-json/jd-api/v1/admin/dashboard">/wp-json/jd-api/v1/admin/dashboard</a>
            <br><small>Get dashboard statistics</small>
          </div>
          
          <h2>🔧 Frontend Integration</h2>
          <p>Update your frontend API base URL to:</p>
          <code style="background: #f1f1f1; padding: 5px;">http://localhost:3001/wp-json/jd-api/v1</code>
          
          <h2>📊 Server Status</h2>
          <p>Port: ${PORT}</p>
          <p>CORS: Enabled</p>
          <p>Status: Running</p>
        </body>
      </html>
    `);
    return;
  }
  
  // Handle API routes
  if (pathname.startsWith('/wp-json/jd-api/v1/')) {
    const endpoint = pathname.replace('/wp-json/jd-api/v1/', '');
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    // Handle different endpoints
    if (endpoint === 'transcribers') {
      res.end(JSON.stringify({
        success: true,
        data: [
          {
            transcriberID: 'TR001',
            name: 'Sarah Johnson',
            email: 'sarah@jdtranscripts.com',
            specialization: 'Legal Transcription',
            hourlyRate: 25,
            availability: 'available',
            experience: '5 years',
            languages: ['English']
          },
          {
            transcriberID: 'TR002',
            name: 'Michael Chen',
            email: 'michael@jdtranscripts.com',
            specialization: 'Medical Transcription',
            hourlyRate: 30,
            availability: 'available',
            experience: '7 years',
            languages: ['English', 'Spanish']
          },
          {
            transcriberID: 'TR003',
            name: 'Emily Davis',
            email: 'emily@jdtranscripts.com',
            specialization: 'Academic Transcription',
            hourlyRate: 20,
            availability: 'busy',
            experience: '3 years',
            languages: ['English']
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
            description: 'We are seeking an experienced legal transcriptionist to join our team.',
            requirements: ['2+ years experience', 'Legal background preferred', 'Excellent typing skills'],
            type: 'full-time',
            location: 'remote',
            salary: '$40,000 - $55,000',
            posted: '2024-12-01'
          },
          {
            id: 2,
            title: 'Medical Transcriptionist',
            description: 'Medical transcriptionist needed for healthcare documentation.',
            requirements: ['Medical terminology knowledge', '3+ years experience', 'HIPAA compliance'],
            type: 'part-time',
            location: 'remote',
            salary: '$35,000 - $45,000',
            posted: '2024-11-28'
          }
        ]
      }));
      return;
    }
    
    if (endpoint === 'admin/dashboard') {
      res.end(JSON.stringify({
        success: true,
        data: {
          totalOrders: 45,
          pendingOrders: 8,
          processingOrders: 12,
          completedOrders: 25,
          totalRevenue: 12450,
          monthlyRevenue: 3200,
          activeTranscribers: 3,
          avgTurnaround: '18 hours'
        }
      }));
      return;
    }
    
    if (endpoint === 'orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const orderData = JSON.parse(body);
          res.end(JSON.stringify({
            success: true,
            message: 'Order created successfully',
            data: {
              orderId: 'JD' + Date.now(),
              ...orderData,
              status: 'pending',
              createdAt: new Date().toISOString(),
              estimatedCost: '$150.00'
            }
          }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid JSON data'
          }));
        }
      });
      return;
    }
    
    // Default API response
    res.end(JSON.stringify({
      success: true,
      message: 'JD Transcripts API is working',
      endpoint: endpoint,
      availableEndpoints: [
        'transcribers',
        'careers/positions',
        'orders (POST)',
        'admin/dashboard'
      ]
    }));
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      '/wp-json/jd-api/v1/transcribers',
      '/wp-json/jd-api/v1/careers/positions',
      '/wp-json/jd-api/v1/orders',
      '/wp-json/jd-api/v1/admin/dashboard'
    ]
  }));
});

server.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 JD Transcripts API Server Started');
  console.log('========================================');
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('📡 API Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/wp-json/jd-api/v1/transcribers`);
  console.log(`   GET  http://localhost:${PORT}/wp-json/jd-api/v1/careers/positions`);
  console.log(`   POST http://localhost:${PORT}/wp-json/jd-api/v1/orders`);
  console.log(`   GET  http://localhost:${PORT}/wp-json/jd-api/v1/admin/dashboard`);
  console.log('');
  console.log('🔧 Frontend Integration:');
  console.log(`   Update API base URL to: http://localhost:${PORT}/wp-json/jd-api/v1`);
  console.log('');
  console.log('🌐 Open in browser: http://localhost:' + PORT);
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped successfully.');
    process.exit(0);
  });
});