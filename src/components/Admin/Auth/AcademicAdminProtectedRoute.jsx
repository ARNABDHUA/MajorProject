import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const AcademicAdminProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      // Get token and user from localStorage
      const token = localStorage.getItem("item");
      const user = localStorage.getItem("user");

      console.log(
        "Checking academic admin auth with token:",
        !!token,
        "and user (from 'localstorage'):",
        !!user
      );

      if (token && user) {
        try {
          const userData = JSON.parse(user);
          console.log("Parsed user data:", userData);

          // Check if user's name is 'Admin Academic'
          if (userData?.name === "Admin Academic") {
            setIsAuthenticated(true);
            setUserRole("academicAdmin");
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing user data from 'localstorage':", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  console.log("Academic admin auth state:", {
    isLoading,
    isAuthenticated,
    userRole,
    allowedRoles,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HashLoader size={40} color="#3B82F6" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "User not authenticated as Admin Academic, redirecting to login"
    );
    return (
      <Navigate
        to="/unauthenticated-user-found"
        state={{ from: location }}
        replace
      />
    );
  }

  const isRoleAllowed =
    allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!isRoleAllowed) {
    console.log("Admin Academic role not allowed for this route");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("Access granted to Admin Academic for protected route");
  return children;
};

export default AcademicAdminProtectedRoute;
