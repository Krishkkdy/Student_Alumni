const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    user1Id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "user1Type", // Dynamic reference based on user1Type
      required: true,
    },
    user1Type: {
      type: String,
      enum: ["Alumni", "Student"], // User1 can be either Alumni or Student
      required: true,
    },
    user2Id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "user2Type", // Dynamic reference based on user2Type
      required: true,
    },
    user2Type: {
      type: String,
      enum: ["Alumni", "Student"], // User2 can be either Alumni or Student
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // Allowed connection statuses
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

// Index to ensure unique connections between two users
connectionSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;