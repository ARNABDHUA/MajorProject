import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

const Admin = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserData(user);
      console.log("User data loaded:", user);
      if (user.admin) setIsAdmin(user.admin);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }

    // Update time every minute
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5 },
    }),
  };

  // Gradient animation for background
  const gradientVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        repeat: Infinity,
        duration: 15,
        ease: "linear",
      },
    },
  };

  // Fixed the unauthorized access render - it was missing a return statement
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-red-400 text-lg">
          Unauthorized Access. please check other routes
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-blue-400 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-red-400 text-lg">
          Error: No user data found in localStorage
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <motion.div
        className="fixed inset-0 pointer-events-none bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 opacity-30"
        variants={gradientVariants}
        animate="animate"
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Main content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <motion.h1
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              className="text-gray-400 mt-1 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {time.toLocaleDateString()} |{" "}
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </motion.p>
          </div>

          <div>
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-bold">
                {userData.name ? userData.name.charAt(0) : "A"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Admin info cards */}
        <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div
            className="bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-4 md:p-6 border border-gray-700 overflow-hidden relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <motion.div
              className="absolute top-4 right-4 rounded-full bg-blue-500 bg-opacity-20 p-2"
              whileHover={{ scale: 1.1, backgroundColor: "#2563EB" }}
            >
              <FiUser className="text-blue-400" />
            </motion.div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Admin Name
            </h3>
            <p className="text-white text-lg font-semibold truncate max-w-full">
              {userData.name || "N/A"}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Role: {userData.role || "Administrator"}
            </p>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-blue-500 bg-opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-4 md:p-6 border border-gray-700 overflow-hidden relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <motion.div
              className="absolute top-4 right-4 rounded-full bg-purple-500 bg-opacity-20 p-2"
              whileHover={{ scale: 1.1, backgroundColor: "#7C3AED" }}
            >
              <FiMail className="text-purple-400" />
            </motion.div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Email Address
            </h3>
            <p className="text-white text-lg font-semibold truncate max-w-full">
              {userData.email || "N/A"}
            </p>
            <p className="text-gray-400 text-xs mt-1">Verified Account</p>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500 bg-opacity-10 rounded-full"></div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-4 md:p-6 border border-gray-700 overflow-hidden relative"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <motion.div
              className="absolute top-4 right-4 rounded-full bg-green-500 bg-opacity-20 p-2"
              whileHover={{ scale: 1.1, backgroundColor: "#10B981" }}
            >
              <FiPhone className="text-green-400" />
            </motion.div>
            <h3 className="text-gray-400 text-sm font-medium mb-2">
              Phone Number
            </h3>
            <p className="text-white text-lg font-semibold truncate max-w-full">
              {userData.phoneNumber || "N/A"}
            </p>
            <p className="text-gray-400 text-xs mt-1">Contact Information</p>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-500 bg-opacity-10 rounded-full"></div>
          </motion.div>
        </div>

        {/* Authorization Status */}
        <motion.div
          className="mt-6 md:mt-8 bg-gray-800 bg-opacity-70 backdrop-blur rounded-xl p-4 md:p-6 border border-gray-700"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
            Authorization Status
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <AuthStatus
              title="Admin"
              active={userData.admin}
              color="blue"
              delay={0.1}
            />
            <AuthStatus
              title="Registration"
              active={userData.registration_admin}
              color="purple"
              delay={0.2}
            />
            <AuthStatus
              title="Academic"
              active={userData.academic_admin}
              color="green"
              delay={0.3}
            />
            <AuthStatus
              title="Accounts"
              active={userData.accounts_admin}
              color="amber"
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 md:mt-12 text-center text-gray-500 text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Admin Panel • Last login: {new Date().toLocaleDateString()}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Component for displaying authorization status
const AuthStatus = ({ title, active, color, delay }) => {
  const getColorClass = () => {
    switch (color) {
      case "blue":
        return active ? "bg-blue-500" : "bg-gray-600";
      case "purple":
        return active ? "bg-purple-500" : "bg-gray-600";
      case "green":
        return active ? "bg-green-500" : "bg-gray-600";
      case "amber":
        return active ? "bg-amber-500" : "bg-gray-600";
      default:
        return active ? "bg-blue-500" : "bg-gray-600";
    }
  };

  return (
    <motion.div
      className="bg-gray-700 bg-opacity-50 rounded-lg p-3 md:p-4 flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.8 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className={`w-3 h-3 rounded-full ${getColorClass()}`}></div>
      <div className="overflow-hidden">
        <p className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </p>
        <p className="text-xs text-gray-400">
          {active ? "Active" : "Inactive"}
        </p>
      </div>
    </motion.div>
  );
};

export default Admin;
