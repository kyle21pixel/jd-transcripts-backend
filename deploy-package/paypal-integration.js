/**
 * PayPal Integration Module
 * 
 * This module handles the PayPal integration for the order form.
 */

// Render PayPal buttons
function renderPayPalButtons() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Get amount from summary
            const amount = parseFloat(document.getElementById('summaryTotal').textContent.replace('$', ''));
            
            // Create PayPal order
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toFixed(2)
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Show loading
            document.getElementById('loading').style.display = 'block';
            
            // Capture the funds from the transaction
            return actions.order.capture().then(function(details) {
                try {
                    // Get order data
                    const orderData = {
                        clientName: document.getElementById('clientName').value,
                        clientEmail: document.getElementById('clientEmail').value,
                        clientPhone: document.getElementById('clientPhone').value,
                        serviceType: document.getElementById('serviceType').value,
                        turnaround: document.getElementById('turnaround').value,
                        instructions: document.getElementById('instructions').value,
                        amount: parseFloat(document.getElementById('summaryTotal').textContent.replace('$', '')),
                        files: selectedFile ? [selectedFile.name] : []
                    };
                    
                    // Create order using real-time connection
                    const orderId = window.realTimeConnection.createOrder(orderData);
                    
                    // Process payment
                    const paymentData = {
                        orderId: orderId,
                        clientName: orderData.clientName,
                        method: 'paypal',
                        amount: orderData.amount,
                        transactionId: details.id
                    };
                    
                    const paymentResult = window.realTimeConnection.processPayment(paymentData);
                    
                    // Hide loading
                    document.getElementById('loading').style.display = 'none';
                    
                    if (paymentResult.success) {
                        // Show success and go to confirmation step
                        document.getElementById('orderId').textContent = orderId;
                        goToStep(4);
                    } else {
                        // Show error
                        document.getElementById('errorText').textContent = paymentResult.message || 'Payment processing failed. Please try again.';
                        document.getElementById('errorMessage').style.display = 'block';
                    }
                } catch (error) {
                    console.error('Order submission error:', error);
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('errorText').textContent = 'Failed to submit order. Please try again.';
                    document.getElementById('errorMessage').style.display = 'block';
                }
            });
        }
    }).render('#paypal-button-container');
}