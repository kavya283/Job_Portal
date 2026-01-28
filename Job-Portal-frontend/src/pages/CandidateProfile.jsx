import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/CandidateProfile.css";

const CandidateProfile = () => {
  const [profile, setProfile] = useState({
    name: "", 
    email: "", 
    phone: "", 
    skills: "", 
    bio: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // 1. Fetch profile data on component load
  useEffect(() => {
    api.get("/candidate/me") 
      .then(res => {
        if (res.data) {
          // If skills come as an array from backend, join them for the input field
          const formattedData = {
            ...res.data,
            skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : res.data.skills
          };
          setProfile(formattedData);
        }
      })
      .catch(err => {
        console.log("No profile found or connection issue:", err.message);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 3. Handle multipart form data submission
  const handleSave = async () => {
    // Basic Validation: Ensure "Incomplete" status can actually change
    if (!profile.name || !profile.skills) {
      alert("Please fill in at least your Name and Skills to complete your profile.");
      return;
    }

    const formData = new FormData();
    
    Object.keys(profile).forEach(key => {
      if (key !== "_id" && key !== "__v" && key !== "resumePath") {
        formData.append(key, profile[key] || "");
      }
    });
    
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const res = await api.put("/candidate/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Update state with returned profile
      const updatedProfile = res.data.profile || res.data;
      setProfile({
        ...updatedProfile,
        skills: Array.isArray(updatedProfile.skills) ? updatedProfile.skills.join(", ") : updatedProfile.skills
      });
      
      setIsEditing(false);
      alert("Profile Updated Successfully! Your dashboard status will now update.");
      
      // Optional: Force a window reload if your dashboard state isn't global
      // window.location.reload(); 
      
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="candidate-profile-container">
      <div className="profile-card">
        <h1>👤 My Profile</h1>
        <p className="subtitle">Manage your personal and professional presence</p>

        <div className="form-section">
          <h3>Personal Details</h3>
          <div className="two-column">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                name="name" 
                value={profile.name || ""} 
                onChange={handleChange} 
                disabled={!isEditing} 
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input 
                name="email" 
                value={profile.email || ""} 
                onChange={handleChange} 
                disabled={!isEditing} 
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Professional Profile</h3>
          <div className="form-group">
            <label>Skills (Comma Separated)</label>
            <input 
              name="skills"
              value={profile.skills || ""} 
              disabled={!isEditing} 
              placeholder="React, Node, MongoDB"
              onChange={handleChange} 
            />
            <div className="skills-container">
               {profile.skills && typeof profile.skills === 'string' 
                 ? profile.skills.split(",").map((s, i) => s.trim() && (
                     <span key={i} className="skill-tag">{s.trim()}</span>
                   ))
                 : <p className="text-muted" style={{fontSize: '12px'}}>No skills added yet</p>
               }
            </div>
          </div>
          
          <div className="form-group">
            <label>Resume (PDF)</label>
            <input 
              type="file" 
              accept=".pdf" 
              disabled={!isEditing}
              onChange={e => setResumeFile(e.target.files[0])} 
              className="file-input"
            />
            {profile.resumePath && !isEditing && (
              <a 
                href={`http://localhost:5000${profile.resumePath}`} 
                target="_blank" 
                rel="noreferrer" 
                className="view-resume-link"
              >
                📄 View Current Resume
              </a>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;