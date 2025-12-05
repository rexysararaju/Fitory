// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/api';
import '../styles/Dashboard.css'; // ← 样式与 Dashboard 统一
import '../styles/general.css';


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

            {/* 侧边栏一致 */}
            <Navbar />

            {/* ⚡ 主体布局与 Dashboard 完全保持一致 */}
            <main className="main-content">
                <div className="content-card">

                    {/* Header */}
                    <div className="page-header-row">
                        <h1 className="page-title">My Profile</h1>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                            <div className="section-header" style={{ marginTop: 0 }}>
                                <h2 className="section-title">Account Details</h2>
                            </div>

                            {/* 信息输入区 */}
                            <div className="workout-card" style={{ padding: 20 }}>

                                {/* Name */}
                                <div className="exercise-item" style={{ marginBottom: 12 }}>
                                    <span className="ex-name" style={{ minWidth: 80 }}>Name:</span>
                                    {isEditing ? (
                                        <input 
                                            value={editName} 
                                            onChange={(e)=>setEditName(e.target.value)}
                                            style={{ flex:1, padding:8,border: '1px solid #ddd', borderRadius:6 }}
                                        />
                                    ) : (<span className="ex-detail">{user.name}</span>)}
                                </div>

                                {/* Email */}
                                <div className="exercise-item" style={{ marginBottom: 12 }}>
                                    <span className="ex-name" style={{ minWidth: 80 }}>Email:</span>
                                    {isEditing ? (
                                        <input 
                                            value={editEmail} 
                                            onChange={(e)=>setEditEmail(e.target.value)}
                                            style={{ flex:1,padding:8,border:'1px solid #ddd',borderRadius:6 }}
                                        />
                                    ) : (<span className="ex-detail">{user.email}</span>)}
                                </div>

                                {/* Role + Joined */}
                                <div className="exercise-item"><span className="ex-name">Role:</span><span className="ex-detail">Member</span></div>
                                <div className="exercise-item"><span className="ex-name">Joined:</span><span className="ex-detail">{new Date(user.createdAt).toLocaleDateString()}</span></div>

                                {/* 按钮 */}
                                <div className="card-actions" style={{ marginTop:20, display:'flex', gap:10 }}>
                                    {isEditing ? (
                                        <>
                                            <button 
                                                style={{flex:1, padding:10, color:'black',borderRadius:30}}
                                                onClick={handleUpdate}
                                            >Save</button>
                                            <button 
                                                style={{flex:1, padding:10, background:'#4e498cff',color:'#fff',borderRadius:30}}
                                                onClick={()=>{setIsEditing(false); setEditName(user.name); setEditEmail(user.email);}}
                                            >Cancel</button>
                                        </>
                                    ) : (
                                        <button className="pro-button"
                                            //style={{width:'100%', padding:12, background:'#4e498cff',color:'#fff',borderRadius:6}}
                                            onClick={()=>setIsEditing(true)}
                                        >Edit Profile</button>
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
