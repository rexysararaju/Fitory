import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/fitory-logo.jpg";



function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const role = localStorage.getItem("role");

  return (
    <nav className="navbar-container">
      <div className="nav-left">

        {/* LOGO + TEXT INSIDE ONE LINK */}
        <Link to="/dashboard" className="nav-logo">
            <img src={logo} alt="Fitory Logo" className="nav-logo-img" />
            <span className="nav-logo-text">Fitory</span>
        </Link>


        {/* NAV LINKS */}
        <div className="nav-links">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>

          {/* SHOW ONLY FOR ADMINS */}
          {role === "admin" && (
            <Link to="/users" className="nav-item">Users</Link>
          )}

          <Link to="/profile" className="nav-item">My Profile</Link>
          <Link to="/history" className="nav-item">History</Link>
          <Link to="/progress" className="nav-item">Progress</Link>
        </div>
      </div>

      <div className="nav-right">
        <Link to="/create-workout" className="btn-primary">
          + Record Workout
        </Link>

        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
