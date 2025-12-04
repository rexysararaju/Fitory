import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import API from "../api/api";
import Navbar from "../components/Navbar"; // 1. 导入 Navbar 组件
import "../styles/dashboard.css"; // 2. 导入上面写好的 CSS
import CalendarView from "../components/CalendarView";

function Dashboard() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    // Fetch logic... (保持不变)
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
        // 1. 最外层布局容器：Flex Row
        <div className="dashboard-layout">
            
            {/* 2. 左侧：复用 Navbar 组件 (现在它是侧边栏样式了) */}
            <Navbar />

            {/* 3. 右侧：主要内容区域 */}
            <main className="main-content">
                {/* 4. 白色大圆角卡片 */}
                <div className="content-card">
                    
                    {/* Header: Title + Record Button */}
                    <div className="page-header-row">
                        <h1 className="page-title">
                             {selectedDate 
                                ? selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) 
                                : "My Workout Log"}
                        </h1>
                        {/* 把Record按钮移到这里，符合图片设计 */}
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
                                            className="btn-secondary"//style={{flex:1, cursor:'pointer', padding:'8px', color:'black', border:'none', borderRadius:'30px'}}
                                            >Edit</button>
                                        <button onClick={() => handleDelete(w._id)} 
                                            className="delete-button"//style={{flex:1, cursor:'pointer', padding:'8px', background:'#4e498cff', color:'white', border:'none', borderRadius:'30px'}}
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

export default Dashboard;