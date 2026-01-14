/**
 * Mock Attendance Service
 * Handles registrations, QR code generation tickets, and scanning.
 */

const REGISTRATIONS_KEY = 'ces_registrations';

const getRegistrations = () => {
    const stored = localStorage.getItem(REGISTRATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
};

export const attendanceService = {
    // Student registers for an event
    registerForEvent: async (student, eventId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const regs = getRegistrations();
                // Check if already registered
                if (regs.some(r => r.studentId === student.id && r.eventId === eventId)) {
                    resolve({ error: 'Already registered' });
                    return;
                }

                const newReg = {
                    ticketId: `T${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    studentId: student.id,
                    studentName: student.name,
                    eventId: eventId,
                    status: 'registered', // registered, attended
                    registeredAt: new Date().toISOString()
                };

                regs.push(newReg);
                localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));
                resolve(newReg);
            }, 500);
        });
    },

    // Verify and Mark Attendance (Scan QR)
    markAttendance: async (ticketId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const regs = getRegistrations();
                const regIndex = regs.findIndex(r => r.ticketId === ticketId);

                if (regIndex === -1) {
                    reject(new Error('Invalid Ticket'));
                    return;
                }

                if (regs[regIndex].status === 'attended') {
                    reject(new Error('Already marked present'));
                    return;
                }

                regs[regIndex].status = 'attended';
                regs[regIndex].attendedAt = new Date().toISOString();
                localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(regs));
                resolve(regs[regIndex]);
            }, 500);
        });
    },

    getStudentRegistrations: async (studentId) => {
        const regs = getRegistrations();
        return regs.filter(r => r.studentId === studentId);
    },

    getEventAttendees: async (eventId) => {
        const regs = getRegistrations();
        return regs.filter(r => r.eventId === eventId);
    }
};
