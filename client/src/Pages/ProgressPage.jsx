import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css"; 

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

function ProgressPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setWorkouts(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  // 📊 Volume per workout
  const volumeData = workouts.map((w) => ({
    date: new Date(w.date).toLocaleDateString(),
    volume: w.exercises.reduce((sum, ex) => sum + ex.sets * ex.reps * ex.weight, 0),
  }));

  // 📅 Monthly workout count
  const monthlyData = {};
  workouts.forEach((w) => {
    const month = new Date(w.date).toLocaleString("default", { month: "short", year:"numeric" });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const monthlyArray = Object.keys(monthlyData).map((month)=>({ month, count: monthlyData[month] }));


  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="main-content">
        <div className="content-card">

          {/* Header */}
          <div className="page-header-row">
            <h1 className="page-title">Progress Overview</h1>
          </div>

          {/* Data States */}
          {loading ? (
            <p>Loading...</p>
          ) : workouts.length === 0 ? (
            <div className="empty-state">
              <p>No workouts available to show progress.</p>
            </div>
          ) : (
            <div style={{ display:"grid", gap:"30px" }}>

              {/* 🔵 Volume Trend */}
              <div className="workout-card" style={{ padding:"25px" }}>
                <h2 className="section-title" style={{ marginBottom:15 }}>Workout Volume Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date"/>
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* 🟣 Monthly Frequency */}
              <div className="workout-card" style={{ padding:"25px" }}>
                <h2 className="section-title" style={{ marginBottom:15 }}>Workouts Per Month</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyArray}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Bar dataKey="count" fill="#6366f1" radius={[6,6,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default ProgressPage;
