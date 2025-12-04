import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import API from "../api/api";
import Navbar from "../components/Navbar"; 
import CalendarView from "../components/CalendarView";
import "../styles/general.css"; 

function HistoryPage() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // store the workout _id waiting for confirmation
    const [message, setMessage] = useState(null);



    // Fetch logic
    const fetchWorkouts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/workouts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setWorkouts(sorted);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching workouts:", err);
            setLoading(false);
        }
    };  

    const handleEdit = (workout) => {
        navigate("/create-workout", { state: { workoutToEdit: workout } });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/workouts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setWorkouts(workouts.filter(w => w._id !== id));
            setMessage("Workout deleted.");
            setTimeout(() => setMessage(null), 2000);
        } catch (err) {
            setMessage("Failed to delete.");
            setTimeout(() => setMessage(null), 2000);
        }
    };  



    useEffect(() => {
        fetchWorkouts();
    }, []);

    const filteredWorkouts = selectedDate
        ? workouts.filter((w) => new Date(w.date).toDateString() === selectedDate.toDateString())
        : workouts;

    return (
        <div className="dashboard-layout">
            
            <Navbar />

            {/* 3. right side: main content */}
            <main className="main-content">
                <div className="content-card">
                    
                    <div className="page-header-row">
                        {message && (
                            <div className="notice-banner">
                                {message}
                            </div>
                        )}

                        <h1 className="page-title">
                             {selectedDate 
                                ? selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) 
                                : "My Workout Log"}
                        </h1>
                        <Link to="/create-workout" className="btn-record">
                            + Record Workout
                        </Link>
                    </div>

                    {!loading && (
                        <div style={{marginBottom: '30px'}}>
                            <CalendarView
                                workouts={workouts}
                                onDateChange={setSelectedDate}
                            />
                            {selectedDate && (
                                <button 
                                    className="btn-record selected-add-btn"
                                    onClick={() => navigate("/create-workout", { state: { prefillDate: selectedDate } })}
                                    style={{ marginBottom: "20px" }}
                                >
                                    + Add Workout on {selectedDate.toLocaleDateString()}
                                </button>
                            )}

                        </div>
                    )}

                    <div className="section-header">
                        <h2 className="section-title">
                            {selectedDate
                                ? `Workouts on ${selectedDate.toLocaleDateString()}`
                                : "All History"}
                        </h2>
                        {selectedDate && (
                            <button className="btn-show-all" onClick={() => setSelectedDate(null)}>
                                Show All
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : filteredWorkouts.length === 0 ? (
                        <div className="empty-state">
                            <p>{selectedDate ? "No workouts found on this day." : "No workouts recorded yet."}</p>
                        </div>
                    ) : (
                        <div className="workout-grid">
                            {filteredWorkouts.map((w) => (
                                <div key={w._id} className="workout-card">
                                    <div className="card-header">
                                        <h3>{w.name}</h3>
                                        <span className="workout-date">{new Date(w.date).toLocaleDateString()}</span>
                                    </div>
                                    {w.description && <p className="workout-desc">{w.description}</p>}
                                    <div className="exercise-list">
                                        {w.exercises.map((ex, idx) => (
                                            <div key={idx} className="exercise-item">
                                                <span className="ex-name">{ex.name}</span>
                                                <span className="ex-detail">
                                                    {ex.sets && `${ex.sets}x${ex.reps}`}
                                                    {ex.weight && ` (${ex.weight}kg)`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="card-actions" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleEdit(w)} 
                                            className="btn edit"//style={{flex:1, cursor:'pointer', padding:'8px', color:'black', border:'none', borderRadius:'30px'}}
                                            >Edit</button>
                                        
                                        <button
                                            className={confirmDelete === w._id ? "delete-confirm" : "delete-button"}
                                            onClick={() => {
                                                // first click asks for confirmation
                                                if (confirmDelete !== w._id) {
                                                    setConfirmDelete(w._id);
                                                
                                                    // auto cancel after 3 seconds
                                                    setTimeout(() => {
                                                        setConfirmDelete(null);
                                                    }, 3000);
                                                    return;
                                                }
                                            
                                                // second click → delete
                                                handleDelete(w._id);
                                                setConfirmDelete(null);
                                            }}
                                        >                                       
                                            {confirmDelete === w._id ? "Confirm?" : "Delete"}
                                        </button>

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