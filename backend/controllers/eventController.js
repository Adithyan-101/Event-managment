import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);
        res.json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
