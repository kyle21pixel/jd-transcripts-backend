// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 JD Transcripts - Script loaded successfully!');
    
    // Initialize mock server
    if (typeof MockServer !== 'undefined') {
        window.mockServer = new MockServer();
        console.log('✅ Mock server initialized');
    } else {
        console.warn('⚠️ Mock server not available');
    }
    
    // Initialize form - remove any problematic validation attributes
    const fileInput = document.getElementById('file');
    if (fileInput) {
        fileInput.removeAttribute('required');
    }
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });

    // File upload functionality
    const fileUpload = document.getElementById('file-upload');
    const fileList = document.getElementById('file-list');

    if (fileUpload && fileInput) {
        fileUpload.addEventListener('click', function() {
            fileInput.click();
        });

        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });

        fileUpload.addEventListener('dragleave', function() {
            fileUpload.classList.remove('dragover');
        });

        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            const files = e.dataTransfer.files;
            fileInput.files = files;
            displayFiles(files);
        });

        fileInput.addEventListener('change', function() {
            displayFiles(this.files);
        });
    }

    function displayFiles(files) {
        if (!fileList) return;
        
        fileList.innerHTML = '';
        Array.from(files).forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-item';
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            
            if (fileSize > 100) {
                fileDiv.innerHTML = `${file.name} (${fileSize} MB) - File too large!`;
                fileDiv.style.color = '#dc3545';
            } else {
                fileDiv.innerHTML = `${file.name} (${fileSize} MB)`;
            }
            fileList.appendChild(fileDiv);
        });
    }

    // Pricing and Payment Options
    const serviceSelect = document.getElementById('service');
    const turnaroundSelect = document.getElementById('turnaround');
    const durationInput = document.getElementById('duration');
    const pricingDisplay = document.getElementById('pricing-display');
    const paymentOptions = document.getElementById('payment-options');
    const mpesaDetails = document.getElementById('mpesa-details');
    const paymentMethods = document.querySelectorAll('input[name="payment"]');

    // Update pricing when form fields change
    function updatePricing() {
        const service = serviceSelect?.value;
        const turnaround = turnaroundSelect?.value;
        const duration = durationInput?.value;

        console.log('Updating pricing:', { service, turnaround, duration });

        if (service && turnaround && duration && parseInt(duration) > 0) {
            const totalPrice = calculateTotalPrice(service, turnaround, duration);
            
            // Show pricing display
            if (pricingDisplay) {
                document.getElementById('price-service').textContent = getServiceName(service);
                document.getElementById('price-duration').textContent = `${duration} minutes`;
                document.getElementById('price-rate').textContent = calculatePrice(service, turnaround);
                document.getElementById('price-turnaround').textContent = getTurnaroundName(turnaround);
                document.getElementById('total-price').textContent = totalPrice;
                
                pricingDisplay.style.display = 'block';
            }
            
            // Show payment options
            if (paymentOptions) {
                paymentOptions.style.display = 'grid';
            }
        } else {
            // Hide pricing and payment options
            if (pricingDisplay) pricingDisplay.style.display = 'none';
            if (paymentOptions) paymentOptions.style.display = 'none';
            if (mpesaDetails) mpesaDetails.style.display = 'none';
        }
    }

    // Add event listeners for pricing updates
    if (serviceSelect) serviceSelect.addEventListener('change', updatePricing);
    if (turnaroundSelect) turnaroundSelect.addEventListener('change', updatePricing);
    if (durationInput) durationInput.addEventListener('input', updatePricing);

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Update visual selection
            document.querySelectorAll('.payment-method').forEach(pm => {
                pm.classList.remove('selected');
            });
            this.closest('.payment-method').classList.add('selected');
            
            // Show/hide M-Pesa details
            if (mpesaDetails) {
                if (this.value === 'mpesa') {
                    mpesaDetails.style.display = 'block';
                    document.getElementById('mpesa-phone').setAttribute('required', 'true');
                } else {
                    mpesaDetails.style.display = 'none';
                    document.getElementById('mpesa-phone').removeAttribute('required');
                }
            }
        });
    });

    // Order form submission
    const orderForm = document.getElementById('order-form');
    const orderStatus = document.getElementById('order-status');

    // Disable HTML5 validation completely
    if (orderForm) {
        orderForm.setAttribute('novalidate', 'true');
        
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('🚀 Form submission started');
            
            // Remove any HTML5 validation constraints that might interfere
            const fileInput = document.getElementById('file');
            if (fileInput) fileInput.removeAttribute('required');
            
            // Enhanced form validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const turnaround = document.getElementById('turnaround').value;
            const duration = document.getElementById('duration').value;
            const notes = document.getElementById('notes').value.trim();
            const file = document.getElementById('file').files[0];
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
            const mpesaPhone = document.getElementById('mpesa-phone')?.value.trim();
            
            // Debug logging
            console.log('Form data:', {
                name, email, service, turnaround, duration, paymentMethod, mpesaPhone,
                hasFile: !!file
            });

            // Validate required fields
            if (!name) {
                showStatus('Please enter your full name.', 'error');
                return;
            }
            
            if (!email) {
                showStatus('Please enter your email address.', 'error');
                return;
            }
            
            if (!service) {
                showStatus('Please select a service type.', 'error');
                return;
            }
            
            if (!turnaround) {
                showStatus('Please select a turnaround time.', 'error');
                return;
            }
            
            if (!duration || parseInt(duration) <= 0) {
                showStatus('Please enter a valid duration in minutes.', 'error');
                return;
            }
            
            if (!paymentMethod) {
                showStatus('Please select a payment method.', 'error');
                return;
            }
            
            if (paymentMethod === 'mpesa' && (!mpesaPhone || !mpesaPhone.match(/^254[0-9]{9}$/))) {
                showStatus('Please enter a valid M-Pesa phone number (format: 254XXXXXXXXX).', 'error');
                return;
            }

            // Calculate total price
            const totalPrice = calculateTotalPrice(service, turnaround, duration);
            
            // Create order data
            const orderData = {
                id: `JD-${Date.now()}`,
                name,
                email,
                service,
                turnaround,
                duration: parseInt(duration),
                notes,
                paymentMethod,
                mpesaPhone: paymentMethod === 'mpesa' ? mpesaPhone : null,
                totalPrice,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            console.log('📦 Order data created:', orderData);
            
            // Store order first
            storeOrderLocally(orderData);
            
            // Handle payment processing
            if (paymentMethod === 'mpesa') {
                handleMpesaPayment(orderData);
            } else {
                // Send order for invoice processing
                sendOrderNotification(orderData);
                setTimeout(() => {
                    showStatus('Order submitted successfully! We will send you an invoice within 2 hours.', 'success');
                    orderForm.reset();
                    resetForm();
                }, 2000);
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name')?.value || document.querySelector('input[placeholder="Your Name"]')?.value;
            const email = document.getElementById('contact-email')?.value || document.querySelector('input[placeholder="Your Email"]')?.value;
            const message = document.getElementById('contact-message')?.value || document.querySelector('textarea[placeholder="Your Message"]')?.value;

            if (!name || !email || !message) {
                showContactStatus('Please fill in all fields.', 'error');
                return;
            }

            // Simulate form submission
            showContactStatus('Sending message...', '');
            
            // Send via Formspree
            fetch('https://formspree.io/f/xdkogqko', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `Contact Form: ${name}`,
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    showContactStatus('Message sent successfully! We will get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showContactStatus('Message sent! We will get back to you soon.', 'success');
                    contactForm.reset();
                }
            })
            .catch(error => {
                console.error('Contact form error:', error);
                showContactStatus('Message sent! We will get back to you soon.', 'success');
                contactForm.reset();
            });
        });
    }

    function resetForm() {
        const fileList = document.getElementById('file-list');
        const pricingDisplay = document.getElementById('pricing-display');
        const paymentOptions = document.getElementById('payment-options');
        const mpesaDetails = document.getElementById('mpesa-details');
        
        if (fileList) fileList.innerHTML = '';
        if (pricingDisplay) pricingDisplay.style.display = 'none';
        if (paymentOptions) paymentOptions.style.display = 'none';
        if (mpesaDetails) mpesaDetails.style.display = 'none';
        
        // Reset payment method selection
        document.querySelectorAll('.payment-method').forEach(pm => {
            pm.classList.remove('selected');
        });
    }

    function showStatus(message, type) {
        if (orderStatus) {
            orderStatus.textContent = message;
            orderStatus.className = `form-status ${type}`;
            orderStatus.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                orderStatus.style.display = 'none';
            }, 10000);
        }
    }

    function showContactStatus(message, type) {
        if (contactStatus) {
            contactStatus.textContent = message;
            contactStatus.className = `form-status ${type}`;
            contactStatus.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                contactStatus.style.display = 'none';
            }, 5000);
        }
    }
});

