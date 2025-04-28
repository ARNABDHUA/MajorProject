import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiBook,
  FiCheckCircle,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { FaRegClock, FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    setTimeout(() => {
      try {
        const data = localStorage.getItem("teacherAttendanceData");
        console.log("Raw localStorage data:", data);

        if (data) {
          // Check if the data is an array or a single object
          let parsedData;
          try {
            parsedData = JSON.parse(data);
            console.log("Parsed data:", parsedData);

            // If parsedData is not an array but an object, convert it to an array
            if (parsedData && !Array.isArray(parsedData)) {
              parsedData = [parsedData];
              console.log("Converted to array:", parsedData);
            }

            // If we have valid data, use it
            if (parsedData && parsedData.length > 0) {
              setAttendanceData(parsedData);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error parsing localStorage data:", error);
          }
        }

        // If we reach here, either there was no data or we couldn't parse it properly
        // Use sample data as fallback
        const sampleData = [
          {
            attendance_id: "bc22b5c5-e218-49c6-81fa-5361fdf7bcd5",
            c_roll: "72570001",
            course_code: "101",
            createdAt: "2025-04-28T17:02:31.055Z",
            date: "2025-04-28T17:02:31.055Z",
            email: "teacherx@gmail.com",
            exittime: "05:19 PM",
            jointime: "05:02 PM",
            paper_code: "MCA-101",
            status: "present",
            teacher: "Teacher x",
            updatedAt: "2025-04-28T17:19:03.956Z",
            __v: 0,
            _id: "680fb4a7b7b3fdb29cbd3151",
          },
          {
            attendance_id: "ac22b5c5-e218-49c6-81fa-5361fdf7bce2",
            c_roll: "72570002",
            course_code: "102",
            createdAt: "2025-04-27T10:15:22.055Z",
            date: "2025-04-27T10:15:22.055Z",
            email: "teachery@gmail.com",
            exittime: "12:30 PM",
            jointime: "10:15 AM",
            paper_code: "MCA-102",
            status: "present",
            teacher: "Teacher Y",
            updatedAt: "2025-04-27T12:30:12.643Z",
            __v: 0,
            _id: "680fb4a7b7b3fdb29cbd3152",
          },
          {
            attendance_id: "dc22b5c5-e218-49c6-81fa-5361fdf7bce7",
            c_roll: "72570003",
            course_code: "103",
            createdAt: "2025-04-26T09:05:12.055Z",
            date: "2025-04-26T09:05:12.055Z",
            email: "teacherz@gmail.com",
            exittime: "",
            jointime: "09:05 AM",
            paper_code: "MCA-103",
            status: "absent",
            teacher: "Teacher Z",
            updatedAt: "2025-04-26T09:05:12.055Z",
            __v: 0,
            _id: "680fb4a7b7b3fdb29cbd3153",
          },
        ];
        setAttendanceData(sampleData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading attendance data:", error);
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  // Filter and search functionality
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch =
      item.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paper_code.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Teacher Attendance Report
          </h1>
          <p className="text-gray-600">
            View and filter attendance records for all teachers
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUser className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-xl font-semibold">{attendanceData.length}</p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-xl font-semibold">
                {
                  attendanceData.filter((item) => item.status === "present")
                    .length
                }
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiClock className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-xl font-semibold">
                {
                  attendanceData.filter((item) => item.status === "absent")
                    .length
                }
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow p-6 flex items-center"
          >
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FiBook className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Courses</p>
              <p className="text-xl font-semibold">
                {new Set(attendanceData.map((item) => item.course_code)).size}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter and Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow mb-8 p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 items-center w-full md:w-auto">
              <FiFilter className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Attendance Records */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow p-8 text-center"
              >
                <p className="text-gray-500 text-lg">
                  No attendance records found
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {filteredData.map((record, index) => (
                  <motion.div
                    key={record._id || index}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div
                      className={`h-2 ${
                        record.status === "present"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              record.status === "present"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            <FaChalkboardTeacher className="text-xl" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {record.teacher}
                            </h3>
                            <div className="flex items-center text-gray-500">
                              <MdOutlineEmail className="mr-1" />
                              <span className="text-sm">{record.email}</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <FiCalendar className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm font-medium">
                              {formatDate(record.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <FiBook className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Course</p>
                            <p className="text-sm font-medium">
                              {record.paper_code}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <FaRegClock className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Join Time</p>
                            <p className="text-sm font-medium">
                              {record.jointime || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <FaRegClock className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Exit Time</p>
                            <p className="text-sm font-medium">
                              {record.exittime || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Attendance;
