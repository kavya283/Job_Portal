import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use hooks to get ID from URL
import api from "../api/axios";

const JobApplicants = () => {
  const { jobId } = useParams(); // Get jobId from the /job-applicants/:jobId route
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        // Using the central api instance is safer than hardcoded localhost URLs
        const res = await api.get(`/jobs/applicants/${jobId}`); 
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="applicants-container">
      <h3>Applicants for Position</h3>
      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="applicant-card">
            {/* Using optional chaining for nested data */}
            <p><strong>Name:</strong> {app.candidate?.name || "Anonymous"}</p>
            <p><strong>Email:</strong> {app.candidate?.email}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplicants;