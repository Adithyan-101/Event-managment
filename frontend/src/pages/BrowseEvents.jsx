import React, { useEffect, useState } from 'react';
import { eventService } from '../services/eventService';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, MapPin, Tag } from 'lucide-react';

const BrowseEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(null);
    const [registeredEventIds, setRegisteredEventIds] = useState(new Set());

    useEffect(() => {
        if (user) {
            loadEvents();
        }
    }, [user]);

    const loadEvents = async () => {
        try {
            const [data, registrations] = await Promise.all([
                eventService.getApprovedEvents(),
                attendanceService.getStudentRegistrations(user.id)
            ]);
            setEvents(data);
            setRegisteredEventIds(new Set(registrations.map(r => r.eventId)));
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        setRegistering(eventId);
        try {
            const result = await attendanceService.registerForEvent(user, eventId);
            if (result.error) {
                alert(result.error);
                if (result.error === 'Already registered') {
                    setRegisteredEventIds(prev => {
                        const newSet = new Set(prev);
                        newSet.add(eventId);
                        return newSet;
                    });
                }
            } else {
                alert('Successfully Registered! Check My Tickets.');
                setRegisteredEventIds(prev => {
                    const newSet = new Set(prev);
                    newSet.add(eventId);
                    return newSet;
                });
            }
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        } finally {
            setRegistering(null);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-muted)' }}>Loading events...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Upcoming Events</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {events.map(event => (
                    <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                {event.clubName}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{event.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{event.description}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} className="text-muted" />
                                    {new Date(event.date).toLocaleString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={16} />
                                    {event.capacity} Spots
                                </div>
                            </div>
                        </div>

                        <button
                            className={`btn ${registeredEventIds.has(event.id) ? 'btn-outline' : 'btn-primary'}`}
                            style={{ width: '100%', cursor: registeredEventIds.has(event.id) ? 'default' : 'pointer' }}
                            onClick={() => handleRegister(event.id)}
                            disabled={registering === event.id || registeredEventIds.has(event.id)}
                        >
                            {registering === event.id ? 'Registering...' : (registeredEventIds.has(event.id) ? 'Registered' : 'Register Now')}
                        </button>
                    </div>
                ))}
            </div>

            {events.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    No upcoming events found.
                </div>
            )}
        </div>
    );
};

export default BrowseEvents;
