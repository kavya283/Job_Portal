import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleViewResume = (resumePath) => {
    if (!resumePath) return alert("No resume uploaded.");
    const backendBaseUrl = "http://localhost:5000";
    const fileName = resumePath.split(/[\\/]/).pop(); 
    const fileUrl = `${backendBaseUrl}/uploads/${fileName}`;
    window.open(fileUrl, "_blank");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      try {
        await api.delete(`/applications/${id}`); 
        setApplications(applications.filter((app) => app._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert(err.response?.data?.message || "Failed to withdraw application.");
      }
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    /* Wrap in master-page-wrapper to enable global theme background */
    <div className="master-page-wrapper">
      <div className="applications-container">
        <h1 className="centered-title">My Applications</h1>
        <div className="applications-list">
          {applications.length === 0 ? (
            <div className="empty-state">
              <p>You haven't applied to any jobs yet.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="application-card">
                <div className="app-info-group">
                  <h3>{app.job?.title || "Position Title"}</h3>
                  <p className="company-name">🏢 {app.job?.companyName || "Company Info Hidden"}</p>
                  <p className="applied-date">📅 Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  <div className={`status-pill ${app.status?.toLowerCase() || 'applied'}`}>
                    {app.status || 'Applied'}
                  </div>
                </div>

                <div className="app-actions-group">
                  <button className="action-btn view" onClick={() => handleViewResume(app.resume)}>
                    📄 View Resume
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(app._id)}>
                    🗑️ Withdraw
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;