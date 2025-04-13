import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaUser } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { MdCoPresent } from "react-icons/md";

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
import { ConsoleLevel } from "@zegocloud/zego-uikit-prebuilt";

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
];

const Sidebar = ({
  isCollapsedProp = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  const [teacherData, setTeacherData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Retrieve data from localStorage
    const localData = localStorage.getItem("user");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setTeacherData(parsedData);
        console.log(
          "Teacher Data from Local Storage profile section:",
          parsedData
        );
      } catch (err) {
        console.error("Error parsing teacher data:", err);
      }
    } else {
      console.log("No teacher data found in Local Storage.");
    }
  }, []);
  console.log("hi", teacherData?.name);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Sidebar variants for animation
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" },
  };

  // Mobile sidebar variants
  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`h-full bg-white text-gray-700 shadow-xl ${
          isMobile ? "w-64" : ""
        }`}
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        initial={isMobile ? "hidden" : isCollapsed ? "collapsed" : "expanded"}
        animate={isMobile ? "visible" : isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar header with logo and toggle/close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed && !isMobile ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                <Link to="/">E</Link>
              </span>
            </div>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 font-semibold text-lg text-teal-600"
              >
                <Link to="/">ECollege</Link>
              </motion.span>
            )}
          </motion.div>

          {isMobile ? (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <FiChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Menu items */}
        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <div className="space-y-1 px-3">
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
                  onClick={isMobile ? onCloseMobile : undefined}
                >
                  <motion.div
                    className={`${isCollapsed && !isMobile ? "mx-auto" : ""}`}
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
                      initial={
                        isCollapsed && !isMobile
                          ? { opacity: 0 }
                          : { opacity: 1 }
                      }
                      animate={{ opacity: 1 }}
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
              );
            })}
          </div>

          {/* Logout button at bottom */}
          <div className="mt-auto px-3 pb-4">
            <div
              className={`px-3 py-2 ${!isCollapsed || isMobile ? "mb-2" : ""}`}
            >
              {(!isCollapsed || isMobile) && (
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {teacherData?.name || "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500">
                        {teacherData?.email || "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              className={`flex items-center w-full py-2.5 px-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 ${
                isCollapsed && !isMobile ? "justify-center" : ""
              }`}
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.2 }}
              >
                <FiLogOut className="w-5 h-5" />
              </motion.div>
              {(!isCollapsed || isMobile) && (
                <span className="ml-3 font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
