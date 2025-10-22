import React, { useState, useEffect } from 'react';
import { serverAPI } from '../../api/server';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        serviceType: '',
        clientEmail: '',
        page: 1,
        limit: 20
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateData, setUpdateData] = useState({});
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        loadOrders();
    }, [filters]);

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await serverAPI.getAdminOrders(filters);
            setOrders(result.orders || []);
            setPagination(result.pagination || {
                total: 0,
                page: 1,
                limit: 20,
                pages: 1
            });
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Failed to load orders: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleOrderUpdate = async (orderId, data) => {
        try {
            await serverAPI.updateOrder(orderId, data);
            await loadOrders(); // Refresh the list
            setSelectedOrder(null);
            setUpdateData({});
            alert('Order updated successfully');
        } catch (error) {
            alert('Error updating order: ' + error.message);
        }
    };

    const handleAssignOrder = async (orderId, transcriberId) => {
        try {
            await serverAPI.assignOrder(orderId, transcriberId);
            await loadOrders(); // Refresh the list
            alert('Order assigned successfully');
        } catch (error) {
            alert('Error assigning order: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'in-progress': return '#3b82f6';
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

    if (loading && orders.length === 0) {
        return (
            <div className="order-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-management">
            <div className="management-header">
                <h2>Order Management</h2>
                <button onClick={loadOrders} className="btn btn-outline btn-sm">
                    <i className="fas fa-sync-alt"></i> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Status:</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Service Type:</label>
                        <select
                            value={filters.serviceType}
                            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                        >
                            <option value="">All Services</option>
                            <option value="Legal Transcription">Legal Transcription</option>
                            <option value="Medical Transcription">Medical Transcription</option>
                            <option value="Business Meetings">Business Meetings</option>
                            <option value="Academic & Research">Academic & Research</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Client Email:</label>
                        <input
                            type="text"
                            value={filters.clientEmail}
                            onChange={(e) => handleFilterChange('clientEmail', e.target.value)}
                            placeholder="Search by email..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Orders Table */}
            <div className="orders-table-container">
                {orders.length > 0 ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Client</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Due Date</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId || order._id}>
                                    <td>#{order.orderId}</td>
                                    <td>
                                        <div className="client-info">
                                            <div className="client-name">{order.clientName}</div>
                                            <div className="client-email">{order.clientEmail}</div>
                                        </div>
                                    </td>
                                    <td>{order.serviceType}</td>
                                    <td>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        {order.dueDate ? formatDate(order.dueDate) : 'N/A'}
                                        {order.isOverdue && order.isOverdue() && (
                                            <span className="overdue-badge">OVERDUE</span>
                                        )}
                                    </td>
                                    <td>{order.assignedTranscriberName || 'Unassigned'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="btn btn-sm btn-outline"
                                            >
                                                Manage
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No orders found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="btn btn-outline btn-sm"
                    >
                        Previous
                    </button>
                    
                    <span className="pagination-info">
                        Page {pagination.page} of {pagination.pages} 
                        ({pagination.total} total orders)
                    </span>
                    
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="btn btn-outline btn-sm"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Order Management Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Manage Order #{selectedOrder.orderId}</h3>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Order Details */}
                            <div className="order-details-section">
                                <h4>Order Details</h4>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <label>Client:</label>
                                        <span>{selectedOrder.clientName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Email:</label>
                                        <span>{selectedOrder.clientEmail}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Phone:</label>
                                        <span>{selectedOrder.clientPhone || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Service:</label>
                                        <span>{selectedOrder.serviceType}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Turnaround:</label>
                                        <span>{selectedOrder.turnaround}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Estimated Cost:</label>
                                        <span>{selectedOrder.estimatedCost}</span>
                                    </div>
                                </div>

                                {selectedOrder.instructions && (
                                    <div className="instructions-section">
                                        <label>Instructions:</label>
                                        <p>{selectedOrder.instructions}</p>
                                    </div>
                                )}

                                {selectedOrder.audioFiles && selectedOrder.audioFiles.length > 0 && (
                                    <div className="files-section">
                                        <label>Audio Files:</label>
                                        <ul>
                                            {selectedOrder.audioFiles.map((file, index) => (
                                                <li key={index}>
                                                    {file.originalName} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Update Form */}
                            <div className="order-update-section">
                                <h4>Update Order</h4>
                                <div className="update-form">
                                    <div className="form-group">
                                        <label>Status:</label>
                                        <select 
                                            value={updateData.status || selectedOrder.status}
                                            onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Assign to Transcriber:</label>
                                        <input
                                            type="text"
                                            value={updateData.assignedTranscriberName || selectedOrder.assignedTranscriberName || ''}
                                            onChange={(e) => setUpdateData({...updateData, assignedTranscriberName: e.target.value})}
                                            placeholder="Enter transcriber name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Actual Cost:</label>
                                        <input
                                            type="number"
                                            value={updateData.actualCost || selectedOrder.actualCost || ''}
                                            onChange={(e) => setUpdateData({...updateData, actualCost: parseFloat(e.target.value)})}
                                            placeholder="Enter actual cost"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Admin Notes:</label>
                                        <textarea
                                            value={updateData.adminNotes || ''}
                                            onChange={(e) => setUpdateData({...updateData, adminNotes: e.target.value})}
                                            placeholder="Add notes about this update..."
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                                <div className="timeline-section">
                                    <h4>Order Timeline</h4>
                                    <div className="timeline">
                                        {selectedOrder.timeline.map((entry, index) => (
                                            <div key={index} className="timeline-entry">
                                                <div className="timeline-date">
                                                    {formatDate(entry.timestamp)}
                                                </div>
                                                <div className="timeline-content">
                                                    <strong>{entry.action}</strong>
                                                    <br />
                                                    <small>by {entry.performedBy}</small>
                                                    {entry.notes && <p>{entry.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button 
                                onClick={() => handleOrderUpdate(selectedOrder.orderId || selectedOrder._id, updateData)}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Order'}
                            </button>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;