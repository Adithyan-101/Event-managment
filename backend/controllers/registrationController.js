import Registration from '../models/Registration.js';

export const getRegistrations = async (req, res) => {
    try {
        const { studentId, eventId } = req.query;
        let query = {};
        if (studentId) query.studentId = studentId;
        if (eventId) query.eventId = eventId;

        const registrations = await Registration.find(query);
        res.json(registrations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createRegistration = async (req, res) => {
    try {
        const { studentId, eventId } = req.body;

        const existing = await Registration.findOne({ studentId, eventId });
        if (existing) {
            return res.json({ error: 'Already registered' });
        }

        const newReg = await Registration.create({
            ...req.body,
            ticketId: `T${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });
        res.json(newReg);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
