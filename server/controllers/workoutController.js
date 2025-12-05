import Workout from "../models/Workout.js";

// ➕ Create a new workout
export const createWorkout = async (req, res) => {
  try {
    const { name, description, date, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workout name is required" });
    }

    // ⭐ Fix timezone — store date EXACTLY as selected
    const localDate = date ? new Date(date + "T00:00:00") : new Date();

    const workout = await Workout.create({
      user: req.user.id,
      name,
      description,
      date: localDate,
      exercises: exercises || [],
      duration: 0,
      steps: 0
    });

    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📚 Get all workouts (newest first)
export const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ date: -1, createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 Get a single workout
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
    let updateData = { ...req.body };

    // ⭐ Fix timezone when updating date
    if (req.body.date) {
      updateData.date = new Date(req.body.date + "T00:00:00");
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
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

// ➕ Add exercise inside workout
export const addExercise = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) return res.status(404).json({ message: "Workout not found" });

    workout.exercises.push(req.body);

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

    // Update the exercise
    Object.assign(exercise, req.body);

    // ⭐ Recalculate workout totals
    let totalDuration = 0;
    let totalSteps = 0;

    workout.exercises.forEach(ex => {
      if (ex.duration) totalDuration += Number(ex.duration);
      if (ex.steps) totalSteps += Number(ex.steps);
    });

    workout.duration = totalDuration;
    workout.steps = totalSteps;

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