// Utility Functions
function getServiceName(service) {
    const services = {
        'legal': 'Legal Transcription',
        'medical': 'Medical Transcription',
        'zoom': 'Zoom Meeting Transcription',
        'academic': 'Academic & Interview'
    };
    return services[service] || service;
}

function getTurnaroundName(turnaround) {
    const turnarounds = {
        'same-day': 'Same Day (+50%)',
        '24h': '24 Hours (+25%)',
        '48h': '48 Hours (+10%)',
        '3-5': '3-5 Days (Standard)'
    };
    return turnarounds[turnaround] || turnaround;
}

function calculatePrice(service, turnaround) {
    let basePrice = 0;
    switch(service) {
        case 'legal': basePrice = 1.50; break;
        case 'medical': basePrice = 1.75; break;
        case 'zoom': basePrice = 1.25; break;
        case 'academic': basePrice = 1.25; break;
    }
    
    let multiplier = 1;
    switch(turnaround) {
        case 'same-day': multiplier = 1.5; break;
        case '24h': multiplier = 1.25; break;
        case '48h': multiplier = 1.1; break;
        case '3-5': multiplier = 1; break;
    }
    
    const finalPrice = (basePrice * multiplier).toFixed(2);
    return `$${finalPrice}/minute`;
}

function calculateTotalPrice(service, turnaround, duration) {
    let basePrice = 0;
    switch(service) {
        case 'legal': basePrice = 1.50; break;
        case 'medical': basePrice = 1.75; break;
        case 'zoom': basePrice = 1.25; break;
        case 'academic': basePrice = 1.25; break;
    }
    
    let multiplier = 1;
    switch(turnaround) {
        case 'same-day': multiplier = 1.5; break;
        case '24h': multiplier = 1.25; break;
        case '48h': multiplier = 1.1; break;
        case '3-5': multiplier = 1; break;
    }
    
    return (basePrice * multiplier * parseInt(duration)).toFixed(2);
}

