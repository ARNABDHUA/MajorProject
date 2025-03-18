import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import {
  FiBookOpen,
  FiCalendar,
  FiBarChart2,
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { SiKdenlive } from "react-icons/si";

const Sidebar = ({
  isMobile = false,
  onCloseMobile = () => {},
  isCollapsedProp = false,
}) => {
  // State to manage sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  const location = useLocation();

  // Handle window resize to adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar menu items
  const menuItems = [
    {
      id: 1,
      title: "Profile",
      icon: <FaHome className="w-5 h-5" />,
      path: "/teacher-home",
    },
    {
      id: 2,
      title: "Students",
      icon: <FaUser className="w-5 h-5" />,
      path: "/teacher-students",
    },
    {
      id: 3,
      title: "Examination",
      icon: <FaRegNoteSticky className="w-5 h-5" />,
      path: "/teacher-examination",
    },
    {
      id: 4,
      title: "Courses",
      icon: <FiBookOpen className="w-5 h-5" />,
      path: "/teacher-courses",
    },
    {
      id: 5,
      title: "Schedule",
      icon: <FiCalendar className="w-5 h-5" />,
      path: "/teacher-schedule",
    },
    {
      id: 6,
      title: "Reports",
      icon: <FiBarChart2 className="w-5 h-5" />,
      path: "/teacher-reports",
    },
    {
      id: 7,
      title: "Live Class",
      icon: <SiKdenlive className="w-5 h-5" />,
      path: "/live-teacher",
    },
    {
      id: 8,
      title: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
      path: "/teacher-settings",
    },
  ];

  // Handle sidebar item click on mobile
  const handleItemClick = () => {
    if (isMobile) {
      onCloseMobile();
    }
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header with Logo and Toggle/Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {/* Logo area */}
        {!isCollapsed ? (
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-2">
              <Link to="/">EC</Link>
            </div>
            <h1 className="text-lg font-bold text-gray-800">E-College</h1>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              EC
            </div>
          </div>
        )}

        {/* Desktop toggle button */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="text-gray-700 w-5 h-5" />
            ) : (
              <FiChevronLeft className="text-gray-700 w-5 h-5" />
            )}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-all duration-200"
            aria-label="Close sidebar"
          >
            <FiX className="text-gray-700 w-5 h-5" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={handleItemClick}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-between"
                  } p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`${
                        isActive ? "text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && isActive && (
                    <FiChevronRight className="w-4 h-4 text-indigo-500" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile and Logout Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <FaUser className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Teacher Name</p>
              <p className="text-xs text-gray-500">teacher@ecollege.edu</p>
            </div>
          </div>
        )}
        <button
          className={`flex items-center ${
            isCollapsed ? "justify-center w-full" : ""
          } p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-all duration-200`}
        >
          <FiLogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
