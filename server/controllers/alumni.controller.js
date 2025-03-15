const User = require('../models/userSchema');
const AlumniProfile = require('../models/AlumniProfile');
const mongoose = require('mongoose');

// Create models for the alumni functionality
// These would typically be in separate model files
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'] },
    salary: { type: String },
    applicationLink: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String },
    isVirtual: { type: Boolean, default: false },
    meetingLink: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const MentorshipRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    message: { type: String },
    topics: [String],
    createdAt: { type: Date, default: Date.now }
});

const ConnectionSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

// Create models if they don't exist in your database yet
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const MentorshipRequest = mongoose.models.MentorshipRequest || mongoose.model('MentorshipRequest', MentorshipRequestSchema);
const Connection = mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);

// Helper function to get alumni profile
const getAlumniProfile = async (userId) => {
    try {
        const alumniProfile = await AlumniProfile.findOne({ user: userId });
        return alumniProfile;
    } catch (error) {
        console.error('Error fetching alumni profile:', error);
        return null;
    }
};

// Profile controllers
exports.getProfile = async (req, res) => {
    try {
        const alumni = await User.findById(req.user._id).select('-password');
        if (!alumni) {
            return res.status(404).json({ message: 'Alumni profile not found' });
        }
        res.status(200).json(alumni);
    } catch (error) {
        console.error('Error fetching alumni profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Prevent updating role or other sensitive fields
        delete updates.role;
        delete updates.password;
        
        const alumni = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.status(200).json(alumni);
    } catch (error) {
        console.error('Error updating alumni profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Mentorship controllers
exports.getMentorshipRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({ alumni: req.user._id })
            .populate('student', 'username profile.firstName profile.lastName profile.avatar academic')
            .sort({ createdAt: -1 });
        
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching mentorship requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.respondToMentorshipRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, message } = req.body;
        
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Mentorship request not found' });
        }
        
        if (request.alumni.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to respond to this request' });
        }
        
        request.status = status;
        if (message) request.message = message;
        await request.save();
        
        res.status(200).json(request);
    } catch (error) {
        console.error('Error responding to mentorship request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getActiveMentorships = async (req, res) => {
    try {
        const mentorships = await MentorshipRequest.find({ 
            alumni: req.user._id,
            status: 'accepted'
        }).populate('student', 'username profile.firstName profile.lastName profile.avatar academic');
        
        res.status(200).json(mentorships);
    } catch (error) {
        console.error('Error fetching active mentorships:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Job posting controllers
exports.createJobPosting = async (req, res) => {
    try {
        const jobData = {
            ...req.body,
            postedBy: req.user._id
        };
        
        const job = new Job(jobData);
        await job.save();
        
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job posting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyJobPostings = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching job postings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateJobPosting = async (req, res) => {
    try {
        const { jobId } = req.params;
        const updates = req.body;
        
        // Prevent updating postedBy
        delete updates.postedBy;
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }
        
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this job posting' });
        }
        
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { $set: updates },
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedJob);
    } catch (error) {
        console.error('Error updating job posting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteJobPosting = async (req, res) => {
    try {
        const { jobId } = req.params;
        
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }
        
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this job posting' });
        }
        
        await Job.findByIdAndDelete(jobId);
        
        res.status(200).json({ message: 'Job posting deleted successfully' });
    } catch (error) {
        console.error('Error deleting job posting:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Event controllers
exports.createEvent = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user._id
        };
        
        const event = new Event(eventData);
        await event.save();
        
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;
        
        // Prevent updating organizer
        delete updates.organizer;
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $set: updates },
            { new: true, runValidators: true }
        );
        
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }
        
        await Event.findByIdAndDelete(eventId);
        
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Network controllers
exports.browseStudents = async (req, res) => {
    try {
        const students = await User.find({ 
            role: 'student',
            'preferences.profileVisibility.profile': true
        }).select('username profile academic');
        
        res.status(200).json(students);
    } catch (error) {
        console.error('Error browsing students:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.connectWithUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if connection already exists
        const existingConnection = await Connection.findOne({
            $or: [
                { requester: req.user._id, recipient: userId },
                { requester: userId, recipient: req.user._id }
            ]
        });
        
        if (existingConnection) {
            return res.status(400).json({ message: 'Connection already exists' });
        }
        
        // Create new connection
        const connection = new Connection({
            requester: req.user._id,
            recipient: userId
        });
        
        await connection.save();
        
        res.status(201).json(connection);
    } catch (error) {
        console.error('Error connecting with user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyConnections = async (req, res) => {
    try {
        const connections = await Connection.find({
            $or: [
                { requester: req.user._id, status: 'accepted' },
                { recipient: req.user._id, status: 'accepted' }
            ]
        }).populate('requester recipient', 'username profile.firstName profile.lastName profile.avatar role');
        
        res.status(200).json(connections);
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const mentorshipRequests = await MentorshipRequest.countDocuments({ 
            alumni: req.user._id,
            status: 'pending'
        });
        
        const activeMentorships = await MentorshipRequest.countDocuments({ 
            alumni: req.user._id,
            status: 'accepted'
        });
        
        const jobPostings = await Job.countDocuments({ postedBy: req.user._id });
        
        const upcomingEvents = await Event.countDocuments({ 
            organizer: req.user._id,
            date: { $gte: new Date() }
        });
        
        const connections = await Connection.countDocuments({
            $or: [
                { requester: req.user._id, status: 'accepted' },
                { recipient: req.user._id, status: 'accepted' }
            ]
        });
        
        res.status(200).json({
            mentorshipRequests,
            activeMentorships,
            jobPostings,
            upcomingEvents,
            connections
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 