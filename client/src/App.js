import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuthContext } from './components/Auth/AuthProvider';
import LoginForm from './components/Auth/LoginForm';
import SignUpForm from './components/Auth/SignUpForm';
import OrderForm from './components/Orders/OrderForm';
import OrderList from './components/Orders/OrderList';

// Main App Content Component
const AppContent = () => {
  const { user, loading, signOut, isAuthenticated } = useAuthContext();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentView, setCurrentView] = useState('orders'); // 'orders' or 'create'

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h1>JD Reporting Company</h1>
            <p>Professional transcription services with Supabase integration</p>
          </div>
          
          {authMode === 'login' ? (
            <LoginForm 
              onSuccess={() => setCurrentView('orders')}
              onToggleMode={() => setAuthMode('signup')}
            />
          ) : (
            <SignUpForm 
              onSuccess={() => setCurrentView('orders')}
              onToggleMode={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>JD Reporting Company</h1>
          <div className="user-info">
            <span>Welcome, {user.user_metadata?.first_name || user.email}</span>
            <button onClick={signOut} className="btn btn-outline btn-sm">
              Sign Out
            </button>
          </div>
        </div>
        
        <nav className="app-nav">
          <button 
            onClick={() => setCurrentView('orders')}
            className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
          >
            My Orders
          </button>
          <button 
            onClick={() => setCurrentView('create')}
            className={`nav-btn ${currentView === 'create' ? 'active' : ''}`}
          >
            Create Order
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="main-content">
          {currentView === 'orders' ? (
            <OrderList />
          ) : (
            <OrderForm onSuccess={() => setCurrentView('orders')} />
          )}
        </div>
      </main>
    </div>
  );
};

// Main App Component with Provider
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
