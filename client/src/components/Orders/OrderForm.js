import React, { useState } from 'react';
import { useOrders } from '../../hooks/useSupabase';
import { useFileUpload } from '../../hooks/useSupabase';
import { useAuthContext } from '../Auth/AuthProvider';

const OrderForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        service_type: 'legal',
        turnaround: '24',
        special_instructions: '',
        contact_name: '',
        contact_email: '',
        contact_phone: ''
    });
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { user } = useAuthContext();
    const { createOrder } = useOrders();
    const { uploadFile, uploading } = useFileUpload();

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
            // Upload files first
            const uploadedFiles = [];
            for (const file of files) {
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = `orders/${fileName}`;
                
                const uploadResult = await uploadFile('audio-files', filePath, file);
                if (uploadResult.success) {
                    uploadedFiles.push({
                        name: file.name,
                        path: filePath,
                        size: file.size,
                        type: file.type,
                        url: uploadResult.data.publicUrl
                    });
                } else {
                    throw new Error(`Failed to upload ${file.name}: ${uploadResult.error}`);
                }
            }

            // Create order with file references
            const orderData = {
                ...formData,
                user_id: user?.id,
                files: uploadedFiles,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            const result = await createOrder(orderData);
            if (result.success) {
                onSuccess && onSuccess(result.data);
                // Reset form
                setFormData({
                    service_type: 'legal',
                    turnaround: '24',
                    special_instructions: '',
                    contact_name: '',
                    contact_email: '',
                    contact_phone: ''
                });
                setFiles([]);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isSubmitting || uploading;

    return (
        <div className="order-form">
            <h2>Create New Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="service_type">Service Type</label>
                        <select
                            id="service_type"
                            name="service_type"
                            value={formData.service_type}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        >
                            <option value="legal">Legal Transcription</option>
                            <option value="medical">Medical Transcription</option>
                            <option value="business">Business Transcription</option>
                            <option value="academic">Academic Transcription</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="turnaround">Turnaround Time</label>
                        <select
                            id="turnaround"
                            name="turnaround"
                            value={formData.turnaround}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        >
                            <option value="24">24 Hours</option>
                            <option value="48">48 Hours</option>
                            <option value="72">72 Hours</option>
                            <option value="week">1 Week</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="contact_name">Contact Name</label>
                        <input
                            type="text"
                            id="contact_name"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact_email">Contact Email</label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="contact_phone">Contact Phone</label>
                    <input
                        type="tel"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="files">Audio Files</label>
                    <input
                        type="file"
                        id="files"
                        multiple
                        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                    {files.length > 0 && (
                        <div className="file-list">
                            <h4>Selected Files:</h4>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="special_instructions">Special Instructions</label>
                    <textarea
                        id="special_instructions"
                        name="special_instructions"
                        value={formData.special_instructions}
                        onChange={handleChange}
                        rows="4"
                        disabled={isLoading}
                        placeholder="Any special requirements or instructions for the transcription..."
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading || files.length === 0}
                    className="btn btn-primary"
                >
                    {isLoading ? 'Creating Order...' : 'Create Order'}
                </button>
            </form>
        </div>
    );
};

export default OrderForm;