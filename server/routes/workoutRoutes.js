import express from "express";
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  addExercise,
  updateExercise,
  deleteExercise
} from "../controllers/workoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Workout CRUD
router.post("/", protect, createWorkout);
router.get("/", protect, getWorkouts);
router.get("/:id", protect, getWorkoutById);
router.put("/:id", protect, updateWorkout);
router.delete("/:id", protect, deleteWorkout);

// Exercise CRUD
router.post("/:id/exercises", protect, addExercise);
router.put("/:id/exercises/:exerciseId", protect, updateExercise);
router.delete("/:id/exercises/:exerciseId", protect, deleteExercise);

export default router;
