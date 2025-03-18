import React from "react";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import errorImage from "/images/error.png";
const Error404 = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Numbers animation for "404"
  const numberVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        delay: i * 0.1,
      },
    }),
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
      >
        {/* Image Section */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <motion.img
            src={errorImage}
            alt="Error 404 Illustration"
            className="max-w-full h-auto max-h-96 object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center md:text-left"
        >
          {/* Animated 404 */}
          <motion.div className="flex justify-center md:justify-start mb-6">
            {[4, 0, 4].map((number, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={numberVariants}
                className="text-7xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mx-1 md:mr-3 md:ml-0"
                style={{ textShadow: "0 8px 16px rgba(129, 140, 248, 0.2)" }}
              >
                {number}
              </motion.div>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            Page Not Found
          </motion.h1>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 hidden md:block"
          ></motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 max-w-md"
          >
            Oops! The page you're looking for seems to have ventured into
            uncharted territory.
          </motion.p>

          {/* Home button */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center md:justify-start"
          >
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 4px 12px rgba(129, 140, 248, 0.2)",
                    "0 6px 16px rgba(129, 140, 248, 0.4)",
                    "0 4px 12px rgba(129, 140, 248, 0.2)",
                  ],
                }}
                transition={{
                  boxShadow: { repeat: Infinity, duration: 2 },
                }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium flex items-center justify-center shadow-lg"
              >
                <FaHome className="mr-2" />
                <span>Return to Homepage</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error404;
