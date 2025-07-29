require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");
const destinationsRouter = require("./routes/destinations");
const usersRouter = require("./routes/auth"); // Only if you have user/auth routes
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// 🌐 Connect to MongoDB
connectDB();

// 🔒 Enable CORS for frontend on Vercel
app.use(cors({
  origin: "https://travel-bucket-u4xg.vercel.app",
  credentials: true, // Required if frontend uses credentials (cookies, auth headers)
}));

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🌍 Destination Management API is running");
});

app.use("/api/destinations", destinationsRouter);
app.use("/api/users", usersRouter); // Optional: only if you have auth

// Global error handler
app.use(errorHandler);

// Start server only after DB connection
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📡 Connected to MongoDB at: ${mongoose.connection.host}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
