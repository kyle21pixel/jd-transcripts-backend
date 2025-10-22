// Dashboard functionality
class Dashboard {
    constructor() {
        this.recentOrdersTable = document.getElementById('recentOrders');
        this.initializeDashboard();
    }

    async initializeDashboard() {
        await this.loadRecentOrders();
        this.setupEventListeners();
    }

    async loadRecentOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            const orders = data.orders || [];
            this.displayOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Failed to load recent orders');
        }
    }

    displayOrders(orders) {
        const tbody = this.recentOrdersTable.querySelector('tbody');
        tbody.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.client_name}</td>
                <td>${order.service_type}</td>
                <td>${order.status}</td>
                <td>${order.created_at || ''}</td>
            `;
            tbody.appendChild(row);
        });
    }

    setupEventListeners() {
        // Add event listeners for dashboard actions if needed
    }

    showError(message) {
        alert(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recentOrders')) {
        new Dashboard();
    }
});