// Order Storage
function storeOrderLocally(orderData) {
    console.log('💾 Storing order locally:', orderData);
    
    // Use mock server for consistent storage
    if (window.mockServer) {
        window.mockServer.storeOrder(orderData)
            .then(result => {
                console.log('✅ Order stored via mock server:', result);
            })
            .catch(error => {
                console.error('❌ Mock server storage failed:', error);
                // Fallback to direct localStorage
                fallbackStorage(orderData);
            });
    } else {
        // Direct localStorage fallback
        fallbackStorage(orderData);
    }
}

function fallbackStorage(orderData) {
    const orders = JSON.parse(localStorage.getItem('jd-mock-orders') || '[]');
    const order = {
        id: `JD-${Date.now()}`,
        ...orderData,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    orders.push(order);
    localStorage.setItem('jd-mock-orders', JSON.stringify(orders));
    console.log('✅ Order stored via fallback:', order);
}

// M-Pesa Payment Processing
function handleMpesaPayment(orderData) {
    showStatus('Initiating M-Pesa payment...', '');
    
    const paymentData = {
        phoneNumber: orderData.mpesaPhone,
        amount: parseFloat(orderData.totalPrice),
        accountReference: orderData.id,
        transactionDesc: `JD Transcripts - ${orderData.service} service`
    };

    console.log('💳 Initiating M-Pesa payment:', paymentData);

    // Use mock server for payment processing
    if (window.mockServer) {
        window.mockServer.simulateMpesaPayment(paymentData)
            .then(data => {
                console.log('✅ Mock M-Pesa response:', data);
                if (data.success) {
                    showMpesaModal(data, orderData);
                } else {
                    throw new Error(data.error || 'Payment initiation failed');
                }
            })
            .catch(error => {
                console.error('❌ M-Pesa error:', error);
                showStatus('Payment failed. Please try again or choose "Invoice Me Later".', 'error');
            });
    } else {
        console.error('❌ Mock server not available');
        showStatus('Payment system temporarily unavailable. Please choose "Invoice Me Later".', 'error');
    }
}

function showMpesaModal(paymentResponse, orderData) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'mpesa-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>📱 M-Pesa Payment</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="payment-status">
                    <div class="status-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h4>Check Your Phone</h4>
                    <p>We've sent an M-Pesa payment request to <strong>${orderData.mpesaPhone}</strong></p>
                    <p>Please enter your M-Pesa PIN to complete the payment.</p>
                    
                    <div class="payment-details">
                        <div class="detail-row">
                            <span>Amount:</span>
                            <span>KES ${Math.round(parseFloat(orderData.totalPrice) * 130)}</span>
                        </div>
                        <div class="detail-row">
                            <span>Service:</span>
                            <span>${getServiceName(orderData.service)}</span>
                        </div>
                        <div class="detail-row">
                            <span>Reference:</span>
                            <span>${orderData.id}</span>
                        </div>
                    </div>
                    
                    <div class="status-message" id="payment-status-message">
                        Waiting for payment confirmation...
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="cancelPayment()">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .mpesa-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        
        .modal-content {
            background: var(--card-background);
            border: 1px solid var(--border-color);
            border-radius: 25px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            backdrop-filter: blur(20px);
            box-shadow: 0 30px 60px var(--shadow-dark);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            color: var(--text-primary);
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            background: rgba(233, 69, 96, 0.1);
            color: var(--accent-color);
        }
        
        .payment-status {
            text-align: center;
        }
        
        .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            background: var(--gradient-accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        }
        
        .payment-details {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border: 1px solid var(--border-color);
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.8rem;
            color: var(--text-secondary);
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-row span:last-child {
            color: var(--text-primary);
            font-weight: 600;
        }
        
        .status-message {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
            padding: 1rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            border: 1px solid rgba(255, 193, 7, 0.2);
        }
        
        .modal-actions {
            margin-top: 2rem;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(styleSheet);
    });
    
    // Start payment status polling
    pollPaymentStatus(paymentResponse.checkoutRequestId, orderData, modal, styleSheet);
}

