import { useState } from "react";
import ApplyModal from "./ApplyModal";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  // Formatting date for a better UI
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Just now";

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="title-area">
          <h3>{job.title}</h3>
          <p className="company-info">
            <span className="icon">🏢</span> {job.companyName || "Tech Corp"}
          </p>
        </div>
        <div className="card-top-right">
           <span className="salary-badge">
             {job.salary ? `💰 $${job.salary.toLocaleString()}` : "💰 Competitive"}
           </span>
        </div>
      </div>
      
      <div className="job-card-meta">
        <div className="meta-left">
          <span className="location-tag">📍 {job.location}</span>
          <span className="date-tag">🕒 {postedDate}</span>
        </div>
        <span className={`status-pill ${job.status || 'open'}`}>
          {job.status || 'open'}
        </span>
      </div>
      
      <div className="job-card-actions">
        <button 
          className="apply-btn" 
          type="button"
          onClick={toggleModal}
        >
          Quick Apply
        </button>
      </div>

      {showModal && (
        <ApplyModal 
          job={job} 
          onClose={toggleModal} 
          onSuccess={() => alert("Application sent!")}
        />
      )}
    </div>
  );
};

export default JobCard;