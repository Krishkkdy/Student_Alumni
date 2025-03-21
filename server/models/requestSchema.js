const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderType", // Dynamic reference based on senderType
      required: true,
    },
    senderType: {
      type: String,
      enum: ["Alumni", "Student","alumni", "student"], // Sender can be either Alumni or Student
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverType", // Dynamic reference based on receiverType
      required: true,
    },
    receiverType: {
      type: String,
      enum: ["Alumni", "Student","alumni", "student"], // Receiver can be either Alumni or Student
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // Allowed request statuses
      default: "pending", // Default status is "pending"
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to the current date and time
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Index to ensure unique requests between sender and receiver
requestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;