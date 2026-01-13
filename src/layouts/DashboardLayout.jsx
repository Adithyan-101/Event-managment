import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Ticket, Scan, LogOut, CheckCircle, Users } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                color: isActive(to) ? 'white' : 'var(--text-muted)',
                background: isActive(to) ? 'var(--color-primary)' : 'transparent',
                transition: 'all 0.2s',
                marginBottom: '0.5rem'
            }}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRight: '1px solid var(--border-color)',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', background: 'var(--color-primary)', borderRadius: '8px' }}></div>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>EventSys</span>
                </div>

                <nav style={{ flex: 1 }}>
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />

                    {user?.role === 'student' && (
                        <>
                            <NavItem to="/dashboard/events" icon={Calendar} label="Browse Events" />
                            <NavItem to="/dashboard/my-tickets" icon={Ticket} label="My Tickets" />
                        </>
                    )}

                    {user?.role === 'club_admin' && (
                        <>
                            <NavItem to="/dashboard/manage-events" icon={Calendar} label="My Events" />
                            <NavItem to="/dashboard/manage-volunteers" icon={Users} label="Volunteers" />
                            <NavItem to="/dashboard/scan" icon={Scan} label="Scan QR" />
                        </>
                    )}

                    {user?.role === 'student' && user?.isVolunteer && (
                        <NavItem to="/dashboard/scan" icon={Scan} label="Scan QR (Volunteer)" />
                    )}

                    {user?.role === 'college_admin' && (
                        <NavItem to="/dashboard/approve-events" icon={CheckCircle} label="Approve Events" />
                    )}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontWeight: '600', color: 'white' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {user?.role.replace('_', ' ')}
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="btn btn-outline"
                        style={{ width: '100%', justifyContent: 'flex-start', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)' }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
