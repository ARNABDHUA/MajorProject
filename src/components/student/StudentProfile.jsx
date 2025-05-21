import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaGraduationCap,
  FaVenusMars,
  FaMapPin,
} from "react-icons/fa";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-300 rounded-2xl shadow-xl overflow-hidden animate-pulse">
          <div className="md:flex p-6">
            <div className="md:w-1/3 flex justify-center md:justify-start">
              <div className="rounded-full h-40 w-40 bg-blue-200"></div>
            </div>
            <div className="md:w-2/3 mt-6 md:mt-0 text-center md:text-left">
              <div className="h-10 bg-blue-200 rounded-lg w-3/4 mb-4"></div>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="h-8 bg-blue-200 rounded-lg w-32"></div>
                <div className="h-8 bg-blue-200 rounded-lg w-40"></div>
              </div>
              <div className="mt-4">
                <div className="h-8 bg-blue-200 rounded-lg w-24"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="bg-white shadow-md rounded-xl mt-6 p-4">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            <div className="h-10 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-36 animate-pulse"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white shadow-md rounded-xl mt-6 p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-gray-200 p-3 rounded-lg h-12 w-12 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="bg-gray-200 p-3 rounded-lg h-12 w-12 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    // Simulating getting data from localStorage
    const fetchUserData = () => {
      try {
        // In a real app, you'd get this from localStorage
        const data = JSON.parse(localStorage.getItem("user"));

        // Simulate network delay to show the skeleton loader
        setTimeout(() => {
          setUserData(data);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const StatusBadge = ({ status, text }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status ? (
        <FaCheck className="inline mr-1" />
      ) : (
        <FaTimes className="inline mr-1" />
      )}
      {text}
    </span>
  );

  const tabItems = [
    { id: "personal", label: "Personal Info", icon: <FaUser /> },
    { id: "academic", label: "Academic Info", icon: <FaGraduationCap /> },
  ];

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-red-600 text-xl">
          Unable to load student profile
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      {/* Header with student photo and basic info */}
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex p-6 text-white">
            <motion.div
              className="md:w-1/3 flex justify-center md:justify-start"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={userData.pic}
                alt="Student"
                className="rounded-full h-40 w-40 object-cover border-4 border-white shadow-lg"
              />
            </motion.div>
            <div className="md:w-2/3 mt-6 md:mt-0 text-center md:text-left">
              <motion.h1
                className="text-3xl md:text-4xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {userData.name}
              </motion.h1>

              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <FaIdCard />
                  <span>{userData.c_roll}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  <FaEnvelope />
                  <span className="truncate max-w-xs">{userData.email}</span>
                </div>
              </div>

              <div className="mt-4 space-x-2 flex flex-wrap gap-2 justify-center md:justify-start">
                <StatusBadge status={userData.payment} text="Payment" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow-md rounded-xl mt-6 p-4">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-blue-100 text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Section */}
        <motion.div
          className="bg-white shadow-md rounded-xl mt-6 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === "personal" && (
            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaUser size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaVenusMars size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-lg font-medium text-gray-800 capitalize">
                        {userData.gender}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaEnvelope size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-lg font-medium text-gray-800 break-all">
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaPhone size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Address Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaMapMarkerAlt size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Street Address</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaMapMarkerAlt size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaMapMarkerAlt size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                      <FaMapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pin Code</p>
                      <p className="text-lg font-medium text-gray-800">
                        {userData.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "academic" && (
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2"
              >
                Academic Information
              </motion.h2>

              <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3 text-blue-600 mb-4">
                    <FaIdCard size={24} />
                    <h3 className="text-xl font-semibold">Student ID</h3>
                  </div>
                  <p className="text-gray-800 text-lg">{userData.c_roll}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-3 text-blue-600 mb-4">
                    <FaGraduationCap size={24} />
                    <h3 className="text-xl font-semibold">Semester</h3>
                  </div>
                  <p className="text-gray-800 text-lg">{userData.sem}</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gray-50 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center space-x-3 text-blue-600 mb-4">
                  <FaFileAlt size={24} />
                  <h3 className="text-xl font-semibold">
                    Subjects in this Semester
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {userData.paper_code.map((paper, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-sm border border-blue-100"
                      whileHover={{ scale: 1.05, backgroundColor: "#EBF5FF" }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="font-medium text-blue-600">{paper}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
