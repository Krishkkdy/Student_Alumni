const express = require ("express");
const mongoose = require ("mongoose");

const app = express();
app.use(express.json());

const connectToMongoDB = async () => {
    try {
      await mongoose.connect("mongodb+srv://SGP:HVDVBBdNYpC8kDrX@studentalumni.aiy4n.mongodb.net/?retryWrites=true&w=majority&appName=StudentAlumni", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected To MongoDB");
    } catch (error) {
      console.log("Error Connecting to MongoDB", error.message);
    }
  };

app.get("/",(req,res)=>{
    res.send("Hello");
})

app.listen(3000,()=>{
    connectToMongoDB();
    console.log("Server is runing on 3000");
})