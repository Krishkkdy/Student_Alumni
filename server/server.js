const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");
const Auth = require("./models/authSchema");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "your_secret_key_here"; // Replace with a strong secret key

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://SGP:HVDVBBdNYpC8kDrX@studentalumni.aiy4n.mongodb.net/", {
    });
    console.log("✅ Connected To MongoDB");
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error.message);
  }
};

app.get("/", (req, res) => {
  res.send("Hello, Welcome to the Student-Alumni Platform!");
});

// REGISTER API
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Auth.create({
      username,
      email,
      password_hash: hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ message: "✅ User registered successfully!", user: newUser });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "✅ Login successful", token });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.listen(3000, () => {
  connectToMongoDB();
  console.log("🚀 Server is running on port 3000");
});
