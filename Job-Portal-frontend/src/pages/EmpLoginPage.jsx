import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/index.css";

const EmpLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double-clicks
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        role: "employer", // Explicitly requesting employer access
      });

      const { token, user } = res.data;

      // 1. Store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // 2. IMPORTANT: Update the Authorization header for immediate use
      // This prevents the "Initial 401" on the very first dashboard load
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 3. Redirect to the dashboard
      navigate("/employer/home");
    } catch (error) {
      console.error("Login Error:", error);
      const errorMsg = error.response?.data?.message || "Login failed. Check your credentials.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="custom-card">
        <h2 className="text-center mb-4">Employer Login</h2>
        
        {/* Social Auth Buttons */}
        <div className="d-flex flex-column gap-2 mb-3">
          <a href="http://localhost:5000/api/auth/google" className="social-btn text-center text-decoration-none">
            <i className="bi bi-google"></i> Google
          </a>
          <a href="http://localhost:5000/api/auth/linkedin" className="social-btn text-center text-decoration-none">
            <i className="bi bi-linkedin"></i> LinkedIn
          </a>
        </div>

        <div className="divider"><span>Or continue with email</span></div>

        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            required 
            className="form-input mb-3" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={isSubmitting}
          />
          <input 
            type="password" 
            required 
            className="form-input mb-4" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="primary-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Don't have an account? 
          <Link to="/empsignup" className="fw-bold text-decoration-none ms-1">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmpLoginPage;