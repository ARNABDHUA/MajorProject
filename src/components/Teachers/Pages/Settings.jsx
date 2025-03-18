import { motion } from "framer-motion";
import { FaTools } from "react-icons/fa";

const Settings = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500 blur-3xl opacity-30 rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-blue-500 blur-3xl opacity-30 rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Content */}
      <motion.div
        className="flex flex-col items-center text-center p-6 bg-gray-800/80 rounded-2xl shadow-xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaTools className="text-6xl text-yellow-400 drop-shadow-md" />
        </motion.div>
        <h1 className="text-4xl font-bold mt-4 text-gray-200 drop-shadow-md">
          Under Development
        </h1>
        <p className="text-gray-400 mt-2 max-w-lg text-lg">
          We're working hard to bring you something amazing! Stay tuned.
        </p>

        {/* Animated Loader */}
        <motion.div className="mt-6 w-16 h-16 border-4 border-t-4 border-t-yellow-400 border-gray-600 rounded-full animate-spin"></motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
