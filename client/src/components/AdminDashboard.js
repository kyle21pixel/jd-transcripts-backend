import React, { useState, useEffect } from 'react';
import serverAPI from '../api/server';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    activeTranscribers: 0,
    availableTranscribers: 0,
    todayOrders: 0,
    todayRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [transcribers, setTranscribers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [message, setMessage] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
      loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsResult = await serverAPI.getAdminStats();
      if (statsResult.success) {
        setStats(statsResult.stats || statsResult);
      }

      // Load orders
      const ordersResult = await serverAPI.getAdminOrders({ limit: 20 });
      if (ordersResult.success) {
        setOrders(ordersResult.orders || []);
      }

      // Load transcribers
      const transcribersResult = await serverAPI.getTranscribers();
      if (transcribersResult.success) {
        setTranscribers(transcribersResult.transcribers || []);
      }

      // Load users
      const usersResult = await serverAPI.getUsers();
      if (usersResult.success) {
        setUsers(usersResult.users || []);
      }

      // Load recent activities
      const activitiesResult = await serverAPI.getActivity(10);
      if (activitiesResult.success) {
        setActivities(activitiesResult.activities || []);
      }

    } catch (error) {
      setMessage(`Error loading dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId, transcriberId, notes = '') => {
    try {
      const result = await serverAPI.assignOrder(orderId, transcriberId, notes);
      if (result.success) {
        setMessage('Order assigned successfully!');
        loadDashboardData(); // Refresh data
        setShowAssignModal(false);
        setSelectedOrder(null);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error assigning order: ${error.message}`);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      let result;
      switch (action) {
        case 'approve':
          result = await serverAPI.approveUser(userId);
          break;
        case 'suspend':
          result = await serverAPI.suspendUser(userId);
          break;
        case 'delete':
          result = await serverAPI.deleteUser(userId);
          break;
        default:
          return;
      }

      if (result.success) {
        setMessage(`User ${action}d successfully!`);
        loadDashboardData(); // Refresh data
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`Error performing action: ${error.message}`);
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-warning',
      'assigned': 'bg-info',
      'in_progress': 'bg-primary',
      'completed': 'bg-success',
      'cancelled': 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': 'fas fa-clock',
      'assigned': 'fas fa-user-check',
      'in_progress': 'fas fa-spinner',
      'completed': 'fas fa-check-circle',
      'cancelled': 'fas fa-times-circle'
    };
    
    return icons[status] || 'fas fa-question-circle';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
          </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">
            <i className="fas fa-tachometer-alt me-2"></i>
            Admin Dashboard
          </h1>
          <button className="btn btn-outline-primary" onClick={loadDashboardData}>
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>

        {/* Message */}
      {message && (
          <div className="alert alert-info alert-dismissible fade show" role="alert">
            <i className="fas fa-info-circle me-2"></i>
          {message}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage('')}
            ></button>
        </div>
      )}

        {/* Navigation Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
        <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
              <i className="fas fa-chart-pie me-2"></i>
          Dashboard
        </button>
          </li>
          <li className="nav-item">
        <button 
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
              <i className="fas fa-clipboard-list me-2"></i>
          Orders
        </button>
          </li>
          <li className="nav-item">
        <button 
              className={`nav-link ${activeTab === 'transcribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcribers')}
        >
              <i className="fas fa-users me-2"></i>
          Transcribers
        </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-user-cog me-2"></i>
              User Management
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <i className="fas fa-history me-2"></i>
              Activity
            </button>
          </li>
        </ul>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="row">
            {/* Stats Cards */}
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Total Orders
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.totalOrders}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                        Completed Orders
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.completedOrders}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Active Transcribers
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {stats.activeTranscribers}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-users fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                        Total Revenue
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        ${stats.totalRevenue?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Order Status Overview</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3 text-center">
                      <div className="mb-2">
                        <i className="fas fa-clock fa-2x text-warning"></i>
                      </div>
                      <h4 className="text-warning">{stats.pendingOrders}</h4>
                      <p className="text-muted">Pending</p>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="mb-2">
                        <i className="fas fa-spinner fa-2x text-primary"></i>
                      </div>
                      <h4 className="text-primary">{stats.inProgressOrders}</h4>
                      <p className="text-muted">In Progress</p>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="mb-2">
                        <i className="fas fa-check-circle fa-2x text-success"></i>
                      </div>
                      <h4 className="text-success">{stats.completedOrders}</h4>
                      <p className="text-muted">Completed</p>
                    </div>
                    <div className="col-md-3 text-center">
                      <div className="mb-2">
                        <i className="fas fa-calendar-day fa-2x text-info"></i>
                      </div>
                      <h4 className="text-info">{stats.todayOrders}</h4>
                      <p className="text-muted">Today</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>

            <div className="col-lg-4 mb-4">
              <div className="card shadow">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
              </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={() => setActiveTab('orders')}>
                      <i className="fas fa-plus me-2"></i>
                      Manage Orders
                    </button>
                    <button className="btn btn-success" onClick={() => setActiveTab('transcribers')}>
                      <i className="fas fa-user-plus me-2"></i>
                      Manage Transcribers
                    </button>
                    <button className="btn btn-info" onClick={() => setActiveTab('users')}>
                      <i className="fas fa-users-cog me-2"></i>
                      User Management
                    </button>
                    <button className="btn btn-warning" onClick={() => setActiveTab('activity')}>
                      <i className="fas fa-history me-2"></i>
                      View Activity
                    </button>
              </div>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Order Management</h6>
              </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Client</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>{order.client_name}</td>
                        <td>{order.service_type}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>${order.estimated_cost}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowAssignModal(true);
                            }}
                            disabled={order.status === 'completed'}
                          >
                            <i className="fas fa-user-check me-1"></i>
                            Assign
                          </button>
                          <button className="btn btn-sm btn-info">
                            <i className="fas fa-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transcribers Tab */}
        {activeTab === 'transcribers' && (
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Transcriber Management</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Specializations</th>
                      <th>Availability</th>
                      <th>Hourly Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcribers.map(transcriber => (
                      <tr key={transcriber.id}>
                        <td>{transcriber.name}</td>
                        <td>{transcriber.email}</td>
                        <td>{Array.isArray(transcriber.specialization) ? transcriber.specialization.join(', ') : transcriber.specialization}</td>
                        <td>
                          <span className={`badge ${transcriber.availability === 'available' ? 'bg-success' : 'bg-warning'}`}>
                            {transcriber.availability}
                          </span>
                        </td>
                        <td>${transcriber.hourly_rate}</td>
                        <td>
                          <button className="btn btn-sm btn-info me-2">
                            <i className="fas fa-eye me-1"></i>
                            View
                          </button>
                          <button className="btn btn-sm btn-warning">
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">User Management</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.is_active ? 'bg-success' : 'bg-warning'}`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          {!user.is_active && (
                            <button 
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleUserAction(user.id, 'approve')}
                            >
                              <i className="fas fa-check me-1"></i>
                              Approve
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <i className="fas fa-pause me-1"></i>
                            Suspend
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                handleUserAction(user.id, 'delete');
                              }
                            }}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Activity</h6>
            </div>
            <div className="card-body">
              <div className="timeline">
                {activities.map((activity, index) => (
                  <div key={activity.id || index} className="timeline-item">
                    <div className="timeline-marker">
                      <i className="fas fa-circle"></i>
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">{activity.action}</h6>
                      <p className="timeline-text">{activity.description || activity.notes}</p>
                      <small className="text-muted">
                        {formatDate(activity.created_at)} by {activity.user_name || activity.performed_by}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </div>
            )}

        {/* Assign Order Modal */}
        {showAssignModal && selectedOrder && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Assign Order #{selectedOrder.order_number}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedOrder(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Select Transcriber</label>
                    <select className="form-select" id="transcriberSelect">
                      <option value="">Choose a transcriber...</option>
                      {transcribers.filter(t => t.availability === 'available').map(transcriber => (
                        <option key={transcriber.id} value={transcriber.id}>
                          {transcriber.name} - {Array.isArray(transcriber.specialization) ? transcriber.specialization.join(', ') : transcriber.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Add any special instructions or notes..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      const transcriberId = document.getElementById('transcriberSelect').value;
                      const notes = document.querySelector('textarea').value;
                      if (transcriberId) {
                        handleAssignOrder(selectedOrder.id, transcriberId, notes);
                      }
                    }}
                  >
                    Assign Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;