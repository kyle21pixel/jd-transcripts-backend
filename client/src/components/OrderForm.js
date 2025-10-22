import React, { useState } from 'react';
import serverAPI from '../api/server';
import FileUpload from './FileUpload';

const OrderForm = ({ onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: '',
    turnaround: '',
    estimatedCost: '',
    instructions: '',
    company: '',
    projectName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate estimated cost when service type or turnaround changes
    if (name === 'serviceType' || name === 'turnaround') {
      calculateCost(name === 'serviceType' ? value : formData.serviceType, 
                   name === 'turnaround' ? value : formData.turnaround);
    }
  };

  const calculateCost = (serviceType, turnaround) => {
    if (!serviceType || !turnaround) return;

    let baseRate = 1.25; // Default rate
    
    switch(serviceType) {
      case 'legal': baseRate = 1.50; break;
      case 'medical': baseRate = 1.75; break;
      case 'business': baseRate = 1.25; break;
      case 'academic': baseRate = 1.25; break;
    }
    
    let multiplier = 1;
    switch(turnaround) {
      case 'same-day': multiplier = 1.5; break;
      case '24h': multiplier = 1.25; break;
      case '48h': multiplier = 1.1; break;
      case 'standard': multiplier = 1; break;
    }
    
    const finalRate = (baseRate * multiplier).toFixed(2);
    setFormData(prev => ({
      ...prev,
      estimatedCost: finalRate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await serverAPI.createOrder(formData);
      setSuccess(`Order submitted successfully! Order ID: ${result.orderNumber}`);
      
      // Reset form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceType: '',
        turnaround: '',
        estimatedCost: '',
        instructions: '',
        company: '',
        projectName: ''
      });

      if (onOrderSubmit) {
        onOrderSubmit(result);
      }

    } catch (err) {
      setError(err.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-form-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">
            <i className="fas fa-clipboard-list me-2"></i>
            Place Your Order
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="clientName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="clientEmail" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="clientEmail"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="clientPhone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="company" className="form-label">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="serviceType" className="form-label">
                    Service Type <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select service</option>
                    <option value="legal">Legal Transcription</option>
                    <option value="medical">Medical Transcription</option>
                    <option value="business">Business Meetings</option>
                    <option value="academic">Academic & Research</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="turnaround" className="form-label">
                    Turnaround Time <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="turnaround"
                    name="turnaround"
                    value={formData.turnaround}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select turnaround</option>
                    <option value="same-day">Same Day (+50%)</option>
                    <option value="24h">24 Hours (+25%)</option>
                    <option value="48h">48 Hours (+10%)</option>
                    <option value="standard">3-5 Days (Standard)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="projectName" className="form-label">
                    Project Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Optional project identifier"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="estimatedCost" className="form-label">
                    Estimated Cost
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={formData.estimatedCost ? `$${formData.estimatedCost}/minute` : ''}
                    readOnly
                    placeholder="Select service and turnaround"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="instructions" className="form-label">
                Special Instructions
              </label>
              <textarea
                className="form-control"
                id="instructions"
                name="instructions"
                rows="4"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Any special requirements, speaker names, technical terms, etc..."
              />
            </div>

            {error && (
              <div className="alert alert-danger mb-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success mb-3">
                <i className="fas fa-check-circle me-2"></i>
                {success}
              </div>
            )}

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Submitting Order...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>
                    Submit Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;