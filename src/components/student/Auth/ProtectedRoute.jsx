import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  // Check authentication status from localStorage
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          // Check if user data has required properties
          if (userData) {
            setIsAuthenticated(true);
            // Set role - either explicitly stored or inferred from data structure
            setUserRole(userData.role || inferUserRole(userData));
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    // Helper function to infer role from user data structure if not explicitly set
    const inferUserRole = (userData) => {
      // Logic to determine if user is student or teacher based on available fields
      if (userData.studentId || userData.enrollmentDate) {
        return "student";
      } else if (userData.teacherId || userData.subjects) {
        return "teacher";
      }
      return null; // Role cannot be determined
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user's role is not included, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === "student") {
      return <Navigate to="/student-profile" replace />;
    } else if (userRole === "teacher") {
      return <Navigate to="/teacher-home" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Return the protected route's children if authenticated and authorized
  return children;
};

export default ProtectedRoute;
