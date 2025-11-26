import React, { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/progress.css";

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
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // 📊 Calculate total volume per workout
  const volumeData = workouts.map((w) => {
    const totalVolume = w.exercises.reduce(
      (sum, ex) => sum + ex.sets * ex.reps * ex.weight,
      0
    );

    return {
      date: new Date(w.date).toLocaleDateString(),
      volume: totalVolume,
    };
  });

  // 📅 Workout frequency by month
  const monthlyData = {};
  workouts.forEach((w) => {
    const month = new Date(w.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[month]) monthlyData[month] = 0;
    monthlyData[month] += 1;
  });

  const monthlyArray = Object.keys(monthlyData).map((month) => ({
    month,
    count: monthlyData[month],
  }));

  return (
    <div className="dashboard-bg">
      <Navbar />

      <div className="progress-container">
        <h1 className="page-title">Progress Overview</h1>

        {loading ? (
          <p>Loading...</p>
        ) : workouts.length === 0 ? (
          <div className="empty-state">
            <p>No workouts available to show progress.</p>
          </div>
        ) : (
          <>
            {/* 🔵 Volume Trend */}
            <div className="chart-card">
              <h2 className="chart-title">Workout Volume Over Time</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 🟣 Monthly Workout Frequency */}
            <div className="chart-card">
              <h2 className="chart-title">Workouts Per Month</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;
