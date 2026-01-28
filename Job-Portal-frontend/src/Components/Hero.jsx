import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import Select from "react-select";
import "../styles/Hero.css";

const cityOptions = [
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Delhi", label: "Delhi" },
  { value: "Mumbai", label: "Mumbai" }
];

function Hero({ setJobs }) {
  return (
    <div className="hero">
      <h1>The Easiest Way to Get Your New Job</h1>

      <div className="hero-search">

        {/* 🔍 JOB KEYWORD INPUT */}
        <div className="input-icon">
          <FaSearch className="icon" />
          <input type="text" placeholder="Job Keyword" />
        </div>

        {/* 📍 LOCATION DROPDOWN */}
        <div className="select-icon">
          <FaMapMarkerAlt className="icon" />

          <Select
            options={cityOptions}
            placeholder="Search Location"
            className="location-dropdown"
            classNamePrefix="react-select"
            isSearchable
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
        </div>

        <button className="search-btn">Search</button>
      </div>
    </div>
  );
}

export default Hero;
