import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiSearch, FiUser, FiBell } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [notifications, setNotifications] = useState(3); // Example notification count
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
    if (path === "/admin-dashboard") return "Dashboard";
    if (path === "/admin-user-management") return "User Management";
    if (path === "/admin-manage-students") return "Manage Students";
    if (path === "/admin-manage-teachers") return "Manage Teachers";
    if (path === "/admin-manage-roles") return "Admins & Roles";
    if (path === "/admin-reset-passwords") return "Reset Passwords";
    if (path === "/admin-registrations") return "New Registrations";
    if (path === "/admin-academic") return "Academic Management";
    if (path === "/course-code-management") return "Course Management";
    if (path === "/teacher-course-management") return "Teacher Course Management";
    if (path === "/student-semester") return "Student Semester Management";
    if (path === "/academic-management-notice") return "Academic Mangement Notice";
    if (path === "/admin-teacher-assignments") return "Teacher Assignments";
    if (path === "/admin-enrollments") return "Student Enrollments";
    if (path === "/admin-study-materials") return "Study Materials";
    if (path === "/admin-timetables") return "Timetables";
    if (path === "/admin-course-progress") return "Course Progress";
    if (path === "/admin-finance") return "Finance & Accounting";
    if (path === "/admin-fee-structures") return "Fee Structures";
    if (path === "/admin-collect-fees") return "Collect Fees";
    if (path === "/admin-payment-history") return "Payment History";
    if (path === "/admin-receipts") return "Receipts";
    if (path === "/admin-due-fees") return "Due Fees";
    if (path === "/admin-financial-reports") return "Financial Reports";
    if (path === "/admin-salaries-expenses") return "Salaries & Expenses";
    if (path === "/admin-records") return "Registration & Records";
    if (path === "/admin-new-registrations") return "New Registrations";
    if (path === "/admin-application-forms") return "Application Forms";
    if (path === "/admin-document-verification") return "Document Verification";
    if (path === "/admin-id-management") return "ID Management";
    if (path === "/admin-admission-records") return "Admission Records";
    if (path === "/admin-reports") return "Reports & Analytics";
    if (path === "/admin-student-performance") return "Student Performance";
    if (path === "/admin-attendance-reports") return "Attendance Reports";
    if (path === "/admin-fee-collection-reports") return "Fee Collection";
    if (path === "/admin-admission-statistics") return "Admission Statistics";
    if (path === "/admin-export-data") return "Export Data";
    if (path === "/admin-communication") return "Communication";
    if (path === "/admin-send-messages") return "Send Messages";
    if (path === "/admin-reminders") return "Reminders";
    if (path === "/admin-notices") return "Notices";
    if (path === "/admin-settings") return "Settings";
    if (path === "/admin-site-settings") return "Site Settings";
    if (path === "/admin-backup-restore") return "Backup & Restore";
    if (path === "/admin-notification-settings") return "Notification Settings";
    if (path === "/admin-access-control") return "Access Control";
    return "Admin Dashboard";
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-64";

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
