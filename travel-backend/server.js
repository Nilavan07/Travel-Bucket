require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const connectDB = require("./config/db");
const destinationsRouter = require("./routes/destinations");
const usersRouter = require("./routes/auth"); // Add this if you have user/auth routes
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🌍 Destination Management API is running");
});

app.use("/api/destinations", destinationsRouter);
app.use("/api/users", usersRouter); // Optional: only if user management is added

// Global error handler
app.use(errorHandler);

// Start server only when DB connection is successful
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
