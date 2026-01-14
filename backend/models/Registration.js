import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    eventId: { type: String, required: true },
    ticketId: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, default: 'registered' }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
