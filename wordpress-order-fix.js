// WordPress Order Submission Fix
// Add this code to your theme's script.js file

// Function to submit order to WordPress database
function submitOrderToWordPress(orderData) {
    console.log('💾 Submitting order to WordPress database:', orderData);
    
    // Prepare form data for WordPress AJAX
    const formData = new FormData();
    formData.append('action', 'submit_order');
    formData.append('nonce', jd_transcripts_ajax.nonce); // WordPress nonce for security
    formData.append('name', orderData.name);
    formData.append('email', orderData.email);
    formData.append('service', orderData.service);
    formData.append('turnaround', orderData.turnaround);
    formData.append('duration', orderData.duration);
    formData.append('notes', orderData.notes || '');
    formData.append('payment_method', orderData.paymentMethod);
    formData.append('mpesa_phone', orderData.mpesaPhone || '');
    formData.append('total_price', orderData.totalPrice);
    
    // Submit to WordPress
    fetch(jd_transcripts_ajax.ajax_url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Order saved to WordPress database:', data.data);
            // Update local storage with WordPress order ID
            orderData.wordpress_id = data.data.order_id;
            storeOrderLocally(orderData);
        } else {
            console.error('❌ Failed to save order to WordPress:', data.data);
        }
    })
    .catch(error => {
        console.error('❌ WordPress submission error:', error);
    });
}

// Function to store order locally (backup)
function storeOrderLocally(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('jd_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('jd_orders', JSON.stringify(orders));
        console.log('💾 Order stored locally:', orderData.id);
    } catch (error) {
        console.error('Local storage error:', error);
    }
}

// INSTRUCTIONS TO IMPLEMENT:
console.log(`
🔧 TO FIX ORDER SUBMISSION:

1. Add this code to your theme's script.js file
2. Make sure WordPress AJAX is properly localized in functions.php
3. The submitOrderToWordPress function will save orders to database
4. Orders will appear in your admin dashboard

The fix ensures orders are saved to WordPress database AND displayed in admin dashboard.
`);