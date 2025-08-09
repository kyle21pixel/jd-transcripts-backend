const express = require('express');
const router = express.Router();
const MpesaService = require('../services/mpesa');
const { sendOrderNotification } = require('../services/email');

const mpesa = new MpesaService();

// Store pending transactions (in production, use a database)
const pendingTransactions = new Map();

// Initiate M-Pesa payment
router.post('/pay', async (req, res) => {
  try {
    const {
      phoneNumber,
      amount,
      orderData
    } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount || !orderData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, amount, orderData'
      });
    }

    // Validate phone number
    const validatedPhone = mpesa.validatePhoneNumber(phoneNumber);
    if (!validatedPhone) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Use 254XXXXXXXXX or 07XXXXXXXX'
      });
    }

    // Convert USD to KES
    const amountKES = mpesa.formatAmount(amount);
    
    // Generate unique reference
    const accountReference = `JD-${Date.now()}`;
    const transactionDesc = `${orderData.service} - ${orderData.duration}min`;

    console.log('Initiating M-Pesa payment:', {
      phone: validatedPhone,
      amount: amountKES,
      reference: accountReference,
      description: transactionDesc
    });

    // Store order data for callback processing
    const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    pendingTransactions.set(transactionId, {
      orderData,
      phoneNumber: validatedPhone,
      amount: amountKES,
      usdAmount: amount,
      accountReference,
      transactionDesc,
      timestamp: new Date().toISOString()
    });

    // Initiate STK push
    const stkResult = await mpesa.stkPush(
      validatedPhone,
      amountKES,
      accountReference,
      transactionDesc,
      transactionId
    );

    if (stkResult.success) {
      // Store checkout request ID for status tracking
      pendingTransactions.set(stkResult.checkoutRequestId, {
        ...pendingTransactions.get(transactionId),
        transactionId,
        checkoutRequestId: stkResult.checkoutRequestId,
        merchantRequestId: stkResult.merchantRequestId
      });

      // Send order notification immediately
      try {
        await sendOrderNotification({
          ...orderData,
          paymentStatus: 'pending',
          mpesaReference: accountReference,
          checkoutRequestId: stkResult.checkoutRequestId
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the payment process if email fails
      }

      res.json({
        success: true,
        message: 'Payment request sent to your phone',
        checkoutRequestId: stkResult.checkoutRequestId,
        merchantRequestId: stkResult.merchantRequestId,
        customerMessage: stkResult.customerMessage,
        accountReference,
        amount: amountKES,
        phoneNumber: validatedPhone
      });
    } else {
      res.status(400).json({
        success: false,
        error: stkResult.error,
        errorCode: stkResult.errorCode
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate payment',
      details: error.message
    });
  }
});

// Check payment status
router.post('/status', async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({
        success: false,
        error: 'checkoutRequestId is required'
      });
    }

    const statusResult = await mpesa.queryStkStatus(checkoutRequestId);
    
    // Get transaction data
    const transactionData = pendingTransactions.get(checkoutRequestId);

    res.json({
      success: statusResult.success,
      resultCode: statusResult.resultCode,
      resultDesc: statusResult.resultDesc,
      checkoutRequestId: statusResult.checkoutRequestId,
      transactionData: transactionData ? {
        accountReference: transactionData.accountReference,
        amount: transactionData.amount,
        phoneNumber: transactionData.phoneNumber
      } : null
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check payment status',
      details: error.message
    });
  }
});

// M-Pesa callback endpoint
router.post('/callback', (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const callbackResult = mpesa.processCallback(req.body);
    
    if (callbackResult.checkoutRequestId) {
      const transactionData = pendingTransactions.get(callbackResult.checkoutRequestId);
      
      if (transactionData) {
        // Update transaction status
        transactionData.paymentResult = callbackResult;
        transactionData.status = callbackResult.success ? 'completed' : 'failed';
        transactionData.completedAt = new Date().toISOString();

        // Send confirmation email
        if (callbackResult.success) {
          sendOrderNotification({
            ...transactionData.orderData,
            paymentStatus: 'completed',
            mpesaReceiptNumber: callbackResult.mpesaReceiptNumber,
            mpesaReference: transactionData.accountReference,
            transactionDate: callbackResult.transactionDate,
            amountPaid: callbackResult.amount
          }).catch(error => {
            console.error('Confirmation email failed:', error);
          });
        }

        console.log('Transaction updated:', {
          checkoutRequestId: callbackResult.checkoutRequestId,
          status: transactionData.status,
          success: callbackResult.success
        });
      }
    }

    // Always respond with success to M-Pesa
    res.json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
  } catch (error) {
    console.error('Callback processing error:', error);
    
    // Still respond with success to avoid M-Pesa retries
    res.json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
  }
});

// Timeout callback endpoint
router.post('/timeout', (req, res) => {
  console.log('M-Pesa Timeout received:', JSON.stringify(req.body, null, 2));
  
  // Handle timeout - mark transaction as timed out
  const { CheckoutRequestID } = req.body;
  if (CheckoutRequestID) {
    const transactionData = pendingTransactions.get(CheckoutRequestID);
    if (transactionData) {
      transactionData.status = 'timeout';
      transactionData.completedAt = new Date().toISOString();
    }
  }

  res.json({
    ResultCode: 0,
    ResultDesc: 'Success'
  });
});

// Get transaction details (for admin)
router.get('/transaction/:checkoutRequestId', (req, res) => {
  const { checkoutRequestId } = req.params;
  const transactionData = pendingTransactions.get(checkoutRequestId);
  
  if (transactionData) {
    res.json({
      success: true,
      transaction: transactionData
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
});

// List all transactions (for admin)
router.get('/transactions', (req, res) => {
  const transactions = Array.from(pendingTransactions.entries()).map(([key, value]) => ({
    id: key,
    ...value
  }));
  
  res.json({
    success: true,
    transactions: transactions.slice(-50) // Return last 50 transactions
  });
});

module.exports = router;