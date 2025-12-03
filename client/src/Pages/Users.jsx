import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import '../styles/dashboard.css';
import { useNavigate } from "react-router-dom";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    // ⭐ BLOCK PAGE IF NOT ADMIN
    useEffect(() => {
        if (role !== "admin") {
            navigate("/dashboard");  // redirect normal users
            return;
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
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setLoading(false);
            }
        };

        if (role === "admin") {
            fetchUsers();
        }
    }, [role]);

    return (
        <div className="dashboard-bg">
            <Navbar />

            <div className="container">
                <h1 className="page-title">Community Members</h1>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    Connect with other fitness enthusiasts!
                </p>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading users...</p>
                ) : (
                    <div className="workout-grid">
                        {users.map((user) => (
                            <div key={user._id} className="workout-card">
                                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%', backgroundColor: '#ddd',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: '#555'
                                    }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <h3>{user.name}</h3>
                                </div>

                                <div className="exercise-list" style={{ marginTop: '10px' }}>
                                    <p style={{ margin: '5px 0' }}>📧 {user.email}</p>
                                    <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9em' }}>
                                        📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
