import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignupScreen.css';

const SignupScreen = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        general: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
            general: ''
        });
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Username is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const result = await signup(formData.username, formData.email, formData.password);

            if (result.success) {
                navigate('/profile-setup');
            } else {
                // Handle specific errors returned from backend
                if (result.error === 'Username already in use') {
                    setErrors((prev) => ({ ...prev, username: 'Username is already taken' }));
                } else if (result.error === 'Email already in use') {
                    setErrors((prev) => ({ ...prev, email: 'Email is already registered' }));
                } else {
                    setErrors((prev) => ({ ...prev, general: result.error || 'Failed to sign up' }));
                }
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, general: 'Failed to sign up' }));
            console.error("Signup error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-visual">
                    <img src="/image/signup-fashion.jpg" alt="Fashion style" className="signup-image" />
                    <h1>👗 StyleAI</h1>
                    <p>Begin your style journey</p>
                </div>
                <div className="signup-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Jane Doe"
                                required
                            />
                            {errors.username && <div className="error-message">{errors.username}</div>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                             {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                        </div>

                        {errors.general && <div className="error-message">{errors.general}</div>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Signing up...' : 'Next: Complete Profile'}
                        </button>
                    </form>
                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login" className="link">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupScreen;