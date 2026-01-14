import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    status: { type: String, default: 'upcoming' },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clubName: { type: String },
    capacity: { type: Number, required: true },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
