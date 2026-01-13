require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is not defined in .env");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // In prod: compare hashed password
        if (user) {
            const { password, ...userWithoutPass } = user.toObject();
            res.json(userWithoutPass);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        const { password, ...userWithoutPass } = newUser.toObject();
        res.json(userWithoutPass);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Event Routes ---
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/events/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Registration Routes ---
app.get('/api/registrations', async (req, res) => {
    try {
        const { studentId, eventId } = req.query;
        let query = {};
        if (studentId) query.studentId = studentId;
        if (eventId) query.eventId = eventId;

        const regs = await Registration.find(query);
        res.json(regs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/registrations', async (req, res) => {
    try {
        const { studentId, eventId } = req.body;

        // Check duplicate
        const existing = await Registration.findOne({ studentId, eventId });
        if (existing) {
            return res.json({ error: 'Already registered' });
        }

        const newReg = new Registration({
            ...req.body,
            ticketId: `T${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });
        await newReg.save();
        res.json(newReg);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
