// WordPress API Configuration and Helper Functions
// This file handles all communication between your React frontend and WordPress backend

class WordPressAPI {
  constructor() {
    // Development URL (local WordPress)
    this.baseURL = process.env.REACT_APP_WP_API_URL || 'http://localhost/jd-backend/wp-json/jd-api/v1';
    
    // For production, set REACT_APP_WP_API_URL in your Netlify environment variables
    // Example: https://yourdomain.com/wp-json/jd-api/v1
    
    this.token = localStorage.getItem('adminToken');
  }

  // Helper method to get headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Orders API
  async createOrder(orderData) {
    try {
      const response = await fetch(`${this.baseURL}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await fetch(`${this.baseURL}/orders`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Admin API
  async adminLogin(username, password) {
    try {
      const response = await fetch(`${this.baseURL}/admin/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ username, password })
      });
      const result = await this.handleResponse(response);
      
      if (result.success && result.token) {
        this.token = result.token;
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', result.user.username);
        localStorage.setItem('adminRole', result.user.role);
        localStorage.setItem('adminLoginTime', new Date().toISOString());
      }
      
      return result;
    } catch (error) {
      console.error('Error during admin login:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/admin/dashboard`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getAdminOrders() {
    try {
      const response = await fetch(`${this.baseURL}/admin/orders`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  }

  // Transcribers API
  async getTranscribers(params = {}) {
    try {
      const url = new URL(`${this.baseURL}/transcribers`);
      
      // Add query parameters if provided
      if (params.specialization && params.specialization !== 'all') {
        url.searchParams.set('specialization', params.specialization);
      }
      if (params.availability && params.availability !== 'all') {
        url.searchParams.set('availability', params.availability);
      }
      if (params.search) {
        url.searchParams.set('search', params.search);
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transcribers:', error);
      throw error;
    }
  }

  async createTranscriber(transcriberData) {
    try {
      const response = await fetch(`${this.baseURL}/transcribers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(transcriberData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating transcriber:', error);
      throw error;
    }
  }

  async clearAllTranscribers() {
    try {
      const response = await fetch(`${this.baseURL}/transcribers/clear`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error clearing transcribers:', error);
      throw error;
    }
  }

  // Utility methods
  logout() {
    this.token = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminLoginTime');
  }

  isLoggedIn() {
    return !!this.token && localStorage.getItem('adminLoggedIn') === 'true';
  }

  getAdminInfo() {
    return {
      username: localStorage.getItem('adminUsername'),
      role: localStorage.getItem('adminRole'),
      loginTime: localStorage.getItem('adminLoginTime')
    };
  }
}

// Create and export a singleton instance
const wordpressAPI = new WordPressAPI();
export default wordpressAPI;

// Export the class for custom instances if needed
export { WordPressAPI };

// Example usage in React components:
/*
import wordpressAPI from './api/wordpress';

// In your component:
const handleCreateOrder = async (orderData) => {
  try {
    const result = await wordpressAPI.createOrder(orderData);
    console.log('Order created:', result);
  } catch (error) {
    console.error('Failed to create order:', error);
  }
};

const handleAdminLogin = async (username, password) => {
  try {
    const result = await wordpressAPI.adminLogin(username, password);
    if (result.success) {
      // Redirect to admin dashboard
      navigate('/admin');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
*/