import React, { useState, useEffect } from 'react';
import { serverAPI } from '../../api/server';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        role: '',
        isActive: '',
        page: 1,
        limit: 20
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'user',
        isActive: true
    });
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        loadUsers();
    }, [filters]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await serverAPI.getUsers(filters);
            setUsers(result.users || []);
            setPagination(result.pagination || {
                total: 0,
                page: 1,
                limit: 20,
                pages: 1
            });
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Failed to load users: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleCreateUser = async (userData) => {
        try {
            // This would need to be implemented in the API
            console.log('Creating user:', userData);
            alert('User creation functionality needs to be implemented in the backend');
            setShowNewUserForm(false);
            setNewUser({
                name: '',
                email: '',
                role: 'user',
                isActive: true
            });
        } catch (error) {
            alert('Error creating user');
        }
    };

    const handleUpdateUser = async (userId, updateData) => {
        try {
            // This would need to be implemented in the API
            console.log('Updating user:', userId, updateData);
            alert('User update functionality needs to be implemented in the backend');
            setSelectedUser(null);
        } catch (error) {
            alert('Error updating user');
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

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return '#dc2626';
            case 'manager': return '#2563eb';
            case 'supervisor': return '#7c3aed';
            case 'user': return '#059669';
            default: return '#6b7280';
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="user-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management">
            <div className="management-header">
                <h2>User Management</h2>
                <div className="header-actions">
                    <button 
                        onClick={() => setShowNewUserForm(true)}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fas fa-plus"></i> Add User
                    </button>
                    <button onClick={loadUsers} className="btn btn-outline btn-sm">
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label>Role:</label>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status:</label>
                        <select
                            value={filters.isActive}
                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                        >
                            <option value="">All Users</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="users-table-container">
                {users.length > 0 ? (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Login</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-name">{user.name}</div>
                                            {user.username && (
                                                <div className="user-username">@{user.username}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span 
                                            className="role-badge"
                                            style={{ backgroundColor: getRoleBadgeColor(user.role) }}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="btn btn-sm btn-outline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No users found matching your criteria.</p>
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
                        ({pagination.total} total users)
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

            {/* New User Modal */}
            {showNewUserForm && (
                <div className="modal-overlay" onClick={() => setShowNewUserForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New User</h3>
                            <button 
                                onClick={() => setShowNewUserForm(false)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateUser(newUser);
                            }}>
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Role:</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                    >
                                        <option value="user">User</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newUser.isActive}
                                            onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                                        />
                                        Active User
                                    </label>
                                </div>

                                <div className="modal-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Create User
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewUserForm(false)}
                                        className="btn btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit User: {selectedUser.name}</h3>
                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="modal-close"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="user-details">
                                <div className="detail-item">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.name}
                                        id="edit-name"
                                    />
                                </div>

                                <div className="detail-item">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        defaultValue={selectedUser.email}
                                        id="edit-email"
                                    />
                                </div>

                                <div className="detail-item">
                                    <label>Role:</label>
                                    <select defaultValue={selectedUser.role} id="edit-role">
                                        <option value="user">User</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="manager">Manager</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="detail-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            defaultChecked={selectedUser.isActive}
                                            id="edit-active"
                                        />
                                        Active User
                                    </label>
                                </div>

                                <div className="user-stats">
                                    <p><strong>Created:</strong> {formatDate(selectedUser.createdAt)}</p>
                                    <p><strong>Last Login:</strong> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</p>
                                    <p><strong>User ID:</strong> {selectedUser._id}</p>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    onClick={() => {
                                        const updateData = {
                                            name: document.getElementById('edit-name').value,
                                            email: document.getElementById('edit-email').value,
                                            role: document.getElementById('edit-role').value,
                                            isActive: document.getElementById('edit-active').checked
                                        };
                                        handleUpdateUser(selectedUser._id, updateData);
                                    }}
                                    className="btn btn-primary"
                                >
                                    Update User
                                </button>
                                <button 
                                    onClick={() => setSelectedUser(null)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;