// index.js
import express from "express";
import cors from "cors";
import connectToMongo from "./db.js";
import authRoute from "./routes/auth.js";


const app = express();

// Connect to MongoDB
connectToMongo();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);


// Static uploads folder
app.use("/uploads", express.static("uploads"));

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
app.listen(8001, () => {
  console.log("App listening at http://localhost:8001");
});
