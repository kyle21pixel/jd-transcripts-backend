// Frontend Integration Script for Railway Backend
// Replace the simulated functions in your script.js with these real API calls

// Configuration
const API_BASE_URL = 'https://your-railway-app-name.railway.app/api'; // Replace with your actual Railway URL

// Real Order Submission Function
async function submitOrderToRailway(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            body: formData // FormData object with file upload
        });

        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                orderNumber: result.data.orderId,
                message: 'Order submitted successfully!'
            };
        } else {
            throw new Error(result.message || 'Failed to submit order');
        }
    } catch (error) {
        console.error('Order submission error:', error);
        throw error;
    }
}

// Real Contact Form Submission
async function submitContactToRailway(contactData) {
    try {
        const response = await fetch(`${API_BASE_URL}/email/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                message: 'Message sent successfully!'
            };
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        throw error;
    }
}

// Health Check Function
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        console.log('API Health:', result);
        return result.status === 'OK';
    } catch (error) {
        console.error('API Health check failed:', error);
        return false;
    }
}

// How to integrate into your existing script.js:

/* 
1. Replace this line in your script.js:
   await simulateOrderSubmission(formData);
   
   With:
   await submitOrderToRailway(formData);

2. Replace contact form simulation with:
   await submitContactToRailway({
       name: name,
       email: email,
       message: message
   });

3. Add API health check on page load:
   document.addEventListener('DOMContentLoaded', function() {
       checkAPIHealth();
       // ... rest of your initialization
   });
*/

// Example of updated order form submission:
function updateOrderFormSubmission() {
    const orderForm = document.getElementById('order-form');
    
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateOrderForm()) {
            return;
        }

        const formData = new FormData(orderForm);
        const submitButton = orderForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
        showOrderStatus('Submitting your order...', 'loading');

        try {
            // Real API call to Railway backend
            const result = await submitOrderToRailway(formData);
            
            showOrderStatus(`Order submitted successfully! Order ID: ${result.orderNumber}`, 'success');
            orderForm.reset();
            document.getElementById('file-preview').style.display = 'none';
            document.getElementById('estimated-cost').value = '';
            
        } catch (error) {
            console.error('Order submission error:', error);
            showOrderStatus('Failed to submit order. Please try again.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Example of updated contact form submission:
function updateContactFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        if (!name || !email || !message) {
            showContactStatus('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showContactStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        showContactStatus('Sending your message...', 'loading');
        
        try {
            // Real API call to Railway backend
            await submitContactToRailway({ name, email, message });
            
            showContactStatus('Message sent successfully! We will get back to you within 24 hours.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Contact form error:', error);
            showContactStatus('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}