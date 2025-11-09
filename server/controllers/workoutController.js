import Workout from "../models/Workout.js";

// ➕ Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const { name, description, exercises } = req.body;

    if (!name) return res.status(400).json({ message: "Workout name required" });

    const workout = await Workout.create({
      user: req.user ? req.user.id : null, // add user ID later with authMiddleware
      name,
      description,
      exercises,
    });

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get all workouts
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get single workout by ID
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update workout
export const updateWorkout = async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWorkout)
      return res.status(404).json({ message: "Workout not found" });
    res.json({
      message: "Workout updated successfully",
      updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete workout
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
