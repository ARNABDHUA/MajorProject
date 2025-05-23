import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiBook,
  FiVideo,
  FiAlertCircle,
  FiLoader,
  FiRefreshCw,
  FiBookOpen,
} from "react-icons/fi";

/**
 * Schedule Component
 *
 * A modern white-themed teacher's class schedule display with multi-semester support
 * Features:
 * - Dynamic semester selection
 * - Clean white design with subtle shadows and accents
 * - Framer Motion animations for smooth transitions
 * - React Icons for improved visual hierarchy
 * - Responsive layout for all screen sizes
 */
const Schedule = () => {
  // State variables
  const [schedules, setSchedules] = useState([]); // Stores schedules for all semesters
  const [loading, setLoading] = useState(true); // Controls loading state
  const [error, setError] = useState(null); // Stores any error messages
  const [activeSemester, setActiveSemester] = useState(null); // Tracks the currently selected semester
  const [activeDay, setActiveDay] = useState(null); // Tracks the currently selected day tab
  const [refreshing, setRefreshing] = useState(false); // Controls refresh animation

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Set initial active day and semester
  useEffect(() => {
    const today = new Date().getDay();

    // Only set activeDay for weekdays (Monday-Friday)
    if (today >= 1 && today <= 5) {
      setActiveDay(today - 1); // Convert to 0-indexed
    } else {
      // For weekend, don't select any day by default
      setActiveDay(null);
    }
  }, []);

  // Load schedule data when component mounts
  useEffect(() => {
    fetchScheduleData();
  }, []);

  /**
   * Fetches schedule data from the API based on teacher's assigned courses
   */
  const fetchScheduleData = async () => {
    try {
      setLoading(true);

      // Get teacher data from local storage or use defaults if not available
      const teacherData = JSON.parse(localStorage.getItem("user")) || {};
      const paperCodes = teacherData.teacher_course || ["MCA-101", "MCA-104"];

      // Make API request to fetch schedule data
      const response = await axios.post(
        `https://e-college-data.onrender.com/v1/adminroutine/routine-teacher`,
        { paper_codes: paperCodes }
      );

      // Process and store the response data
      if (response.data && response.data.data) {
        const fetchedSchedules = response.data.data;
        setSchedules(fetchedSchedules);

        // Set initial semester (first available or first semester)
        if (fetchedSchedules.length > 0) {
          // Prioritize setting current semester, fallback to first available
          const currentSem =
            fetchedSchedules.find((schedule) => schedule.sem === "3") ||
            fetchedSchedules[0];
          setActiveSemester(currentSem.sem);
        }

        console.log("Schedule data loaded:", fetchedSchedules);
      } else {
        console.warn("Empty or invalid schedule data received");
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError("Failed to load schedule. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refreshes the schedule data with animation
   */
  const refreshSchedule = async () => {
    // Only refresh if not already refreshing
    if (refreshing) return;

    setRefreshing(true);
    await fetchScheduleData();

    // Add slight delay before turning off refresh animation
    setTimeout(() => setRefreshing(false), 600);
  };

  /**
   * Formats time string for display
   * @param {string} timeString - Time string from API
   * @returns {string} Formatted time string or N/A if not available
   */
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";

    // Convert 24-hour format to 12-hour format
    try {
      const [hours, minutes] = timeString
        .replace(/\s*[APM]+/gi, "")
        .split("-")[0]
        .trim()
        .split(":");
      const hour = parseInt(hours);
      const suffix = hour >= 12 ? "PM" : "AM";
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${suffix}`;
    } catch (err) {
      return timeString; // Fallback to original string
    }
  };

  /**
   * Formats date string for display
   * @param {string} dateString - Date string from API (YYYY-MM-DD)
   * @returns {string} Formatted date or "Not scheduled" if not available
   */
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      return dateString; // Fallback to original string
    }
  };

  /**
   * Checks if a class is currently live
   * @param {Object} classItem - Class data object
   * @returns {boolean} True if class is scheduled for today and has a live link
   */
  const isClassLive = (classItem) => {
    if (!classItem || !classItem.is_live) return false;

    // Check if the class is scheduled for today
    const today = new Date().toISOString().split("T")[0];
    return classItem.date === today;
  };

  /**
   * Renders loading state with animation
   */
  const renderLoading = () => (
    <motion.div
      className="flex justify-center items-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-blue-500 mb-4"
        >
          <FiLoader size={40} />
        </motion.div>
        <div className="text-gray-600 font-medium">
          Loading your schedule...
        </div>
      </div>
    </motion.div>
  );

  /**
   * Renders error state with animation
   */
  const renderError = () => (
    <motion.div
      className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-4">
        <FiAlertCircle size={48} className="text-red-500" />
      </div>
      <div className="text-red-500 mb-3 font-semibold text-lg">
        Unable to Load Schedule
      </div>
      <p className="text-gray-700 mb-6">{error}</p>
      <button
        onClick={refreshSchedule}
        className="flex items-center justify-center mx-auto bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium shadow-sm"
      >
        <FiRefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
        Try Again
      </button>
    </motion.div>
  );

  /**
   * Renders semester tabs for navigation
   */
  const renderSemesterTabs = () => {
    if (schedules.length === 0) return null;

    // Get unique semesters from schedules
    const uniqueSemesters = [
      ...new Set(schedules.map((schedule) => schedule.sem)),
    ];

    return (
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {uniqueSemesters.map((semester) => (
            <motion.button
              key={semester}
              onClick={() => {
                setActiveSemester(semester);
                // Reset day when changing semester
                setActiveDay(null);
              }}
              className={`px-5 py-3 font-medium text-sm transition-colors whitespace-nowrap
                ${
                  activeSemester === semester
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Semester {semester}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders day tabs for navigation
   */
  const renderDayTabs = () => {
    const days = [
      { id: "day1", label: "Monday", icon: <FiCalendar /> },
      { id: "day2", label: "Tuesday", icon: <FiCalendar /> },
      { id: "day3", label: "Wednesday", icon: <FiCalendar /> },
      { id: "day4", label: "Thursday", icon: <FiCalendar /> },
      { id: "day5", label: "Friday", icon: <FiCalendar /> },
    ];

    return (
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {days.map((day, index) => (
            <motion.button
              key={day.id}
              onClick={() => setActiveDay(index)}
              className={`px-5 py-3 font-medium text-sm transition-colors whitespace-nowrap flex items-center
                ${
                  activeDay === index
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span className="mr-2">{day.icon}</span>
              {day.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders a single class card
   * @param {Object} classItem - Class data object
   * @param {number} idx - Index of the class
   */
  const renderClassCard = (classItem, idx) => {
    // Determine if class is live for join button
    const isLive = isClassLive(classItem);

    return (
      <motion.div
        key={idx}
        variants={cardVariants}
        className="mb-5 border-l-4 border-blue-500 rounded-lg shadow-lg p-5 bg-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          {/* Course icon/image */}
          <div className="w-14 h-14 mb-3 sm:mb-0 sm:mr-4 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-sm border border-gray-100">
            {classItem.image ? (
              <img
                src={
                  classItem.image.startsWith("data:")
                    ? "/api/placeholder/48/48"
                    : classItem.image
                }
                alt={classItem.paper}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-2xl font-bold text-blue-500">
                <FiBookOpen size={28} />
              </div>
            )}
          </div>

          {/* Course title and code */}
          <div className="flex-1 mb-3 sm:mb-0">
            <h4 className="font-semibold text-gray-900 text-lg">
              {classItem.paper || "Untitled Course"}
            </h4>
            <div className="flex items-center text-sm text-gray-600">
              <FiBook className="mr-1" />
              {classItem.paper_code || "No code"}
            </div>
          </div>
        </div>

        {/* Class details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4 bg-gray-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-start">
            <FiBook className="mr-2 mt-1 text-gray-500" />
            <div>
              <span className="font-medium text-gray-700 block">Topic:</span>
              <div className="text-gray-600">
                {classItem.topic || "Not specified"}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <FiClock className="mr-2 mt-1 text-gray-500" />
            <div>
              <span className="font-medium text-gray-700 block">Time:</span>
              <div className="text-gray-600">{formatTime(classItem.time)}</div>
            </div>
          </div>

          <div className="flex items-start md:col-span-2">
            <FiCalendar className="mr-2 mt-1 text-gray-500" />
            <div>
              <span className="font-medium text-gray-700 block">Date:</span>
              <div className="text-gray-600">{formatDate(classItem.date)}</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  /**
   * Renders the main schedule content with multiple semester support
   */
  const renderSchedule = () => {
    // Handle loading, error and empty states
    if (loading) return renderLoading();
    if (error) return renderError();
    if (!schedules.length) return renderEmpty();

    // Find the current semester's schedule
    const currentSemesterSchedule = schedules.find(
      (schedule) => schedule.sem === activeSemester
    );

    // If no schedule found for the current semester
    if (!currentSemesterSchedule) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderSemesterTabs()}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-red-100 mb-4">
              <FiAlertCircle size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No Data Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no classes scheduled for Semester {activeSemester}.
              Please check back later or contact the administrator.
            </p>
          </motion.div>
        </div>
      );
    }

    // If activeDay is null (weekend), show a message to select a day
    if (activeDay === null) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderSemesterTabs()}
          {renderDayTabs()}

          {/* Weekend message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <FiCalendar size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              It's the weekend!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Please select a weekday from the tabs above to view your schedule.
            </p>
          </motion.div>
        </div>
      );
    }

    // Get classes for the active day
    const dayKey = `day${activeDay + 1}`;
    const dayClasses = currentSemesterSchedule[dayKey] || [];

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Semester and day navigation tabs */}
        {renderSemesterTabs()}
        {renderDayTabs()}

        {/* Day schedule content with animation */}
        <motion.div
          key={`${activeSemester}-${activeDay}`} // Force re-render animation when semester or day changes
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="min-h-40"
        >
          {dayClasses.length > 0 ? (
            <div className="space-y-4">
              {dayClasses.map((classItem, idx) =>
                renderClassCard(classItem, idx)
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FiCalendar size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                No classes scheduled for this day
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  };

  /**
   * Renders empty state when no schedule is found
   */
  const renderEmpty = () => (
    <motion.div
      className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center mb-4">
        <FiCalendar size={56} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        No Schedules Available
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        You don't have any schedules assigned yet. Check back later or contact
        the administrator.
      </p>
      <button
        onClick={refreshSchedule}
        className="flex items-center justify-center mx-auto bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium shadow-sm"
      >
        <FiRefreshCw className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
        Check Again
      </button>
    </motion.div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page header with animation */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            My Teaching Schedule
          </h2>
          <p className="text-gray-600 mb-4">
            View and manage your upcoming classes
          </p>

          {/* Refresh button */}
          <motion.button
            onClick={refreshSchedule}
            className="mt-2 inline-flex items-center justify-center px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || refreshing}
          >
            <FiRefreshCw
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Schedule
          </motion.button>
        </motion.div>

        {/* Schedule content */}
        {renderSchedule()}
      </div>
    </div>
  );
};

export default Schedule;
