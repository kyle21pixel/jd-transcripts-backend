import React, { useState } from 'react';
import serverAPI from '../api/server';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    
    try {
      // Try to fetch order by ID first
      const result = await serverAPI.getOrder(orderId);
      
      if (result.success) {
        setOrder(result.order);
      } else {
        setError(result.message || 'Order not found');
      }
    } catch (err) {
      setError('Could not fetch order. Please check your order ID and try again.');
    } finally {
      setLoading(false);
    }
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
      <span className={`badge ${statusClasses[status] || 'bg-secondary'} fs-6`}>
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (status) => {
    const progressMap = {
      'pending': 20,
      'assigned': 40,
      'in_progress': 70,
      'completed': 100,
      'cancelled': 0
    };
    return progressMap[status] || 0;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-5 text-primary mb-3">
              <i className="fas fa-search me-3"></i>
              Track Your Order
            </h1>
            <p className="lead text-muted">
              Enter your order ID to check the status and progress of your transcription order.
            </p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="orderId" className="form-label">
                        <i className="fas fa-hashtag me-2"></i>
                        Order ID
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="orderId"
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                        placeholder="Enter your order ID (e.g., ORD-20241201-001)"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
        <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope me-2"></i>
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Your email address"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-lg" 
                    type="submit" 
                    disabled={loading || !orderId.trim()}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Tracking...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        Track Order
                      </>
                    )}
                  </button>
        </div>
      </form>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

      {order && (
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <i className="fas fa-file-alt me-2"></i>
                    Order #{order.order_number}
                  </h4>
                  {getStatusBadge(order.status)}
                </div>
              </div>
          <div className="card-body">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Order Progress</span>
                    <span className="text-muted">{calculateProgress(order.status)}% Complete</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: `${calculateProgress(order.status)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Order Information
                    </h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Client Name:</strong></td>
                          <td>{order.client_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Service Type:</strong></td>
                          <td>{order.service_type}</td>
                        </tr>
                        <tr>
                          <td><strong>Turnaround:</strong></td>
                          <td>{order.turnaround}</td>
                        </tr>
                        <tr>
                          <td><strong>Estimated Cost:</strong></td>
                          <td>${order.estimated_cost}/minute</td>
                        </tr>
                        <tr>
                          <td><strong>Created:</strong></td>
                          <td>{formatDate(order.created_at)}</td>
                        </tr>
                        <tr>
                          <td><strong>Due Date:</strong></td>
                          <td>{formatDate(order.due_date)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-user me-2"></i>
                      Assignment Details
                    </h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <i className={`${getStatusIcon(order.status)} me-2`}></i>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </td>
                        </tr>
                        {order.assigned_transcriber_name && (
                          <tr>
                            <td><strong>Transcriber:</strong></td>
                            <td>{order.assigned_transcriber_name}</td>
                          </tr>
                        )}
                        {order.completed_date && (
                          <tr>
                            <td><strong>Completed:</strong></td>
                            <td>{formatDate(order.completed_date)}</td>
                          </tr>
                        )}
                        {order.actual_cost && (
                          <tr>
                            <td><strong>Final Cost:</strong></td>
                            <td>${order.actual_cost}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Special Instructions */}
                {order.instructions && (
                  <div className="mt-4">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-sticky-note me-2"></i>
                      Special Instructions
                    </h5>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      {order.instructions}
                    </div>
                  </div>
                )}

                {/* File Information */}
                {(order.audio_file_path || order.transcript_file_path) && (
                  <div className="mt-4">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-paperclip me-2"></i>
                      Files
                    </h5>
                    <div className="row">
                      {order.audio_file_path && (
                        <div className="col-md-6">
                          <div className="card border-success">
                            <div className="card-body text-center">
                              <i className="fas fa-microphone fa-2x text-success mb-2"></i>
                              <h6>Audio File</h6>
                              <small className="text-muted">Original recording</small>
                            </div>
                          </div>
                        </div>
                      )}
                      {order.transcript_file_path && (
                        <div className="col-md-6">
                          <div className="card border-primary">
                            <div className="card-body text-center">
                              <i className="fas fa-file-alt fa-2x text-primary mb-2"></i>
                              <h6>Transcript</h6>
                              <small className="text-muted">Completed transcription</small>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Timeline */}
                {order.timeline && order.timeline.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-history me-2"></i>
                      Order Timeline
                    </h5>
                    <div className="timeline">
                      {order.timeline.map((entry, index) => (
                        <div key={entry.id || index} className="timeline-item">
                          <div className="timeline-marker">
                            <i className="fas fa-circle"></i>
                          </div>
                          <div className="timeline-content">
                            <h6 className="timeline-title">{entry.action}</h6>
                            <p className="timeline-text">{entry.notes}</p>
                            <small className="text-muted">
                              {formatDate(entry.created_at)} by {entry.performed_by}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="text-primary mb-2">
                    <i className="fas fa-headset me-2"></i>
                    Need Help?
                  </h6>
                  <p className="mb-2">
                    If you have any questions about your order, please contact us:
                  </p>
                  <div className="row">
                    <div className="col-md-6">
                      <small>
                        <i className="fas fa-envelope me-2"></i>
                        info@jdreporting.org
                      </small>
                    </div>
                    <div className="col-md-6">
                      <small>
                        <i className="fas fa-phone me-2"></i>
                        +254 746 546 205
                      </small>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
