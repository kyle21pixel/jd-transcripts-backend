// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.orders = [];
        this.transcribers = [];
        this.currentOrderId = null;
        
        this.init();
    }

    init() {
        // Check authentication
        if (!this.checkAuth()) {
            window.location.href = 'admin-login.html';
            return;
        }

        // Initialize data
        this.loadSampleData();
        this.setupEventListeners();
        this.updateClock();
        this.renderDashboard();
        
        // Update clock every minute
        setInterval(() => this.updateClock(), 60000);
        
        // Auto-refresh data every 5 minutes
        setInterval(() => this.refreshData(), 300000);
    }

    checkAuth() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        const username = localStorage.getItem('adminUsername');
        
        if (isLoggedIn === 'true' && username) {
            // Update user info
            document.getElementById('userName').textContent = username.charAt(0).toUpperCase() + username.slice(1);
            document.getElementById('userAvatar').textContent = username.charAt(0).toUpperCase();
            return true;
        }
        return false;
    }

    loadSampleData() {
        // Sample orders data
        this.orders = [
            {
                id: 'ORD-001',
                clientName: 'John Smith',
                clientEmail: 'john.smith@lawfirm.com',
                clientPhone: '+1-555-0123',
                serviceType: 'Legal Transcription',
                status: 'pending',
                assignedTo: null,
                createdDate: new Date('2025-01-07'),
                dueDate: new Date('2025-01-09'),
                priority: 'normal',
                estimatedCost: '$150.00',
                notes: 'Court hearing transcript needed urgently'
            },
            {
                id: 'ORD-002',
                clientName: 'Dr. Sarah Johnson',
                clientEmail: 'sarah.j@medcenter.com',
                clientPhone: '+1-555-0124',
                serviceType: 'Medical Transcription',
                status: 'in-progress',
                assignedTo: 'Alice Cooper',
                createdDate: new Date('2025-01-06'),
                dueDate: new Date('2025-01-08'),
                priority: 'high',
                estimatedCost: '$200.00',
                notes: 'Patient consultation recording'
            },
            {
                id: 'ORD-003',
                clientName: 'Tech Corp Inc.',
                clientEmail: 'admin@techcorp.com',
                clientPhone: '+1-555-0125',
                serviceType: 'Business Meetings',
                status: 'completed',
                assignedTo: 'Bob Wilson',
                createdDate: new Date('2025-01-05'),
                dueDate: new Date('2025-01-07'),
                priority: 'normal',
                estimatedCost: '$125.00',
                notes: 'Board meeting minutes'
            },
            {
                id: 'ORD-004',
                clientName: 'University Research',
                clientEmail: 'research@university.edu',
                clientPhone: '+1-555-0126',
                serviceType: 'Academic & Research',
                status: 'in-progress',
                assignedTo: 'Carol Davis',
                createdDate: new Date('2025-01-04'),
                dueDate: new Date('2025-01-10'),
                priority: 'normal',
                estimatedCost: '$175.00',
                notes: 'Research interview transcription'
            },
            {
                id: 'ORD-005',
                clientName: 'Legal Associates',
                clientEmail: 'contact@legalassoc.com',
                clientPhone: '+1-555-0127',
                serviceType: 'Legal Transcription',
                status: 'pending',
                assignedTo: null,
                createdDate: new Date('2025-01-08'),
                dueDate: new Date('2025-01-10'),
                priority: 'urgent',
                estimatedCost: '$300.00',
                notes: 'Deposition transcript - rush order'
            }
        ];

        // Sample transcribers data
        this.transcribers = [
            {
                id: 'T001',
                name: 'Alice Cooper',
                email: 'alice.cooper@jdtranscripts.com',
                phone: '+1-555-1001',
                specialization: 'Medical',
                experience: 'senior',
                hourlyRate: 25.00,
                activeOrders: 2,
                completedOrders: 45,
                rating: 4.9,
                status: 'active',
                joinDate: new Date('2023-03-15'),
                avgTurnaround: 16.5,
                qualityScore: 4.9
            },
            {
                id: 'T002',
                name: 'Bob Wilson',
                email: 'bob.wilson@jdtranscripts.com',
                phone: '+1-555-1002',
                specialization: 'Legal',
                experience: 'senior',
                hourlyRate: 28.00,
                activeOrders: 1,
                completedOrders: 52,
                rating: 4.8,
                status: 'active',
                joinDate: new Date('2023-01-10'),
                avgTurnaround: 18.2,
                qualityScore: 4.8
            },
            {
                id: 'T003',
                name: 'Carol Davis',
                email: 'carol.davis@jdtranscripts.com',
                phone: '+1-555-1003',
                specialization: 'Academic',
                experience: 'intermediate',
                hourlyRate: 22.00,
                activeOrders: 3,
                completedOrders: 38,
                rating: 4.7,
                status: 'active',
                joinDate: new Date('2023-06-20'),
                avgTurnaround: 20.1,
                qualityScore: 4.7
            },
            {
                id: 'T004',
                name: 'David Brown',
                email: 'david.brown@jdtranscripts.com',
                phone: '+1-555-1004',
                specialization: 'Business',
                experience: 'intermediate',
                hourlyRate: 20.00,
                activeOrders: 0,
                completedOrders: 29,
                rating: 4.6,
                status: 'active',
                joinDate: new Date('2023-09-05'),
                avgTurnaround: 22.3,
                qualityScore: 4.6
            },
            {
                id: 'T005',
                name: 'Emma Thompson',
                email: 'emma.thompson@jdtranscripts.com',
                phone: '+1-555-1005',
                specialization: 'Legal',
                experience: 'junior',
                hourlyRate: 18.00,
                activeOrders: 1,
                completedOrders: 15,
                rating: 4.5,
                status: 'active',
                joinDate: new Date('2024-02-14'),
                avgTurnaround: 24.5,
                qualityScore: 4.5
            }
        ];
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Modal close on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            orders: 'Order Management',
            transcribers: 'Transcriber Management',
            performance: 'Performance Analytics',
            settings: 'System Settings'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName];

        this.currentSection = sectionName;

        // Load section-specific data
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'transcribers':
                this.renderTranscribers();
                break;
            case 'performance':
                this.renderPerformance();
                break;
        }
    }

    renderDashboard() {
        // Update stats
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const completedOrders = this.orders.filter(o => o.status === 'completed').length;
        const activeTranscribers = this.transcribers.filter(t => t.status === 'active').length;

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('completedOrders').textContent = completedOrders;
        document.getElementById('activeTranscribers').textContent = activeTranscribers;

        // Update orders badge
        document.getElementById('ordersBadge').textContent = pendingOrders;

        // Render recent orders
        this.renderRecentOrders();
    }

    renderRecentOrders() {
        const recentOrders = this.orders.slice(0, 5);
        const tbody = document.getElementById('recentOrdersTable');
        
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    <div>${order.clientName}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${order.clientEmail}</div>
                </td>
                <td>${order.serviceType}</td>
                <td><span class="status-badge ${order.status}">${this.formatStatus(order.status)}</span></td>
                <td>${order.assignedTo || '<span style="color: #64748b;">Unassigned</span>'}</td>
                <td>${this.formatDate(order.dueDate)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="dashboard.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${!order.assignedTo ? `
                        <button class="btn btn-sm btn-success" onclick="dashboard.showAssignModal('${order.id}')">
                            <i class="fas fa-user-plus"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    renderOrders() {
        const tbody = document.getElementById('ordersTable');
        
        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    <div><strong>${order.clientName}</strong></div>
                    <div style="font-size: 0.75rem; color: #64748b;">${order.clientEmail}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${order.clientPhone}</div>
                </td>
                <td>
                    <div>${order.serviceType}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${order.estimatedCost}</div>
                </td>
                <td>
                    <span class="status-badge ${order.status}">${this.formatStatus(order.status)}</span>
                    ${order.priority === 'urgent' ? '<div style="color: #ef4444; font-size: 0.75rem; font-weight: 600;">URGENT</div>' : ''}
                </td>
                <td>${order.assignedTo || '<span style="color: #64748b;">Unassigned</span>'}</td>
                <td>${this.formatDate(order.createdDate)}</td>
                <td>${this.formatDate(order.dueDate)}</td>
                <td>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-sm btn-primary" onclick="dashboard.viewOrder('${order.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${!order.assignedTo ? `
                            <button class="btn btn-sm btn-success" onclick="dashboard.showAssignModal('${order.id}')" title="Assign">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.updateOrderStatus('${order.id}')" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderTranscribers() {
        const tbody = document.getElementById('transcribersTable');
        
        tbody.innerHTML = this.transcribers.map(transcriber => `
            <tr>
                <td>
                    <div><strong>${transcriber.name}</strong></div>
                    <div style="font-size: 0.75rem; color: #64748b;">ID: ${transcriber.id}</div>
                </td>
                <td>
                    <div>${transcriber.email}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${transcriber.phone}</div>
                </td>
                <td>
                    <div>${transcriber.specialization}</div>
                    <div style="font-size: 0.75rem; color: #64748b;">${transcriber.experience}</div>
                </td>
                <td><span class="status-badge ${transcriber.activeOrders > 0 ? 'in-progress' : 'completed'}">${transcriber.activeOrders}</span></td>
                <td>${transcriber.completedOrders}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <span>${transcriber.rating}</span>
                        <i class="fas fa-star" style="color: #fbbf24; font-size: 0.75rem;"></i>
                    </div>
                </td>
                <td><span class="status-badge ${transcriber.status === 'active' ? 'completed' : 'cancelled'}">${transcriber.status}</span></td>
                <td>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn btn-sm btn-primary" onclick="dashboard.viewTranscriber('${transcriber.id}')" title="View Profile">
                            <i class="fas fa-user"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="dashboard.editTranscriber('${transcriber.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="dashboard.removeTranscriber('${transcriber.id}')" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update assign transcriber dropdown
        this.updateTranscriberDropdown();
    }

    renderPerformance() {
        // Sort transcribers by performance
        const sortedTranscribers = [...this.transcribers]
            .sort((a, b) => b.qualityScore - a.qualityScore)
            .slice(0, 5);

        const tbody = document.getElementById('performanceTable');
        
        tbody.innerHTML = sortedTranscribers.map((transcriber, index) => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-weight: 600; color: ${index < 3 ? '#f59e0b' : '#64748b'};">
                            #${index + 1}
                        </span>
                        ${index === 0 ? '<i class="fas fa-crown" style="color: #f59e0b;"></i>' : ''}
                    </div>
                </td>
                <td>
                    <div><strong>${transcriber.name}</strong></div>
                    <div style="font-size: 0.75rem; color: #64748b;">${transcriber.specialization}</div>
                </td>
                <td>${transcriber.completedOrders}</td>
                <td>${transcriber.avgTurnaround} hrs</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                        <span>${transcriber.qualityScore}</span>
                        <i class="fas fa-star" style="color: #fbbf24; font-size: 0.75rem;"></i>
                    </div>
                </td>
                <td>$${(transcriber.completedOrders * transcriber.hourlyRate * 8).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    updateTranscriberDropdown() {
        const select = document.getElementById('assignTranscriber');
        const availableTranscribers = this.transcribers.filter(t => t.status === 'active');
        
        select.innerHTML = '<option value="">Choose transcriber...</option>' +
            availableTranscribers.map(t => 
                `<option value="${t.id}">${t.name} (${t.specialization}) - ${t.activeOrders} active</option>`
            ).join('');
    }

    // Modal functions
    showAssignModal(orderId) {
        this.currentOrderId = orderId;
        this.updateTranscriberDropdown();
        document.getElementById('assignOrderModal').classList.add('show');
    }

    showAddTranscriberModal() {
        document.getElementById('addTranscriberModal').classList.add('show');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    // Order functions
    assignOrder() {
        const transcriberSelect = document.getElementById('assignTranscriber');
        const prioritySelect = document.getElementById('assignPriority');
        const notesTextarea = document.getElementById('assignNotes');

        if (!transcriberSelect.value) {
            alert('Please select a transcriber');
            return;
        }

        const transcriber = this.transcribers.find(t => t.id === transcriberSelect.value);
        const order = this.orders.find(o => o.id === this.currentOrderId);

        if (order && transcriber) {
            order.assignedTo = transcriber.name;
            order.status = 'in-progress';
            order.priority = prioritySelect.value;
            order.notes += `\n\nAssigned to ${transcriber.name} - ${notesTextarea.value}`;

            // Update transcriber active orders
            transcriber.activeOrders++;

            // Send email notification (simulated)
            this.sendAssignmentEmail(order, transcriber);

            this.closeModal('assignOrderModal');
            this.renderDashboard();
            this.renderOrders();

            // Clear form
            transcriberSelect.value = '';
            prioritySelect.value = 'normal';
            notesTextarea.value = '';

            this.showNotification('Order assigned successfully!', 'success');
        }
    }

    addTranscriber() {
        const name = document.getElementById('transcriberName').value;
        const email = document.getElementById('transcriberEmail').value;
        const phone = document.getElementById('transcriberPhone').value;
        const specialization = document.getElementById('transcriberSpecialization').value;
        const experience = document.getElementById('transcriberExperience').value;
        const rate = parseFloat(document.getElementById('transcriberRate').value);

        if (!name || !email || !rate) {
            alert('Please fill in all required fields');
            return;
        }

        const newTranscriber = {
            id: 'T' + String(this.transcribers.length + 1).padStart(3, '0'),
            name,
            email,
            phone,
            specialization,
            experience,
            hourlyRate: rate,
            activeOrders: 0,
            completedOrders: 0,
            rating: 4.0,
            status: 'active',
            joinDate: new Date(),
            avgTurnaround: 24.0,
            qualityScore: 4.0
        };

        this.transcribers.push(newTranscriber);
        this.closeModal('addTranscriberModal');
        this.renderTranscribers();

        // Clear form
        document.getElementById('transcriberName').value = '';
        document.getElementById('transcriberEmail').value = '';
        document.getElementById('transcriberPhone').value = '';
        document.getElementById('transcriberRate').value = '';

        this.showNotification('Transcriber added successfully!', 'success');
    }

    removeTranscriber(transcriberID) {
        const transcriber = this.transcribers.find(t => t.id === transcriberID);
        
        if (transcriber.activeOrders > 0) {
            alert('Cannot remove transcriber with active orders. Please reassign orders first.');
            return;
        }

        if (confirm(`Are you sure you want to remove ${transcriber.name}?`)) {
            this.transcribers = this.transcribers.filter(t => t.id !== transcriberID);
            this.renderTranscribers();
            this.showNotification('Transcriber removed successfully!', 'success');
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            alert(`Order Details:\n\nID: ${order.id}\nClient: ${order.clientName}\nService: ${order.serviceType}\nStatus: ${order.status}\nAssigned: ${order.assignedTo || 'Unassigned'}\nDue: ${this.formatDate(order.dueDate)}\nNotes: ${order.notes}`);
        }
    }

    updateOrderStatus(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            const newStatus = prompt('Enter new status (pending, in-progress, completed, cancelled):', order.status);
            if (newStatus && ['pending', 'in-progress', 'completed', 'cancelled'].includes(newStatus)) {
                const oldStatus = order.status;
                order.status = newStatus;

                // Update transcriber stats if completed
                if (newStatus === 'completed' && oldStatus !== 'completed' && order.assignedTo) {
                    const transcriber = this.transcribers.find(t => t.name === order.assignedTo);
                    if (transcriber) {
                        transcriber.activeOrders = Math.max(0, transcriber.activeOrders - 1);
                        transcriber.completedOrders++;
                    }
                }

                this.renderDashboard();
                this.renderOrders();
                this.showNotification('Order status updated!', 'success');
            }
        }
    }

    // Email simulation
    sendAssignmentEmail(order, transcriber) {
        console.log(`Email sent to ${transcriber.email}:`);
        console.log(`Subject: New Order Assignment - ${order.id}`);
        console.log(`Body: You have been assigned order ${order.id} for ${order.clientName}. Due: ${this.formatDate(order.dueDate)}`);
        
        // In production, this would make an API call to send actual email
        // Example: fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailData) })
    }

    // Utility functions
    formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Filter and search functions
    filterOrders() {
        const statusFilter = document.getElementById('statusFilter').value;
        // Implementation would filter the orders table
        console.log('Filtering orders by status:', statusFilter);
    }

    searchOrders() {
        const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
        // Implementation would search through orders
        console.log('Searching orders:', searchTerm);
    }

    // Settings functions
    saveSettings() {
        const companyName = document.getElementById('companyName').value;
        const adminEmail = document.getElementById('adminEmail').value;
        const defaultTurnaround = document.getElementById('defaultTurnaround').value;
        const autoAssign = document.getElementById('autoAssign').value;

        // Save to localStorage (in production, would save to backend)
        localStorage.setItem('adminSettings', JSON.stringify({
            companyName,
            adminEmail,
            defaultTurnaround,
            autoAssign
        }));

        this.showNotification('Settings saved successfully!', 'success');
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            document.getElementById('companyName').value = 'JD Legal Transcripts';
            document.getElementById('adminEmail').value = 'admin@jdlegaltranscripts.com';
            document.getElementById('defaultTurnaround').value = '24';
            document.getElementById('autoAssign').value = 'true';
            
            this.showNotification('Settings reset to default!', 'success');
        }
    }

    // Mobile functions
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-show');
    }

    // Refresh data
    refreshData() {
        // In production, this would fetch fresh data from the API
        this.renderDashboard();
        console.log('Data refreshed');
    }

    refreshOrders() {
        this.renderOrders();
        this.showNotification('Orders refreshed!', 'success');
    }

    // Notifications
    showNotifications() {
        alert('Notifications:\n\n• 3 new orders pending assignment\n• 2 orders due today\n• 1 transcriber completed training');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminLoginTime');
        window.location.href = 'admin-login.html';
    }
}

// Global functions for onclick handlers
function showSection(section) {
    dashboard.showSection(section);
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new AdminDashboard();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);