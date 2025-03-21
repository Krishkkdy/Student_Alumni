// controllers/connectionController.js
const Request = require("../models/requestSchema");
const Connection = require("../models/connectionSchema");
const mongoose = require("mongoose");

// Send a connection request
exports.sendRequest = async (req, res) => {
    const { senderId, senderType, receiverId, receiverType } = req.body;

    // Validate ObjectIds
    console.log(req.body);
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid senderId or receiverId." });
    }

    try {
        // Check if a request already exists
        const existingRequest = await Request.findOne({
            senderId,
            receiverId,
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent." });
        }

        // Create a new request
        const newRequest = new Request({
            senderId,
            senderType,
            receiverId,
            receiverType,
            status: "pending",
        });

        await newRequest.save();

        res.status(201).json({ message: "Request sent successfully.", request: newRequest });
    } catch (err) {
        console.error("Error in sendRequest:", err); // Log the error
        res.status(500).json({ message: "Error sending request.", error: err.message });
    }
};

// controllers/connectionController.js
exports.acceptRequest = async (req, res) => {
    const { requestId } = req.body;

    try {
        // Find the request
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found." });
        }

        // Update the request status to "accepted"
        request.status = "accepted";
        await request.save();

        // Create a new connection
        const newConnection = new Connection({
            user1Id: request.senderId,
            user1Type: request.senderType,
            user2Id: request.receiverId,
            user2Type: request.receiverType,
            status: "accepted",
        });

        await newConnection.save();

        res.status(200).json({ message: "Request accepted and connection established.", connection: newConnection });
    } catch (err) {
        res.status(500).json({ message: "Error accepting request.", error: err.message });
    }
};

exports.getRequests = async (req, res) => {
    const { userId, userType } = req.query;

    try {
        const requests = await Request.find({
            $or: [
                { senderId: userId, senderType: userType }, // Requests where user is the sender
                { receiverId: userId, receiverType: userType }, // Requests where user is the receiver
            ],
        });

        res.status(200).json({ data: requests });
    } catch (err) {
        res.status(500).json({ message: "Error fetching requests.", error: err.message });
    }
};

// Get all connections for a user
exports.getConnections = async (req, res) => {
    const { userId, userType } = req.query;

    try {
        const connections = await Connection.find({
            $or: [
                { user1Id: userId, user1Type: userType },
                { user2Id: userId, user2Type: userType },
            ],
            status: "accepted",
        });

        res.status(200).json({ data: connections });
    } catch (err) {
        res.status(500).json({ message: "Error fetching connections.", error: err.message });
    }
};

// Reject a connection request
exports.rejectRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await Request.findByIdAndDelete(requestId);

        if (!request) {
            return res.status(404).json({ message: "Request not found." });
        }

        res.status(200).json({ message: "Request rejected successfully." });
    } catch (err) {
        res.status(500).json({ message: "Error rejecting request.", error: err.message });
    }
};
