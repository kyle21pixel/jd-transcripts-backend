// M-Pesa Integration API (Backend Simulation)
// In production, this would be on your Node.js server

class MpesaAPI {
    constructor() {
        // These would be your actual M-Pesa API credentials
        this.consumerKey = 'YOUR_CONSUMER_KEY';
        this.consumerSecret = 'YOUR_CONSUMER_SECRET';
        this.businessShortCode = 'YOUR_BUSINESS_SHORTCODE';
        this.passkey = 'YOUR_PASSKEY';
        this.environment = 'sandbox'; // or 'production'
        
        this.baseURL = this.environment === 'sandbox' 
            ? 'https://sandbox.safaricom.co.ke' 
            : 'https://api.safaricom.co.ke';
    }

    // Generate OAuth token
    async getAccessToken() {
        const auth = btoa(`${this.consumerKey}:${this.consumerSecret}`);
        
        try {
            const response = await fetch(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });
            
            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    }

    // Initiate STK Push
    async stkPush(phoneNumber, amount, accountReference, transactionDesc) {
        const accessToken = await this.getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = btoa(`${this.businessShortCode}${this.passkey}${timestamp}`);

        const requestBody = {
            BusinessShortCode: this.businessShortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: this.businessShortCode,
            PhoneNumber: phoneNumber,
            CallBackURL: 'https://your-domain.com/mpesa/callback',
            AccountReference: accountReference,
            TransactionDesc: transactionDesc
        };

        try {
            const response = await fetch(`${this.baseURL}/mpesa/stkpush/v1/processrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error initiating STK push:', error);
            throw error;
        }
    }

    // Query STK Push status
    async queryStkStatus(checkoutRequestID) {
        const accessToken = await this.getAccessToken();
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
        const password = btoa(`${this.businessShortCode}${this.passkey}${timestamp}`);

        const requestBody = {
            BusinessShortCode: this.businessShortCode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestID
        };

        try {
            const response = await fetch(`${this.baseURL}/mpesa/stkpushquery/v1/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error querying STK status:', error);
            throw error;
        }
    }

    // Handle M-Pesa callback (this would be on your server)
    handleCallback(callbackData) {
        const { Body } = callbackData;
        const { stkCallback } = Body;
        
        if (stkCallback.ResultCode === 0) {
            // Payment successful
            const { CallbackMetadata } = stkCallback;
            const items = CallbackMetadata.Item;
            
            const paymentData = {};
            items.forEach(item => {
                switch (item.Name) {
                    case 'Amount':
                        paymentData.amount = item.Value;
                        break;
                    case 'MpesaReceiptNumber':
                        paymentData.receiptNumber = item.Value;
                        break;
                    case 'TransactionDate':
                        paymentData.transactionDate = item.Value;
                        break;
                    case 'PhoneNumber':
                        paymentData.phoneNumber = item.Value;
                        break;
                }
            });
            
            // Update order status in database
            this.updateOrderStatus(stkCallback.CheckoutRequestID, 'paid', paymentData);
            
            // Send confirmation email to customer
            this.sendPaymentConfirmation(paymentData);
            
        } else {
            // Payment failed
            this.updateOrderStatus(stkCallback.CheckoutRequestID, 'failed', {
                errorCode: stkCallback.ResultCode,
                errorMessage: stkCallback.ResultDesc
            });
        }
    }

    updateOrderStatus(checkoutRequestID, status, data) {
        // Update order status in your database
        console.log(`Order ${checkoutRequestID} status updated to: ${status}`, data);
    }

    sendPaymentConfirmation(paymentData) {
        // Send confirmation email/SMS to customer
        console.log('Payment confirmation sent:', paymentData);
    }
}

// Usage example:
/*
const mpesa = new MpesaAPI();

// Initiate payment
mpesa.stkPush('254712345678', 1000, 'JD-12345', 'Legal Transcription Service')
    .then(response => {
        console.log('STK Push initiated:', response);
        
        // Poll for payment status
        if (response.CheckoutRequestID) {
            setTimeout(() => {
                mpesa.queryStkStatus(response.CheckoutRequestID)
                    .then(status => {
                        console.log('Payment status:', status);
                    });
            }, 30000); // Check after 30 seconds
        }
    })
    .catch(error => {
        console.error('Payment initiation failed:', error);
    });
*/

export default MpesaAPI;