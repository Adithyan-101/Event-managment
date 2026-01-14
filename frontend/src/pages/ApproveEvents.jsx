import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { Check, X, Calendar, User } from 'lucide-react';

const ApproveEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('pending'); // 'pending' | 'all'

    useEffect(() => {
        loadEvents();
    }, [filter]);

    const loadEvents = async () => {
        const allEvents = await eventService.getAllEvents();
        if (filter === 'pending') {
            setEvents(allEvents.filter(e => e.status === 'pending'));
        } else {
            setEvents(allEvents);
        }
    };

    const handleStatus = async (eventId, status) => {
        await eventService.updateEventStatus(eventId, status);
        loadEvents();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Events</h2>
                <div className="glass-panel" style={{ padding: '0.25rem', display: 'inline-flex', gap: '0.25rem' }}>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`btn ${filter === 'pending' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: filter === 'pending' ? 'white' : 'var(--text-muted)' }}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`btn ${filter === 'all' ? 'btn-primary' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: filter === 'all' ? 'white' : 'var(--text-muted)' }}
                    >
                        All Events
                    </button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {filter === 'pending' ? 'No pending events to review.' : 'No events found.'}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {events.map(event => (
                        <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{event.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <User size={14} /> {event.clubName}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} /> {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        color: event.status === 'approved' ? '#4ade80' : event.status === 'rejected' ? '#f87171' : '#facc15'
                                    }}>
                                        • {event.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {event.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                        onClick={() => handleStatus(event.id, 'rejected')}
                                    >
                                        <X size={18} /> Reject
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ background: '#22c55e' }}
                                        onClick={() => handleStatus(event.id, 'approved')}
                                    >
                                        <Check size={18} /> Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApproveEvents;
