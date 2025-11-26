import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

import templateRoutes from "./routes/templateRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Fitory backend is running ✅");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Workout routes
app.use("/api/workouts", workoutRoutes);

// Workout Template routes
app.use("/api/templates", templateRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
