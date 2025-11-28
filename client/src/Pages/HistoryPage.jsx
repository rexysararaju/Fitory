import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/history.css";

function HistoryPage() {
    const navigate = useNavigate(); // Initialize navigation
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const sorted = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setWorkouts(sorted);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Navigate to form with workout data
    const handleEdit = (workout) => {
        navigate("/create-workout", { state: { workoutToEdit: workout } });
    };

    // Delete workout logic
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;
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
        <div className="dashboard-bg">
            <Navbar />

            <div className="history-container">
                <h1 className="page-title">Workout History</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : workouts.length === 0 ? (
                    <div className="empty-state">
                        <p>No workouts recorded yet.</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="history-card">
                                <div className="history-header">
                                    <h3>{workout.name}</h3>
                                    <span className="history-date">
                                        {new Date(workout.date).toLocaleDateString()}
                                    </span>
                                </div>

                                {workout.description && (
                                    <p className="history-desc">{workout.description}</p>
                                )}

                                <div className="exercise-list">
                                    {workout.exercises.map((ex, idx) => (
                                        <div key={idx} className="exercise-item">
                                            <span className="ex-name">{ex.name}</span>
                                            <span className="ex-detail">
                                                {ex.sets ? `${ex.sets} x ${ex.reps} (${ex.weight}kg)` : ''}
                                                {ex.steps ? `${ex.steps} steps` : ''}
                                                {ex.duration ? `${ex.duration} min` : ''}
                                                {ex.distance ? `${ex.distance} km` : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons Container */}
                                <div className="history-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={() => handleEdit(workout)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(workout._id)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HistoryPage;