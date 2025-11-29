import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles/auth.css";

import logo from "../assets/fitory-logo.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LEFT SIDE WITH IMAGE */}
        <div className="auth-left">
          
          <div className="auth-left-inner">
            <div className="brand-row">
              <span className="brand-wordmark">Fitory</span>
              <span className="brand-tagline-small">Workout planner</span>
            </div>

            <h1 className="hero-title">Your workout, organized.</h1>
            <p className="hero-subtitle">
              Build consistent training habits with a planner that keeps every
              session, plan, and progress update in one place.
            </p>

            <ul className="feature-list">
              <li>Smart workout scheduling so you never miss a session.</li>
              <li>Visual progress tracking to stay motivated over time.</li>
              <li>Designed for people who take training seriously.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="auth-right">
          <div className="auth-form-card">
            <div className="form-header">
              <img src={logo} alt="Fitory logo" className="form-logo" />

              <div className="form-header-text">
                <div className="form-brand-name">Fitory</div>
                <div className="form-brand-caption">
                  Your personal training dashboard
                </div>
              </div>
            </div>

            <h2 className="auth-form-title">Log in</h2>
            <p className="auth-form-subtitle">
              Use your email and password to access your Fitory account.
            </p>

            <form className="auth-form" onSubmit={handleLogin}>
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

              {error && <p className="auth-error">{error}</p>}

              <button className="auth-button" type="submit">
                Login
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <Link className="auth-link" to="/register">
                Register
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
