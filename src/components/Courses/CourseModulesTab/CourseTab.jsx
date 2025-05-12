import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus, FaLock } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { CiStreamOn } from "react-icons/ci";
import defaultImage from "../../../assets/python.png";

import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseTab = () => {
  // State management
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [liveClass, setLiveClass] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sem, setSem] = useState();
  const [coursePurchaseVerfication, setCoursePurchaseverification] =
    useState(false);
  const [myCourse, setMycourseCode] = useState();

  const containerRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setSem(parsedUser.sem);
        setMycourseCode(parsedUser.course_code);
        setCoursePurchaseverification(id === parsedUser.course_code);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, []);

  // Fetch schedule data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/adminroutine/routine-all/${id}/${sem}`
        );

        if (!response.data?.data?.[0]) {
          throw new Error("Invalid data format received");
        }

        const formattedSchedule = formatScheduleData(response.data.data[0]);
        setSchedule([formattedSchedule]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("Failed to fetch schedule data. Please try again later.");
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id, isAuthenticated]);

  // Format API response data into a more usable structure
  const formatScheduleData = (routineData) => {
    const days = routineData.days;

    const weekData = {
      dateRange: routineData.date_range || `Semester ${routineData.sem}`,
      days: [],
    };

    // Convert day numbers to actual day names
    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Process each day (day1, day2, etc.)
    Object.keys(days).forEach((dayKey, index) => {
      if (
        days[dayKey] &&
        Array.isArray(days[dayKey]) &&
        days[dayKey].length > 0
      ) {
        // Get the actual day name using the index
        const dayName = dayNames[index % 7];

        const dayClasses = days[dayKey].map((classItem) => ({
          subject: classItem.paper,
          topic: classItem.topic || classItem.paper_code,
          time: classItem.time,
          isLive: classItem.is_live || false,
          image: classItem.image,
          date: classItem.date,
          paperCode: classItem.paper_code,
        }));

        weekData.days.push({
          day: dayName,
          date: dayName, // Use the actual day name here instead of "Day X"
          classes: dayClasses,
        });
      }
    });

    return weekData;
  };

  const handleLiveLink = async (paper_code, isLive) => {
    console.log("ignore user", user.course_code);

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-attendance-start",
        {
          c_roll: user.c_roll,
          paper_code: paper_code,
          course_code: user.course_code,
        }
      );
      if (response.data.data.attendance_id) {
        const attandanceData = response.data.data.attendance_id;
        const AttandanceId = localStorage.setItem(
          "attendanceid",
          attandanceData
        );
        window.open(`${isLive}`);
      }
    } catch (err) {
      console.log("Error attandance Attandence", err);
    }
  };

  // Event handlers for expanding/collapsing sections
  const toggleWeek = (weekIndex) => {
    setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex);
    if (expandedWeek !== weekIndex) {
      setExpandedDay(null); // Reset day when expanding a different week
    }
  };

  const toggleDay = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  /**
   * Check if a class is currently live based on date and time
   * @param {Object} classData - The class data object
   * @returns {Boolean} - Whether class is currently live
   */
  const isClassLive = (classData) => {
    // First check if we have the required data and a live URL
    if (!classData.date || !classData.isLive || !classData.time) return false;

    try {
      // Check if the date matches today's date (YYYY-MM-DD format)
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Simple string comparison for dates in YYYY-MM-DD format
      const isToday = classData.date === todayStr;

      // Only check time if it's today
      if (isToday) {
        return isTimeInRange(classData.time);
      }

      return false;
    } catch (error) {
      console.error("Error checking if class is live:", error);
      return false;
    }
  };

  /**
   * Check if current time is within a specified time range
   * @param {String} timeRange - Time range string (e.g. "10.00 P.M-11.00 P.M")
   * @returns {Boolean} - Whether current time is in range
   */
  const isTimeInRange = (timeRange) => {
    if (!timeRange) return false;

    try {
      // Split the time range into start and end times
      const [startStr, endStr] = timeRange.split(/\s*-\s*/);
      if (!startStr || !endStr) return false;

      const now = new Date();
      const startTime = parseTimeString(startStr);
      const endTime = parseTimeString(endStr);

      if (!startTime || !endTime) return false;

      // Compare current time with the range
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      const startTotalMinutes = startTime.hours * 60 + startTime.minutes;
      const endTotalMinutes = endTime.hours * 60 + endTime.minutes;

      return (
        currentTotalMinutes >= startTotalMinutes &&
        currentTotalMinutes <= endTotalMinutes
      );
    } catch (error) {
      console.error("Error checking time range:", error);
      return false;
    }
  };

  /**
   * Parse a time string into hours and minutes in 24-hour format
   * @param {String} timeStr - Time string (e.g. "10.00 P.M" or "9:30 AM")
   * @returns {Object|null} - Object with hours and minutes, or null if invalid
   */
  const parseTimeString = (timeStr) => {
    if (!timeStr) return null;

    try {
      // Handle various time formats: "1:00 PM", "1 PM", "13:00", "10.00 P.M" etc.
      const timeRegex = /(\d+)(?:[:.:](\d+))?\s*([AP]\.?M\.?)?/i;
      const match = timeStr.match(timeRegex);

      if (!match) return null;

      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const period = match[3];

      // Convert to 24-hour format if AM/PM is specified
      if (period) {
        const isPM = period.toUpperCase().startsWith("P");
        if (isPM && hours !== 12) hours += 12;
        else if (!isPM && hours === 12) hours = 0;
      }

      return { hours, minutes };
    } catch (error) {
      console.error(`Error parsing time: ${timeStr}`, error);
      return null;
    }
  };

  // Smooth scroll to expanded day
  useEffect(() => {
    if (expandedDay !== null && containerRef.current) {
      const element = containerRef.current.querySelector(
        `[data-day-index="${expandedDay}"]`
      );
      if (element) {
        // Add a small delay to ensure the content has rendered
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [expandedDay]);

  /**
   * Format a date string for display
   * @param {String} dateStr - Date string in YYYY-MM-DD format
   * @returns {String} - Formatted date string
   */
  const formatDateString = (dateStr) => {
    if (!dateStr) return "";

    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr; // Return original if parsing fails
    }
  };
  if (!coursePurchaseVerfication) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-md max-w-md mx-auto flex items-center space-x-4">
        <div className="bg-red-100 rounded-full p-3">
          <FaLock className="text-red-600 w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Course Purchase Restricted
          </h3>
          <p className="text-red-700">
            You have already purchased the course with ID:
            <span className="font-bold ml-1">{myCourse}</span>
          </p>
          <div className="mt-3 text-sm text-red-600 flex items-center">
            <FaLock className="mr-2 w-4 h-4" />
            Additional courses are currently locked 🔏🔏🔏
          </div>
        </div>
      </div>
    );
  }

  // Render functions for different states
  const renderAuthenticatedView = () => (
    <div
      ref={containerRef}
      className="overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] pb-6 px-3 sm:px-4 md:px-6"
    >
      {schedule?.map((weekData, weekIndex) => (
        <div key={weekIndex} className="mb-4">
          {/* Week Header */}
          <div
            className="flex justify-between border border-slate-300 items-center p-3 rounded-xl select-none cursor-pointer sticky top-0 bg-white z-10 shadow-md transition-all hover:bg-gray-50"
            onClick={() => toggleWeek(weekIndex)}
          >
            <div className="p-1 sm:p-2 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-slate-700 text-sm sm:text-base">
                {weekData.dateRange}
              </span>
            </div>
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              {expandedWeek === weekIndex ? (
                <FaMinus className="text-xs sm:text-sm text-gray-700" />
              ) : (
                <FaPlus className="text-xs sm:text-sm text-gray-700" />
              )}
            </div>
          </div>

          {/* Days Inside Week */}
          {expandedWeek === weekIndex &&
            weekData.days.map((dayData, dayIndex) => (
              <div key={dayIndex} data-day-index={dayIndex} className="mt-3">
                {/* Day Header */}
                <div
                  className="my-2 flex justify-between border border-slate-300 p-2 sm:p-3 rounded-md select-none cursor-pointer sticky top-16 bg-white z-10 shadow-sm transition-all hover:bg-gray-50"
                  onClick={() => toggleDay(dayIndex)}
                >
                  <div className="p-1 sm:p-2 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="font-bold text-sm sm:text-md text-gray-800">
                      {dayData.day}
                    </span>
                  </div>
                  <div className="p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    {expandedDay === dayIndex ? (
                      <FaMinus className="text-xs text-gray-700" />
                    ) : (
                      <FaPlus className="text-xs text-gray-700" />
                    )}
                  </div>
                </div>

                {/* Classes for the Day */}
                {expandedDay === dayIndex && (
                  <div className="max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 rounded-md bg-gray-50 p-2">
                    {dayData.classes.length > 0 ? (
                      dayData.classes.map((classData, classIndex) => {
                        // Check if class is currently live based on date and time
                        const isLive = isClassLive(classData);

                        return (
                          <div
                            key={classIndex}
                            className="m-2 sm:m-3 my-3 sm:my-4 flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                          >
                            <div className="flex-shrink-0 bg-gray-50 p-1 rounded-md">
                              <img
                                src={classData.image || defaultImage}
                                className="w-8 h-8 sm:w-12 sm:h-12 object-contain pointer-events-none"
                                alt={classData.subject}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h1 className="font-medium text-sm sm:text-base md:text-lg truncate text-gray-800">
                                {classData.subject} - {classData.paperCode}
                                {classData.topic ? ` - ${classData.topic}` : ""}
                              </h1>
                              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mt-1">
                                <span className="font-light truncate">
                                  {classData.time}
                                </span>
                                {classData.date && (
                                  <>
                                    <LuDot className="mx-1" />
                                    <span className="font-light">
                                      {formatDateString(classData.date)}
                                    </span>
                                  </>
                                )}
                                {/* Show Live indicator only if class is currently live */}
                                {isLive && (
                                  <>
                                    <LuDot className="hidden sm:block mx-1" />
                                    <span className="flex items-center text-red-600 cursor-pointer font-medium ml-1 sm:ml-0">
                                      <button
                                        onClick={() =>
                                          handleLiveLink(
                                            classData.paperCode,
                                            classData.isLive
                                          )
                                        }
                                        className="flex justify-center items-center gap-2"
                                      >
                                        <span>Live</span>
                                        <CiStreamOn className="ml-1 text-lg sm:text-xl text-red-600" />
                                      </button>
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        No classes scheduled for this day
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}

      {schedule?.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No schedule information available
        </div>
      )}
    </div>
  );

  const renderLockedView = () => (
    <div className="relative">
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-60">
        <div className="overflow-y-auto max-h-[60vh] pb-6 px-3">
          <div className="mb-4">
            <div className="flex justify-between border border-slate-300 items-center p-3 rounded-xl">
              <div className="p-2 flex flex-col">
                <span className="text-slate-700 text-sm">Sample Semester</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="my-2 flex justify-between border border-slate-300 p-2 rounded-md">
                <div className="p-2 flex flex-col">
                  <span className="font-bold text-sm text-gray-800">
                    Monday
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay with subscription message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-20">
        <FaLock className="text-red-500 text-5xl mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Content Locked</h2>
        <p className="text-gray-700 text-center max-w-md mb-4 px-4">
          You haven't subscribed to access this content. Please subscribe to
          view the complete course schedule.
        </p>
        <div className="text-gray-600 px-6 py-3 rounded-lg border border-gray-300 bg-gray-50">
          You haven't subscribed
        </div>
      </div>
    </div>
  );

  const renderUnauthenticatedView = () => (
    <div className="flex flex-col items-center justify-center h-64 p-4">
      <div className="text-center mb-6">
        <FaLock className="text-gray-400 text-4xl mb-2 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-700">
          Access Restricted
        </h2>
        <p className="text-gray-600 mt-2">
          You need to login to view course schedule
        </p>
      </div>
      <button
        onClick={() => navigate("/login")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
      >
        Login to Continue
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-2"></div>
        <p className="text-sm sm:text-base">Loading schedule...</p>
      </div>
    </div>
  );

  const renderErrorView = () => (
    <div className="text-red-500 p-4 text-center">
      <p className="font-semibold text-sm sm:text-base">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-blue-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Main render logic with cleaner conditional flow
  if (!isAuthenticated) {
    return renderUnauthenticatedView();
  }

  if (user && user.payment === false) {
    return renderLockedView();
  }

  if (loading) {
    return renderLoadingView();
  }

  if (error) {
    return renderErrorView();
  }

  if (!schedule) {
    return (
      <div className="text-center p-4 text-gray-500">No schedule available</div>
    );
  }

  return renderAuthenticatedView();
};

export default CourseTab;
