import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function WorkoutForm() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [exercises, setExercises] = useState([
        { name: "", sets: 3, reps: 10, weight: 0 },
    ]);

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const addExerciseField = () => {
        setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: 0 }]);
    };

    const removeExerciseField = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await API.post(
                "/workouts",
                { name, description, exercises },
                config
            );

            alert("Workout saved!");
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
                    <div className="form-group">
                        <label>Workout Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Morning Chest Day"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <textarea
                            className="input-field"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="How did it feel?"
                        />
                    </div>

                    <h3 className="section-title">Exercises</h3>
                    {exercises.map((ex, index) => (
                        <div key={index} className="exercise-input-group">
                            <div className="ex-row-main">
                                <input
                                    type="text"
                                    placeholder="Exercise Name (e.g. Bench Press)"
                                    value={ex.name}
                                    onChange={(e) => handleExerciseChange(index, "name", e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeExerciseField(index)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="ex-row-details">
                                <label>
                                    Sets <input type="number" value={ex.sets} onChange={(e) => handleExerciseChange(index, "sets", e.target.value)} />
                                </label>
                                <label>
                                    Reps <input type="number" value={ex.reps} onChange={(e) => handleExerciseChange(index, "reps", e.target.value)} />
                                </label>
                                <label>
                                    Kg <input type="number" value={ex.weight} onChange={(e) => handleExerciseChange(index, "weight", e.target.value)} />
                                </label>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addExerciseField} className="btn-secondary full-width">
                        + Add Exercise
                    </button>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary full-width">
                            Save Workout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default WorkoutForm;