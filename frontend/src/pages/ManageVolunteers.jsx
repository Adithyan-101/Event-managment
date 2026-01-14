import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User, CheckCircle, Search, BadgeCheck } from 'lucide-react';

const ManageVolunteers = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        const users = await authService.getAllUsers();
        // Filter only students
        setStudents(users.filter(u => u.role === 'student'));
    };

    const toggleVolunteer = (student) => {
        // Toggle status
        authService.updateUser(student.id, { isVolunteer: !student.isVolunteer });
        loadStudents(); // Reload UI
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Manage Volunteers</h2>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        className="input"
                        style={{ paddingLeft: '3rem' }}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredStudents.map(student => (
                    <div key={student.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: student.isVolunteer ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <User size={20} color={student.isVolunteer ? 'white' : 'var(--text-muted)'} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{student.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{student.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {student.isVolunteer && (
                                <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                    <BadgeCheck size={16} /> Volunteer
                                </span>
                            )}

                            <button
                                className={`btn ${student.isVolunteer ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => toggleVolunteer(student)}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                            >
                                {student.isVolunteer ? 'Remove' : 'Promote'}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredStudents.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        No students found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageVolunteers;
