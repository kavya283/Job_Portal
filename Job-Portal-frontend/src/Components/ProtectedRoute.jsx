import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // Redirect to the specific login page based on the intended role
    const redirectPath = role === "employer" ? "/emplogin" : "/candidate/login";
    return <Navigate to={redirectPath} replace />;
  }

  if (role && userRole !== role) {
    // If they are logged in but have the wrong role, send them to their respective home
    const homePath = userRole === "employer" ? "/employer/home" : "/candidate-home";
    return <Navigate to={homePath} replace />;
  }

  return children;
};

export default ProtectedRoute;