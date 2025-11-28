import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/workoutForm.css";

function WorkoutForm() {
    const navigate = useNavigate();
    const location = useLocation(); // To access passed state

    // State to track if we are editing an existing workout
    const [editingId, setEditingId] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [exercises, setExercises] = useState([
        {
            name: "",
            type: "",
            sets: null, reps: null, weight: null,
            duration: null, distance: null, steps: null
        },
    ]);

    // Effect: Check if data was passed from Dashboard/History
    useEffect(() => {
        if (location.state && location.state.workoutToEdit) {
            const workout = location.state.workoutToEdit;

            // Pre-fill the form with existing data
            setName(workout.name);
            setDescription(workout.description || "");
            setExercises(workout.exercises);
            setEditingId(workout._id); // Set the ID to enable "Edit Mode"
        }
    }, [location.state]);

    const handleExerciseChange = (index, field, value) => {
        const updated = [...exercises];
        updated[index][field] = value;
        setExercises(updated);
    };

    const addExerciseField = () => {
        setExercises([
            ...exercises,
            {
                name: "", type: "",
                sets: null, reps: null, weight: null,
                duration: null, distance: null, steps: null
            }
        ]);
    };

    const removeExerciseField = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { name, description, exercises };

            if (editingId) {
                // If editingId exists, send a PUT request to update
                await API.put(`/workouts/${editingId}`, payload, config);
                alert("Workout updated successfully!");
            } else {
                // Otherwise, send a POST request to create new
                await API.post("/workouts", payload, config);
                alert("Workout saved successfully!");
            }

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Failed to save workout");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container form-container">
                {/* Dynamic Title */}
                <h1 className="page-title">
                    {editingId ? "Edit Workout" : "Record New Workout"}
                </h1>

                <form onSubmit={handleSubmit}>

                    {/* WORKOUT NAME */}
                    <div className="form-group">
                        <label>Workout Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* WORKOUT DESCRIPTION */}
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* EXERCISES */}
                    <h3 className="section-title">Exercises</h3>

                    {exercises.map((ex, index) => (
                        <div key={index} className="exercise-input-group">

                            {/* Exercise Type */}
                            <label>Exercise</label>
                            <select
                                className="input-field"
                                value={ex.type || ""}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    handleExerciseChange(index, "type", selected);

                                    // Logic to auto-fill name based on type
                                    if (selected === "walking") handleExerciseChange(index, "name", "Walking");
                                    if (selected === "running") handleExerciseChange(index, "name", "Running");
                                    if (selected === "cycling") handleExerciseChange(index, "name", "Cycling");

                                    // Clear name if Custom or Strength selected
                                    if (selected === "strength" || selected === "custom") {
                                        handleExerciseChange(index, "name", "");
                                    }
                                }}
                                required
                            >
                                <option value="">Select Exercise</option>
                                <option value="strength">💪 Strength</option>
                                <option value="walking">🚶 Walking</option>
                                <option value="running">🏃 Running</option>
                                <option value="cycling">🚴 Cycling</option>
                                <option value="custom">✏️ Custom</option>
                            </select>

                            {/* Conditional Inputs based on Type */}
                            {(ex.type === "strength" || ex.type === "custom") && (
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter exercise name"
                                    value={ex.name}
                                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                    required
                                />
                            )}

                            {/* Detail Fields (Sets/Reps/Weight etc.) */}
                            {ex.type === "strength" && (
                                <div className="ex-row-details">
                                    <label>Sets <input type="number" value={ex.sets || ""} onChange={(e) => handleExerciseChange(index, "sets", e.target.value)} /></label>
                                    <label>Reps <input type="number" value={ex.reps || ""} onChange={(e) => handleExerciseChange(index, "reps", e.target.value)} /></label>
                                    <label>Weight (kg) <input type="number" value={ex.weight || ""} onChange={(e) => handleExerciseChange(index, "weight", e.target.value)} /></label>
                                </div>
                            )}

                            {ex.type === "walking" && (
                                <div className="ex-row-details">
                                    <label>Steps <input type="number" value={ex.steps || ""} onChange={(e) => handleExerciseChange(index, "steps", e.target.value)} /></label>
                                </div>
                            )}

                            {ex.type === "cycling" && (
                                <div className="ex-row-details">
                                    <label>Duration (min) <input type="number" value={ex.duration || ""} onChange={(e) => handleExerciseChange(index, "duration", e.target.value)} /></label>
                                </div>
                            )}

                            {ex.type === "running" && (
                                <div className="ex-row-details">
                                    <label>Distance (km) <input type="number" value={ex.distance || ""} onChange={(e) => handleExerciseChange(index, "distance", e.target.value)} /></label>
                                </div>
                            )}

                            {/* REMOVE BUTTON */}
                            <button
                                type="button"
                                className="btn-delete"
                                onClick={() => removeExerciseField(index)}
                            >
                                Remove Exercise
                            </button>
                        </div>
                    ))}

                    {/* ADD & SUBMIT BUTTONS */}
                    <button type="button" onClick={addExerciseField} className="btn-secondary full-width">
                        + Add Exercise
                    </button>

                    <button type="submit" className="btn-primary full-width">
                        {/* Change button text based on mode */}
                        {editingId ? "Update Workout" : "Save Workout"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WorkoutForm;