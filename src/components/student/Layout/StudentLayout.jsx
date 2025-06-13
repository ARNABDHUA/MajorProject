import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import StudentSidebar from "./StudentSidebar";
import WelcomePage from "../HandleRetriction/WelcomePage";
import VerificationStatus from "../../Courses/CourseModulesTab/VerificationStatus";
import RejectionPage from "../HandleRetriction/RejectionPage";

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [user, setUser] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [approval, setApproval] = useState(null);
  const [rejected, setRejected] = useState(null);
  const [croll, setcroll] = useState();
  const [acAccess, setasAccess] = useState(false);
  const location = useLocation();

  // Get user data from localStorage
  useEffect(() => {
    console.log("hi");
    const userData = localStorage.getItem("user");

    if (userData) {
      setasAccess(true);
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
      console.log("I love you parbat", parsedUserData);
      console.log(parsedUserData.submit);
      setApproval(parsedUserData.verify);
      setSubmitStatus(parsedUserData.submit);
      setRejected(parsedUserData.rejected);
      const crollCheck = parsedUserData.c_roll ? true : false;
      setcroll(crollCheck);
    }
  }, []);

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
    if (path === "/student-profile") return "Profile";
    if (path === "/student-courses") return "My Courses";
    if (path === "/student-payments") return "Payment Information";
    if (path === "/student-attendance") return "Attendance";
    if (path === "/student-quiz") return "Quiz";
    if (path === "/student-chat") return "Chat Room";
    if (path === "/student-edit-profile") return "Edit Profile";
    if (path === "/student-live-class") return "Live Class";
    if (path === "/class-assistant") return "Student Assistant";
    if (path === "/student-admit") return "Student Admit Card";
    if (path === "/student-idcard") return "Student Identity Card";
    return "Student Dashboard";
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

  // Check if we should render the welcome page or the main layout
  if (!croll) {
    if (submitStatus && rejected) {
      return <RejectionPage />;
    }

    if (submitStatus && !approval) {
      return <VerificationStatus />;
    }
    if (!submitStatus && acAccess) {
      return <WelcomePage />;
    }
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar - Fixed position */}
        <div className={`hidden lg:block ${sidebarWidth} flex-shrink-0`}>
          <div className="fixed h-full">
            <StudentSidebar isCollapsedProp={isCollapsed} />
          </div>
        </div>

        {/* Mobile Sidebar - Absolutely positioned with overlay */}
        {isSidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="absolute inset-y-0 left-0">
                <StudentSidebar isMobile={true} onCloseMobile={closeSidebar} />
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

              {/* User profile with actual user pic and name */}
              <div className="flex items-center">
                {user && user.pic ? (
                  <img
                    src={user.pic}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="hidden md:inline-block ml-3 font-medium text-gray-700">
                  {user?.name || "Loading..."}
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

export default StudentLayout;
