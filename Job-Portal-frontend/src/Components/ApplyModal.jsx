import React, { useState } from "react";
import ReactDOM from "react-dom";
import api from "../api/axios";
import "../styles/ApplyModal.css";

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/applications", { jobId: job._id, resume: resumeLink });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  const modalLayout = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Apply for {job.title}</h2>
        <p className="muted">{job.companyName}</p>
        
        <form onSubmit={handleApply}>
          <div className="input-group">
            <label>Resume Link (Google Drive/Dropbox)</label>
            <input 
              type="url" 
              placeholder="https://..." 
              required 
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Sending..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // This renders the modal outside the Job Card container
  return ReactDOM.createPortal(modalLayout, document.body);
};

export default ApplyModal;