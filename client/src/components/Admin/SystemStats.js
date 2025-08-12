import React, { useState, useEffect } from 'react';
import { useSupabaseQuery } from '../../hooks/useSupabase';
import { supabase } from '../../config/supabase';

const SystemStats = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalUsers: 0,
        activeTranscribers: 0,
        totalRevenue: 0,
        avgCompletionTime: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        fetchRecentOrders();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch order statistics
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('status, created_at');

            if (ordersError) throw ordersError;

            // Calculate order stats
            const totalOrders = orders?.length || 0;
            const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
            const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;

            // Fetch user count (this might need admin privileges)
            let totalUsers = 0;
            try {
                const { count, error: usersError } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true });
                
                if (!usersError) {
                    totalUsers = count || 0;
                }
            } catch (err) {
                console.warn('Could not fetch user count:', err);
            }

            // Fetch transcriber count
            let activeTranscribers = 0;
            try {
                const { count, error: transcriberError } = await supabase
                    .from('transcribers')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_active', true);
                
                if (!transcriberError) {
                    activeTranscribers = count || 0;
                }
            } catch (err) {
                console.warn('Could not fetch transcriber count:', err);
            }

            setStats({
                totalOrders,
                pendingOrders,
                completedOrders,
                totalUsers,
                activeTranscribers,
                totalRevenue: 0, // You would calculate this based on your pricing
                avgCompletionTime: 0 // You would calculate this from completed orders
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id,
                    service_type,
                    status,
                    contact_name,
                    created_at,
                    user_profiles!orders_user_id_fkey (
                        first_name,
                        last_name,
                        company
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            setRecentOrders(data || []);
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="system-stats">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.totalOrders}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.pendingOrders}</div>
                        <div className="stat-label">Pending Orders</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.completedOrders}</div>
                        <div className="stat-label">Completed Orders</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.activeTranscribers}</div>
                        <div className="stat-label">Active Transcribers</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <div className="stat-number">${stats.totalRevenue}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-sections">
                <div className="recent-orders-section">
                    <h3>Recent Orders</h3>
                    <div className="recent-orders-list">
                        {recentOrders.length === 0 ? (
                            <div className="empty-state">
                                <p>No recent orders</p>
                            </div>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order.id} className="recent-order-item">
                                    <div className="order-info">
                                        <div className="order-customer">
                                            {order.user_profiles?.first_name} {order.user_profiles?.last_name}
                                            {order.user_profiles?.company && (
                                                <span className="company"> - {order.user_profiles.company}</span>
                                            )}
                                        </div>
                                        <div className="order-details">
                                            <span className="service-type">{order.service_type}</span>
                                            <span className="order-date">{formatDate(order.created_at)}</span>
                                        </div>
                                    </div>
                                    <div 
                                        className="order-status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {order.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="quick-actions-section">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button className="quick-action-btn">
                            <span className="action-icon">📊</span>
                            <span>Generate Report</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">📧</span>
                            <span>Send Notifications</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">🔄</span>
                            <span>Sync Data</span>
                        </button>
                        <button className="quick-action-btn">
                            <span className="action-icon">⚙️</span>
                            <span>System Settings</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>Order Status Distribution</h3>
                    <div className="simple-chart">
                        <div className="chart-bar">
                            <div className="bar-segment pending" style={{width: `${(stats.pendingOrders / stats.totalOrders) * 100}%`}}>
                                <span>Pending ({stats.pendingOrders})</span>
                            </div>
                            <div className="bar-segment completed" style={{width: `${(stats.completedOrders / stats.totalOrders) * 100}%`}}>
                                <span>Completed ({stats.completedOrders})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStats;