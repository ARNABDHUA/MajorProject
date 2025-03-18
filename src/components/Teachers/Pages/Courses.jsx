import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTool, FiCode, FiCpu, FiCoffee, FiCalendar } from "react-icons/fi";

const Courses = () => {
  const [rotation, setRotation] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation((prev) => prev + 5);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, []);

  const toolIconVariants = {
    animate: {
      rotate: [0, 15, 0, -15, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
      },
    },
  };

  const floatingIconVariants = {
    animate: (i) => ({
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
        delay: i * 0.3,
      },
    }),
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl w-full bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-2xl p-6 md:p-12 shadow-2xl border border-gray-700"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-3">
            Under Development
          </h1>
          <div className="flex justify-center mb-6">
            <motion.div
              variants={toolIconVariants}
              animate="animate"
              className="text-yellow-400 mx-2"
            >
              <FiTool size={32} />
            </motion.div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            We're working hard to bring you something amazing. Our team is
            coding day and night to launch soon!
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="mb-10">
          <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-right mt-2 text-gray-400">{progress}% Complete</p>
        </div>

        {/* Floating icons */}
        <div className="flex justify-center space-x-8 md:space-x-16 mb-10">
          {[FiCode, FiCpu, FiCoffee, FiCalendar].map((Icon, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={floatingIconVariants}
              animate="animate"
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
            >
              <Icon size={28} />
            </motion.div>
          ))}
        </div>

        {/* Spinning cog animation */}
        <motion.div
          className="flex justify-center items-center mb-8"
          style={{ rotate: rotation }}
        >
          <div className="text-purple-400 opacity-30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Get Notified When We Launch
          </button>
          <p className="text-gray-400 mt-8">
            Expected launch date:{" "}
            <span className="text-gray-300">April 2025</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Courses;
