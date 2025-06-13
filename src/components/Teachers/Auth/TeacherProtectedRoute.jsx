import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const TeacherProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      // Fix: Changed "token" to "item" to match what's set in TeacherLogin.js
      const token = localStorage.getItem("item");
      const user = localStorage.getItem("user");
      console.log("Checking auth with token:", !!token, "and user:", !!user);

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log("User data:", userData);

          if (userData) {
            setIsAuthenticated(true);
            // Assuming teacher role since this is TeacherProtectedRoute
            setUserRole(userData.role);
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

    checkAuthStatus();
  }, []);

  console.log("Auth state:", {
    isLoading,
    isAuthenticated,
    userRole,
    allowedRoles,
  });

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
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/teacher-login" state={{ from: location }} replace />;
  }

  // Check if user's role is allowed for this route
  const isRoleAllowed =
    allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!isRoleAllowed) {
    console.log("Role not allowed, redirecting based on role");
    // Redirect based on role
    if (userRole === "teacher") {
      return <Navigate to="/teacher-home" replace />;
    } else {
      return <Navigate to="/teacher-login" replace />;
    }
  }

  // User is authenticated and authorized
  console.log("User authorized, showing protected content");
  return children;
};

export default TeacherProtectedRoute;
