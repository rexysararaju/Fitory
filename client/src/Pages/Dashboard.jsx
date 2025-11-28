import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import CalendarView from "../components/CalendarView";

function Dashboard() {
    const navigate = useNavigate(); // Initialize navigation
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const sorted = res.data.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setWorkouts(sorted);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching workouts:", err);
            setLoading(false);
        }
    };

    // Handler to navigate to the form page with existing data
    const handleEdit = (workout) => {
        // Pass the workout object via state to the Create/Edit page
        navigate("/create-workout", { state: { workoutToEdit: workout } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;

        try {
            const token = localStorage.getItem("token");
            await API.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Update UI by filtering out the deleted workout
            setWorkouts(workouts.filter((w) => w._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const filteredWorkouts = selectedDate
        ? workouts.filter(
            (w) =>
                new Date(w.date).toDateString() ===
                selectedDate.toDateString()
        )
        : workouts;

    return (
        <div className="dashboard-bg">
            <Navbar />

            <div className="container">
                <h1 className="page-title">My Workout Log</h1>

                {!loading && (
                    <CalendarView
                        workouts={workouts}
                        onDateChange={setSelectedDate}
                    />
                )}

                <div className="section-header">
                    <h2 className="section-title">
                        {selectedDate
                            ? `Workouts on ${selectedDate.toLocaleDateString()}`
                            : "All History"}
                    </h2>

                    {selectedDate && (
                        <button
                            className="btn-show-all"
                            onClick={() => setSelectedDate(null)}
                        >
                            Show All
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : filteredWorkouts.length === 0 ? (
                    <div className="empty-state">
                        <p>
                            {selectedDate
                                ? "No workouts found on this day."
                                : "No workouts recorded yet."}
                        </p>
                    </div>
                ) : (
                    <div className="workout-grid">
                        {filteredWorkouts.map((w) => (
                            <div key={w._id} className="workout-card">
                                <div className="card-header">
                                    <h3>{w.name}</h3>
                                    <span className="workout-date">
                                        {new Date(w.date).toLocaleDateString()}
                                    </span>
                                </div>

                                {w.description && (
                                    <p className="workout-desc">{w.description}</p>
                                )}

                                <div className="exercise-list">
                                    {w.exercises.map((ex, idx) => (
                                        <div key={idx} className="exercise-item">
                                            <span className="ex-name">{ex.name}</span>
                                            <span className="ex-detail">
                                                {ex.sets != null && ex.reps != null && ex.weight != null && (
                                                    `${ex.sets} sets × ${ex.reps} reps (${ex.weight}kg)`
                                                )}
                                                {ex.steps != null && `${ex.steps} steps`}
                                                {ex.duration != null && `${ex.duration} min cycling`}
                                                {ex.distance != null && `${ex.distance} km`}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons: Edit & Delete */}
                                <div className="card-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => handleEdit(w)}
                                        style={{
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(w._id)}
                                        style={{
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            flex: 1
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

export default Dashboard;