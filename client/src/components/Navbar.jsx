import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; 

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");   
        navigate("/login");
    };

    return (
        <nav className="navbar-container">
            <div className="nav-left">
                {/* 1. logo */}
                <Link to="/dashboard" className="nav-logo">
                    Fitory
                </Link>

                {/* 2. Nav links */}
                <div className="nav-links">
                    <Link to="/dashboard" className="nav-item">Dashboard</Link>
                    <Link to="/users" className="nav-item">Users</Link>
                    <Link to="/profile" className="nav-item">My Profile</Link>
                    <Link to="/history" className="nav-item">History</Link>
                    <Link to="/progress" className="nav-item">Progress</Link>
                </div>
            </div>

            <div className="nav-right">
                <Link to="/create-workout" className="btn-primary">
                    + Record Workout
                </Link>

                {/* 3. signout*/}
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;