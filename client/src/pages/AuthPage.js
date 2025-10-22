import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleLoginSuccess = (user) => {
    console.log('Login successful:', user);
    // Redirect to dashboard or home page
    window.location.href = '/admin';
  };

  const handleRegisterSuccess = (result) => {
    console.log('Registration successful:', result);
    // Show success message and switch to login
    alert('Registration successful! Please login with your credentials.');
    setAuthMode('login');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center mb-5">
              <h1 className="display-4 text-primary">
                <i className="fas fa-microphone-alt me-3"></i>
                JD Reporting Company
              </h1>
              <p className="lead text-muted">
                Professional Transcription Services
              </p>
            </div>

            {authMode === 'login' ? (
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}

            <div className="text-center mt-4">
              <div className="row">
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-shield-alt fa-2x text-primary mb-2"></i>
                    <h6>Secure</h6>
                    <small className="text-muted">Your data is protected</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-clock fa-2x text-primary mb-2"></i>
                    <h6>Fast</h6>
                    <small className="text-muted">Quick turnaround times</small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-item">
                    <i className="fas fa-award fa-2x text-primary mb-2"></i>
                    <h6>Quality</h6>
                    <small className="text-muted">Professional results</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;




