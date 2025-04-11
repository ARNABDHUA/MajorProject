import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaBook,
  FaCalendarAlt,
  FaIdCard,
  FaPhoneAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { MdSchool, MdSubject } from "react-icons/md";
import HashLoader from "react-spinners/HashLoader";

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        // console.log("userdata", userData);
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          throw new Error("Authentication data not found");
        }

        // Verify if it's a student account
        if (userData.role !== "student") {
          throw new Error("Not a student account");
        }

        // Try to fetch additional student data from API
        try {
          // Fixed axios request - properly structure headers and use GET method

          // Combine stored user data with any additional data from API
          setProfileData({
            ...userData,
          });
        } catch (apiError) {
          console.warn("API request failed, using local data only:", apiError);
          // Continue with just the userData if API call fails
          setProfileData(userData);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <HashLoader color="#3B82F6" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => (window.location.href = "/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Mock data for courses and grades (replace with actual data from API)
  const courses = [
    { id: 1, name: "Mathematics", instructor: "Dr. Smith", progress: 85 },
    {
      id: 2,
      name: "Computer Science",
      instructor: "Prof. Johnson",
      progress: 72,
    },
    { id: 3, name: "Physics", instructor: "Dr. Williams", progress: 90 },
  ];

  const grades = [
    { subject: "Mathematics", midterm: 85, final: 88, grade: "A" },
    { subject: "Computer Science", midterm: 78, final: 82, grade: "B+" },
    { subject: "Physics", midterm: 92, final: 94, grade: "A+" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full rounded-full bg-gray-300 flex justify-center items-center"
              >
                <FaUser className="text-blue-700 text-5xl" />
              </motion.div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold">
                {profileData?.name || "Student Name"}
              </h1>
              <p className="text-blue-100 mt-2">
                ID: {profileData?.studentId || profileData?._id || "STU12345"}
              </p>
              <p className="text-blue-100">
                {profileData?.department || "Computer Science"} Department
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b shadow-sm">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "courses"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`px-6 py-4 font-medium text-sm ${
                activeTab === "grades"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Grades
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          {activeTab === "profile" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaIdCard className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">
                      Student ID
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.studentId || profileData?._id || "STU12345"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaEnvelope className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">Email</span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.email || "student@gmail.com"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <MdSchool className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">
                      Department
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.department || "Computer Science"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaGraduationCap className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">Program</span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.program || "Bachelor of Science"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaCalendarAlt className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">
                      Enrolled Year
                    </span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.enrollmentYear || "2023"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaPhoneAlt className="text-blue-500 mr-2" />
                    <span className="text-gray-500 font-medium">Phone</span>
                  </div>
                  <p className="text-gray-800 font-semibold pl-6">
                    {profileData?.phone ||
                      profileData?.phoneNumber ||
                      "Not provided"}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Academic Status
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-gray-500">Current Semester</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {profileData?.semester || "3rd"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-gray-500">CGPA</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {profileData?.cgpa || "3.8"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-gray-500">Credits Completed</h4>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {profileData?.creditsCompleted || "64"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "courses" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Current Courses
              </h3>
              <div className="space-y-4">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <FaBook className="text-blue-500 mr-2" />
                          <h4 className="text-lg font-medium text-gray-800">
                            {course.name}
                          </h4>
                        </div>
                        <p className="text-gray-600 mt-1 pl-6">
                          Instructor: {course.instructor}
                        </p>
                      </div>
                      <div className="w-full md:w-1/3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            Progress
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-blue-500 h-2 rounded-full"
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "grades" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Academic Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Subject
                      </th>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Midterm
                      </th>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Final
                      </th>
                      <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((item, index) => (
                      <motion.tr
                        key={index}
                        variants={itemVariants}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="py-4 px-4 border-b">
                          <div className="flex items-center">
                            <MdSubject className="text-blue-500 mr-2" />
                            {item.subject}
                          </div>
                        </td>
                        <td className="py-4 px-4 border-b">{item.midterm}</td>
                        <td className="py-4 px-4 border-b">{item.final}</td>
                        <td className="py-4 px-4 border-b">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.grade}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
