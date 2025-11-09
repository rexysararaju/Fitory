import express from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all workout routes
router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/:id", protect, getWorkoutById);
router.patch("/:id", protect, updateWorkout);
router.delete("/:id", protect, deleteWorkout);

export default router;
