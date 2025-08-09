// Mock server functionality for immediate testing
// This runs in the browser and simulates server responses

class MockServer {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('jd-mock-orders') || '[]');
        this.isEnabled = true;
    }

    // Simulate M-Pesa payment
    async simulateMpesaPayment(paymentData) {
        console.log('🔄 Mock M-Pesa Payment:', paymentData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock response
        const mockResponse = {
            success: true,
            checkoutRequestId: `CHK_${Date.now()}`,
            merchantRequestId: `MER_${Date.now()}`,
            customerMessage: 'Check your phone and enter M-Pesa PIN',
            accountReference: `JD-${Date.now()}`,
            amount: Math.round(parseFloat(paymentData.amount) * 130),
            phoneNumber: paymentData.phoneNumber
        };

        // Store the payment request
        this.storePendingPayment(mockResponse);
        
        return mockResponse;
    }

    // Store pending payment
    storePendingPayment(paymentData) {
        const pendingPayments = JSON.parse(localStorage.getItem('jd-pending-payments') || '{}');
        pendingPayments[paymentData.checkoutRequestId] = {
            ...paymentData,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('jd-pending-payments', JSON.stringify(pendingPayments));
    }

    // Simulate payment status check
    async checkPaymentStatus(checkoutRequestId) {
        console.log('🔍 Checking payment status:', checkoutRequestId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const pendingPayments = JSON.parse(localStorage.getItem('jd-pending-payments') || '{}');
        const payment = pendingPayments[checkoutRequestId];
        
        if (!payment) {
            return {
                success: false,
                error: 'Payment not found'
            };
        }

        // Simulate 90% success rate after 10 seconds
        const timeSincePayment = Date.now() - new Date(payment.timestamp).getTime();
        const shouldSucceed = timeSincePayment > 10000 && Math.random() > 0.1;
        
        if (shouldSucceed) {
            // Mark as completed
            payment.status = 'completed';
            payment.resultCode = 0;
            payment.mpesaReceiptNumber = `MPE${Date.now()}`;
            pendingPayments[checkoutRequestId] = payment;
            localStorage.setItem('jd-pending-payments', JSON.stringify(pendingPayments));
            
            return {
                success: true,
                resultCode: 0,
                resultDesc: 'The service request is processed successfully.',
                checkoutRequestId: checkoutRequestId
            };
        } else {
            return {
                success: true,
                resultCode: 1032,
                resultDesc: 'Request cancelled by user',
                checkoutRequestId: checkoutRequestId
            };
        }
    }

    // Store order
    async storeOrder(orderData) {
        console.log('💾 Storing order:', orderData);
        
        const order = {
            id: `JD-${Date.now()}`,
            ...orderData,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        this.orders.push(order);
        localStorage.setItem('jd-mock-orders', JSON.stringify(this.orders));
        
        // Send email notification
        this.sendEmailNotification(order);
        
        return {
            success: true,
            order: order,
            message: 'Order created successfully'
        };
    }

    // Get all orders
    async getOrders() {
        console.log('📋 Fetching orders');
        
        return {
            success: true,
            orders: this.orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
            count: this.orders.length
        };
    }

    // Send email notification (mock)
    async sendEmailNotification(orderData) {
        console.log('📧 Sending email notification:', orderData);
        
        // Use Formspree for real email
        try {
            const response = await fetch('https://formspree.io/f/xdkogqko', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `🔔 NEW ORDER: ${orderData.service} - ${orderData.name} - $${orderData.totalPrice}`,
                    'Customer Name': orderData.name,
                    'Email': orderData.email,
                    'Service Type': orderData.service,
                    'Duration': `${orderData.duration} minutes`,
                    'Turnaround Time': orderData.turnaround,
                    'Total Price': `$${orderData.totalPrice}`,
                    'Payment Method': orderData.paymentMethod === 'mpesa' ? `📱 M-Pesa (${orderData.mpesaPhone})` : '📄 Invoice Later',
                    'Additional Notes': orderData.notes || 'None',
                    'Order Date': orderData.timestamp || new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log('✅ Email sent successfully');
            } else {
                console.log('❌ Email sending failed');
            }
        } catch (error) {
            console.error('Email error:', error);
        }
    }
}

// Create global mock server instance
window.mockServer = new MockServer();

// Override fetch for API calls
const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    // Check if this is an API call to our server
    if (url.includes('/api/')) {
        console.log('🔄 Intercepting API call:', url, options);
        
        // Parse the URL
        const urlObj = new URL(url, window.location.origin);
        const path = urlObj.pathname;
        
        try {
            // Route to appropriate mock function
            if (path === '/api/mpesa/pay' && options?.method === 'POST') {
                const paymentData = JSON.parse(options.body);
                return {
                    ok: true,
                    json: async () => await window.mockServer.simulateMpesaPayment(paymentData)
                };
            }
            
            if (path === '/api/mpesa/status' && options?.method === 'POST') {
                const statusData = JSON.parse(options.body);
                return {
                    ok: true,
                    json: async () => await window.mockServer.checkPaymentStatus(statusData.checkoutRequestId)
                };
            }
            
            if (path === '/api/orders' && options?.method === 'POST') {
                const orderData = JSON.parse(options.body);
                return {
                    ok: true,
                    json: async () => await window.mockServer.storeOrder(orderData)
                };
            }
            
            if (path === '/api/orders' && (!options?.method || options.method === 'GET')) {
                return {
                    ok: true,
                    json: async () => await window.mockServer.getOrders()
                };
            }
            
            // Health check
            if (path === '/') {
                return {
                    ok: true,
                    json: async () => ({
                        success: true,
                        message: 'Mock server is running!',
                        timestamp: new Date().toISOString(),
                        version: '1.0.0-mock'
                    })
                };
            }
            
        } catch (error) {
            console.error('Mock server error:', error);
        }
    }
    
    // For non-API calls, use original fetch
    return originalFetch.apply(this, arguments);
};

console.log('🎭 Mock server initialized and ready!');