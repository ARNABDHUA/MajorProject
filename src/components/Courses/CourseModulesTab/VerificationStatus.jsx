import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, Clock, AlertCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Main component for the verification status
export default function VerificationStatus() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Simulate progress update
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Handle redirect to home
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        {/* Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <motion.div
            className="inline-block bg-blue-100 rounded-full p-4 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FileText className="text-blue-600 w-10 h-10" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800">
            Registration Successful!
          </h1>
        </motion.div>

        {/* Main card content */}
        <motion.div
          className="w-full bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start space-x-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="mt-1 text-blue-500"
            >
              <Clock className="w-6 h-6" />
            </motion.div>
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">
                Verification In Progress
              </h2>
              <p className="text-gray-600 mb-4">
                Your documents and details are currently under verification. We
                will inform you shortly once the verification is complete. Until
                then, stay tuned.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Processing indicator with documents */}
        <div className="mt-8 w-full relative">
          <div className="text-center mb-2 text-sm text-gray-500 font-medium">
            Processing Documents
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Document processing animation */}
          <div className="mt-8 flex justify-center">
            <div className="relative h-32 w-64">
              {/* Document stack */}
              <motion.div
                className="absolute top-6 left-4 w-40 h-24 bg-gray-100 rounded border border-gray-300 shadow-sm z-10"
                animate={{ x: [0, 50, 50, 0], opacity: [1, 0.5, 0.5, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <div className="h-3 w-20 bg-blue-200 rounded-sm m-2"></div>
                <div className="h-2 w-32 bg-gray-300 rounded-sm m-2"></div>
                <div className="h-2 w-28 bg-gray-300 rounded-sm m-2"></div>
              </motion.div>

              {/* Second document */}
              <motion.div
                className="absolute top-3 left-8 w-40 h-24 bg-gray-100 rounded border border-gray-300 shadow-sm z-20"
                animate={{ x: [0, 50, 50, 0], opacity: [1, 0.5, 0.5, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  delay: 1,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <div className="h-3 w-16 bg-blue-300 rounded-sm m-2"></div>
                <div className="h-2 w-30 bg-gray-300 rounded-sm m-2"></div>
                <div className="h-2 w-24 bg-gray-300 rounded-sm m-2"></div>
              </motion.div>

              {/* Verification circle */}
              <motion.div
                className="absolute top-0 right-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center z-30"
                animate={{
                  rotate: [0, 360],
                  boxShadow: [
                    "0px 0px 0px rgba(59, 130, 246, 0.5)",
                    "0px 0px 20px rgba(59, 130, 246, 0.5)",
                    "0px 0px 0px rgba(59, 130, 246, 0.5)",
                  ],
                }}
                transition={{
                  rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                  boxShadow: { repeat: Infinity, duration: 2 },
                }}
              >
                <CheckCircle className="text-blue-500 w-8 h-8" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Status updates */}
        <motion.div
          className="mt-8 w-full grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-green-50 p-4 rounded-lg border-t-2 border-green-500 text-center">
            <CheckCircle className="text-green-500 w-6 h-6 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Documents Received</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-t-2 border-blue-500 text-center relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-blue-100"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              style={{ opacity: 0.5 }}
            />
            <Clock className="text-blue-500 w-6 h-6 mx-auto mb-2 relative z-10" />
            <p className="text-sm text-gray-600 relative z-10">
              Verification In Progress
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-t-2 border-gray-300 text-center">
            <AlertCircle className="text-gray-400 w-6 h-6 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Final Approval</p>
          </div>
        </motion.div>

        {/* Additional information note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 border-l-4 border-gray-400"
        >
          <p>
            Your documents and details are currently under verification. You
            will be notified once the verification process is complete. In the
            meantime, please stay tuned. If any updates are not visible, try
            logging out and logging back in, as changes may take some time to
            reflect.
          </p>
        </motion.div>

        {/* Estimated time */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 p-3 bg-blue-50 rounded-lg text-center text-sm text-blue-700"
        >
          <p>
            Estimated completion time:{" "}
            <span className="font-semibold">24-48 hours</span>
          </p>
        </motion.div>

        {/* Back to Home button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={handleBackToHome}
          className="mt-8 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>
      </div>
    </div>
  );
}
