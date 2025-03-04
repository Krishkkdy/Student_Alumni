const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userSchema");
const Auth = require("./models/authSchema");

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

app.post("/create/user_info", async (req, res) => {
  console.log
});

app.post("/create/user", async (req, res) => {
  console.log(req.body);
  let auth_info = req.body;
  try {
    let auth_details = await Auth.create({
      username: auth_info.username,  // Replace with a valid User ObjectId
      email: auth_info.email,
      password_hash: auth_info.password, // Hashed password
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ message: "✅ User created successfully!", auth: auth_details });
    res.send("Successfully created")

  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
})

app.get("/user/:email", async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

app.listen(3000, () => {
  connectToMongoDB();
  console.log("🚀 Server is running on port 3000");
});
