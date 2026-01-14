import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    eventId: { type: String, required: true },
    ticketId: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
