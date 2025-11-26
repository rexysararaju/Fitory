import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, //change to true when auth is implemented
    },
    name: {
      type: String,
      required: [true, "Workout name is required"],
    },
    description: {
      type: String,
    },
    exercises: [
  {
    name: { type: String, required: true },

    // Strength fields
    sets: { type: Number, default: null },
    reps: { type: Number, default: null },
    weight: { type: Number, default: null },

    // Cardio fields
    duration: { type: Number, default: null }, // minutes
    distance: { type: Number, default: null }, // km
    steps: { type: Number, default: null }     // number of steps
  }
  ],

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
