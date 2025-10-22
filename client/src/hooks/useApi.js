import { useState, useCallback } from 'react';
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Custom hook for API calls
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (config) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api(config);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, config = {}) => {
        return request({ method: 'GET', url, ...config });
    }, [request]);

    const post = useCallback((url, data, config = {}) => {
        return request({ method: 'POST', url, data, ...config });
    }, [request]);

    const put = useCallback((url, data, config = {}) => {
        return request({ method: 'PUT', url, data, ...config });
    }, [request]);

    const patch = useCallback((url, data, config = {}) => {
        return request({ method: 'PATCH', url, data, ...config });
    }, [request]);

    const del = useCallback((url, config = {}) => {
        return request({ method: 'DELETE', url, ...config });
    }, [request]);

    return {
        loading,
        error,
        request,
        get,
        post,
        put,
        patch,
        delete: del,
        clearError: () => setError(null)
    };
};

// Specific API hooks
export const useOrdersApi = () => {
    const api = useApi();

    const createOrder = useCallback(async (orderData) => {
        return await api.post('/orders', orderData);
    }, [api]);

    const getOrders = useCallback(async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/orders${queryString ? `?${queryString}` : ''}`);
    }, [api]);

    const getOrder = useCallback(async (id) => {
        return await api.get(`/orders/${id}`);
    }, [api]);

    const updateOrder = useCallback(async (id, data) => {
        return await api.patch(`/orders/${id}`, data);
    }, [api]);

    const deleteOrder = useCallback(async (id) => {
        return await api.delete(`/orders/${id}`);
    }, [api]);

    const uploadFiles = useCallback(async (orderId, files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        
        return await api.post(`/orders/${orderId}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }, [api]);

    return {
        ...api,
        createOrder,
        getOrders,
        getOrder,
        updateOrder,
        deleteOrder,
        uploadFiles
    };
};

export const useAuthApi = () => {
    const api = useApi();

    const login = useCallback(async (credentials) => {
        const result = await api.post('/auth/login', credentials);
        if (result.success && result.data.data?.token) {
            localStorage.setItem('token', result.data.data.token);
        }
        return result;
    }, [api]);

    const logout = useCallback(async () => {
        const result = await api.post('/auth/logout');
        localStorage.removeItem('token');
        return result;
    }, [api]);

    const verifyToken = useCallback(async () => {
        return await api.post('/auth/verify');
    }, [api]);

    const changePassword = useCallback(async (passwordData) => {
        return await api.post('/auth/change-password', passwordData);
    }, [api]);

    return {
        ...api,
        login,
        logout,
        verifyToken,
        changePassword
    };
};

export const useAdminApi = () => {
    const api = useApi();

    const getDashboard = useCallback(async () => {
        return await api.get('/admin/dashboard');
    }, [api]);

    const getAdminOrders = useCallback(async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/admin/orders${queryString ? `?${queryString}` : ''}`);
    }, [api]);

    const updateAdminOrder = useCallback(async (id, data) => {
        return await api.patch(`/admin/orders/${id}`, data);
    }, [api]);

    const assignOrder = useCallback(async (id, assignmentData) => {
        return await api.post(`/admin/orders/${id}/assign`, assignmentData);
    }, [api]);

    const getUsers = useCallback(async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await api.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
    }, [api]);

    const getAnalytics = useCallback(async (period = '30d') => {
        return await api.get(`/admin/analytics?period=${period}`);
    }, [api]);

    return {
        ...api,
        getDashboard,
        getAdminOrders,
        updateAdminOrder,
        assignOrder,
        getUsers,
        getAnalytics
    };
};

export default api;