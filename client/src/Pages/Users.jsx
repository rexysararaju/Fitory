import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import '../styles/dashboard.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                // Fetch all users from DB
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

        fetchUsers();
    }, []);

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
                            // Use _id from MongoDB
                            <div key={user._id} className="workout-card">
                                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        borderRadius: '50%', backgroundColor: '#ddd',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: '#555'
                                    }}>
                                        {/* Show first letter of name */}
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