import { motion } from "framer-motion";

import { FiLoader } from "react-icons/fi";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaHourglassEnd } from "react-icons/fa6";
const ChatLoading = () => {
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Different animation variants for different message types
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  // Pulse animation for the typing indicator
  const pulseVariants = {
    hidden: { opacity: 0.3, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.8
      }
    }
  };

  // Shimmer effect
  const shimmerVariants = {
    hidden: { x: "-100%" },
    show: {
      x: "100%",
      transition: {
        repeat: Infinity,
        repeatDelay: 1,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6 p-3 bg-blue-50 rounded-lg shadow-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <LuMessageCircleMore className="text-blue-500 mr-2" size={20} />
          <h3 className="font-semibold text-blue-700">Loading Chat</h3>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <FiLoader className="text-blue-500" size={18} />
        </motion.div>
      </motion.div>

      {/* Chat bubbles container */}
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Generate a mix of left (user) and right (bot) messages */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            {/* User message */}
            <motion.div
              className="self-end max-w-xs"
              variants={bubbleVariants}
            >
              <div className="bg-blue-500 text-white p-3 rounded-t-lg rounded-l-lg shadow-sm relative overflow-hidden">
                <div className="h-3 w-20 bg-white/20 rounded mb-1"></div>
                <div className="h-2 w-32 bg-white/20 rounded"></div>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  variants={shimmerVariants}
                />
              </div>
            </motion.div>

            {/* Bot response */}
            <motion.div
              className="self-start max-w-xs"
              variants={bubbleVariants}
            >
              <div className="bg-gray-100 p-3 rounded-t-lg rounded-r-lg shadow-sm relative overflow-hidden">
                <div className="h-3 w-28 bg-gray-300 rounded mb-2"></div>
                <div className="h-2 w-36 bg-gray-300 rounded mb-1"></div>
                <div className="h-2 w-24 bg-gray-300 rounded"></div>
                <motion.div
                  className="absolute inset-0 bg-gray-200/50"
                  variants={shimmerVariants}
                />
              </div>
            </motion.div>
          </div>
        ))}

        {/* Typing indicator */}
        <motion.div
          className="self-start mt-2 flex items-center gap-1 bg-gray-100 px-4 py-3 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(3)].map((_, idx) => (
            <motion.div
              key={idx}
              className="w-2 h-2 bg-blue-500 rounded-full"
              variants={pulseVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.15 }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Input field */}
      <motion.div
        className="mt-6 bg-white border border-gray-200 rounded-full flex items-center p-2 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex-1 h-8 bg-gray-100 rounded-full mx-2"></div>
        <motion.div
          className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHourglassEnd size={16} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatLoading;