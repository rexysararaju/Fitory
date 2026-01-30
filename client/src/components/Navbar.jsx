import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

// 1. 引入图标库 (这里用的是 Lucide 风格，很现代)
// LuLayoutDashboard = Dashboard
// LuUser = Profile
// LuHistory = History
// LuTrendingUp = Progress
// LuUsers = Users
import {
  LuLayoutDashboard,
  LuUser,
  LuHistory,
  LuTrendingUp,
  LuUsers,
  LuLogOut,
  LuPlus,
  LuMenu
} from "react-icons/lu";

import logo from "../assets/logoBlue.png"; 

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear(); // 简单粗暴清除所有
    navigate("/login");
    setMenuOpen(false);
  };

  const role = localStorage.getItem("role");
  
  // 辅助函数保持不变
  const isActive = (path) => location.pathname === path ? "nav-item active" : "nav-item";

  return (
    <nav className="sidebar-container">
      <div className="sidebar-top">
        {/* LOGO */}
        <Link to="/dashboard" className="sidebar-logo">
           <img src={logo} alt="Fitory" className="logo-img" />
           <span className="logo-text">FITORY</span>
        </Link>



        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <LuMenu className="nav-icon" />
        </button>

        <div className={`sidebar-links ${menuOpen ? "open" : ""}`}>
          
          <Link to="/dashboard" className={isActive("/dashboard")} onClick={() => setMenuOpen(false)}>
            {/* 2. 直接像组件一样使用图标 */}
            <LuLayoutDashboard className="nav-icon" />
            <span>  Dashboard</span>
          </Link>

          <Link to="/profile" className={isActive("/profile")} onClick={() => setMenuOpen(false)}>
            <LuUser className="nav-icon" />
            <span>  My Profile</span>
          </Link>

          <Link to="/history" className={isActive("/history")} onClick={() => setMenuOpen(false)}>
            <LuHistory className="nav-icon" />
            <span>  History</span>
          </Link>

          <Link to="/progress" className={isActive("/progress")} onClick={() => setMenuOpen(false)}>
            <LuTrendingUp className="nav-icon" />
            <span>  Progress</span>
          </Link>

          {role === "admin" && (
            <Link to="/users" className={isActive("/users")} onClick={() => setMenuOpen(false)}>
               <LuUsers className="nav-icon" />
               <span>  Users</span>
            </Link>
          )}
        </div>
      </div>

      <div className="sidebar-bottom">
        <button onClick={handleLogout} className="btn-logout">
          <LuLogOut className="nav-icon" />
          <span>  Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
