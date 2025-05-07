import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiSearch, FiUser } from "react-icons/fi";
import Sidebar from "./SideBar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Get current page title from path
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === "/teacher-home") return "Profile";
    if (path === "/teacher-schedule") return "Schedule";
    if (path === "/teacher-courses") return "My Classes";
    if (path === "/live-teacher") return "Live Class";
    if (path === "/teacher-examination") return "Examination";
    if (path === "/teacher-reports") return "Reports";
    if (path === "/teacher-settings") return "Settings";
    if (path === "/teacher-students") return "Students";
    if (path === "/teacher-attendance") return "Attendance";
    if (path === "/teacher-chat") return "My Chat";
    if (path === "/upload-recorded-class") return "Upload recorded class";
    if (path === "/teacher-quiz") return "Quiz";
    if (path === "/teacher-assesment") return "Assessment";
    if (path === "/schedule-class") return "Schedule";
    if (path === "/salary-slip") return "Salary Slip";
    if (path === "/teacher-delete") return "Teacher Delete";
    if (path === "/teacher-assign") return "Teacher Assign";
    return "Profile";
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar - Fixed position */}
        <div className={`hidden lg:block ${sidebarWidth} flex-shrink-0`}>
          <div className="fixed h-full">
            <Sidebar isCollapsedProp={isCollapsed} />
          </div>
        </div>

        {/* Mobile Sidebar - Absolutely positioned with overlay */}
        {isSidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="absolute inset-y-0 left-0">
                <Sidebar isMobile={true} onCloseMobile={closeSidebar} />
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
          <header className="bg-white border-b border-gray-100 shadow-sm z-10">
            <div className="flex items-center justify-between py-3 px-4 lg:px-6">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden mr-2"
                  aria-label="Toggle sidebar"
                >
                  <FiMenu className="w-6 h-6 text-gray-600" />
                </button>

                <h2 className="text-lg font-medium text-gray-700">
                  {getCurrentPageTitle()}
                </h2>
              </div>

              {/* User profile */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiUser className="w-4 h-4" />
                </div>
                <span className="hidden md:inline-block ml-3 font-medium text-gray-700">
                  Teacher
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
