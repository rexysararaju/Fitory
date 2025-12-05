import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import WorkoutForm from "./Pages/WorkoutForm";
import HistoryPage from "./Pages/HistoryPage";
import ProgressPage from "./Pages/ProgressPage";
import Users from "./Pages/Users";
import Profile from "./Pages/Profile";
import "./styles/responsive.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-workout" element={<WorkoutForm />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/progress" element={<ProgressPage />} />

        {/* 2. Add Routes for Users and Profile */}
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;