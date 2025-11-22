import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import CalendarView from "../components/CalendarView";

function Dashboard() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState(null);

    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const res = await API.get("/workouts", config);

            const sortedData = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setWorkouts(sortedData);
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

    const filteredWorkouts = selectedDate
        ? workouts.filter(workout =>
            new Date(workout.createdAt).toDateString() === selectedDate.toDateString()
        )
        : workouts;

    return (
        <div>
            <Navbar />
            <div className="container">
                <h1 className="page-title">My Workout Log</h1>

                {!loading && (
                    <CalendarView
                        workouts={workouts}
                        onDateChange={setSelectedDate}
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', marginBottom: '15px' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                        {selectedDate
                            ? `Workouts on ${selectedDate.toLocaleDateString()}`
                            : "All History"}
                    </h2>

                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate(null)}
                            style={{ padding: '8px 12px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
                        {filteredWorkouts.map((workout) => (
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