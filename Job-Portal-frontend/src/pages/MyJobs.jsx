import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket"; 
import "../styles/MyJobs.css";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Matches backend: router.get("/my-jobs", authMiddleware...)
      const res = await api.get("/jobs/my-jobs"); 
      
      // Ensure we always set an array even if data is null/undefined
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err.response);
      // Checking for 401 (Unauthorized) or 403 (Forbidden)
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data?.message || "Could not load your jobs. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJobs();

    // Re-fetching on socket events ensures the list is always fresh
    socket.on("jobPosted", fetchMyJobs);
    socket.on("jobUpdated", fetchMyJobs);
    socket.on("jobDeleted", fetchMyJobs);

    return () => {
      socket.off("jobPosted");
      socket.off("jobUpdated");
      socket.off("jobDeleted");
    };
  }, [fetchMyJobs]);

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      // Matches backend: router.delete("/:id")
      await api.delete(`/jobs/${id}`);
      // Optimistic UI update: remove from state immediately
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loader"></div>
      <p>Loading your listings...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <p className="error-text">{error}</p>
      <button onClick={() => navigate("/emplogin")} className="retry-btn">Back to Login</button>
    </div>
  );

  return (
    <div className="my-jobs-container">
      <div className="header-section">
        <h1>Manage Your Listings</h1>
        <button className="add-job-btn" onClick={() => navigate("/employer/post-job")}>
          + Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <p>You haven't posted any jobs yet.</p>
          <button onClick={() => navigate("/employer/post-job")} className="secondary-btn">Create your first post</button>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card-simple">
              <div className="job-info">
                {/* Optional chaining safely handles missing titles */}
                <h3>{job?.title || "Untitled Position"}</h3>
                <p>
                  📍 {job?.location || "Remote"} | 
                  <span className={`status-tag ${job?.status || 'open'}`}>
                    {job?.status?.toUpperCase() || 'OPEN'}
                  </span>
                </p>
                
                <button 
                  className="view-apps-link"
                  onClick={() => navigate(`/job-applicants/${job._id}`)}
                >
                  View Applicants
                </button>
              </div>
              <div className="job-actions">
                {/* Passing job data through state is efficient for the edit form */}
                <button 
                  className="edit-btn" 
                  onClick={() => navigate("/employer/post-job", { state: { editJob: job } })}
                >
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteJob(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;