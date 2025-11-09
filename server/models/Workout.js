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
        sets: { type: Number, default: 3 },
        reps: { type: Number, default: 10 },
        weight: { type: Number, default: 0 },
      },
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
