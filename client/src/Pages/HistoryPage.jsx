import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/history.css";

function HistoryPage() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // sort by date newest → oldest
            const sorted = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setWorkouts(sorted);
            setLoading(false);
        } catch (err) {
            console.error(err);
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
                                                {ex.sets} x {ex.reps} ({ex.weight}kg)
                                            </span>
                                        </div>
                                    ))}
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
