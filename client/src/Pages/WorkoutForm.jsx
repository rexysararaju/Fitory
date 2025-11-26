import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/workoutForm.css";

function WorkoutForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [exercises, setExercises] = useState([
        { 
            name: "", 
            type: "", 
            sets: null, 
            reps: null, 
            weight: null,
            duration: null,
            distance: null,
            steps: null 
        },
    ]);

    const handleExerciseChange = (index, field, value) => {
        const updated = [...exercises];
        updated[index][field] = value;
        setExercises(updated);
    };

    const addExerciseField = () => {
        setExercises([
            ...exercises,
            { 
                name: "", 
                type: "", 
                sets: null, 
                reps: null, 
                weight: null,
                duration: null,
                distance: null,
                steps: null 
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

            await API.post(
                "/api/workouts",
                { name, description, exercises },
                config
            );

            alert("Workout saved successfully!");
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
                <h1 className="page-title">Record New Workout</h1>

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

                                    // Auto-name cardio
                                    if (selected === "walking") handleExerciseChange(index, "name", "Walking");
                                    if (selected === "running") handleExerciseChange(index, "name", "Running");
                                    if (selected === "cycling") handleExerciseChange(index, "name", "Cycling");

                                    // Strength & custom require manual typing
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

                            {/* Name input only for strength OR custom */}
                            {(ex.type === "strength" || ex.type === "custom") && (
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter exercise name (e.g., Walking Lunges)"
                                    value={ex.name}
                                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                    required
                                />
                            )}

                            {/* CONDITIONAL FIELDS */}
                            {ex.type === "strength" && (
                                <div className="ex-row-details">
                                    <label>
                                        Sets
                                        <input 
                                            type="number"
                                            value={ex.sets || ""}
                                            onChange={(e) => handleExerciseChange(index, "sets", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Reps
                                        <input 
                                            type="number"
                                            value={ex.reps || ""}
                                            onChange={(e) => handleExerciseChange(index, "reps", e.target.value)}
                                        />
                                    </label>

                                    <label>
                                        Weight (kg)
                                        <input 
                                            type="number"
                                            value={ex.weight || ""}
                                            onChange={(e) => handleExerciseChange(index, "weight", e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}

                            {ex.type === "walking" && (
                                <div className="ex-row-details">
                                    <label>
                                        Steps
                                        <input 
                                            type="number"
                                            value={ex.steps || ""}
                                            onChange={(e) => handleExerciseChange(index, "steps", e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}

                            {ex.type === "cycling" && (
                                <div className="ex-row-details">
                                    <label>
                                        Duration (minutes)
                                        <input 
                                            type="number"
                                            value={ex.duration || ""}
                                            onChange={(e) => handleExerciseChange(index, "duration", e.target.value)}
                                        />
                                    </label>
                                </div>
                            )}

                            {ex.type === "running" && (
                                <div className="ex-row-details">
                                    <label>
                                        Distance (km)
                                        <input 
                                            type="number"
                                            value={ex.distance || ""}
                                            onChange={(e) => handleExerciseChange(index, "distance", e.target.value)}
                                        />
                                    </label>
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

                    {/* ADD & SAVE BUTTONS */}
                    <button 
                        type="button" 
                        onClick={addExerciseField} 
                        className="btn-secondary full-width"
                    >
                        + Add Exercise
                    </button>

                    <button type="submit" className="btn-primary full-width">
                        Save Workout
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WorkoutForm;
