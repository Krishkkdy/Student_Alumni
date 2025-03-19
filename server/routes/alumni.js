const express = require('express');
const router = express.Router();
const alumniAuth = require('../middleware/alumniAuth');
const alumniController = require('../controllers/alumni.controller');

router.get('/all-alumni',alumniController.getAllprofile);
router.get('/profile/:id',alumniController.profileView);

// Alumni profile routes
router.get('/profile', alumniAuth, alumniController.getProfile);
router.put('/profile', alumniAuth, alumniController.updateProfile);

// Mentorship routes
router.get('/mentorship/requests', alumniAuth, alumniController.getMentorshipRequests);
router.post('/mentorship/respond/:requestId', alumniAuth, alumniController.respondToMentorshipRequest);
router.get('/mentorship/active', alumniAuth, alumniController.getActiveMentorships);

// Job posting routes
router.post('/jobs', alumniAuth, alumniController.createJobPosting);
router.get('/jobs', alumniAuth, alumniController.getMyJobPostings);
router.put('/jobs/:jobId', alumniAuth, alumniController.updateJobPosting);
router.delete('/jobs/:jobId', alumniAuth, alumniController.deleteJobPosting);

// Event routes
router.post('/events', alumniAuth, alumniController.createEvent);
router.get('/events', alumniAuth, alumniController.getMyEvents);
router.put('/events/:eventId', alumniAuth, alumniController.updateEvent);
router.delete('/events/:eventId', alumniAuth, alumniController.deleteEvent);

// Network routes
router.get('/network/students', alumniAuth, alumniController.browseStudents);
router.post('/network/connect/:userId', alumniAuth, alumniController.connectWithUser);
router.get('/network/connections', alumniAuth, alumniController.getMyConnections);

// Dashboard statistics
router.get('/dashboard/stats', alumniAuth, alumniController.getDashboardStats);

module.exports = router; 