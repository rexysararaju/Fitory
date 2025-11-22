import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const res = await API.get("/workouts", config);
            setWorkouts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching workouts:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this workout?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkouts(workouts.filter((w) => w._id !== id)); 
        } catch (err) {
            alert("Failed to delete");
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1 className="page-title">My Workout Log</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : workouts.length === 0 ? (
                    <div className="empty-state">
                        <p>No workouts recorded yet.</p>
                    </div>
                ) : (
                    <div className="workout-grid">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="workout-card">
                                <div className="card-header">
                                    <h3>{workout.name}</h3>
                                    <span className="workout-date">
                                        {new Date(workout.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {workout.description && <p className="workout-desc">{workout.description}</p>}

                                <div className="exercise-list">
                                    {workout.exercises.map((ex, idx) => (
                                        <div key={idx} className="exercise-item">
                                            <span className="ex-name">{ex.name}</span>
                                            <span className="ex-detail">
                                                {ex.sets} sets x {ex.reps} reps ({ex.weight}kg)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(workout._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;