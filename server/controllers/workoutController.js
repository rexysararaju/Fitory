import Workout from "../models/Workout.js";

// ➕ Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const { name, description, date, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workout name is required" });
    }

    const workout = await Workout.create({
      user: req.user.id, // Logged-in user
      name,
      description,
      date: date || Date.now(),
      exercises: exercises || []
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📚 Get all workouts (for Dashboard + History + Progress)
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: -1 }); // newest first

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get a single workout by ID
export const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update workout details (name, description, date)
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete workout
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ Add exercise inside a workout
export const addExercise = async (req, res) => {
  try {
    const { name, sets, reps, weight, muscleGroup } = req.body;

    const workout = await Workout.findOne({ _id: req.params.id, user: req.user.id });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    workout.exercises.push({
      name,
      sets,
      reps,
      weight,
      muscleGroup
    });

    await workout.save();

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update a specific exercise inside workout
export const updateExercise = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    const exercise = workout.exercises.id(req.params.exerciseId);

    if (!exercise) return res.status(404).json({ message: "Exercise not found" });

    // update fields
    Object.assign(exercise, req.body);

    await workout.save();

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete an exercise inside workout
export const deleteExercise = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    const exercise = workout.exercises.id(req.params.exerciseId);

    if (!exercise) return res.status(404).json({ message: "Exercise not found" });

    exercise.remove();
    await workout.save();

    res.json({ message: "Exercise deleted", workout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
