import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../Auth/AuthProvider';
import { serverAPI } from '../../api/server';

const TranscriberDashboard = () => {
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState('assigned');
    const [isTranscriber, setIsTranscriber] = useState(false);
    const [transcriptions, setTranscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is transcriber
    useEffect(() => {
        const checkTranscriberStatus = () => {
            const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
            setIsTranscriber(userRole === 'transcriber');
        };

        checkTranscriberStatus();
    }, [user]);

    // Fetch transcriptions assigned to the transcriber
    useEffect(() => {
        const fetchTranscriptions = async () => {
            if (!isTranscriber) return;
            
            try {
                setLoading(true);
                const response = await serverAPI.getTranscriberAssignments();
                setTranscriptions(response || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching transcriptions:', err);
                setError('Failed to load your assigned transcriptions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTranscriptions();
    }, [isTranscriber]);

    if (!isTranscriber) {
        return (
            <div className="transcriber-access-denied">
                <div className="access-denied-content">
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access the transcriber dashboard.</p>
                    <p>Please contact an administrator if you believe this is an error.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'assigned', label: 'Assigned Tasks', icon: '📋' },
        { id: 'in-progress', label: 'In Progress', icon: '🔄' },
        { id: 'completed', label: 'Completed', icon: '✅' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    const filterTranscriptionsByStatus = (status) => {
        return transcriptions.filter(t => {
            if (status === 'in-progress') return t.status === 'in_progress';
            return t.status === status;
        });
    };

    const handleStatusChange = async (transcriptionId, newStatus) => {
        try {
            await serverAPI.updateTranscriptionStatus(transcriptionId, newStatus);
            
            // Update local state
            setTranscriptions(prev => 
                prev.map(t => t._id === transcriptionId ? { ...t, status: newStatus } : t)
            );
        } catch (err) {
            console.error('Error updating transcription status:', err);
            setError('Failed to update transcription status. Please try again.');
        }
    };

    const renderTabContent = () => {
        if (loading) {
            return <div className="loading">Loading your transcriptions...</div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        switch (activeTab) {
            case 'assigned':
                return <TranscriptionList 
                    transcriptions={filterTranscriptionsByStatus('assigned')} 
                    onStatusChange={handleStatusChange}
                    status="assigned"
                />;
            case 'in-progress':
                return <TranscriptionList 
                    transcriptions={filterTranscriptionsByStatus('in-progress')} 
                    onStatusChange={handleStatusChange}
                    status="in_progress"
                />;
            case 'completed':
                return <TranscriptionList 
                    transcriptions={filterTranscriptionsByStatus('completed')} 
                    onStatusChange={handleStatusChange}
                    status="completed"
                />;
            case 'profile':
                return <TranscriberProfile user={user} />;
            default:
                return <TranscriptionList 
                    transcriptions={filterTranscriptionsByStatus('assigned')} 
                    onStatusChange={handleStatusChange}
                    status="assigned"
                />;
        }
    };

    return (
        <div className="transcriber-dashboard">
            <div className="transcriber-header">
                <h1>Transcriber Dashboard</h1>
                <div className="transcriber-user-info">
                    <span>Welcome, {user?.user_metadata?.first_name || user?.email}</span>
                    <span className="transcriber-badge">Transcriber</span>
                </div>
            </div>

            <div className="transcriber-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`transcriber-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="transcriber-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

// Transcription List Component
const TranscriptionList = ({ transcriptions, onStatusChange, status }) => {
    if (transcriptions.length === 0) {
        return (
            <div className="no-transcriptions">
                <p>No {status} transcriptions found.</p>
            </div>
        );
    }

    return (
        <div className="transcription-list">
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Transcriptions</h2>
            <div className="transcription-cards">
                {transcriptions.map(transcription => (
                    <div key={transcription._id} className="transcription-card">
                        <div className="transcription-header">
                            <h3>Order #{transcription.order.orderNumber}</h3>
                            <span className={`status-badge status-${transcription.status}`}>
                                {transcription.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="transcription-details">
                            <p><strong>File:</strong> {transcription.file.originalName}</p>
                            <p><strong>Duration:</strong> {transcription.file.duration || 'Unknown'} minutes</p>
                            <p><strong>Deadline:</strong> {new Date(transcription.order.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="transcription-actions">
                            {status === 'assigned' && (
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => onStatusChange(transcription._id, 'in_progress')}
                                >
                                    Start Transcription
                                </button>
                            )}
                            {status === 'in_progress' && (
                                <button 
                                    className="btn btn-success"
                                    onClick={() => onStatusChange(transcription._id, 'completed')}
                                >
                                    Mark as Completed
                                </button>
                            )}
                            <a 
                                href={`/transcriber/edit/${transcription._id}`} 
                                className="btn btn-secondary"
                            >
                                {status === 'completed' ? 'View' : 'Edit'} Transcription
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Transcriber Profile Component
const TranscriberProfile = ({ user }) => {
    const [stats, setStats] = useState({
        completed: 0,
        inProgress: 0,
        averageRating: 0,
        totalMinutes: 0
    });

    useEffect(() => {
        // Fetch transcriber stats
        const fetchStats = async () => {
            try {
                const apiService = new ApiService();
                const response = await apiService.get('/transcriber/stats');
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching transcriber stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="transcriber-profile">
            <h2>Your Profile</h2>
            
            <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-details">
                    <p><strong>Name:</strong> {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> Transcriber</p>
                </div>
            </div>
            
            <div className="profile-section">
                <h3>Performance Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats.completed}</div>
                        <div className="stat-label">Completed Transcriptions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
                        <div className="stat-label">Average Rating</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalMinutes}</div>
                        <div className="stat-label">Total Minutes Transcribed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranscriberDashboard;