import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import "../styles/general.css";
import "../styles/Dashboard.css";
import { LuUser, LuMail, LuCalendar, LuShield } from "react-icons/lu";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
            alert("Failed to update profile");
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar />

            <main className="main-content">
                <div className="content-card">

                    {/* Page Header */}
                    <div className="profile-header">
                        <h1 className="page-title">My Profile</h1>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="profile-container">

                            {/* Avatar */}
                            <div className="profile-avatar">
                                {user.name?.charAt(0)}
                            </div>

                            {/* Card */}
                            <div className="profile-card">

                                {/* Name */}
                                <div className="profile-row">
                                    <LuUser className="profile-icon" />
                                    <label>Name</label>

                                    {isEditing ? (
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="profile-input"
                                        />
                                    ) : (
                                        <span>{user.name}</span>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="profile-row">
                                    <LuMail className="profile-icon" />
                                    <label>Email</label>

                                    {isEditing ? (
                                        <input
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            className="profile-input"
                                        />
                                    ) : (
                                        <span>{user.email}</span>
                                    )}
                                </div>

                                {/* Role */}
                                <div className="profile-row">
                                    <LuShield className="profile-icon" />
                                    <label>Role</label>
                                    <span>Member</span>
                                </div>

                                {/* Join Date */}
                                <div className="profile-row">
                                    <LuCalendar className="profile-icon" />
                                    <label>Joined</label>
                                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>

                                {/* BUTTONS */}
                                <div className="profile-actions">
                                    {isEditing ? (
                                        <>
                                            <button className="save-btn" onClick={handleUpdate}>Save</button>
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setEditName(user.name);
                                                    setEditEmail(user.email);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default Profile;
