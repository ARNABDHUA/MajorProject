import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaUser,
  FaGraduationCap,
  FaRegCreditCard,
  FaCalendarCheck,
  FaQuestionCircle,
  FaComments,
  FaUserEdit,
  FaLock,
} from "react-icons/fa";
import {
  FiHome,
  FiLogOut,
  FiChevronRight,
  FiChevronLeft,
  FiX,
} from "react-icons/fi";
import { SiKdenlive } from "react-icons/si";

// Sidebar menu items
const menuItems = [
  {
    id: 1,
    title: "Profile",
    icon: <FiHome />,
    path: "/student-profile",
    requiresPayment: false,
  },
  {
    id: 2,
    title: "My Courses",
    icon: <FaGraduationCap />,
    path: "/student-courses",
    requiresPayment: true,
  },
  {
    id: 3,
    title: "Payment Info",
    icon: <FaRegCreditCard />,
    path: "/student-payments",
    requiresPayment: false,
  },
  {
    id: 4,
    title: "Attendance",
    icon: <FaCalendarCheck />,
    path: "/student-attendance",
    requiresPayment: true,
  },
  {
    id: 5,
    title: "Quiz",
    icon: <FaQuestionCircle />,
    path: "/student-quiz",
    requiresPayment: true,
  },
  {
    id: 6,
    title: "Chat Room",
    icon: <FaComments />,
    path: "/student-chat",
    requiresPayment: true,
  },
  {
    id: 7,
    title: "Edit Profile",
    icon: <FaUserEdit />,
    path: "/student-edit-profile",
    requiresPayment: false,
  },
  {
    id: 8,
    title: "Live Class",
    icon: <SiKdenlive />,
    path: "/student-live-class",
    requiresPayment: true,
  },
];

const StudentSidebar = ({
  isCollapsedProp = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  const [studentData, setStudentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Load user data from localStorage once on component mount
    const loadUserData = () => {
      try {
        const localData = localStorage.getItem("user");
        if (localData) {
          const parsedData = JSON.parse(localData);
          setStudentData(parsedData);

          // Check payment status
          const hasValidPayment =
            parsedData &&
            (parsedData.payment === true || parsedData.payment === "true");

          setPaymentStatus(hasValidPayment);
        }
      } catch (err) {
        console.error("Error loading student data:", err);
      }
    };

    loadUserData();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle click on locked menu items
  const handleLockedItemClick = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Payment Required",
      text: "Please complete your payment to access this feature",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Go to Payment",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/student-payments";
      }
    });
  };

  // Handle logout with confirmation
  const handleLogout = () => {
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
          window.location.href = "/login";
        });
      }
    });
  };

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

  // Determine if text should be shown
  const showText = !isCollapsed || isMobile;

  return (
    <AnimatePresence>
      <motion.div
        className="h-full bg-white text-gray-700 shadow-xl flex flex-col"
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        initial={isMobile ? "hidden" : isCollapsed ? "collapsed" : "expanded"}
        animate={isMobile ? "visible" : isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflowX: "hidden" }}
      >
        {/* Header section */}
        <motion.div
          className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0"
          layout
        >
          <div className="flex items-center">
            <motion.div
              className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center"
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
                  className="ml-3 font-semibold text-lg text-blue-600 whitespace-nowrap"
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
              onClick={onCloseMobile}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </motion.button>
          ) : (
            <motion.button
              onClick={toggleCollapse}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
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
            <div className="space-y-1 px-3 py-4">
              {/* Payment warning notification */}
              <AnimatePresence>
                {!paymentStatus && showText && (
                  <motion.div
                    className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs text-yellow-700">
                      Some features are locked. Please complete your payment to
                      access all features.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Menu items */}
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isLocked = item.requiresPayment && !paymentStatus;

                return (
                  <div key={item.id}>
                    {isLocked ? (
                      <motion.div
                        onClick={handleLockedItemClick}
                        className={`flex items-center py-3 px-3 rounded-lg cursor-not-allowed ${
                          isActive ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 1)",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className={isCollapsed && !isMobile ? "mx-auto" : ""}
                          whileTap={{ scale: 0.95 }}
                        >
                          {React.cloneElement(item.icon, {
                            className: `w-5 h-5 text-gray-400`,
                          })}
                        </motion.div>

                        <AnimatePresence>
                          {showText && (
                            <motion.span
                              className="ml-3 font-medium text-gray-400 whitespace-nowrap"
                              variants={textVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        <AnimatePresence>
                          {showText && (
                            <motion.div
                              className="ml-auto"
                              variants={textVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              <FaLock className="w-3 h-3 text-gray-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-blue-500 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          }`
                        }
                        onClick={isMobile ? onCloseMobile : undefined}
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer section - fixed at bottom */}
          <motion.div
            className="flex-shrink-0 border-t border-gray-200 pt-2"
            layout
          >
            {/* Payment status indicator */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  className="px-4 py-2"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div
                    className={`text-xs flex items-center ${
                      paymentStatus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        paymentStatus ? "bg-green-500" : "bg-red-500"
                      }`}
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
                    <span>
                      {paymentStatus ? "Payment Complete" : "Payment Required"}
                    </span>
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
                  {studentData?.pic ? (
                    <img
                      src={studentData.pic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-blue-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-blue-600" />
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
                        {studentData?.name || "Student Name"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {studentData?.email || "student@example.com"}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Logout button - always visible regardless of payment status */}
            <div className="px-3 pb-4">
              <motion.button
                className={`flex items-center w-full py-2.5 px-3 rounded-lg text-gray-600 ${
                  isCollapsed && !isMobile ? "justify-center" : ""
                }`}
                whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                whileTap={{ backgroundColor: "rgba(229, 231, 235, 1)" }}
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
                      className="ml-3 font-medium whitespace-nowrap"
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
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentSidebar;
