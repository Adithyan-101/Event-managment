import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'student', // Default for register
        clubName: '' // For club admin
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                // Register
                await authService.register(formData);
                // Manually trigger context update if needed, but login does it usually
                window.location.reload(); // Simple reload to pick up new session
                return;
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    // Demo Fill
    const fillDemo = (email, pass) => {
        setFormData({ ...formData, email, password: pass });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90vh' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" className="input" required value={formData.name} onChange={handleChange} />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label htmlFor="role">I am a...</label>
                                <select id="role" className="input" value={formData.role} onChange={handleChange}>
                                    <option value="student">Student</option>
                                    <option value="club_admin">Club Admin</option>
                                    <option value="college_admin">College Admin</option>
                                </select>
                            </div>

                            {formData.role === 'club_admin' && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <label htmlFor="clubName">Club Name</label>
                                    <input type="text" id="clubName" className="input" required placeholder="e.g., Robotics Club" value={formData.clubName} onChange={handleChange} />
                                </div>
                            )}
                        </>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" id="email" className="input" required placeholder="name@college.edu" value={formData.email} onChange={handleChange} />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" className="input" required placeholder="••••••" value={formData.password} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>

                {isLogin && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>Demo Shortcuts</p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => fillDemo('john@college.edu', 'password')}>Student</button>
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => fillDemo('tech@clubs.edu', 'password')}>Club Admin</button>
                            <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => fillDemo('admin@college.edu', 'password')}>College Admin</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
