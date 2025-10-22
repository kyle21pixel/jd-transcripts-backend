/**
 * API Service for TranscribeHub
 * Handles all communication between frontend and backend
 */

class ApiService {
    constructor() {
        // Base API URL - can be configured based on environment
        this.baseUrl = '/api';
        this.token = localStorage.getItem('authToken') || null;
    }

    /**
     * Set authentication token for subsequent requests
     * @param {string} token - JWT token
     */
    setAuthToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    /**
     * Get authentication headers
     * @returns {Object} Headers object with authorization if token exists
     */
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    /**
     * Handle API response
     * @param {Response} response - Fetch API response
     * @returns {Promise} Promise resolving to response data or error
     */
    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                this.setAuthToken(null);
                // Redirect to login page
                window.location.href = '/new-login.html';
            }
            
            throw {
                status: response.status,
                message: data.message || 'An error occurred',
                errors: data.errors
            };
        }
        
        return data;
    }

    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} Promise resolving to response data
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    }

    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @returns {Promise} Promise resolving to response data
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    }

    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request payload
     * @returns {Promise} Promise resolving to response data
     */
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    }

    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise} Promise resolving to response data
     */
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }

    /**
     * Upload a file
     * @param {string} endpoint - API endpoint
     * @param {File} file - File to upload
     * @param {Object} additionalData - Additional form data
     * @returns {Promise} Promise resolving to response data
     */
    async uploadFile(endpoint, file, additionalData = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add any additional data to the form
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
            
            const headers = {};
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData
            });
            
            return this.handleResponse(response);
        } catch (error) {
            console.error('API Upload Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(email, password) {
        const data = await this.post('/auth/login', { email, password });
        if (data.token) {
            this.setAuthToken(data.token);
        }
        return data;
    }

    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async logout() {
        this.setAuthToken(null);
        return { success: true };
    }

    // User methods
    async getCurrentUser() {
        return this.get('/users/me');
    }

    async updateProfile(userData) {
        return this.put('/users/profile', userData);
    }

    // Order methods
    async getOrders(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.get(`/orders?${queryParams}`);
    }

    async getOrderById(orderId) {
        return this.get(`/orders/${orderId}`);
    }

    async createOrder(orderData) {
        return this.post('/orders', orderData);
    }

    async updateOrder(orderId, orderData) {
        return this.put(`/orders/${orderId}`, orderData);
    }

    async trackOrder(orderNumber, email) {
        return this.post('/orders/track', { orderNumber, email });
    }

    // Transcription methods
    async uploadAudioForTranscription(file, options = {}) {
        return this.uploadFile('/transcriptions', file, options);
    }

    async getTranscriptionStatus(transcriptionId) {
        return this.get(`/transcriptions/${transcriptionId}/status`);
    }

    async getTranscriptionResult(transcriptionId) {
        return this.get(`/transcriptions/${transcriptionId}/result`);
    }

    // Contact methods
    async submitContactForm(contactData) {
        return this.post('/contact', contactData);
    }
}

// Create a singleton instance
const apiService = new ApiService();

// Export the singleton
export default apiService;