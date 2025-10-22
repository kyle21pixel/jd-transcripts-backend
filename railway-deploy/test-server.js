// Simple test script to verify server functionality
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

async function testServer() {
    console.log('🧪 Testing JD Transcripts Server...\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health check...');
        const healthResponse = await axios.get(`${SERVER_URL}/`);
        console.log('✅ Health check:', healthResponse.data.message);
        
        // Test 2: Orders API
        console.log('\n2. Testing orders API...');
        const ordersResponse = await axios.get(`${SERVER_URL}/api/orders`);
        console.log('✅ Orders API:', ordersResponse.data);
        
        // Test 3: Create test order
        console.log('\n3. Testing order creation...');
        const testOrder = {
            name: 'Test Customer',
            email: 'test@example.com',
            service: 'legal',
            turnaround: '24h',
            duration: 30,
            totalPrice: '56.25',
            paymentMethod: 'mpesa',
            mpesaPhone: '254712345678'
        };
        
        const createResponse = await axios.post(`${SERVER_URL}/api/orders`, testOrder);
        console.log('✅ Order created:', createResponse.data.order.id);
        
        // Test 4: Get orders again
        console.log('\n4. Testing orders retrieval...');
        const ordersResponse2 = await axios.get(`${SERVER_URL}/api/orders`);
        console.log('✅ Orders count:', ordersResponse2.data.count);
        
        console.log('\n🎉 All tests passed! Server is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Run tests
testServer();