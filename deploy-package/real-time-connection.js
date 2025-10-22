/**
 * Real-time Connection Module
 * 
 * This module handles the real-time connection between the order form and admin dashboard
 * using localStorage for demo purposes. In a production environment, this would use
 * WebSockets or a similar technology for real-time communication.
 */

// Event names
const EVENTS = {
    NEW_ORDER: 'new_order',
    ORDER_UPDATED: 'order_updated',
    NEW_TRANSCRIBER: 'new_transcriber',
    TRANSCRIBER_UPDATED: 'transcriber_updated',
    NEW_PAYMENT: 'new_payment'
};

// LocalStorage keys
const STORAGE_KEYS = {
    ORDERS: 'jdOrders',
    TRANSCRIBERS: 'jdTranscribers',
    CLIENTS: 'jdClients',
    PAYMENTS: 'jdPayments',
    POSITIONS: 'jdPositions',
    EVENTS: 'jdEvents'
};

// Event listeners
const eventListeners = {};

/**
 * Initialize the real-time connection
 */
function initRealTimeConnection() {
    // Set up storage event listener
    window.addEventListener('storage', handleStorageEvent);
    
    // Initialize events array if it doesn't exist
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([]));
    }
}

/**
 * Handle storage event
 * @param {StorageEvent} event - Storage event
 */
function handleStorageEvent(event) {
    if (event.key === STORAGE_KEYS.EVENTS) {
        const events = JSON.parse(event.newValue || '[]');
        const lastEvent = events[events.length - 1];
        
        if (lastEvent && eventListeners[lastEvent.type]) {
            eventListeners[lastEvent.type].forEach(callback => {
                callback(lastEvent.data);
            });
        }
    }
}

/**
 * Add event listener
 * @param {string} eventName - Event name
 * @param {Function} callback - Callback function
 */
function addEventListener(eventName, callback) {
    if (!eventListeners[eventName]) {
        eventListeners[eventName] = [];
    }
    
    eventListeners[eventName].push(callback);
}

/**
 * Remove event listener
 * @param {string} eventName - Event name
 * @param {Function} callback - Callback function
 */
function removeEventListener(eventName, callback) {
    if (eventListeners[eventName]) {
        eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
    }
}

/**
 * Dispatch event
 * @param {string} eventName - Event name
 * @param {*} data - Event data
 */