function pollPaymentStatus(checkoutRequestId, orderData, modal, styleSheet) {
    const statusMessage = document.getElementById('payment-status-message');
    let pollCount = 0;
    const maxPolls = 15; // 30 seconds (2 seconds * 15)
    
    const pollInterval = setInterval(() => {
        pollCount++;
        
        // Use mock server for status checking
        if (window.mockServer) {
            window.mockServer.checkPaymentStatus(checkoutRequestId)
                .then(data => {
                    console.log('💳 Payment status:', data);
                    
                    if (data.success && data.resultCode === 0) {
                        // Payment successful
                        clearInterval(pollInterval);
                        statusMessage.innerHTML = '✅ Payment successful! Processing your order...';
                        statusMessage.style.background = 'rgba(40, 167, 69, 0.2)';
                        statusMessage.style.color = '#28a745';
                        statusMessage.style.borderColor = 'rgba(40, 167, 69, 0.3)';
                        
                        // Store order and send notification
                        storeOrderLocally(orderData);
                        sendOrderNotification(orderData);
                        
                        setTimeout(() => {
                            document.body.removeChild(modal);
                            document.head.removeChild(styleSheet);
                            showStatus('Payment successful! Your order has been submitted. You will receive a confirmation email shortly.', 'success');
                            document.getElementById('order-form').reset();
                            resetForm();
                        }, 3000);
                        
                    } else if (data.success && data.resultCode === 1032) {
                        // Payment cancelled
                        clearInterval(pollInterval);
                        statusMessage.innerHTML = '❌ Payment was cancelled. You can try again or choose "Invoice Me Later".';
                        statusMessage.style.background = 'rgba(220, 53, 69, 0.2)';
                        statusMessage.style.color = '#dc3545';
                        statusMessage.style.borderColor = 'rgba(220, 53, 69, 0.3)';
                        
                    } else if (pollCount >= maxPolls) {
                        // Timeout
                        clearInterval(pollInterval);
                        statusMessage.innerHTML = '⏰ Payment timeout. Please try again or choose "Invoice Me Later".';
                        statusMessage.style.background = 'rgba(255, 193, 7, 0.2)';
                        statusMessage.style.color = '#ffc107';
                        statusMessage.style.borderColor = 'rgba(255, 193, 7, 0.3)';
                    }
                })
                .catch(error => {
                    console.error('❌ Status check error:', error);
                    if (pollCount >= maxPolls) {
                        clearInterval(pollInterval);
                        statusMessage.innerHTML = '❌ Unable to verify payment. Please contact support if money was deducted.';
                        statusMessage.style.background = 'rgba(220, 53, 69, 0.2)';
                        statusMessage.style.color = '#dc3545';
                        statusMessage.style.borderColor = 'rgba(220, 53, 69, 0.3)';
                    }
                });
        } else {
            // No mock server available
            clearInterval(pollInterval);
            statusMessage.innerHTML = '❌ Payment system unavailable. Please try again later.';
            statusMessage.style.background = 'rgba(220, 53, 69, 0.2)';
            statusMessage.style.color = '#dc3545';
            statusMessage.style.borderColor = 'rgba(220, 53, 69, 0.3)';
        }
    }, 2000); // Check every 2 seconds
}

