import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import API from "../api/api";
import Navbar from "../components/Navbar"; 
import "../styles/general.css"; 

function Dashboard() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

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

    function getStreak(workouts) {
        if (workouts.length === 0) return 0;

        // Extract unique workout dates in yyyy-mm-dd format
        const dates = new Set(
            workouts.map(w => new Date(w.date).toISOString().split("T")[0])
        );

        let streak = 0;
        let current = new Date();

        while (dates.has(current.toISOString().split("T")[0])) {
            streak++;
            current.setDate(current.getDate() - 1); // check previous day
        }

        return streak;
    }

    const streak = getStreak(workouts);

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
            setWorkouts(workouts.filter((w) => w._id !== id));
        } catch (err) {
            alert("Failed to delete");
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
                    
                                    {/* =================== HERO HEADER =================== */}
                <div className="dashboard-header">
                <h1 className="dashboard-title">My Workout Log</h1>

                <button 
                    className="record-btn"
                    onClick={() => navigate("/create-workout")}
                >
                    + Record Workout
                </button>
             </div>

        <p className="dashboard-sub">Track your fitness journey and stay consistent!</p>

                

                {/* =================== SUMMARY CARDS =================== */}
                <div className="stat-grid">
                    <div className="stat-card">
                        <h2>{workouts.length}</h2>
                        <p>Total Workouts</p>
                        <div className="stat-icon blue">🏋</div>
                    </div>

                    <div className="stat-card">
                        <h2>{workouts.filter(w => 
                            new Date(w.date) > new Date().setDate(new Date().getDate()-7)
                        ).length}</h2>
                        <p>This Week</p>
                        <div className="stat-icon purple">📅</div>
                    </div>
                    
                    <div className="stat-card">
                        <h2>{
                            workouts.reduce((sum,w) => sum + w.exercises.length,0)
                        }</h2>
                        <p>Total Exercises</p>
                        <div className="stat-icon green">📈</div>
                    </div>
                    
                    <div className="stat-card">
                        <h2>{streak} days</h2>
                        <p>Current Streak 🔥</p>
                        <div className="stat-icon pink">⚡</div>
                    </div>
                </div>
                                    
                <hr className="section-divider"/>
                                    
                <h2 className="section-heading">Recent Workouts</h2>
                                    
                {/* =================== Recent Workout Cards =================== */}
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
                            <button className="btn delete"
                                onClick={() => handleDelete(w._id)}
                            >Delete</button>
                        </div>
                    </div>
                ))}
                </div>
                
                </div>
            </main>
        </div>
    );
}

export default Dashboard;