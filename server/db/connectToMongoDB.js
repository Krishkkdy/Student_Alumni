const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    try {
      await mongoose.connect("mongodb+srv://SGP:HVDVBBdNYpC8kDrX@studentalumni.aiy4n.mongodb.net/StudentAlumni", {
        
      });
      console.log("✅ Connected To MongoDB");
    } catch (error) {
      console.error("❌ Error Connecting to MongoDB:", error.message);
    }
  };

module.exports = connectToMongoDB;