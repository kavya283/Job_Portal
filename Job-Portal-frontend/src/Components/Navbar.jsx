import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  
  const role = localStorage.getItem("role"); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/");
  };

  const toggleTheme = (e) => {
    e.stopPropagation(); 
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="global-navbar">
      <div className="nav-container">
        <Link to={role === "employer" ? "/employer/home" : "/candidate-home"} className="nav-logo">
          JobPortal
        </Link>

        <div className="nav-actions">
          <div className="profile-menu-container">
            <button 
              className="profile-trigger"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              👤
            </button>

            {showDropdown && (
              <div className="profile-dropdown" onMouseLeave={() => setShowDropdown(false)}>
                {role === "candidate" ? (
                  <>
                    <Link to="/candidate-home" className="dropdown-item">Dashboard</Link>
                    <Link to="/candidate/profile" className="dropdown-item">Profile</Link>
                    <Link to="/my-applications" className="dropdown-item">Applications</Link>
                    <Link to="/candidate/jobs" className="dropdown-item">Find Jobs</Link>
                  </>
                ) : (
                  <>
                    <Link to="/employer/home" className="dropdown-item">Dashboard</Link>
                    <Link to="/employer/profile" className="dropdown-item">Profile</Link>
                    <Link to="/employer/my-jobs" className="dropdown-item">My Jobs</Link>
                    <Link to="/employer/post-job" className="dropdown-item">Post a Job</Link>
                  </>
                )}

                <div className="dropdown-divider"></div>
                <div className="dropdown-item theme-item" onClick={toggleTheme}>
                  <span>{isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                </div>

                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;