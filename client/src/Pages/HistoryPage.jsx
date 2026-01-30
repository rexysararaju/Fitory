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
            setMessage({ type: 'success', text: 'Workout deleted.' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete.' });
            setTimeout(() => setMessage(null), 3000);
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

            {/* Modal popup for messages */}
            {message && (
                <div className="modal-overlay" onClick={() => setMessage(null)}>
                    <div className={`modal-popup modal-${message.type}`} onClick={(e) => e.stopPropagation()}>
                        <p>{message.text}</p>
                        <button onClick={() => setMessage(null)} className="modal-close-btn">Close</button>
                    </div>
                </div>
            )}

            {/* 3. right side: main content */}
            <main className="main-content">
                <div className="content-card">
                    
                    <div className="page-header-row">
                        <h1 className="dashboard-title">
                             {selectedDate 
                                ? selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) 
                                : "History"}
                        </h1>
                        
                        {selectedDate && (
                                <button 
                                    className="btn-record"
                                    onClick={() => navigate("/create-workout", { state: { prefillDate: selectedDate } })}
                                >
                                    + Record Workout
                                </button>
                            )}
                    </div>

                    {!loading && (
                        <div style={{marginBottom: '30px'}}>
                            <CalendarView
                                workouts={workouts}
                                onDateChange={setSelectedDate}
                            />

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
                        <div className="recent-grid">
                        {filteredWorkouts.slice(0,3).map(w => (
                            <div key={w._id} className="recent-card">
                                
                                <h3>{w.name}</h3>
                
                                <p className="date">
                                    📅 {new Date(w.date).toLocaleDateString()}
                                </p>
                
                                <p className="desc">{w.description}</p>
                        
                                <div className="exercise-list">
                                    {w.exercises.map(ex => (
                                        <div className="exercise-block" key={ex.name}>
                                            <span>🔵 {ex.name}</span>
                                            <p className="muted">
                                                {ex.sets && `${ex.sets}×${ex.reps} reps @ ${ex.weight}kg`}
                                                {ex.duration && `${ex.duration} min`}
                                                {ex.steps && `${ex.steps} steps`}
                                                {ex.distance && `${ex.distance} km`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="row-btn">
                                    <button className="btn edit"
                                        onClick={() => handleEdit(w)}
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