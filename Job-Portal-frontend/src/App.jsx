import { Routes, Route } from "react-router-dom";
/* Auth Pages */
import EmpLoginPage from "./pages/EmpLoginPage.jsx";
import EmpSignupPage from "./pages/EmpSignupPage.jsx";
import CandidateLoginPage from "./pages/CandidateLoginPage.jsx";
import CandidateSignupPage from "./pages/CandidateSignupPage.jsx";
/* Common */
import Masterpage from "./pages/Masterpage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx"; // Fixed casing: Components -> components if standard
import LoginSuccess from "./components/LoginSuccess.jsx";
/* Candidate Pages */
import CandidateHome from "./pages/CandidateHome.jsx";
import CandidateProfile from "./pages/CandidateProfile.jsx";
import JobSearch from "./pages/JobSearch.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
/* Employer Pages */
import EmpHome from "./pages/EmpHomePage.jsx";
import EmployerProfile from "./pages/EmployerProfile.jsx";
import PostJob from "./pages/PostJob.jsx";
import MyJobs from "./pages/MyJobs.jsx";
import JobApplicants from "./pages/JobApplicants.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Masterpage />} />
          <Route path="/emplogin" element={<EmpLoginPage />} />
          <Route path="/empsignup" element={<EmpSignupPage />} />
          <Route path="/candidate/login" element={<CandidateLoginPage />} />
          <Route path="/signup" element={<CandidateSignupPage />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          
          {/* Public Job Details - Allowed for anyone to see */}
          <Route path="/jobs/:id" element={<JobDetailsPage />} />

          {/* Candidate Protected Routes */}
          <Route
            path="/candidate-home"
            element={
              <ProtectedRoute role="candidate">
                <CandidateHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/profile"
            element={
              <ProtectedRoute role="candidate">
                <CandidateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/jobs"
            element={
              <ProtectedRoute role="candidate">
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="candidate">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/home"
            element={
              <ProtectedRoute role="employer">
                <EmpHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile" // Fixed: Consistency with /employer/home
            element={
              <ProtectedRoute role="employer">
                <EmployerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job" // Recommended: Use nested-style naming
            element={
              <ProtectedRoute role="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/my-jobs" // Recommended: Use nested-style naming
            element={
              <ProtectedRoute role="employer">
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-applicants/:jobId"
            element={
              <ProtectedRoute role="employer">
                <JobApplicants />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;