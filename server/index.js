import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let users = [];
let events = [];
let registrations = [];

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const { password, ...userWithoutPass } = user;
            res.json(userWithoutPass);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/register', (req, res) => {
    try {
        const { email } = req.body;
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const newUser = { ...req.body, _id: Date.now().toString() };
        users.push(newUser);
        const { password, ...userWithoutPass } = newUser;
        res.json(userWithoutPass);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Event Routes ---
app.get('/api/events', (req, res) => {
    try {
        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        res.json(sortedEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', (req, res) => {
    try {
        const newEvent = { ...req.body, _id: Date.now().toString() };
        events.push(newEvent);
        res.json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/events/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const eventIndex = events.findIndex(e => e._id === req.params.id);
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }
        events[eventIndex].status = status;
        res.json(events[eventIndex]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Registration Routes ---
app.get('/api/registrations', (req, res) => {
    try {
        const { studentId, eventId } = req.query;
        let results = registrations;
        if (studentId) results = results.filter(r => r.studentId === studentId);
        if (eventId) results = results.filter(r => r.eventId === eventId);

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/registrations', (req, res) => {
    try {
        const { studentId, eventId } = req.body;

        // Check duplicate
        const existing = registrations.find(r => r.studentId === studentId && r.eventId === eventId);
        if (existing) {
            return res.json({ error: 'Already registered' });
        }

        const newReg = {
            ...req.body,
            _id: Date.now().toString(),
            ticketId: `T${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            registrationDate: new Date()
        };
        registrations.push(newReg);
        res.json(newReg);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