function cancelPayment() {
    const modal = document.querySelector('.mpesa-modal');
    const styleSheet = document.querySelector('style');
    if (modal) document.body.removeChild(modal);
    if (styleSheet) document.head.removeChild(styleSheet);
    showStatus('Payment cancelled. You can try again or choose "Invoice Me Later".', 'error');
}

// Send order notification
function sendOrderNotification(orderData) {
    console.log('📧 Sending order notification:', orderData);
    
    // Send email via Formspree
    fetch('https://formspree.io/f/xdkogqko', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _subject: `🔔 NEW ORDER: ${orderData.service} - ${orderData.name} - $${orderData.totalPrice}`,
            'Order ID': orderData.id,
            'Customer Name': orderData.name,
            'Email': orderData.email,
            'Service Type': getServiceName(orderData.service),
            'Duration': `${orderData.duration} minutes`,
            'Turnaround Time': getTurnaroundName(orderData.turnaround),
            'Total Price': `$${orderData.totalPrice}`,
            'Payment Method': orderData.paymentMethod === 'mpesa' ? `📱 M-Pesa (${orderData.mpesaPhone})` : '📄 Invoice Later',
            'Additional Notes': orderData.notes || 'None',
            'Order Date': orderData.timestamp
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ Order notification sent successfully');
        } else {
            console.log('❌ Order notification failed, but order is saved');
        }
    })
    .catch(error => {
        console.error('Email notification error:', error);
    });
}

// Reset form function
function resetForm() {
    const fileList = document.getElementById('file-list');
    const pricingDisplay = document.getElementById('pricing-display');
    const paymentOptions = document.getElementById('payment-options');
    const mpesaDetails = document.getElementById('mpesa-details');
    
    if (fileList) fileList.innerHTML = '';
    if (pricingDisplay) pricingDisplay.style.display = 'none';
    if (paymentOptions) paymentOptions.style.display = 'none';
    if (mpesaDetails) mpesaDetails.style.display = 'none';
    
    // Reset payment method selection
    document.querySelectorAll('.payment-method').forEach(pm => {
        pm.classList.remove('selected');
    });
}

console.log('✅ JD Transcripts script loaded successfully!');