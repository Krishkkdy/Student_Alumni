// const mongoose = require('mongoose');

// const JobSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     company: { type: String, required: true },
//     location: { type: String, required: true },
//     description: { type: String, required: true },
//     requirements: [String],
//     type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'] },
//     salary: { type: String },
//     applicationLink: { type: String },
//     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     createdAt: { type: Date, default: Date.now },
//     expiresAt: { type: Date }
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Job', JobSchema);