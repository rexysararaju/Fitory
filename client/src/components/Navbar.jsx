import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; 

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        alert("Logged out successfully");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/dashboard">Fitory</Link>
            </div>
            <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/create-workout" className="nav-link btn-primary">
                    + Record Workout
                </Link>
                <button onClick={handleLogout} className="nav-link btn-logout">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;