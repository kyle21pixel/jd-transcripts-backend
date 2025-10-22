const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Handle SPA routing - redirect all non-file requests to index.html
app.get('*', (req, res) => {
  // Check if the request is for a file (has extension)
  if (path.extname(req.path)) {
    res.status(404).send('File not found');
    return;
  }

  // For HTML pages, serve the specific page if it exists, otherwise serve index.html
  const requestedPath = path.join(__dirname, req.path + '.html');
  const fs = require('fs');

  if (fs.existsSync(requestedPath)) {
    res.sendFile(requestedPath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
  console.log('Available pages:');
  console.log(`- http://localhost:${PORT}/ (Home)`);
  console.log(`- http://localhost:${PORT}/track-order`);
  console.log(`- http://localhost:${PORT}/careers`);
  console.log(`- http://localhost:${PORT}/about`);
  console.log(`- http://localhost:${PORT}/contact`);
});