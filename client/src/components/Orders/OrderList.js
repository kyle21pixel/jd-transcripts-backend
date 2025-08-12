import React, { useState } from 'react';
import { useOrders } from '../../hooks/useSupabase';
import { useAuthContext } from '../Auth/AuthProvider';

const OrderList = () => {
    const { user } = useAuthContext();
    const { orders, loading, error, updateOrder, deleteOrder } = useOrders(user?.id);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in_progress': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        const result = await updateOrder(orderId, { 
            status: newStatus,
            updated_at: new Date().toISOString()
        });
        
        if (!result.success) {
            alert('Failed to update order status: ' + result.error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            const result = await deleteOrder(orderId);
            if (!result.success) {
                alert('Failed to delete order: ' + result.error);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error loading orders: {error}</p>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="empty-state">
                <h3>No Orders Found</h3>
                <p>You haven't created any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="order-list">
            <h2>Your Orders</h2>
            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <div className="order-id">
                                Order #{order.id.slice(-8)}
                            </div>
                            <div 
                                className="order-status"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                                {order.status.replace('_', ' ').toUpperCase()}
                            </div>
                        </div>

                        <div className="order-details">
                            <div className="detail-row">
                                <span className="label">Service:</span>
                                <span className="value">{order.service_type}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Turnaround:</span>
                                <span className="value">{order.turnaround} hours</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Created:</span>
                                <span className="value">{formatDate(order.created_at)}</span>
                            </div>
                            {order.files && order.files.length > 0 && (
                                <div className="detail-row">
                                    <span className="label">Files:</span>
                                    <span className="value">{order.files.length} file(s)</span>
                                </div>
                            )}
                        </div>

                        {order.special_instructions && (
                            <div className="order-instructions">
                                <strong>Instructions:</strong>
                                <p>{order.special_instructions}</p>
                            </div>
                        )}

                        <div className="order-actions">
                            <button
                                onClick={() => setSelectedOrder(order)}
                                className="btn btn-outline btn-sm"
                            >
                                View Details
                            </button>
                            
                            {order.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Start Processing
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order Details</h3>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="order-detail-grid">
                                <div className="detail-item">
                                    <label>Order ID:</label>
                                    <span>{selectedOrder.id}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <span 
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                                    >
                                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Service Type:</label>
                                    <span>{selectedOrder.service_type}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Turnaround:</label>
                                    <span>{selectedOrder.turnaround} hours</span>
                                </div>
                                <div className="detail-item">
                                    <label>Contact Name:</label>
                                    <span>{selectedOrder.contact_name}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Contact Email:</label>
                                    <span>{selectedOrder.contact_email}</span>
                                </div>
                                {selectedOrder.contact_phone && (
                                    <div className="detail-item">
                                        <label>Contact Phone:</label>
                                        <span>{selectedOrder.contact_phone}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <label>Created:</label>
                                    <span>{formatDate(selectedOrder.created_at)}</span>
                                </div>
                                {selectedOrder.updated_at && (
                                    <div className="detail-item">
                                        <label>Last Updated:</label>
                                        <span>{formatDate(selectedOrder.updated_at)}</span>
                                    </div>
                                )}
                            </div>

                            {selectedOrder.special_instructions && (
                                <div className="instructions-section">
                                    <label>Special Instructions:</label>
                                    <p>{selectedOrder.special_instructions}</p>
                                </div>
                            )}

                            {selectedOrder.files && selectedOrder.files.length > 0 && (
                                <div className="files-section">
                                    <label>Uploaded Files:</label>
                                    <ul className="file-list">
                                        {selectedOrder.files.map((file, index) => (
                                            <li key={index} className="file-item">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">
                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </span>
                                                {file.url && (
                                                    <a 
                                                        href={file.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="file-link"
                                                    >
                                                        Download
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;