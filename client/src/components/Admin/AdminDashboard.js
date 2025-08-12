import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../Auth/AuthProvider';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import SystemStats from './SystemStats';

const AdminDashboard = () => {
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState('stats');
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin
    useEffect(() => {
        const checkAdminStatus = () => {
            const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
            setIsAdmin(userRole === 'admin');
        };

        checkAdminStatus();
    }, [user]);

    if (!isAdmin) {
        return (
            <div className="admin-access-denied">
                <div className="access-denied-content">
                    <h2>Access Denied</h2>
                    <p>You don't have permission to access the admin dashboard.</p>
                    <p>Please contact an administrator if you believe this is an error.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'stats', label: 'Dashboard', icon: '📊' },
        { id: 'orders', label: 'Orders', icon: '📋' },
        { id: 'users', label: 'Users', icon: '👥' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'stats':
                return <SystemStats />;
            case 'orders':
                return <OrderManagement />;
            case 'users':
                return <UserManagement />;
            case 'settings':
                return <AdminSettings />;
            default:
                return <SystemStats />;
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-user-info">
                    <span>Welcome, {user?.user_metadata?.first_name || user?.email}</span>
                    <span className="admin-badge">Admin</span>
                </div>
            </div>

            <div className="admin-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="admin-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

// Admin Settings Component
const AdminSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        autoAssignment: false,
        maxFileSize: 100,
        allowedFileTypes: 'mp3,wav,m4a,aac,ogg',
        defaultTurnaround: '24'
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = () => {
        // Save settings to database
        console.log('Saving settings:', settings);
        // You would implement the actual save logic here
    };

    return (
        <div className="admin-settings">
            <h2>System Settings</h2>
            
            <div className="settings-grid">
                <div className="setting-group">
                    <h3>Notifications</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            />
                            Enable email notifications
                        </label>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Order Management</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.autoAssignment}
                                onChange={(e) => handleSettingChange('autoAssignment', e.target.checked)}
                            />
                            Auto-assign orders to transcribers
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            Default turnaround time (hours):
                            <select
                                value={settings.defaultTurnaround}
                                onChange={(e) => handleSettingChange('defaultTurnaround', e.target.value)}
                            >
                                <option value="24">24 hours</option>
                                <option value="48">48 hours</option>
                                <option value="72">72 hours</option>
                                <option value="168">1 week</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>File Upload</h3>
                    <div className="setting-item">
                        <label>
                            Maximum file size (MB):
                            <input
                                type="number"
                                value={settings.maxFileSize}
                                onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                                min="1"
                                max="500"
                            />
                        </label>
                    </div>
                    <div className="setting-item">
                        <label>
                            Allowed file types:
                            <input
                                type="text"
                                value={settings.allowedFileTypes}
                                onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                                placeholder="mp3,wav,m4a,aac,ogg"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="settings-actions">
                <button onClick={handleSaveSettings} className="btn btn-primary">
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;