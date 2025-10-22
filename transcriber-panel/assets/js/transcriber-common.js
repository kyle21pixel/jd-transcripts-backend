// Transcriber Panel - Shared JavaScript Functions

// API Configuration
const API_BASE = 'http://localhost:8080/jd%203/php_backend/api/transcriber-api.php';
const TRANSCRIBER_ID = 1; // Default transcriber ID (in production, get from session/login)

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
async function apiGet(action, params = {}) {
    try {
        params.transcriberId = TRANSCRIBER_ID;
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE}?action=${action}&${queryString}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showToast('Failed to fetch data', 'error');
        throw error;
    }
}

async function apiPost(action, body) {
    try {
        body.transcriberId = TRANSCRIBER_ID;
        const url = `${API_BASE}?action=${action}&transcriberId=${TRANSCRIBER_ID}`;
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

async function apiPut(action, body) {
    try {
        const url = `${API_BASE}?action=${action}&transcriberId=${TRANSCRIBER_ID}`;
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

// Status Badge Helper
function getStatusBadge(status) {
    const statusMap = {
        'pending': 'Pending',
        'assigned': 'Assigned',
        'in_progress': 'In Progress',
        'quality_check': 'Quality Check',
        'completed': 'Completed',
        'delivered': 'Delivered'
    };
    
    const displayStatus = statusMap[status] || status;
    const className = status.replace('_', '-');
    
    return `<span class="status-badge status-${className}">${displayStatus}</span>`;
}

// Format Currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount || 0).toFixed(2);
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

// Calculate Time Remaining
function getTimeRemaining(deadline) {
    if (!deadline) return '-';
    
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff < 0) {
        return '<span style="color: var(--danger);">Overdue</span>';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
        return 'Less than 1 hour';
    }
}

// Order Status Actions
async function startOrder(orderId) {
    if (!confirm('Start working on this order?')) return;
    
    try {
        const result = await apiPut('status', {
            orderId: orderId,
            status: 'in_progress'
        });
        
        if (result.success) {
            showToast('Order status updated to In Progress', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(result.error || 'Failed to update status', 'error');
        }
    } catch (error) {
        showToast('Error updating order status', 'error');
    }
}

async function completeOrder(orderId) {
    if (!confirm('Mark this order as completed?')) return;
    
    try {
        const result = await apiPut('status', {
            orderId: orderId,
            status: 'completed'
        });
        
        if (result.success) {
            showToast('Order marked as completed!', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(result.error || 'Failed to complete order', 'error');
        }
    } catch (error) {
        showToast('Error completing order', 'error');
    }
}

async function acceptOrder(orderId) {
    if (!confirm('Accept this order?')) return;
    
    try {
        const result = await apiPost('accept', {
            orderId: orderId
        });
        
        if (result.success) {
            showToast('Order accepted successfully!', 'success');
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showToast(result.error || 'Failed to accept order', 'error');
        }
    } catch (error) {
        showToast('Error accepting order', 'error');
    }
}
