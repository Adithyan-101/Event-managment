import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardHome = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here is what's happening today.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Next Event</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>Intro to React</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-primary)', marginTop: '0.5rem' }}>Tomorrow, 2:00 PM</p>
                </div>

                {user?.role === 'student' && (
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>My Tickets</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: '600' }}>2 Active</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHome;
