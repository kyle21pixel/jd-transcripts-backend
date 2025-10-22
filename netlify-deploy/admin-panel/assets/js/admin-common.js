// Admin Panel - Shared JavaScript Functions

// API Configuration
const API_BASE = 'http://localhost:8080/jd%203/php_backend/api/admin-api.php';

// Utility Functions
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Modal Functions
function showModal(modalId) {
    $(modalId).classList.add('active');
}

function hideModal(modalId) {
    $(modalId).classList.remove('active');
}

// API Helper Functions
async function apiGet(endpoint) {
    try {
        // Convert endpoint like '/admin/orders' to '?action=orders'
        const action = endpoint.replace('/admin/', '').replace('/', '');
        const url = `${API_BASE}?action=${action}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to fetch data', 'error');
        throw error;
    }
}

async function apiPost(endpoint, body) {
    try {
        const action = endpoint.replace('/admin/orders/', '').replace('/admin/', '');
        const url = `${API_BASE}?action=${action}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to submit data', 'error');
        throw error;
    }
}

async function apiPut(endpoint, body) {
    try {
        const action = endpoint.replace('/admin/orders/', '').replace('/admin/', '');
        const url = `${API_BASE}?action=${action}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to update data', 'error');
        throw error;
    }
}

async function apiDelete(endpoint, params = {}) {
    try {
        const action = 'delete';
        const queryString = new URLSearchParams({action, ...params}).toString();
        const url = `${API_BASE}?${queryString}`;
        const response = await fetch(url, {
            method: 'DELETE'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to delete data', 'error');
        throw error;
    }
}

// Status Badge Helper
function getStatusBadge(status) {
    const statusMap = {
        'pending': 'badge-pending',
        'assigned': 'badge-assigned',
        'in_progress': 'badge-in-progress',
        'completed': 'badge-completed',
        'delivered': 'badge-delivered',
        'cancelled': 'badge-cancelled'
    };
    const badgeClass = statusMap[status] || 'badge-pending';
    const displayStatus = status.replace('_', ' ').toUpperCase();
    return `<span class="badge ${badgeClass}">${displayStatus}</span>`;
}

// Format Currency
function formatCurrency(amount) {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Set Active Navigation
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    $$('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    
    // Close modals when clicking outside
    $$('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});
