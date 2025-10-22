const WebSocket = require('ws');
const { query } = require('./config/database');
const jwt = require('jsonwebtoken');

function setupWebSocketServer(server) {
    // Attach WebSocket server to existing HTTP server
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws, req) => {
        console.log('New client connected');

        // Authenticate WebSocket connection
        const token = req.url.split('token=')[1];
        if (!token) {
            ws.send(JSON.stringify({ type: 'error', message: 'Authentication required' }));
            ws.close();
            return;
        }

        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            ws.user = user;
        } catch (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            ws.close();
            return;
        }

        try {
            const orders = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
            ws.send(JSON.stringify({ type: 'orders', data: orders }));
        } catch (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Failed to fetch orders' }));
        }

        ws.on('message', async message => {
            try {
                const orders = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
                ws.send(JSON.stringify({ type: 'orders', data: orders }));
            } catch (err) {
                ws.send(JSON.stringify({ type: 'error', message: 'Failed to fetch orders' }));
            }
        });
    });

    console.log('WebSocket server is ready');
}

module.exports = { setupWebSocketServer };