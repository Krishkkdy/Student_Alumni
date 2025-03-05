const express = require("express");
const authRoutes = require("./routes/auth.routes");
const connectToMongoDB = require("./db/connectToMongoDB");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);

app.listen(3000, () => {
  connectToMongoDB();
  console.log("🚀 Server is running on port 3000");
});
