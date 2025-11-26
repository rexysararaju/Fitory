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

            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Sort by workout date
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

    // Filter by selected date
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
                                            {/* Strength */}
                                                {ex.sets != null && ex.reps != null && ex.weight != null && (
                                                 `${ex.sets} sets × ${ex.reps} reps (${ex.weight}kg)`
                                    )}

                                                      {/* Walking */}
                                                          {ex.steps != null && (
                                                         `${ex.steps} steps`
                                    )}

                                                 {/* Cycling */}
                                                {ex.duration != null && (
                                            `${ex.duration} min cycling`
                                              )}

                                              {/* Running */}
                                             {ex.distance != null && (
                                          `${ex.distance} km`
                                                    )}
                                    </span>
                                </div>
                         ))}
                         </div>


                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(w._id)}
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