function dispatchEvent(eventName, data) {
    const events = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
    
    events.push({
        type: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    
    // Keep only the last 100 events
    if (events.length > 100) {
        events.shift();
    }
    
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    
    // Also trigger local event listeners
    if (eventListeners[eventName]) {
        eventListeners[eventName].forEach(callback => {
            callback(data);
        });
    }
}

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {string} - Order ID
 */
function createOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    // Generate order ID
    const orderId = 'JD-' + (1000 + orders.length + 1);
    
    // Create order object
    const order = {
        id: orderId,
        client: orderData.clientName,
        email: orderData.clientEmail,
        phone: orderData.clientPhone,
        service: orderData.serviceType,
        turnaround: orderData.turnaround,
        status: 'received',
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(orderData.amount || 0),
        files: orderData.files || [],
        transcripts: [],
        notes: orderData.instructions || '',
        timeline: [
            {
                action: 'Order Created',
                timestamp: new Date().toISOString(),
                performedBy: 'Client',
                notes: 'Order was submitted by the client.'
            }
        ],
        assignedTo: ''
    };
    
    // Add order to array
    orders.push(order);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Dispatch event
    dispatchEvent(EVENTS.NEW_ORDER, order);
    
    // Update client data
    updateClientData(orderData);
    
    return orderId;
}

/**
 * Update client data
 * @param {Object} orderData - Order data
 */
function updateClientData(orderData) {
    const clients = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTS) || '[]');
    
    // Check if client exists
    let client = clients.find(c => c.email === orderData.clientEmail);
    
    if (client) {
        // Update existing client
        client.totalOrders += 1;
        client.totalSpent += parseFloat(orderData.amount || 0);
    } else {
        // Create new client
        client = {
            id: clients.length + 1,
            name: orderData.clientName,
            email: orderData.clientEmail,
            phone: orderData.clientPhone,
            type: 'individual',
            joinDate: new Date().toISOString().split('T')[0],
            totalOrders: 1,
            totalSpent: parseFloat(orderData.amount || 0)
        };
        
        clients.push(client);
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

/**
 * Process payment
 * @param {Object} paymentData - Payment data
 * @returns {Object} - Payment result
 */
function processPayment(paymentData) {
    const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    
    // Generate payment ID
    const paymentId = 'PAY-' + (1000 + payments.length + 1);
    
    // Create payment object
    const payment = {
        id: paymentId,
        orderId: paymentData.orderId,
        client: paymentData.clientName,
        amount: parseFloat(paymentData.amount || 0),
        method: paymentData.method,
        status: 'completed',
        date: new Date().toISOString(),
        transactionId: paymentData.transactionId || generateTransactionId(paymentData.method)
    };
    
    // Add payment to array
    payments.push(payment);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    
    // Dispatch event
    dispatchEvent(EVENTS.NEW_PAYMENT, payment);
    
    // Update order with payment information
    updateOrderPayment(paymentData.orderId, payment);
    
    return {
        success: true,
        paymentId: paymentId,
        message: 'Payment processed successfully'
    };
}

/**
 * Generate transaction ID
 * @param {string} method - Payment method
 * @returns {string} - Transaction ID
 */
function generateTransactionId(method) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    if (method === 'stripe') {
        result = 'ch_';
        for (let i = 0; i < 24; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } else if (method === 'paypal') {
        result = 'PAYPAL';
        for (let i = 0; i < 10; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return result;
}

/**
 * Update order with payment information
 * @param {string} orderId - Order ID
 * @param {Object} payment - Payment object
 */
function updateOrderPayment(orderId, payment) {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    // Find order
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        // Add payment to timeline
        orders[orderIndex].timeline.push({
            action: 'Payment Received',
            timestamp: payment.date,
            performedBy: 'System',
            notes: `Payment of $${payment.amount.toFixed(2)} was received via ${payment.method === 'stripe' ? 'Credit Card' : 'PayPal'}.`
        });
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        // Dispatch event
        dispatchEvent(EVENTS.ORDER_UPDATED, orders[orderIndex]);
    }
}

/**
 * Add transcriber
 * @param {Object} transcriberData - Transcriber data
 * @returns {Object} - Result
 */
function addTranscriber(transcriberData) {
    const transcribers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIBERS) || '[]');
    
    // Check if transcriber already exists
    if (transcribers.some(t => t.email === transcriberData.email)) {
        return {
            success: false,
            message: 'Transcriber with this email already exists'
        };
    }
    
    // Create transcriber object
    const transcriber = {
        id: transcribers.length + 1,
        name: transcriberData.name,
        email: transcriberData.email,
        phone: transcriberData.phone,
        specialty: transcriberData.specialty,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        completedOrders: 0,
        rating: 0
    };
    
    // Add transcriber to array
    transcribers.push(transcriber);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.TRANSCRIBERS, JSON.stringify(transcribers));
    
    // Dispatch event
    dispatchEvent(EVENTS.NEW_TRANSCRIBER, transcriber);
    
    return {
        success: true,
        transcriberId: transcriber.id,
        message: 'Transcriber added successfully'
    };
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {string} assignedTo - Assigned transcriber email
 * @param {string} notes - Notes
 * @returns {Object} - Result
 */
function updateOrderStatus(orderId, status, assignedTo, notes) {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    
    // Find order
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        return {
            success: false,
            message: 'Order not found'
        };
    }
    
    // Get transcriber name if assigned
    let assignedTranscriberName = '';
    if (assignedTo) {
        const transcribers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIBERS) || '[]');
        const transcriber = transcribers.find(t => t.email === assignedTo);
        if (transcriber) {
            assignedTranscriberName = transcriber.name;
        }
    }
    
    // Update order
    orders[orderIndex].status = status;
    if (assignedTo) {
        orders[orderIndex].assignedTo = assignedTo;
    }
    
    // Add to timeline
    orders[orderIndex].timeline.push({
        action: `Status Updated to ${status}`,
        timestamp: new Date().toISOString(),
        performedBy: localStorage.getItem('userName') || 'Admin',
        notes: notes || (assignedTo ? `Order assigned to ${assignedTranscriberName}` : `Status changed to ${status}`)
    });
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Dispatch event
    dispatchEvent(EVENTS.ORDER_UPDATED, orders[orderIndex]);
    
    // Update transcriber stats if completed
    if (status === 'completed' && orders[orderIndex].assignedTo) {
        updateTranscriberStats(orders[orderIndex].assignedTo);
    }
    
    return {
        success: true,
        message: 'Order status updated successfully'
    };
}

/**
 * Update transcriber stats
 * @param {string} email - Transcriber email
 */
function updateTranscriberStats(email) {
    const transcribers = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSCRIBERS) || '[]');
    
    // Find transcriber
    const transcriberIndex = transcribers.findIndex(t => t.email === email);
    
    if (transcriberIndex !== -1) {
        // Update stats
        transcribers[transcriberIndex].completedOrders += 1;
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.TRANSCRIBERS, JSON.stringify(transcribers));
        
        // Dispatch event
        dispatchEvent(EVENTS.TRANSCRIBER_UPDATED, transcribers[transcriberIndex]);
    }
}

// Export functions
window.realTimeConnection = {
    init: initRealTimeConnection,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    dispatchEvent: dispatchEvent,
    createOrder: createOrder,
    processPayment: processPayment,
    addTranscriber: addTranscriber,
    updateOrderStatus: updateOrderStatus,
    EVENTS: EVENTS
};