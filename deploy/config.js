// Configuration file for server URLs
const CONFIG = {
    // Temporary live server URL (will be replaced with your Railway URL)
    SERVER_URL: 'https://jd-transcripts-server.vercel.app',
    
    // Fallback to demo mode if server is not available
    USE_DEMO_MODE: false,
    
    // API endpoints
    ENDPOINTS: {
        ORDERS: '/api/orders',
        MPESA_PAY: '/api/mpesa/pay',
        MPESA_STATUS: '/api/mpesa/status',
        HEALTH: '/'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}