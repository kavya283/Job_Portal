import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import api from "../api/axios";
import "../styles/EmpHomePage.css";

const EmpHomePage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/my-jobs"),
        api.get("/jobs/applicants")
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Unable to load dashboard data. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchDashboard();
    socket.on("jobPosted", (job) => setJobs((prev) => [job, ...prev]));
    socket.on("newApplication", (app) => setApplications((prev) => [app, ...prev]));
    return () => {
      socket.off("jobPosted");
      socket.off("newApplication");
    };
  }, [fetchDashboard]);

  return (
    <div className="employer-dashboard no-sidebar">
      <main className="dashboard-content full-width">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Employer Dashboard</h1>
        </header>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">JOBS POSTED</span>
            <p className="stat-value">{jobs.length}</p>
          </div>
          <div className="stat-card">
            <span className="stat-label">TOTAL APPLICATIONS</span>
            <p className="stat-value">{applications.length}</p>
          </div>
        </div>
        <section className="data-section">
          <div className="section-header">
            <h2>My Posted Jobs</h2>
            <button 
              className="primary-btn" 
              onClick={() => navigate("/employer/post-job")} 
            >
              ➕ Post Job
            </button>
          </div>
          {jobs.length === 0 ? (
            <p className="empty-text">No jobs posted yet.</p>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div 
                  className="data-card clickable" 
                  key={job._id}
                  onClick={() => navigate("/employer/my-jobs")} 
                >
                  <h4>{job.title}</h4>
                  <p className="muted">📍 {job.location || "Remote"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="data-section">
          <h2>Recent Applications</h2>
          {applications.length === 0 ? (
            <p className="empty-text">No applications received yet.</p>
          ) : (
            <div className="apps-list">
              {applications.slice(0, 5).map((app) => (
                <div className="data-card" key={app._id}>
                  {/* Fallback for candidate name */}
                  <h4>{app.candidate?.name || "Candidate"}</h4>
                  <p className="muted">
                    Applied for: <strong>{app.job?.title || "Deleted Position"}</strong>
                  </p>
                  <p className="app-date">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Date unknown"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default EmpHomePage;