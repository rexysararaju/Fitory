import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";   // ← 直接复用 Dashboard 样式！
import "../styles/general.css"; 


function HistoryPage() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setWorkouts(sorted);
        } catch {
            alert("Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (workout) => {
        navigate("/create-workout", { state: { workoutToEdit: workout } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkouts(workouts.filter(w => w._id !== id));
        } catch {
            alert("Failed to delete");
        }
    };

    useEffect(() => { fetchWorkouts(); }, []);

    return (
        <div className="dashboard-layout">
            <Navbar />

            <main className="main-content">
                <div className="content-card">

                    {/* Header */}
                    <div className="page-header-row">
                        <h1 className="page-title">Workout History</h1>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : workouts.length === 0 ? (
                        <div className="empty-state">
                            <p>No workouts recorded yet.</p>
                        </div>
                    ) : (
                        <div className="workout-grid"> {/* 🔥 与 Dashboard 卡片网格一致 */}
                            {workouts.map(workout => (
                                <div key={workout._id} className="workout-card">

                                    <div className="card-header">
                                        <h3>{workout.name}</h3>
                                        <span className="workout-date">
                                            {new Date(workout.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {workout.description && (
                                        <p className="workout-desc">{workout.description}</p>
                                    )}

                                    <div className="exercise-list">
                                        {workout.exercises.map((ex, i) => (
                                            <div key={i} className="exercise-item">
                                                <span className="ex-name">{ex.name}</span>
                                                <span className="ex-detail">
                                                    {ex.sets ? `${ex.sets}x${ex.reps}` : ''}
                                                    {ex.weight ? ` (${ex.weight}kg)` : ''}
                                                    {ex.steps ? `${ex.steps} steps` : ''}
                                                    {ex.duration ? `${ex.duration} min` : ''}
                                                    {ex.distance ? `${ex.distance} km` : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="card-actions" style={{ marginTop: 15, display:"flex", gap:10 }}>
                                        <button className="btn-secondary"
                                            onClick={() => handleEdit(workout)} 
                                            //style={{flex:1, padding:'8px', borderRadius:8, border:'none', background:"#4CAF50", color:"#fff"}}
                                        >Edit</button>

                                        <button className="delete-button"
                                            onClick={() => handleDelete(workout._id)}
                                            //style={{flex:1, padding:'8px', borderRadius:8, border:'none', background:"#f44336", color:"#fff"}}
                                        >Delete</button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default HistoryPage;
