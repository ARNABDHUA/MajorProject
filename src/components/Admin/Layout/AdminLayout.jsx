import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiSearch, FiUser, FiBell } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import UnAuthorizedAccessPage from "../Auth/UnAuthorizedAccessPage";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [role, setRole] = useState("");
  const location = useLocation();

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const parsedData = JSON.parse(localData);
      setRole(parsedData.role);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Get current page title from path
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    //Register Admin
    if (path === "/student-document-verification")
      return "Document Verification of student";
    if (path === "/teacher-document-verification")
      return "Document Verification of Teacher";
    if (path === "/students-details") return "Student Details";
    if (path === "/teachers-details") return "Teacher Details";
    if (path === "/register-communication") return "My communication";
    if (path === "/register-management-notice") return "My Notice";
    //acadmic admin
    if (path === "/teacher-course-management")
      return "Teacher Course Management";
    if (path === "/academic-Create-Course-Code") return "Create Course";
    if (path === "/student-semester") return "Student Semester Management";
    if (path === "/course-code-management") return "Course Management";
    if (path === "/academic-management-notice")
      return "Academic Mangement Notice";
    if (path === "/academic-communication") return "My communication";
    //Accounts Admin
    if (path === "/new-registerStudent") return "New Studebt register";
    if (path === "/regular-student") return "Regular Students";
    if (path === "/employees-salary") return "Employees Salary";
    if (path === "/financial-management-notice") return "My Notice";
    if (path === "/account-communication") return "My Communication";

    return "Admin Dashboard";
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";
  if (!role || !role === "admin") {
    return <UnAuthorizedAccessPage />;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar - Fixed position */}
        <div className={`hidden lg:block ${sidebarWidth} flex-shrink-0`}>
          <div className="fixed h-full">
            <AdminSidebar isCollapsedProp={isCollapsed} />
          </div>
        </div>

        {/* Mobile Sidebar - Absolutely positioned with overlay */}
        {isSidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="absolute inset-y-0 left-0">
                <AdminSidebar isMobile={true} onCloseMobile={closeSidebar} />
              </div>
            </div>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={closeSidebar}
            />
          </>
        )}

        {/* Main Content Area - Takes remaining width */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="bg-black border-b border-gray-800 shadow-md z-10 text-purple-600">
            <div className="flex items-center justify-between py-3 px-4 lg:px-6">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-900 lg:hidden mr-2 text-purple-600"
                  aria-label="Toggle sidebar"
                >
                  <FiMenu className="w-6 h-6" />
                </button>

                <h2 className="text-lg font-medium text-purple-600">
                  {getCurrentPageTitle()}
                </h2>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Admin profile */}
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-black border border-purple-600 flex items-center justify-center text-purple-600">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <span className="hidden md:inline-block ml-3 font-medium text-purple-600">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-black text-purple-600">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
