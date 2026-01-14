import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import { Plus, Calendar, Users, Clock } from 'lucide-react';

const ManageEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        capacity: ''
    });

    useEffect(() => {
        if (user) {
            loadEvents();
        }
    }, [user]);

    const loadEvents = async () => {
        if (!user?.id) return;
        try {
            const data = await eventService.getClubEvents(user.id);
            setEvents(data);
        } catch (error) {
            console.error("Failed to load events", error);
        }
    };

    const handleViewAttendees = async (eventId) => {
        const list = await attendanceService.getEventAttendees(eventId);
        setAttendees(list);
        setShowAttendeesModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await eventService.createEvent({
                ...formData,
                clubId: user?.id,
                clubName: user?.clubName || 'My Club'
            });
            setShowModal(false);
            setFormData({ title: '', description: '', date: '', capacity: '' });
            loadEvents();
        } catch (error) {
            console.error("Failed to create event", error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Manage Events</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage your club's events</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Create New Event
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {events.map(event => (
                    <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                background: event.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                color: event.status === 'approved' ? '#4ade80' : '#facc15'
                            }}>
                                {event.status.toUpperCase()}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.4', flex: 1 }}>
                            {event.description}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Calendar size={14} />
                                {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Users size={14} />
                                {event.capacity}
                            </div>
                        </div>

                        <button
                            className="btn btn-outline"
                            style={{ width: '100%', fontSize: '0.9rem' }}
                            onClick={() => handleViewAttendees(event.id)}
                        >
                            <Users size={16} /> View Attendees
                        </button>
                    </div>
                ))}
            </div>
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Create New Event</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Event Title</label>
                                <input className="input" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Description</label>
                                <textarea className="input" required rows="3"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Date & Time</label>
                                    <input type="datetime-local" className="input" required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div style={{ width: '100px' }}>
                                    <label>Capacity</label>
                                    <input type="number" className="input" required min="1"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Attendees Modal */}
            {
                showAttendeesModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 100
                    }}>
                        <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3>Event Attendees</h3>
                                <button onClick={() => setShowAttendeesModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                    <Clock size={20} style={{ transform: 'rotate(45deg)' }} /> {/* Using Clock as close icon proxy or import X */}
                                </button>
                            </div>

                            {attendees.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No registrations yet.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                            <th style={{ padding: '0.75rem' }}>Student Name</th>
                                            <th style={{ padding: '0.75rem' }}>Ticket ID</th>
                                            <th style={{ padding: '0.75rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.map(record => (
                                            <tr key={record.ticketId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '0.75rem' }}>{record.studentName}</td>
                                                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{record.ticketId}</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem', borderRadius: '4px',
                                                        background: record.status === 'attended' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                                        color: record.status === 'attended' ? '#4ade80' : '#818cf8',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {record.status === 'attended' ? 'Attended' : 'Registered'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                <button className="btn btn-outline" onClick={() => setShowAttendeesModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ManageEvents;
