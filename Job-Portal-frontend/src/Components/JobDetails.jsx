import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const JobDetails = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Replace with your actual backend endpoint for a single job
        const res = await api.get(`/jobs/${id}`); 
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  if (loading) return <h2>Loading Job Details...</h2>;
  if (!job) return <h2>Job not found!</h2>;

  return (
    <div className="job-details-container" style={{ padding: "40px" }}>
      <h1>{job.title}</h1>
      <p><strong>Company:</strong> {job.companyName}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <hr />
      <h3>Description</h3>
      <p>{job.description}</p>
      <button className="apply-btn">Apply Now</button>
    </div>
  );
};

export default JobDetails;