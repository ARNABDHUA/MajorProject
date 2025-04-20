import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiServer,
  FiDatabase,
  FiActivity,
  FiLayers,
  FiGrid,
  FiClock,
  FiUser,
  FiShield,
} from "react-icons/fi";

const Admin = () => {
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [consoleLines, setConsoleLines] = useState([]);
  // Update console messages
  useEffect(() => {
    const messages = [
      "Initializing system...",
      "Loading core modules...",
      "Configuring database connections...",
      "Setting up user authentication...",
      "Loading admin interface components...",
      "Checking system integrity...",
      "Building user interface...",
      "System update required...",
      "Development in progress...",
    ];

    const addMessage = (index) => {
      if (index < messages.length) {
        setTimeout(() => {
          setConsoleLines((prev) => [...prev, messages[index]]);
          addMessage(index + 1);
        }, Math.random() * 1000 + 500);
      }
    };

    addMessage(0);
  }, []);

  // Update loader progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoaderProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92; // Never reaches 100% as it's under development
        }
        return prev + Math.random() * 3;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const statItems = [
    { icon: FiUser, label: "Users", value: "0", color: "bg-blue-500" },
    { icon: FiServer, label: "Servers", value: "4", color: "bg-green-500" },
    { icon: FiDatabase, label: "Data", value: "85%", color: "bg-purple-500" },
    {
      icon: FiActivity,
      label: "Traffic",
      value: "Low",
      color: "bg-yellow-500",
    },
  ];

  const gridSquareVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4 md:p-8">
      {/* Admin header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-800"
      >
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3 bg-indigo-600 p-2 rounded-lg">
            <FiShield className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">
              System undergoing maintenance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-gray-800 rounded-md text-sm flex items-center">
            <FiClock className="mr-2" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="px-3 py-1 bg-red-900 text-red-100 rounded-md text-sm font-medium flex items-center">
            <span className="mr-2">●</span>
            <span>Development Mode</span>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-5 shadow-lg lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FiLayers className="mr-2" /> System Status
            </h2>
            <div className="text-sm text-gray-400">Version 0.9.2-beta</div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Development Progress</span>
              <span>{Math.round(loaderProgress)}%</span>
            </div>
            <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ width: "0%" }}
                animate={{ width: `${loaderProgress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <div
                  className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-3`}
                >
                  <item.icon className="text-white text-xl" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {item.value}
                </div>
                <div className="text-xs text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Grid decoration */}
          <div className="grid grid-cols-8 gap-1 mt-8">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={gridSquareVariants}
                initial="initial"
                animate="animate"
                className={`h-8 rounded ${
                  Math.random() > 0.7
                    ? "bg-indigo-500 bg-opacity-20"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right panel - Console */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-5 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <FiGrid className="mr-2" /> System Console
            </h2>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-80 overflow-y-auto">
            {consoleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <span className="text-green-500">
                  [
                  {formatTime(
                    new Date(currentTime - (consoleLines.length - i) * 1000)
                  )}
                  ]
                </span>{" "}
                <span>{line}</span>
                {i === consoleLines.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    _
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-400">Estimated Completion</span>
              <span className="font-semibold text-white">April 2025</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Lead Developer</span>
              <span className="font-semibold text-white">Team Alpha</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Request Early Access
          </motion.button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-center text-gray-500 text-sm"
      >
        Admin Dashboard v0.9.2-beta • All systems in development mode • Not for
        production use
      </motion.div>
    </div>
  );
};

export default Admin;
