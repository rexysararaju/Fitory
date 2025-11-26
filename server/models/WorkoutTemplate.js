import mongoose from "mongoose";

const workoutTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // Optional: template exercises
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number
      }
    ],

    // Optional: if templates belong to specific users
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  { timestamps: true }
);

const WorkoutTemplate = mongoose.model("WorkoutTemplate", workoutTemplateSchema);

export default WorkoutTemplate;
