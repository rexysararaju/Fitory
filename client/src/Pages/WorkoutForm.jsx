import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/workoutForm.css";

function WorkoutForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const prefillDate = location.state?.prefillDate || null;

    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); // How you felt
    const [date, setDate] = useState(
        prefillDate ? new Date(prefillDate).toISOString().split("T")[0] : ""
    );

    const [exercises, setExercises] = useState([
        { name: "", type: "", sets: "", reps: "", weight: "", duration: "", distance: "", steps: "" }
    ]);

    const fromHistory = location.state?.fromHistory || false;

    // Prefill when editing
    useEffect(() => {
        if (location.state?.workoutToEdit) {
            const workout = location.state.workoutToEdit;
            setName(workout.name);
            setDescription(workout.description || "");
            setExercises(workout.exercises);
            setEditingId(workout._id);
            setDate(workout.date?.split("T")[0] || "");
        }
    }, [location.state]);

    const handleExerciseChange = (i, field, value) => {
        const updated = [...exercises];
        updated[i][field] = value;
        setExercises(updated);
    };

    const addExerciseField = () =>
        setExercises([...exercises, { name: "", type: "", sets: "", reps: "", weight: "", duration: "", distance: "", steps: "" }]);

    const removeExerciseField = (i) =>
        setExercises(exercises.filter((_, x) => x !== i));

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { name, description, exercises, date };

            editingId
                ? await API.put(`/workouts/${editingId}`, payload, config)
                : await API.post(`/workouts`, payload, config);

            alert(editingId ? "Workout updated!" : "Workout saved!");

            // return to correct place
            navigate(fromHistory ? "/history" : "/dashboard");
        } catch {
            alert("Failed to save workout");
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />

            <main className="main-content">
                <div className="content-card">

                    <div className="page-header-row">
                        <h1 className="page-title">
                            {editingId ? "Edit Workout" : "Record New Workout"}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>

                        {/* Workout Name */}
                        <div className="form-group">
                            <label className="section-title">Workout Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* How did you feel? */}
                        <div className="form-group">
                            <label className="section-title">How did you feel?</label>
                            <textarea
                                className="input-field"
                                placeholder="Optional — describe your mood, energy, or notes"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label className="section-title">Workout Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        {/* Exercises */}
                        <h2 className="section-title" style={{ marginTop: 10 }}>Exercises</h2>

                        {exercises.map((ex, index) => (
                            <div key={index} className="workout-card">

                                {/* Exercise Type */}
                                <label className="ex-name">Exercise Type</label>
                                <select
                                    className="input-field"
                                    value={ex.type}
                                    onChange={(e) => {
                                        const t = e.target.value;
                                        handleExerciseChange(index, "type", t);

                                        if (t === "running") handleExerciseChange(index, "name", "Running");
                                        if (t === "walking") handleExerciseChange(index, "name", "Walking");
                                        if (t === "cycling") handleExerciseChange(index, "name", "Cycling");
                                        if (t === "strength" || t === "custom") handleExerciseChange(index, "name", "");
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

                                {/* Custom Name */}
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

                                {/* Strength Fields */}
                                {ex.type === "strength" && (
                                    <div className="ex-row-details">
                                        <label>Sets
                                            <input type="number" value={ex.sets || ""} onChange={(e) => handleExerciseChange(index, "sets", e.target.value)} />
                                        </label>

                                        <label>Reps
                                            <input type="number" value={ex.reps || ""} onChange={(e) => handleExerciseChange(index, "reps", e.target.value)} />
                                        </label>

                                        <label>Weight (kg)
                                            <input type="number" value={ex.weight || ""} onChange={(e) => handleExerciseChange(index, "weight", e.target.value)} />
                                        </label>
                                    </div>
                                )}

                                {/* WALKING */}
                                {ex.type === "walking" && (
                                    <>
                                        <label>Steps
                                            <input type="number" value={ex.steps || ""} onChange={(e) => handleExerciseChange(index, "steps", e.target.value)} />
                                        </label>

                                        <label>Duration (min)
                                            <input type="number" value={ex.duration || ""} onChange={(e) => handleExerciseChange(index, "duration", e.target.value)} />
                                        </label>
                                    </>
                                )}

                                {/* RUNNING */}
                                {ex.type === "running" && (
                                    <>
                                        <label>Distance (km)
                                            <input type="number" value={ex.distance || ""} onChange={(e) => handleExerciseChange(index, "distance", e.target.value)} />
                                        </label>

                                        <label>Duration (min)
                                            <input type="number" value={ex.duration || ""} onChange={(e) => handleExerciseChange(index, "duration", e.target.value)} />
                                        </label>
                                    </>
                                )}

                                {/* CYCLING */}
                                {ex.type === "cycling" && (
                                    <label>Duration (min)
                                        <input type="number" value={ex.duration || ""} onChange={(e) => handleExerciseChange(index, "duration", e.target.value)} />
                                    </label>
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

                        <button type="button" onClick={addExerciseField} className="btn-secondary full-width">
                            + Add Exercise
                        </button>

                        <button type="submit" className="btn-primary full-width">
                            {editingId ? "Update Workout" : "Save Workout"}
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}

export default WorkoutForm;
