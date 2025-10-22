import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import Home from './pages/Home';
import Order from './pages/Order';
import TrackOrder from './pages/TrackOrder';
import Careers from './pages/Careers';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
// TranscriberOrderManagement component not found - removed import
import PasswordReset from './pages/PasswordReset';
import serverAPI from './api/server';
import { io } from 'socket.io-client';
import config from './config';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main App Content
const AppContent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const socket = io(config.API_URL, {
      withCredentials: true
    });
    
    socket.on('notification', (n) => {
      setNotifications((prev) => [n, ...prev].slice(0, 20));
    });
    
    socket.on('new_order', (o) => {
      setNotifications((prev) => [{
        id: o.id,
        title: 'New Order',
        message: `Order ${o.order_number} submitted`,
        type: 'info',
        created_at: new Date().toISOString()
      }, ...prev].slice(0, 20));
    });
    
    socket.on('order_assigned', (data) => {
      setNotifications((prev) => [{
        id: data.order_id,
        title: 'Order Assigned',
        message: `Order assigned to ${data.transcriber_name}`,
        type: 'info',
        created_at: new Date().toISOString()
      }, ...prev].slice(0, 20));
    });
    
    return () => socket.disconnect();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <div className="App">
      {/* Notification ticker */}
      {notifications.length > 0 && (
        <div style={{ position: 'fixed', top: 8, right: 8, zIndex: 1000, maxWidth: 360 }}>
          {notifications.slice(0, 3).map((n) => (
            <div key={n.id + n.created_at} style={{ 
              background: '#fff', 
              border: '1px solid #ddd', 
              marginBottom: 8, 
              padding: 10, 
              borderRadius: 6,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <strong>{n.title}</strong>
              <div style={{ fontSize: 12 }}>{n.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-microphone-alt me-2"></i>
            JD Reporting
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/track-order">Track Order</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/careers">Careers</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                  </li>
                  {user?.role === 'transcriber' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/transcriber">My Orders</Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            <div className="navbar-nav">
              {isAuthenticated ? (
                <div className="nav-item dropdown">
                  <button
                    className="btn btn-link nav-link dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user me-2"></i>
                    {user?.name || 'User'}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/auth">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Link>
                </li>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transcriber" 
          element={
            <ProtectedRoute>
              <div>Transcriber Dashboard Coming Soon</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

// App entry renders the canonical Admin Dashboard
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;