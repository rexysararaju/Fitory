import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // change to true when auth is implemented
    },

    name: {
      type: String,
      required: [true, "Workout name is required"],
    },

    description: {
      type: String,
    },

    // ⭐ NEW: Summary fields (for smart stats)
    duration: {
      type: Number,
      default: 0, // total minutes
    },
    steps: {
      type: Number,
      default: 0, // total steps counted
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
        steps: { type: Number, default: null }, // steps
      }
    ],

    date: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
