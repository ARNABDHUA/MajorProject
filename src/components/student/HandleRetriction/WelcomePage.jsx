import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBook,
  FiAward,
  FiUser,
  FiMail,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import { RiRocketLine, RiVidicon2Line, RiComputerLine } from "react-icons/ri";
import { BsLightbulb } from "react-icons/bs";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userDataFromStorage = localStorage.getItem("user");
      if (userDataFromStorage) {
        setUserData(JSON.parse(userDataFromStorage));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Example course categories for the featured section
  const courseCategories = [
    {
      id: 1,
      name: "Technology",
      icon: <RiComputerLine className="text-indigo-500" size={24} />,
      count: 42,
    },
    {
      id: 2,
      name: "Science",
      icon: <BsLightbulb className="text-yellow-500" size={24} />,
      count: 38,
    },
    {
      id: 3,
      name: "Business",
      icon: <RiRocketLine className="text-blue-500" size={24} />,
      count: 29,
    },
    {
      id: 4,
      name: "Media Arts",
      icon: <RiVidicon2Line className="text-purple-500" size={24} />,
      count: 24,
    },
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-blue-600/5 -top-20 -left-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-purple-600/5 top-1/4 right-0"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, 10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-cyan-600/5 bottom-0 left-1/3"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Main content */}
      <main className="container mx-auto px-6 pt-10 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Welcome section */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-start gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
              >
                <FiUser size={32} />
              </motion.div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Welcome,{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    {userData?.name || "Student"}
                  </span>
                  !
                </h1>
                <p className="text-xl text-gray-600">
                  You're ready to begin your learning journey.
                </p>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiUser className="text-blue-500" />
                Your Profile
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{userData?.email || "email@example.com"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{userData?.city || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mb-12 shadow-lg border border-blue-100"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Ready to start learning?
                </h2>
                <p className="text-gray-600 mb-4">
                  Begin your journey by exploring our courses designed to help
                  you succeed.
                </p>
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 text-white"
                  >
                    Browse Courses <FiArrowRight />
                  </motion.button>
                </Link>
              </div>
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white"
              >
                <FiAward size={48} />
              </motion.div>
            </div>
          </motion.div>

          {/* Features section */}
          <motion.div variants={itemVariants} className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Everything you need to succeed
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <RiRocketLine size={24} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Self-paced Learning
                </h3>
                <p className="text-gray-600">
                  Learn at your own pace with flexible schedules designed to fit
                  your lifestyle.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
              >
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FiUser size={24} className="text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Expert Instructors
                </h3>
                <p className="text-gray-600">
                  Learn from industry professionals who bring real-world
                  experience to every lesson.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
              >
                <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FiAward size={24} className="text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Recognized Certificates
                </h3>
                <p className="text-gray-600">
                  Earn certificates that are recognized by leading companies and
                  institutions.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <FiBook className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold">E-College</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 E-College. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
