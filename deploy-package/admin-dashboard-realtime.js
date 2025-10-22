/**
 * Admin Dashboard Real-time Integration
 * 
 * This module handles the real-time integration for the admin dashboard.
 */

// Initialize real-time connection
window.realTimeConnection.init();

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.padding = '1rem';
    notification.style.marginBottom = '1rem';
    notification.style.background = 'white';
    notification.style.borderRadius = '0.5rem';
    notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    notification.style.borderLeft = `4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}`;
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }, 5000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Set up event listeners for real-time updates
window.realTimeConnection.addEventListener(window.realTimeConnection.EVENTS.NEW_ORDER, function(order) {
    // Show notification
    showNotification(`New order received: ${order.id}`, 'success');
    
    // Refresh orders
    loadOrders();
    loadRecentOrders();
    updateDashboardStats();
});

window.realTimeConnection.addEventListener(window.realTimeConnection.EVENTS.ORDER_UPDATED, function(order) {
    // Show notification
    showNotification(`Order updated: ${order.id}`, 'info');
    
    // Refresh orders
    loadOrders();
    loadRecentOrders();
    updateDashboardStats();
});

window.realTimeConnection.addEventListener(window.realTimeConnection.EVENTS.NEW_PAYMENT, function(payment) {
    // Show notification
    showNotification(`New payment received: $${payment.amount.toFixed(2)} for order ${payment.orderId}`, 'success');
    
    // Refresh payments
    initializePayments();
    updateDashboardStats();
});

window.realTimeConnection.addEventListener(window.realTimeConnection.EVENTS.NEW_TRANSCRIBER, function(transcriber) {
    // Show notification
    showNotification(`New transcriber added: ${transcriber.name}`, 'success');
    
    // Refresh transcribers
    initializeTranscribers();
    updateDashboardStats();
});

// Add transcriber function
function addNewTranscriber() {
    // Get form data
    const name = document.getElementById('transcriberName').value;
    const email = document.getElementById('transcriberEmail').value;
    const phone = document.getElementById('transcriberPhone').value;
    const specialty = document.getElementById('transcriberSpecialty').value;
    
    // Validate form
    if (!name || !email || !specialty) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Create transcriber
    const result = window.realTimeConnection.addTranscriber({
        name: name,
        email: email,
        phone: phone,
        specialty: specialty
    });
    
    if (result.success) {
        // Show success notification
        showNotification(`Transcriber ${name} added successfully.`, 'success');
        
        // Close modal
        closeTranscriberModal();
        
        // Refresh transcribers
        initializeTranscribers();
    } else {
        // Show error notification
        showNotification(result.message || 'Failed to add transcriber.', 'error');
    }
}

// Show add transcriber modal
function showAddTranscriberModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('transcriberModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'transcriberModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Add New Transcriber</h2>
                    <button class="close-btn" onclick="closeTranscriberModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="transcriberName">Name</label>
                        <input type="text" id="transcriberName" required>
                    </div>
                    <div class="form-group">
                        <label for="transcriberEmail">Email</label>
                        <input type="email" id="transcriberEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="transcriberPhone">Phone</label>
                        <input type="tel" id="transcriberPhone">
                    </div>
                    <div class="form-group">
                        <label for="transcriberSpecialty">Specialty</label>
                        <select id="transcriberSpecialty" required>
                            <option value="">Select Specialty</option>
                            <option value="legal">Legal</option>
                            <option value="medical">Medical</option>
                            <option value="academic">Academic</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeTranscriberModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="addNewTranscriber()">Add Transcriber</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Close transcriber modal
function closeTranscriberModal() {
    const modal = document.getElementById('transcriberModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Update order status
function updateOrder(orderId, status, assignedTo, notes) {
    const result = window.realTimeConnection.updateOrderStatus(orderId, status, assignedTo, notes);
    
    if (result.success) {
        // Show success notification
        showNotification(`Order ${orderId} updated successfully.`, 'success');
        
        // Close modal
        closeModal();
        
        // Refresh orders
        loadOrders();
        loadRecentOrders();
    } else {
        // Show error notification
        showNotification(result.message || 'Failed to update order.', 'error');
    }
}