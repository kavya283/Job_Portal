import { useEffect, useState } from "react";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import "../styles/JobSearch.css";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    minSalary: "",
  });
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/search", { params: filters });
      setJobs(res.data || []);
    } catch (err) {
      console.error("Search failed:", err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(fetchJobs, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="job-search-page">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      <div className="search-header-bg">
        <h1>Find Your Next Career Move</h1>
        <p>Discover opportunities from top companies worldwide</p>
        <div className="search-filter-card">
          <div className="input-with-icon">
            <span className="icon">🔍</span>
            <input
              type="text"
              placeholder="Job title or role"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>

          <div className="v-divider"></div>
          <div className="input-with-icon">
            <span className="icon">📍</span>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          <div className="v-divider"></div>
          <div className="input-with-icon">
            <span className="icon">💰</span>
            <input
              type="number"
              placeholder="Min Salary"
              value={filters.minSalary}
              onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
            />
          </div>
          <button className="search-action-btn" onClick={fetchJobs}>Search</button>
        </div>
      </div>

      <div className="results-container">
        {loading ? (
          <div className="loading-spinner">Searching for jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-results">
            <h3>No jobs found matching your criteria</h3>
            <p>Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="job-results-grid">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;