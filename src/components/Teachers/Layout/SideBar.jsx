import React, { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaUser, FaComment } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { MdCoPresent } from "react-icons/md";
import Swal from "sweetalert2";

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
  {
    id: 9,
    title: "Attendance",
    icon: <MdCoPresent className="w-5 h-5" />,
    path: "/teacher-attendance",
  },
  {
    id: 10,
    title: "Chat",
    icon: <FaComment className="w-5 h-5" />,
    path: "/teacher-chat",
  },
];

const Sidebar = ({
  isCollapsedProp = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  const [teacherData, setTeacherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load teacher data - with proper error handling
  useEffect(() => {
    setIsLoading(true);
    try {
      const localData = localStorage.getItem("user");
      if (localData) {
        const parsedData = JSON.parse(localData);
        setTeacherData(parsedData);
        setIsLoading(false);
      } else {
        // Set null but don't show error for logged out state
        setTeacherData(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error parsing teacher data:", err);
      setError("Failed to load user data");
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");

        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/teacher-login");
        });
      }
    });
  }, [navigate]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "-100%", transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Check if user should see logout (teachers always see it, some students might not)
  const shouldShowLogout = () => {
    // If teacher, show logout
    if (teacherData?.role === "teacher") return true;

    // If student with paid status, show logout
    if (
      teacherData?.role === "student" &&
      teacherData?.paymentStatus === "paid"
    )
      return true;

    // Default case - if no role specified or unknown user type, still show logout for safety
    if (!teacherData?.role) return true;

    // For unpaid students, don't show logout
    return false;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`h-full bg-white text-gray-700 shadow-xl flex flex-col relative ${
          isMobile ? "fixed top-0 left-0 z-50 w-64" : ""
        }`}
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        initial={isMobile ? "hidden" : isCollapsed ? "collapsed" : "expanded"}
        animate={isMobile ? "visible" : isCollapsed ? "collapsed" : "expanded"}
        exit={isMobile ? "exit" : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header with logo and toggle button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <Link to="/" className="flex items-center focus:outline-none">
            <motion.div
              className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-lg">E</span>
            </motion.div>

            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3 font-semibold text-lg text-teal-600"
              >
                ECollege
              </motion.span>
            )}
          </Link>

          {isMobile ? (
            <motion.button
              onClick={onCloseMobile}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Close sidebar"
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </motion.button>
          ) : (
            <motion.button
              onClick={toggleCollapse}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? (
                <FiChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>
          )}
        </div>

        {/* Menu items with fixed height and proper scrolling */}
        <div className="flex flex-col h-full overflow-hidden">
          <motion.div
            className="py-4 px-3 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent no-scrollbar"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div key={item.id} variants={itemVariants}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-teal-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                      onClick={isMobile ? onCloseMobile : undefined}
                    >
                      <motion.div
                        className={isCollapsed && !isMobile ? "mx-auto" : ""}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 ${
                            isActive ? "text-white" : "text-gray-500"
                          }`,
                        })}
                      </motion.div>

                      {(!isCollapsed || isMobile) && (
                        <motion.span
                          initial={false}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 font-medium"
                        >
                          {item.title}
                        </motion.span>
                      )}

                      {isActive && !isCollapsed && !isMobile && (
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-white ml-auto"
                          layoutId="activeIndicator"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* User profile and logout section - fixed at bottom */}
          <div className="mt-auto border-t border-gray-200 px-3 pt-2 pb-4 flex-shrink-0">
            {/* User profile info */}
            {(!isCollapsed || isMobile) && !isLoading && teacherData && (
              <motion.div
                className="mb-2 px-3 py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center"
                    whileHover={{ scale: 1.1, backgroundColor: "#5eead4" }}
                  >
                    <FaUser className="w-4 h-4 text-teal-600" />
                  </motion.div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {teacherData?.name || "Guest User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {teacherData?.email || "guest@ecollege.edu"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Show loading state while data is being fetched */}
            {isLoading && (!isCollapsed || isMobile) && (
              <div className="mb-2 px-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="ml-3">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-2 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Only show logout button if appropriate */}
            {(!teacherData || shouldShowLogout()) && (
              <motion.button
                onClick={handleLogout}
                className={`flex items-center w-full py-2.5 px-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-red-100 hover:text-red-600 focus:outline-none ${
                  isCollapsed && !isMobile ? "justify-center" : ""
                }`}
                whileHover={{ backgroundColor: "#fee2e2" }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiLogOut className="w-5 h-5" />
                </motion.div>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    className="ml-3 font-medium"
                    initial={false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Logout
                  </motion.span>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
