// Authentication and User Management
const auth = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || '{}'),

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && this.token !== 'undefined' && this.token.length > 10;
    },

    // Validate token with backend
    async validateToken() {
        if (!this.token) return false;
        try {
            const response = await fetch('/api/auth/validate', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (!response.ok) throw new Error('Invalid token');
            const data = await response.json();
            return data.success;
        } catch {
            return false;
        }
    },

    // Initialize authentication state
    async init() {
        if (!this.isAuthenticated() || !(await this.validateToken())) {
            this.logout();
            return;
        }
        // Set up logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        // Set up API interceptor
        this.setupApiInterceptor();
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },

    // Setup API interceptor for authentication
    setupApiInterceptor() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            if (this.isAuthenticated()) {
                if (!args[1]) args[1] = {};
                if (!args[1].headers) args[1].headers = {};
                args[1].headers['Authorization'] = `Bearer ${this.token}`;
            }
            return originalFetch(...args);
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});