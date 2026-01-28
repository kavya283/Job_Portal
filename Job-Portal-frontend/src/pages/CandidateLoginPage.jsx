import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/index.css";

const CandidateLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { 
        email, 
        password, 
        role: "candidate" 
      });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);
      
      navigate("/candidate-home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="custom-card">
        <h2 className="text-center mb-4">Job Seeker Login</h2>
        <div className="d-flex flex-column gap-2 mb-3">
          <a href="http://localhost:5000/api/auth/google" className="social-btn text-center text-decoration-none">Google</a>
          <a href="http://localhost:5000/api/auth/linkedin" className="social-btn text-center text-decoration-none">LinkedIn</a>
        </div>
        <div className="divider"><span>Or continue with email</span></div>
        <form onSubmit={handleLogin}>
          <input type="email" required className="form-input mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required className="form-input mb-4" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="primary-btn">Log in</button>
        </form>
        <p className="text-center mt-3">New here? <Link to="/signup">Create account</Link></p>
      </div>
    </div>
  );
};

export default CandidateLoginPage;