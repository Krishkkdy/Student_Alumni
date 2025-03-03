const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userSchema"); 

const app = express();
app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://SGP:HVDVBBdNYpC8kDrX@studentalumni.aiy4n.mongodb.net/StudentAlumni", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected To MongoDB");
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error.message);
  }
};

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Student-Alumni Platform!");
});

// app.get("/create", async (req, res) => {
//   try {
    
//     let user_details = await User.create({
//       name: "John Doe",
//       email: "johnny@example.com",
//       phone: "+1234567890",
//       role: "alumni",
//       profile_picture: "https://example.com/profile/johndoe.jpg",
//       bio: "Software Engineer with 5 years of experience in full-stack development.",
//       skills: ["JavaScript", "React", "Node.js", "MongoDB"],
//       education: ["65c9a10f9a7b410001cfd123"],  // Use valid ObjectId references
//       work_experience: ["65c9a10f9a7b410001cfd456"],  // Use valid ObjectId references
//       linkedin_profile: "https://linkedin.com/in/johndoe"
//     });

//     res.status(201).json({ message: "✅ User created successfully!", user: user_details });

//   } catch (error) {
//     console.error("❌ Error creating user:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });

app.listen(3000, () => {
  connectToMongoDB();
  console.log("🚀 Server is running on port 3000");
});
