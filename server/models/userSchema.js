const mongoose = require ("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    role: { type: String, enum: ['student', 'alumni', 'admin'], required: true },
    profile_picture: { type: String },
    bio: { type: String },
    skills: { type: [String] },
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
    work_experience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkExperience' }],
    linkedin_profile: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const user = mongoose.model('User', UserSchema);
module.exports = user;