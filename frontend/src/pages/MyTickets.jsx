import React, { useEffect, useState } from 'react';
import { attendanceService } from '../services/attendanceService';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import QRCode from 'qrcode'; // Default export
import { QrCode, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

const MyTickets = () => {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [events, setEvents] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [qrDataUrl, setQrDataUrl] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const regs = await attendanceService.getStudentRegistrations(user.id);
        setTickets(regs);

        // Load event details for each ticket
        const eventMap = {};
        for (let r of regs) {
            if (!eventMap[r.eventId]) {
                const evt = await eventService.getEventById(r.eventId);
                eventMap[r.eventId] = evt;
            }
        }
        setEvents(eventMap);
    };

    const handleShowQr = async (ticket) => {
        try {
            // Generate QR
            const url = await QRCode.toDataURL(ticket.ticketId);
            setQrDataUrl(url);
            setSelectedTicket(ticket);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadCertificate = (ticket) => {
        const event = events[ticket.eventId];
        const doc = new jsPDF({
            orientation: 'landscape'
        });

        // Background
        doc.setFillColor(240, 240, 250);
        doc.rect(0, 0, 297, 210, 'F');

        // Border
        doc.setLineWidth(2);
        doc.setDrawColor(99, 102, 241); // Indigo
        doc.rect(10, 10, 277, 190);

        // Title
        doc.setFontSize(40);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text('Certificate of Participation', 148.5, 50, { align: 'center' });

        // Content
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('This is to certify that', 148.5, 80, { align: 'center' });

        doc.setFontSize(30);
        doc.setFont('helvetica', 'bold');
        doc.text(user.name, 148.5, 95, { align: 'center' });

        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.text('has successfully attended the event', 148.5, 115, { align: 'center' });

        doc.setFontSize(24);
        doc.setTextColor(99, 102, 241);
        doc.setFont('helvetica', 'bold');
        doc.text(event.title, 148.5, 130, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 148.5, 145, { align: 'center' });
        doc.text(`Organized by: ${event.clubName}`, 148.5, 153, { align: 'center' });

        doc.save(`${event.title}_Certificate.pdf`);
    };

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>My Tickets</h2>

            <div style={{ display: 'grid', gaps: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {tickets.map(ticket => {
                    const event = events[ticket.eventId] || {};
                    return (
                        <div key={ticket.ticketId} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute', top: 0, right: 0,
                                background: ticket.status === 'attended' ? '#22c55e' : 'var(--color-primary)',
                                padding: '0.25rem 1rem', fontSize: '0.75rem', fontWeight: 'bold',
                                borderBottomLeftRadius: '8px'
                            }}>
                                {ticket.status.toUpperCase()}
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{event.title || 'Loading...'}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                {event.date ? new Date(event.date).toLocaleString() : ''}
                            </p>

                            <button
                                className="btn btn-outline"
                                style={{ width: '100%', marginBottom: '0.5rem' }}
                                onClick={() => handleShowQr(ticket)}
                            >
                                <QrCode size={18} /> Show QR Code
                            </button>

                            {ticket.status === 'attended' && (
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                    onClick={() => downloadCertificate(ticket)}
                                >
                                    <Download size={18} /> Certificate
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* QR Modal */}
            {selectedTicket && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100
                }} onClick={() => setSelectedTicket(null)}>
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: '#fff', color: '#000', maxWidth: '320px' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem', color: '#000' }}>Event Ticket</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                            Scan this code at the venue entrance.
                        </p>

                        <img src={qrDataUrl} alt="QR Code" style={{ width: '200px', height: '200px', marginBottom: '1rem' }} />

                        <p style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            {selectedTicket.ticketId}
                        </p>

                        <button className="btn" style={{ width: '100%', background: '#000', color: '#fff', marginTop: '1rem' }} onClick={() => setSelectedTicket(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTickets;
