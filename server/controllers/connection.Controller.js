// controllers/connectionController.js
const Request = require("../models/requestSchema");
const Connection = require("../models/connectionSchema");

// Send a connection request
exports.sendRequest = async (req, res) => {
    const { senderId, senderType, receiverId, receiverType } = req.body;

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
