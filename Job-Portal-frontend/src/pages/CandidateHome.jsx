import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import socket from "../socket";
import api from "../api/axios";
import "../styles/CandidateHome.css";

const CandidateHome = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const isProfileComplete = (prof) => {
  return !!(prof && prof.name && prof.email && prof.skills);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profRes, jobsRes] = await Promise.all([
          api.get("/candidate/me"),
          api.get("/jobs/latest"), 
        ]);
        setProfile(profRes.data);
        setJobs(jobsRes.data || []);
      } catch (err) {
        console.error("Dashboard failed to load:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    socket.on("jobPosted", (newJob) => {
      setJobs((prev) => {
        const exists = prev.find(j => j._id === newJob._id);
        if (exists) return prev;
        return [newJob, ...prev].slice(0, 10);
      });
    });
    return () => socket.off("jobPosted");
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <h2 style={{ padding: "100px", textAlign: "center", color: "var(--text)" }}>
          Loading dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="candidate-dashboard">
      <div className="dashboard-container">
        <main className="dashboard-content">
          <header className="content-header">
            <h1>Candidate Dashboard</h1>
          </header>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Profile Status</h3>
              <p className={`status-badge ${isProfileComplete(profile) ? "complete" : "incomplete"}`}>
                {isProfileComplete(profile) ? "✅ Complete" : "❌ Incomplete"}
              </p>
            </div>
            <div className="stat-card">
              <h3>Available Jobs</h3>
              <p className="stat-number">{jobs.length}</p>
            </div>
          </div>
          <section className="data-section">
            <div className="section-header">
              <h2>Latest Opportunities</h2>
              <button className="text-link" onClick={() => navigate("/candidate/jobs")} > View all </button>
            </div>
            {jobs.length === 0 ? (
              <div className="empty-state-card">
                <p>No new jobs posted recently. Check back soon!</p>
              </div>
            ) : (
              <div className="job-list-container">
                {jobs.map((job) => (
                  <div className="job-row" key={job._id}>
                    <div className="job-info-main">
                      <h4>{job.title}</h4>
                      <p>
                        <span className="company-name-highlight">
                          {job.companyName || "Private Employer"} 
                        </span> 
                        {" • "}{job.location}
                      </p>
                    </div>
                    <button className="apply-btn-sm" onClick={() => navigate(`/jobs/${job._id}`)} > View Details </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CandidateHome;