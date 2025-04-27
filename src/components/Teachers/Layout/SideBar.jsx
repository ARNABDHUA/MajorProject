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
  FiHome,
} from "react-icons/fi";
import { SiKdenlive } from "react-icons/si";

// Sidebar menu items
const menuItems = [
  {
    id: 1,
    title: "Profile",
    icon: <FiHome className="w-5 h-5" />,
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
  const location = useLocation();
  const navigate = useNavigate();

  // Load teacher data from localStorage once on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const localData = localStorage.getItem("user");
        if (localData) {
          const parsedData = JSON.parse(localData);
          setTeacherData(parsedData);
        }
      } catch (err) {
        console.error("Error loading teacher data:", err);
      }
    };

    loadUserData();
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
          title: "Logged Out!",
          text: "You have been successfully logged out.",
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

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const textVariants = {
    visible: { opacity: 1, transition: { delay: 0.1 } },
    hidden: { opacity: 0, transition: { duration: 0.1 } },
  };

  // Fix: Always show text on mobile
  const showText = !isCollapsed || isMobile;

  // Fix: Make sure onCloseMobile is defined
  const handleCloseMobile = useCallback(() => {
    if (onCloseMobile && typeof onCloseMobile === "function") {
      onCloseMobile();
    }
  }, [onCloseMobile]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <motion.div
        className={`h-screen ${
          isMobile ? "fixed top-0 left-0 z-50 shadow-2xl" : "relative"
        }`}
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        initial={isMobile ? "hidden" : isCollapsed ? "collapsed" : "expanded"}
        animate={isMobile ? "visible" : isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          width: isMobile ? "100%" : "auto", // Changed from 85% to 100%
          maxWidth: isMobile ? "none" : "auto", // Changed from 300px to none
        }}
      >
        <div className="flex flex-col h-full bg-white text-gray-700 shadow-xl overflow-hidden">
          {/* Header section */}
          <motion.div
            className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0 bg-white"
            layout="position"
          >
            <div className="flex items-center">
              <motion.div
                className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/" className="text-white font-bold text-lg">
                  E
                </Link>
              </motion.div>

              <AnimatePresence>
                {showText && (
                  <motion.span
                    className="ml-3 font-semibold text-lg text-teal-600 whitespace-nowrap"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Link to="/">ECollege</Link>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {isMobile ? (
              <motion.button
                onClick={handleCloseMobile}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </motion.button>
            ) : (
              <motion.button
                onClick={toggleCollapse}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isCollapsed ? (
                  <FiChevronRight className="w-5 h-5 text-gray-600" />
                ) : (
                  <FiChevronLeft className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Main content area with scrolling */}
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Menu items with fixed height and proper scrolling */}
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-x-hidden">
              <nav className="space-y-1 px-3 py-4">
                {/* Menu items */}
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-teal-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                      }
                      onClick={isMobile ? handleCloseMobile : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <motion.div
                            className={
                              isCollapsed && !isMobile ? "mx-auto" : ""
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {React.cloneElement(item.icon, {
                              className: `w-5 h-5 ${
                                isActive ? "text-white" : "text-gray-500"
                              }`,
                            })}
                          </motion.div>

                          <AnimatePresence>
                            {showText && (
                              <motion.span
                                className={`ml-3 font-medium whitespace-nowrap ${
                                  isActive ? "text-white" : ""
                                }`}
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>

                          {isActive && showText && (
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
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Footer section - fixed at bottom */}
            <motion.div
              className="flex-shrink-0 border-t border-gray-200 pt-2 bg-gray-50"
              layout="position"
            >
              {/* Status indicator for teachers */}
              <AnimatePresence>
                {showText && teacherData?.role && (
                  <motion.div
                    className="px-4 py-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="text-xs flex items-center text-teal-600">
                      <motion.div
                        className="w-2 h-2 rounded-full mr-2 bg-teal-500"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />
                      <span>Active Teacher</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User info */}
              <div className="px-3 py-2">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {teacherData?.pic ? (
                      <img
                        src={teacherData.pic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-teal-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-teal-600" />
                      </div>
                    )}
                  </motion.div>

                  <AnimatePresence>
                    {showText && (
                      <motion.div
                        className="ml-3 overflow-hidden"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {teacherData?.name || "Teacher Name"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {teacherData?.email || "teacher@example.com"}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Logout button */}
              <div className="px-3 pb-4">
                <motion.button
                  className={`flex items-center w-full py-2.5 px-3 rounded-lg text-gray-600 hover:bg-red-50 ${
                    isCollapsed && !isMobile ? "justify-center" : ""
                  }`}
                  whileHover={{ backgroundColor: "rgba(254, 226, 226, 1)" }}
                  whileTap={{ backgroundColor: "rgba(254, 202, 202, 1)" }}
                  onClick={handleLogout}
                >
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiLogOut className="w-5 h-5 text-red-500" />
                  </motion.div>

                  <AnimatePresence>
                    {showText && (
                      <motion.span
                        className="ml-3 font-medium whitespace-nowrap text-red-500"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        Logout
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
