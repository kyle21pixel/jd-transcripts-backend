// Main JavaScript file for the website

// WebSocket connection
let socket;

// Initialize WebSocket connection
function initializeWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
        console.log('WebSocket connected');
        if (auth.isAuthenticated()) {
            socket.send(JSON.stringify({
                type: 'subscribe_orders',
                userId: auth.user.id
            }));
        }
    };
    
    socket.onmessage = handleWebSocketMessage;
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    socket.onclose = () => {
        console.log('WebSocket disconnected');
        // Try to reconnect after 5 seconds
        setTimeout(initializeWebSocket, 5000);
    };
}

// Handle WebSocket messages
function handleWebSocketMessage(event) {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'order_update':
            updateOrderUI(data.data);
            showNotification('Order Update', `Order #${data.data.id} status: ${data.data.status}`);
            break;
        case 'initial_orders':
            updateOrdersList(data.data);
            break;
        case 'error':
            showNotification('Error', data.message, 'error');
            break;
    }
}

// Show notification
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Create notification container
function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    `;
    document.body.appendChild(container);
    return container;
}

// Authentication functions
const auth = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),

    isAuthenticated() {
        return !!this.token;
    },

    isAdmin() {
        return this.user?.role === 'admin';
    },

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.data.token;
                this.user = data.data.user;
                initializeWebSocket(); // Initialize WebSocket after successful login
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
};

// Toast notification system
const toast = {
    show(message, type = 'info') {
        const container = document.querySelector('.toast-container') || 
            (() => {
                const div = document.createElement('div');
                div.className = 'toast-container';
                document.body.appendChild(div);
                return div;
            })();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 3000);
    }
};

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }

        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        }
    });

    return isValid;
}

// API client
const api = {
    async request(endpoint, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...(auth.token ? { 'Authorization': `Bearer ${auth.token}` } : {}),
                ...options.headers
            };

            const API_BASE = 'http://localhost:3000';
            const response = await fetch(`${API_BASE}/api${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },

    // Orders
    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders?${queryString}`);
    },

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    async updateOrderStatus(orderId, status) {
        return this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// Page-specific initialization
document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation active states
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Initialize forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                toast.show('Please fill in all required fields correctly', 'error');
            }
        });
    });

    // Handle authentication state
    if (!auth.isAuthenticated() && document.querySelector('[data-auth-required]')) {
        window.location.href = '/login.html';
    }

    // Initialize mobile navigation
    const mobileNavToggle = document.querySelector('.navbar-toggler');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            document.querySelector('.navbar-collapse').classList.toggle('show');
        });
    }
});

// Export for use in other scripts
window.auth = auth;
window.toast = toast;
window.api = api;