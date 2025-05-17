import React, { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaHandsHelping } from "react-icons/fa";
import { PiIdentificationCardBold } from "react-icons/pi";
import { FaRegAddressCard } from "react-icons/fa6";
import Swal from "sweetalert2";
import {
  FaUser,
  FaGraduationCap,
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
import { PiExamFill } from "react-icons/pi";
import { SiKdenlive } from "react-icons/si";
import { MdOutlinePayments } from "react-icons/md";

const StudentSidebar = ({
  isCollapsedProp = false,
  isMobile = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(isCollapsedProp);
  const [studentData, setStudentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [registered, setRegistered] = useState();
  const [approval, setApproval] = useState();
  const [admissionFeesStatus, setAdmissionFeesStatus] = useState();
  const [semesterFeesStatus, setSemesterFeesStatus] = useState();
  const [isRollExist, setIsRollExist] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  // Load user data from localStorage once on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const localData = localStorage.getItem("user");
        if (localData) {
          const parsedData = JSON.parse(localData);
          setStudentData(parsedData);
          setSemesterFeesStatus(parsedData.sem_payment);
          setRegistered(parsedData.submit);
          setApproval(parsedData.verify);
          setAdmissionFeesStatus(parsedData.payment);
          const croll = parsedData.c_roll || false;
          setIsRollExist(croll);

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

  // Define menu items based on payment status
  const getMenuItems = () => {
    const baseMenuItems = [
      {
        id: 1,
        title: "Profile",
        icon: <FiHome className="w-5 h-5" />,
        path: "/student-profile",
        requiresPayment: false,
      },
      {
        id: 4,
        title: "My Courses",
        icon: <FaGraduationCap className="w-5 h-5" />,
        path: "/student-courses",
        requiresPayment: true,
      },
      {
        id: 5,
        title: "Attendance",
        icon: <FaCalendarCheck className="w-5 h-5" />,
        path: "/student-attendance",
        requiresPayment: true,
      },
      {
        id: 6,
        title: "Quiz",
        icon: <FaQuestionCircle className="w-5 h-5" />,
        path: "/student-quiz",
        requiresPayment: true,
      },
      {
        id: 7,
        title: "Chat Room",
        icon: <FaComments className="w-5 h-5" />,
        path: "/student-chat",
        requiresPayment: true,
      },
      {
        id: 8,
        title: "Edit Profile",
        icon: <FaUserEdit className="w-5 h-5" />,
        path: "/student-edit-profile",
        requiresPayment: false,
      },
      {
        id: 9,
        title: "Class Assessment",
        icon: <SiKdenlive className="w-5 h-5" />,
        path: "/class-assessment",
        requiresPayment: true,
      },
      {
        id: 10,
        title: "Marks",
        icon: <PiExamFill className="w-5 h-5" />,
        path: "/student-marks",
        requiresPayment: true,
      },
      {
        id: 11,
        title: "Student assistant",
        icon: <FaHandsHelping className="w-5 h-5" />,
        path: "/class-assistant",
        requiresPayment: true,
      },
      {
        id: 12,
        title: "Admit Card",
        icon: <PiIdentificationCardBold className="w-5 h-5" />,
        path: "/student-admit",
        requiresPayment: true,
      },
      {
        id: 13,
        title: "E-Identity card",
        icon: <FaRegAddressCard className="w-5 h-5" />,
        path: "/student-idcard",
        requiresPayment: true,
      },
    ];

    if (isRollExist && registered && approval && !admissionFeesStatus) {
      baseMenuItems.push({
        id: 15,
        title: "Pay Admission Fees",
        icon: <MdOutlinePayments className="w-5 h-5" />,
        path: "/pay-admission-fees",
        requiresPayment: false,
      });
    }

    if (!isRollExist && registered && approval && !admissionFeesStatus) {
      baseMenuItems.push({
        id: 2,
        title: "Pay Admission Fees",
        icon: <MdOutlinePayments className="w-5 h-5" />,
        path: "/pay-admission-fees",
        requiresPayment: false,
      });
    }

    if (
      admissionFeesStatus &&
      isRollExist &&
      registered &&
      approval &&
      !semesterFeesStatus
    ) {
      baseMenuItems.push({
        id: 3,
        title: "Pay Semester Fees",
        icon: <MdOutlinePayments className="w-5 h-5" />,
        path: "/pay-semester-fees",
        requiresPayment: false,
      });
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();

  // Toggle sidebar collapse state
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Handle locked menu items click
  const handleLockedItemClick = useCallback(
    (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Payment Required",
        text: "Please complete your payment to access this feature",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Go to Payment",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/pay-admission-fees");
        }
      });
    },
    [navigate]
  );

  // Handle logout with confirmation
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
          navigate("/login");
        });
      }
    });
  }, [navigate]);

  // Handle mobile sidebar close
  const handleCloseMobile = useCallback(() => {
    if (onCloseMobile && typeof onCloseMobile === "function") {
      onCloseMobile();
    }
  }, [onCloseMobile]);

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
      >
        <div className="flex flex-col h-full bg-white text-gray-700 shadow-xl overflow-hidden">
          {/* Header section */}
          <motion.div
            className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0 bg-white"
            layout="position"
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
                onClick={handleCloseMobile}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </motion.button>
            ) : (
              <motion.button
                onClick={toggleCollapse}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {/* Payment warning notification */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  className={`m-3 p-2 rounded-lg border ${
                    !paymentStatus
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-green-50 border-green-200"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p
                    className={`text-xs ${
                      !paymentStatus ? "text-yellow-700" : "text-green-700"
                    }`}
                  >
                    {!paymentStatus
                      ? "Some features are locked. Please complete your payment to access all features."
                      : "Payment successful. All features are unlocked. Enjoy the full access now!"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu items with fixed height and proper scrolling */}
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-x-hidden">
              <nav className="space-y-1 px-3 py-4">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const isLocked = item.requiresPayment && !paymentStatus;

                  if (isLocked) {
                    return (
                      <div
                        key={item.id}
                        onClick={handleLockedItemClick}
                        className={`flex items-center py-3 px-3 rounded-lg cursor-not-allowed ${
                          isActive ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
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
                              className="ml-3 font-medium text-gray-400 whitespace-nowrap flex-grow"
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
                              className="flex-shrink-0"
                              variants={textVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              <FaLock className="w-3 h-3 text-gray-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center py-3 px-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500 text-white shadow-md"
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
                        {paymentStatus
                          ? "Payment Complete"
                          : "Payment Required"}
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
                        <p className="text-sm font-medium text-gray-700 truncate max-w-[140px]">
                          {studentData?.name || "Student Name"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[140px]">
                          {studentData?.email || "student@example.com"}
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

export default StudentSidebar;
