const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In real app, hash this!
    role: { type: String, enum: ['student', 'club_admin', 'college_admin'], default: 'student' },
    clubName: { type: String }, // Only for club_admin
    isVolunteer: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
