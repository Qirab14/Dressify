import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginScreen.css';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, currentUser } = useAuth(); // Adjust for auth condition
  const navigate = useNavigate();

  if (currentUser) {
    return null; // Or redirect as needed
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-visual">
     <div className="login-visual">
  <img
    src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&q=80"
    alt="login"
    className="login-image"
  />
  <h1>👗 StyleAI</h1>
  <p>Virtual Try-On & AI Style Assistant</p>
</div>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
          {/* <div className="social-login">
            <button className="social-btn google">Sign in with Google</button>
            <button className="social-btn facebook">Sign in with Facebook</button>
          </div> */}
          <div className="login-footer">
            <p>New here? <Link to="/signup" className="link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
