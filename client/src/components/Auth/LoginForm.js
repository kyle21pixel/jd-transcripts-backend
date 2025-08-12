import React, { useState } from 'react';
import { useAuthContext } from './AuthProvider';

const LoginForm = ({ onSuccess, onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn(email, password);
            if (result.success) {
                onSuccess && onSuccess(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn btn-primary"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>

            <div className="auth-links">
                <button 
                    type="button" 
                    onClick={onToggleMode}
                    className="link-button"
                >
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;