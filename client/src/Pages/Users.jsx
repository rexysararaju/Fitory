import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import '../styles/Dashboard.css';
import { useNavigate } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    // ⛔ Block if not admin
    useEffect(() => {
        if (role !== "admin") {
            navigate("/dashboard");
        }
    }, [role, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUsers(res.data);
            } catch (err) {
                console.error("User fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (role === "admin") fetchUsers();
    }, [role]);

    return (
        <div className="dashboard-layout">
            <Navbar />

            {/* Main Unified Layout */}
            <main className="main-content">
                <div className="content-card">

                    {/* HEADER */}
                    <div className="page-header-row">
                        <h1 className="page-title">Community Members</h1>
                    </div>

                    <p style={{ textAlign: 'center', marginBottom: 20, color:'#6b7280' }}>
                        Connect with other fitness enthusiasts!
                    </p>

                    {/* CONTENT */}
                    {loading ? (
                        <p>Loading users...</p>
                    ) : users.length === 0 ? (
                        <div className="empty-state">No members found.</div>
                    ) : (
                        <div className="workout-grid">
                            {users.map((user)=>(
                                <div key={user._id} className="workout-card">

                                    {/* User Header */}
                                    <div className="card-header" style={{ display:'flex', alignItems:'center', gap:12 }}>
                                        <div style={{
                                            width:50, height:50,
                                            borderRadius:'50%', background:'#eef2ff',
                                            display:'flex', justifyContent:'center', alignItems:'center',
                                            fontWeight:'bold', fontSize:'1.1rem', color:'#4f46e5'
                                        }}>
                                            {user.name?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                        <h3>{user.name}</h3>
                                    </div>

                                    {/* Details */}
                                    <div className="exercise-list" style={{ marginTop:10 }}>
                                        <p>📧 {user.email}</p>
                                        <p style={{ fontSize:".9rem", color:"#6b7280" }}>
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
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

export default Users;
