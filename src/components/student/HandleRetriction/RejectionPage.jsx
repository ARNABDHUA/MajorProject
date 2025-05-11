import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertCircle, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function RejectionPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a better user experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 8 }}
            transition={{ duration: 0.8 }}
            className="w-full bg-red-500"
          />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-12 left-6 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2,
              }}
            >
              <FiAlertCircle size={32} className="text-red-500" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="px-6 pt-16 pb-8"
        >
          <motion.h1
            variants={item}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Application Status
          </motion.h1>

          <motion.div variants={item} className="bg-red-50 rounded-lg p-4 mb-6">
            <p className="text-red-600 font-semibold">
              We regret to inform you that your application was not selected.
            </p>
          </motion.div>

          <motion.p variants={item} className="text-gray-600 mb-6">
            Thank you for your interest in our program. We received many
            qualified applications this year and unfortunately could not
            accommodate all candidates.
          </motion.p>

          <motion.button
            variants={item}
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 font-medium"
          >
            <span>View Feedback</span>
            <motion.div
              animate={{ rotate: showDetails ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FiChevronRight size={20} />
            </motion.div>
          </motion.button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-gray-50 rounded-lg p-4"
            >
              <p className="text-gray-600 text-sm mb-2">
                We encourage you to apply again for future opportunities. Our
                selection committee has noted your potential and suggests
                strengthening your application in the following areas:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                <li>Academic prerequisites</li>
                <li>Project portfolio</li>
                <li>Relevant experience</li>
              </ul>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={item}
          className="px-6 py-4 bg-gray-50 flex flex-col gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Link to="/">Return to Homepage</Link>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-gray-500 text-sm"
      >
        Better luck next time! We hope to see your application again.
      </motion.p>
    </div>
  );
}
