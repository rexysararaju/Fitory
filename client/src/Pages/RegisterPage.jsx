import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";
import logo from "/fitory-logo.jpg";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await API.post("/register", { name, email, password });

      alert("Account created!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page auth-page--single">
      <div className="auth-panel">
     
        <div className="form-header form-header--panel">
          <img src={logo} alt="Fitory logo" className="form-logo" />
          <div className="form-header-text">
            <div className="form-brand-name">Fitory</div>
            <div className="form-brand-caption">
              Create your fitness planner account
            </div>
          </div>
        </div>

        <h2 className="auth-form-title">Create an account</h2>
        <p className="auth-form-subtitle">
          Start organizing your workouts and tracking your progress.
        </p>

        <form className="auth-form" onSubmit={handleRegister}>
          <label className="auth-label">
            Full name
            <input
              type="text"
              placeholder="Your name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Password
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="auth-label">
            Confirm password
            <input
              type="password"
              placeholder="Repeat password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit">
            Create account
          </button>
        </form>

        <p className="auth-switch auth-switch--center">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
