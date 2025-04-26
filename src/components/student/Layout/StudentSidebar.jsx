import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2"; // Import SweetAlert
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
    icon: <FiHome className="w-5 h-5" />,
    path: "/student-profile",
    requiresPayment: false, // Always accessible
  },
  {
    id: 2,
    title: "My Courses",
    icon: <FaGraduationCap className="w-5 h-5" />,
    path: "/student-courses",
    requiresPayment: true,
  },
  {
    id: 3,
    title: "Payment Info",
    icon: <FaRegCreditCard className="w-5 h-5" />,
    path: "/student-payments",
    requiresPayment: false, // Always accessible to make payments
  },
  {
    id: 4,
    title: "Attendance",
    icon: <FaCalendarCheck className="w-5 h-5" />,
    path: "/student-attendance",
    requiresPayment: true,
  },
  {
    id: 5,
    title: "Quiz",
    icon: <FaQuestionCircle className="w-5 h-5" />,
    path: "/student-quiz",
    requiresPayment: true,
  },
  {
    id: 6,
    title: "Chat Room",
    icon: <FaComments className="w-5 h-5" />,
    path: "/student-chat",
    requiresPayment: true,
  },
  {
    id: 7,
    title: "Edit Profile",
    icon: <FaUserEdit className="w-5 h-5" />,
    path: "/student-edit-profile",
    requiresPayment: false, // Always accessible
  },
  {
    id: 8,
    title: "Live Class",
    icon: <SiKdenlive className="w-5 h-5" />,
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
    // Retrieve data from localStorage
    const localData = localStorage.getItem("user");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        setStudentData(parsedData);

        // Check if payment property exists and set status
        if (parsedData && parsedData.hasOwnProperty("payment")) {
          // Convert to boolean in case it's stored as string
          setPaymentStatus(
            parsedData.payment === true || parsedData.payment === "true"
          );
        }
      } catch (err) {
        console.error("Error parsing student data:", err);
      }
    }
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
        window.location.href = "/";
      }
    });
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

  //logout with confirmation
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
          window.location.href = "/login"; // Redirect to login
        });
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`h-full bg-white text-gray-700 shadow-xl flex flex-col ${
          isMobile ? "w-64" : ""
        }`}
        variants={isMobile ? mobileSidebarVariants : sidebarVariants}
        initial={isMobile ? "hidden" : isCollapsed ? "collapsed" : "expanded"}
        animate={isMobile ? "visible" : isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar header with logo and toggle/close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <motion.div
            initial={false}
            animate={{ opacity: isCollapsed && !isMobile ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                <Link to="/">E</Link>
              </span>
            </div>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 font-semibold text-lg text-blue-600"
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

        {/* Menu items with scrollbar */}
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-1 px-3 py-4">
              {!paymentStatus && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    Some features are locked. Please complete your payment to
                    access all features.
                  </p>
                </div>
              )}

              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const isLocked = item.requiresPayment && !paymentStatus;

                // Determine the appropriate element and props
                const ElementType = isLocked ? "div" : NavLink;
                const elementProps = isLocked
                  ? {
                      onClick: handleLockedItemClick,
                      className: `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gray-300 text-gray-500"
                          : "text-gray-400 hover:bg-gray-100"
                      } cursor-not-allowed opacity-70`,
                    }
                  : {
                      to: item.path,
                      className: ({ isActive }) =>
                        `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }`,
                      onClick: isMobile ? onCloseMobile : undefined,
                    };

                return (
                  <ElementType key={item.id} {...elementProps}>
                    <motion.div
                      className={`${isCollapsed && !isMobile ? "mx-auto" : ""}`}
                      whileHover={{ scale: isLocked ? 1 : 1.1 }}
                      whileTap={{ scale: isLocked ? 1 : 0.95 }}
                    >
                      {React.cloneElement(item.icon, {
                        className: `w-5 h-5 ${
                          isActive && !isLocked
                            ? "text-white"
                            : isLocked
                            ? "text-gray-400"
                            : "text-gray-500"
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
                        className={`ml-3 font-medium ${
                          isLocked ? "text-gray-400" : ""
                        }`}
                      >
                        {item.title}
                      </motion.span>
                    )}

                    {/* Lock icon for locked items */}
                    {isLocked && (
                      <FaLock className="ml-auto w-3 h-3 text-gray-400" />
                    )}

                    {isActive && !isCollapsed && !isMobile && !isLocked && (
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
                  </ElementType>
                );
              })}
            </div>
          </div>

          {/* Payment status indicator */}
          <div className="px-4 py-2">
            {(!isCollapsed || isMobile) && (
              <div
                className={`text-xs flex items-center ${
                  paymentStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    paymentStatus ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>
                  {paymentStatus ? "Payment Complete" : "Payment Required"}
                </span>
              </div>
            )}
          </div>

          {/* Logout button and user info at bottom */}
          <div className="px-3 pb-4 mt-auto border-t border-gray-200 flex-shrink-0">
            <div
              className={`px-3 py-2 ${!isCollapsed || isMobile ? "mb-2" : ""}`}
            >
              {(!isCollapsed || isMobile) && (
                <div className="pt-2">
                  <div className="flex items-center">
                    {studentData?.pic ? (
                      <img
                        src={studentData.pic}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {studentData?.name || "Student Name"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {studentData?.email || "student@example.com"}
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
              onClick={handleLogout}
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

export default StudentSidebar;
