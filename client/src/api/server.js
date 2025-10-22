// Server API helper for React client to communicate with Node/Express backend
// Uses JWT stored in localStorage under key 'token'

import config from '../config';
const BASE_URL = config.API_URL;

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handle(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data.message || data.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export const serverAPI = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await handle(res);
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },
  logout() {
    localStorage.removeItem('token');
  },
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },

  // Admin dashboard
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async getAdminOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/admin/orders${query ? `?${query}` : ''}`, {
      headers: getHeaders()
    });
    return handle(res);
  },
  
  async getTranscribers() {
    const res = await fetch(`${BASE_URL}/api/transcribers`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async assignOrder(orderId, transcriber_id, notes = '') {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ transcriber_id, notes })
    });
    return handle(res);
  },

  async listNotifications(only_unread = false, limit = 50) {
    const res = await fetch(`${BASE_URL}/api/notifications?only_unread=${only_unread}&limit=${limit}`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async markNotificationRead(id) {
    const res = await fetch(`${BASE_URL}/api/notifications/${id}/read`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handle(res);
  },

  async requestPasswordReset(email) {
    const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return handle(res);
  },

  async resetPassword(token, password) {
    const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ token, password })
    });
    return handle(res);
  },

  async createOrder(data) {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handle(res);
  },

  // Transcriber specific endpoints
  async getTranscriberAssignments() {
    const res = await fetch(`${BASE_URL}/api/transcriptions/assigned`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async updateTranscriptionStatus(transcriptionId, status) {
    const res = await fetch(`${BASE_URL}/api/transcriptions/${transcriptionId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handle(res);
  },

  async submitTranscription(transcriptionId, content) {
    const res = await fetch(`${BASE_URL}/api/transcriptions/${transcriptionId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return handle(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async updateOrder(orderId, data) {
    const res = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handle(res);
  },

  // User management endpoints
  async getUsers(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/api/admin/users${query ? `?${query}` : ''}`, {
      headers: getHeaders()
    });
    return handle(res);
  },

  async createUser(userData) {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handle(res);
  },

  async updateUser(userId, userData) {
    const res = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handle(res);
  },

  getAdminInfo() {
    // Fallback to localStorage for admin info
    return {
      username: localStorage.getItem('adminUsername') || 'Admin',
      role: localStorage.getItem('adminRole') || 'admin'
    };
  }
};

export default serverAPI;