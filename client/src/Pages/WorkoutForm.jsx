import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import "../styles/workoutForm.css";

function WorkoutForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const prefillDate = location.state?.prefillDate || null;

    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); // How you felt
    const [date, setDate] = useState(
        prefillDate ? new Date(prefillDate).toISOString().split("T")[0] : ""
    );

    const [exercises, setExercises] = useState([
        { name: "", type: "", sets: "", reps: "", weight: "", duration: "", distance: "", steps: "" }
    ]);

    const fromHistory = location.state?.fromHistory || false;

    // Prefill when editing
    useEffect(() => {
        if (location.state?.workoutToEdit) {
            const workout = location.state.workoutToEdit;
            setName(workout.name);
            setDescription(workout.description || "");
            setExercises(workout.exercises);
            setEditingId(workout._id);
        }
    }, [location.state]);

    const handleExerciseChange = (i, field, value) => {
        const updated=[...exercises]; updated[i][field]=value; setExercises(updated);
    };
    const addExerciseField =()=> setExercises([...exercises,{name:"",type:""}]);
    const removeExerciseField =(i)=> setExercises(exercises.filter((_,x)=>x!==i));

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            const token=localStorage.getItem("token");
            const config={headers:{Authorization:`Bearer ${token}`}};
            const payload={name,description,exercises,date};

            editingId? await API.put(`/workouts/${editingId}`,payload,config)
                     : await API.post("/workouts",payload,config);

            alert(editingId?"Workout updated!":"Workout saved!");
            navigate("/dashboard");
        }catch{
            alert("Failed to save workout");
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />

            {/* unified layout */}
            <main className="main-content">
                <div className="content-card">

                    {/* Title */}
                    <div className="page-header-row">
                        <h1 className="page-title">
                            {editingId ? "Edit Workout" : "Record New Workout"}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} style={{display:"grid", gap:20}}>

                        {/* NAME */}
                        <div className="form-group">
                            <label className="section-title">Workout Name</label>
                            <input type="text" className="input-field"
                                value={name} onChange={e=>setName(e.target.value)} required />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="form-group">
                            <label className="section-title">Description (Optional)</label>
                            <textarea className="input-field"
                                value={description} onChange={e=>setDescription(e.target.value)} />
                        </div>
                        {/* Workout Date (Auto-filled if opened from calendar) */}
                        <label className="auth-label">
                            Workout Date
                            <input
                                type="date"
                                className="input-field"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </label>


                        {/* EXERCISES */}
                        <h2 className="section-title" style={{marginTop:5}}>Exercises</h2>

                        {exercises.map((ex,index)=>(
                            <div key={index} className="workout-card" style={{padding:20, display:"grid", gap:12}}>

                                {/* TYPE SELECT */}
                                <label className="ex-name">Exercise Type</label>
                                <select className="input-field" value={ex.type}
                                    onChange={e=>{
                                        const t=e.target.value;
                                        handleExerciseChange(index,"type",t);
                                        if(t==="running") handleExerciseChange(index,"name","Running");
                                        if(t==="walking") handleExerciseChange(index,"name","Walking");
                                        if(t==="cycling") handleExerciseChange(index,"name","Cycling");
                                        if(t==="strength"||t==="custom") handleExerciseChange(index,"name","");
                                    }} required>
                                    <option value="">Select Exercise</option>
                                    <option value="strength">💪 Strength</option>
                                    <option value="walking">🚶 Walking</option>
                                    <option value="running">🏃 Running</option>
                                    <option value="cycling">🚴 Cycling</option>
                                    <option value="custom">✏️ Custom</option>
                                </select>

                                {/* Custom name input */}
                                {(ex.type==="strength"||ex.type==="custom")&&(
                                    <input type="text" className="input-field"
                                    placeholder="Enter exercise name"
                                    value={ex.name} onChange={e=>handleExerciseChange(index,"name",e.target.value)} required/>
                                )}

                                {/* Conditional Fields */}
                                {ex.type==="strength"&&(
                                    <div className="ex-row-details">
                                        <label>Sets <input type="number" value={ex.sets||""} onChange={e=>handleExerciseChange(index,"sets",e.target.value)}/></label>
                                        <label>Reps <input type="number" value={ex.reps||""} onChange={e=>handleExerciseChange(index,"reps",e.target.value)}/></label>
                                        <label>Weight (kg)<input type="number" value={ex.weight||""} onChange={e=>handleExerciseChange(index,"weight",e.target.value)}/></label>
                                    </div>
                                )}
                                {ex.type==="walking"&& <label>Steps <input type="number" value={ex.steps||""} onChange={e=>handleExerciseChange(index,"steps",e.target.value)}/></label>}
                                {ex.type==="cycling"&& <label>Duration (min) <input type="number" value={ex.duration||""} onChange={e=>handleExerciseChange(index,"duration",e.target.value)}/></label>}
                                {ex.type==="running"&& <label>Distance (km) <input type="number" value={ex.distance||""} onChange={e=>handleExerciseChange(index,"distance",e.target.value)}/></label>}

                                {/* REMOVE BTN */}
                                <button type="button" className="btn-delete"
                                    onClick={()=>removeExerciseField(index)}>
                                    Remove Exercise
                                </button>

                            </div>
                        ))}

                        <button type="button" onClick={addExerciseField} className="btn-secondary full-width">+ Add Exercise</button>

                        <button type="submit" className="btn-primary full-width">
                            {editingId?"Update Workout":"Save Workout"}
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}

export default WorkoutForm;
