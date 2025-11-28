import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import '../styles/dashboard.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for Edit Mode
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await API.get("/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUser(res.data);
                setEditName(res.data.name);
                setEditEmail(res.data.email);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.put("/users/profile", {
                name: editName,
                email: editEmail
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div className="dashboard-bg">
            <Navbar />
            <div className="container">
                <h1 className="page-title">My Profile</h1>

                {user ? (
                    <div className="workout-card" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '20px' }}>
                        <div className="card-header">
                            <h3>User Information</h3>
                        </div>

                        <div className="exercise-list" style={{ padding: '20px' }}>
                            {/* Name Field */}
                            <div className="exercise-item" style={{ alignItems: 'center' }}>
                                <span className="ex-name" style={{ minWidth: '80px', fontWeight: 'bold' }}>Name:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="input-field"
                                        style={{ flex: 1, padding: '8px', margin: 0 }}
                                    />
                                ) : (
                                    <span className="ex-detail" style={{ flex: 1 }}>{user.name}</span>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="exercise-item" style={{ alignItems: 'center', marginTop: '10px' }}>
                                <span className="ex-name" style={{ minWidth: '80px', fontWeight: 'bold' }}>Email:</span>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="input-field"
                                        style={{ flex: 1, padding: '8px', margin: 0 }}
                                    />
                                ) : (
                                    <span className="ex-detail" style={{ flex: 1 }}>{user.email}</span>
                                )}
                            </div>

                            {/* Role (Read-only) */}
                            <div className="exercise-item" style={{ marginTop: '10px' }}>
                                <span className="ex-name" style={{ minWidth: '80px', fontWeight: 'bold' }}>Role:</span>
                                <span className="ex-detail" style={{ flex: 1 }}>Member</span>
                            </div>

                            {/* Joined Date (Read-only) */}
                            <div className="exercise-item" style={{ marginTop: '10px' }}>
                                <span className="ex-name" style={{ minWidth: '80px', fontWeight: 'bold' }}>Joined:</span>
                                <span className="ex-detail" style={{ flex: 1 }}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="card-actions" style={{ padding: '20px 20px 0', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            {isEditing ? (
                                <>
                                    {/* Save Button (Green) */}
                                    <button
                                        onClick={handleUpdate}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            minWidth: '100px',
                                            flex: 1
                                        }}
                                    >
                                        Save Changes
                                    </button>

                                    {/* Cancel Button (Red) */}
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditName(user.name);
                                            setEditEmail(user.email);
                                        }}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            minWidth: '100px',
                                            flex: 1
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                /* Edit Profile Button (Blue Theme) */
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>Failed to load profile.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;