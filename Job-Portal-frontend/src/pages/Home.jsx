import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import "../styles/Home.css";

function Home() {
  const [jobs, setJobs] = useState([]);

  return (
    <>
      <Navbar />
      <Hero setJobs={setJobs} />
      <Categories />

      {/* Latest Jobs Section */}
      <div className="latest-jobs">
        <h2 className="section-title">Latest Job Openings</h2>
        <p className="section-subtitle">
          Explore opportunities from top companies
        </p>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p className="no-jobs">No jobs found</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p>Company: {job.company}</p>
                <p>Location: {job.location}</p>
                <button>Apply Now</button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
