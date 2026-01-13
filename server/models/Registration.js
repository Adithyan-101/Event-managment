const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    ticketId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentName: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['registered', 'attended'], default: 'registered' },
    attendedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
