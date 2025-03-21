// const express = require('express');
// const router = express.Router();
// const Job = require('../models/JobSchema');
// const authMiddleware = require('../middleware/authMiddleware');

// router.post('/',authMiddleware, async (req, res) => {
//     try {
//         console.log(req.body);

//         // Convert expiresAt string to a Date object
//         const jobData = {
//             ...req.body,
//             postedBy: req.user._id,
//             expiresAt: new Date(req.body.expiresAt)  // Convert to Date object
//         };

//         const job = new Job(jobData);
//         console.log(job);
//         await job.save();
//         res.status(201).json(job);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Get all job postings
// router.get('/',authMiddleware, async (req, res) => {
//     try {
//         const jobs = await Job.find({ postedBy: req.user._id });
//         res.json(jobs);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get a single job posting by ID
// router.get('/:id',authMiddleware, async (req, res) => {
//     try {
//         const job = await Job.findOne({ _id: req.params.id, postedBy: req.user._id });
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found' });
//         }
//         res.json(job);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Update a job posting
// router.put('/:id',authMiddleware, async (req, res) => {
//     try {
//         const job = await Job.findOneAndUpdate(
//             { _id: req.params.id, postedBy: req.user._id },
//             req.body,
//             { new: true }
//         );
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found' });
//         }
//         res.json(job);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Delete a job posting
// router.delete('/:id',authMiddleware, async (req, res) => {
//     try {
//         const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user._id });
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found' });
//         }
//         res.json({ message: 'Job deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;