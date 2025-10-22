require('dotenv').config();
const { sendOrderNotification } = require('./services/email');

// Test order data
const testOrderData = {
  name: 'Test Client',
  email: 'client@example.com', // Replace with the actual client email you want to test
  service: 'legal',
  duration: 60,
  turnaround: '24h',
  totalPrice: 150,
  paymentMethod: 'mpesa',
  mpesaPhone: '1234567890',
  fileName: 'test-audio.mp3',
  fileSize: '10MB',
  notes: 'This is a test order to verify email functionality',
  timestamp: new Date().toISOString(),
  paymentStatus: 'pending'
};

// Run the test
async function testEmail() {
  try {
    console.log('Sending test email...');
    const result = await sendOrderNotification(testOrderData);
    console.log('Email sent successfully:', result.messageId);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();