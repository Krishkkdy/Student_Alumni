const express = require('express');
const router = express.Router();
const alumniAuth = require('../middleware/alumniAuth');
const studentController = require('../controllers/student.controller');

router.get('/all-students',studentController.getAllprofile);

module.exports = router;