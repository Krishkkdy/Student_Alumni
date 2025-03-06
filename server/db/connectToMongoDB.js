const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected To MongoDB");
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error.message);
  }
};

module.exports = connectToMongoDB;