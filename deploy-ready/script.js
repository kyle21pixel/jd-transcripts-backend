// Clean JavaScript for JD Legal Transcripts

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initOrderForm();
    initContactForm();
    initScrollEffects();
    initAnimations();
});

// Navigation
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Order Form
function initOrderForm() {
    const orderForm = document.getElementById('order-form');
    const serviceSelect = document.getElementById('service');
    const turnaroundSelect = document.getElementById('turnaround');
    const estimatedCostInput = document.getElementById('estimated-cost');
    const fileInput = document.getElementById('file');
    const fileUpload = document.getElementById('file-upload');
    const filePreview = document.getElementById('file-preview');

    // Pricing
    const basePrices = {
        legal: 1.50,
        medical: 1.75,
        business: 1.25,
        academic: 1.25
    };

    const turnaroundMultipliers = {
        'same-day': 1.50,
        '24h': 1.25,
        '48h': 1.10,
        'standard': 1.00
    };

    function calculateEstimate() {
        const service = serviceSelect.value;
        const turnaround = turnaroundSelect.value;
        
        if (service && turnaround) {
            const basePrice = basePrices[service] || 1.25;
            const multiplier = turnaroundMultipliers[turnaround] || 1.00;
            const estimatedMinutes = 30;
            const totalCost = (basePrice * multiplier * estimatedMinutes).toFixed(2);
            estimatedCostInput.value = `$${totalCost} (estimated for 30 min)`;
        } else {
            estimatedCostInput.value = '';
        }
    }

    serviceSelect.addEventListener('change', calculateEstimate);
    turnaroundSelect.addEventListener('change', calculateEstimate);

    // File upload
    fileUpload.addEventListener('click', () => fileInput.click());
    
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });
    
    fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });
    
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        // Validate file type
        const allowedTypes = ['audio/', 'video/'];
        const isValidType = allowedTypes.some(type => file.type.startsWith(type));
        
        if (!isValidType) {
            showOrderStatus('Please select an audio or video file.', 'error');
            return;
        }

        // Validate file size (100MB limit)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            showOrderStatus('File size must be less than 100MB.', 'error');
            return;
        }

        // Show file preview
        filePreview.innerHTML = `
            <div class="file-item">
                <i class="fas fa-file-audio"></i>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        filePreview.style.display = 'block';
    }

    // Form submission
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
            await submitOrderToAPI(formData);
            
            showOrderStatus('Order submitted successfully! You will receive a confirmation email shortly.', 'success');
            orderForm.reset();
            filePreview.style.display = 'none';
            estimatedCostInput.value = '';
            
        } catch (error) {
            console.error('Order submission error:', error);
            showOrderStatus('Failed to submit order. Please try again.', 'error');
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    function validateOrderForm() {
        const requiredFields = ['name', 'email', 'service', 'turnaround', 'file'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field.value.trim()) {
                showOrderStatus(`Please fill in the ${fieldName} field.`, 'error');
                field.focus();
                isValid = false;
                return false;
            }
        });

        // Validate email
        const email = document.getElementById('email').value;
        if (!isValidEmail(email)) {
            showOrderStatus('Please enter a valid email address.', 'error');
            document.getElementById('email').focus();
            isValid = false;
        }

        return isValid;
    }

    async function submitOrderToAPI(formData) {
        const API_BASE_URL = 'https://jd-transcripts-backend-production.up.railway.app';
        
        const orderData = {
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            turnaround: formData.get('turnaround'),
            estimatedCost: document.getElementById('estimated-cost').value,
            phone: formData.get('phone') || '',
            notes: formData.get('notes') || ''
        };
        
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Store for success page
        sessionStorage.setItem('lastOrder', JSON.stringify(result));
        
        return result;
    }

    function showOrderStatus(message, type) {
        const statusDiv = document.getElementById('order-status');
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Contact Form
function initContactForm() {
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
            const API_BASE_URL = 'https://jd-transcripts-backend-production.up.railway.app';
            
            const response = await fetch(`${API_BASE_URL}/api/email/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
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
    
    function showContactStatus(message, type) {
        const statusDiv = document.getElementById('contact-status');
        statusDiv.textContent = message;
        statusDiv.className = `form-status ${type}`;
        statusDiv.style.display = 'block';
        
        if (type === 'success' || type === 'error') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Scroll Effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.service-card, .feature, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function removeFile() {
    const fileInput = document.getElementById('file');
    const filePreview = document.getElementById('file-preview');
    const estimatedCostInput = document.getElementById('estimated-cost');
    
    fileInput.value = '';
    filePreview.style.display = 'none';
    
    // Recalculate estimate
    const serviceSelect = document.getElementById('service');
    const turnaroundSelect = document.getElementById('turnaround');
    
    if (serviceSelect.value && turnaroundSelect.value) {
        const basePrices = {
            legal: 1.50,
            medical: 1.75,
            business: 1.25,
            academic: 1.25
        };
        
        const turnaroundMultipliers = {
            'same-day': 1.50,
            '24h': 1.25,
            '48h': 1.10,
            'standard': 1.00
        };
        
        const basePrice = basePrices[serviceSelect.value] || 1.25;
        const multiplier = turnaroundMultipliers[turnaroundSelect.value] || 1.00;
        const estimatedMinutes = 30;
        const totalCost = (basePrice * multiplier * estimatedMinutes).toFixed(2);
        estimatedCostInput.value = `$${totalCost} (estimated for 30 min)`;
    }
}

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    .file-upload.dragover {
        border-color: var(--primary);
        background: var(--gray-50);
    }
    
    .file-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--white);
        border: 1px solid var(--gray-200);
        border-radius: 0.5rem;
    }
    
    .file-item i {
        font-size: 1.5rem;
        color: var(--primary);
    }
    
    .file-details {
        flex: 1;
    }
    
    .file-name {
        font-weight: 600;
        color: var(--gray-900);
    }
    
    .file-size {
        font-size: 0.875rem;
        color: var(--gray-500);
    }
    
    .remove-file {
        background: var(--error);
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
    }
    
    .remove-file:hover {
        background: #dc2626;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-top: 1px solid var(--gray-200);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);