import React, { useState } from 'react';
import serverAPI from '../../api/server';

const OrderForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        service_type: 'legal',
        turnaround: '24',
        special_instructions: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        company: '',
        project_name: ''
    });
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Call serverAPI.createOrder with normalized keys matching backend expectations
            const result = await serverAPI.createOrder({
                clientName: formData.contact_name,
                clientEmail: formData.contact_email,
                clientPhone: formData.contact_phone,
                serviceType: formData.service_type === 'legal' ? 'Legal Transcription' :
                           formData.service_type === 'medical' ? 'Medical Transcription' :
                           formData.service_type === 'business' ? 'Business Meetings' :
                           'Academic & Research',
                turnaround: formData.turnaround,
                estimatedCost: 150.00, // Default estimated cost
                instructions: formData.special_instructions,
                company: formData.company,
                projectName: formData.project_name
            });
            if (result.success) {
                setSuccess(true);
                setFormData({
                    service_type: 'legal',
                    turnaround: '24',
                    special_instructions: '',
                    contact_name: '',
                    contact_email: '',
                    contact_phone: '',
                    company: '',
                    project_name: ''
                });
                setFiles([]);
                if (onSuccess) onSuccess();
            } else {
                setError(result.error || 'Failed to submit order. Please try again.');
            }
        } catch (err) {
            setError('Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getServicePrice = (serviceType) => {
        const prices = {
            legal: '$2.50/min',
            medical: '$3.00/min',
            business: '$2.00/min'
        };
        return prices[serviceType] || '$2.50/min';
    };

    if (success) {
        return (
            <div className="order-success">
                <div className="success-icon">✅</div>
                <h2>Quote Request Submitted Successfully!</h2>
                <p>Thank you for your interest in our transcription services.</p>
                <p>We will review your request and contact you within 24 hours with a detailed quote.</p>
                <div className="success-details">
                    <h3>What happens next?</h3>
                    <ul>
                        <li>Our team will review your requirements</li>
                        <li>We'll prepare a detailed quote based on your files and specifications</li>
                        <li>You'll receive an email with pricing and timeline</li>
                        <li>Once approved, we'll begin your transcription project</li>
                    </ul>
                </div>
                <button 
                    onClick={() => setSuccess(false)} 
                    className="btn btn-primary"
                >
                    Submit Another Request
                </button>
            </div>
        );
    }

    return (
        <div className="order-form-container">
            <div className="order-form-header">
                <h1>Request a Quote</h1>
                <p>Get a personalized quote for your transcription project</p>
            </div>

            {error && (
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="order-form">
                <div className="form-section">
                    <h3>Project Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="project_name">Project Name</label>
                            <input
                                type="text"
                                id="project_name"
                                name="project_name"
                                value={formData.project_name}
                                onChange={handleChange}
                                placeholder="e.g., Deposition - Smith vs. Jones"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="service_type">Service Type *</label>
                            <select
                                id="service_type"
                                name="service_type"
                                value={formData.service_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="legal">Legal Transcription</option>
                                <option value="medical">Medical Transcription</option>
                                <option value="business">Business Transcription</option>
                            </select>
                            <small className="form-help">
                                Estimated rate: {getServicePrice(formData.service_type)}
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="turnaround">Turnaround Time *</label>
                            <select
                                id="turnaround"
                                name="turnaround"
                                value={formData.turnaround}
                                onChange={handleChange}
                                required
                            >
                                <option value="24">24 Hours (Rush - +50%)</option>
                                <option value="48">48 Hours (Standard)</option>
                                <option value="72">72 Hours</option>
                                <option value="week">1 Week</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Contact Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="contact_name">Full Name *</label>
                            <input
                                type="text"
                                id="contact_name"
                                name="contact_name"
                                value={formData.contact_name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact_email">Email Address *</label>
                            <input
                                type="email"
                                id="contact_email"
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact_phone">Phone Number</label>
                            <input
                                type="tel"
                                id="contact_phone"
                                name="contact_phone"
                                value={formData.contact_phone}
                                onChange={handleChange}
                                placeholder="(555) 123-4567"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="company">Company/Organization</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="ABC Law Firm"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Audio Files</h3>
                    <div className="form-group">
                        <label htmlFor="files">Upload Audio Files</label>
                        <input
                            type="file"
                            id="files"
                            multiple
                            accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <small className="form-help">
                            Supported formats: MP3, WAV, M4A, AAC, OGG. Max file size: 100MB each.
                        </small>
                        
                        {files.length > 0 && (
                            <div className="file-list">
                                <h4>Selected Files:</h4>
                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>
                                            <i className="fas fa-file-audio"></i>
                                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Special Instructions</h3>
                    <div className="form-group">
                        <label htmlFor="special_instructions">Additional Requirements</label>
                        <textarea
                            id="special_instructions"
                            name="special_instructions"
                            value={formData.special_instructions}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Please include any special formatting requirements, speaker identification needs, or other specific instructions..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-full"
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Submitting Request...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Request Quote
                            </>
                        )}
                    </button>
                </div>

                <div className="form-footer">
                    <p>
                        <i className="fas fa-shield-alt"></i>
                        Your files and information are secure and confidential. 
                        We are HIPAA compliant and follow strict privacy protocols.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;