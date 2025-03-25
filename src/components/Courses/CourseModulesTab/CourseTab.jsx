import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { CiStreamOn } from "react-icons/ci";
import python from "../../../assets/python.png"; // Sample image
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseTab = () => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref for the container to measure and control scrolling
  const containerRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/adminroutine/routine-all/${id}/1`
        );

        const routineData = response.data.data[0];
        const days = routineData.days;

        // Create a week object with transformed data
        const weekData = {
          week: routineData.week || `Week ${routineData.sem}`,
          dateRange: routineData.date_range || `Semester ${routineData.sem}`,
          days: [],
        };

        // Transform each day's data
        Object.keys(days).forEach((dayKey, index) => {
          if (
            days[dayKey] &&
            Array.isArray(days[dayKey]) &&
            days[dayKey].length > 0
          ) {
            const dayName = dayKey.replace("day", "Day ");
            const dayClasses = days[dayKey].map((classItem) => ({
              subject: classItem.paper,
              topic: classItem.topic || classItem.paper_code,
              time: classItem.time,
              isLive: classItem.is_live || false,
              image: classItem.image,
              date: classItem.date,
            }));

            weekData.days.push({
              day: dayName,
              date: `Day ${index + 1}`,
              classes: dayClasses,
            });
          }
        });

        setSchedule([weekData]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schedule data");
        setLoading(false);
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule();
  }, [id]);

  // Handle expansion of weeks
  const handleWeekExpand = (weekIndex) => {
    setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex);
    // Reset expanded day when collapsing a week
    if (expandedWeek === weekIndex) {
      setExpandedDay(null);
    }
  };

  // Handle expansion of days
  const handleDayExpand = (dayIndex) => {
    setExpandedDay(expandedDay === dayIndex ? null : dayIndex);
  };

  // Auto-scroll when content expands
  useEffect(() => {
    if (expandedDay !== null && containerRef.current) {
      // Get the currently expanded day element
      const expandedDayElement = containerRef.current.querySelector(
        `[data-day-index="${expandedDay}"]`
      );
      if (expandedDayElement) {
        // Smooth scroll to show the expanded content
        expandedDayElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [expandedDay]);

  // Helper function to get current day number (0-6)
  const getCurrentDayNumber = () => {
    return new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
  };

  // Function to check if time is in range - FIXED
  function isCurrentTimeInRange(timeRange) {
    if (!timeRange) return false;

    try {
      // Split by dash with optional spaces around it
      const parts = timeRange.split(/\s*-\s*/);
      if (parts.length !== 2) return false;

      const [start, end] = parts;

      // Get the current time
      const now = new Date();

      // Convert given time range to Date objects
      const startTime = new Date(now);
      const endTime = new Date(now);

      // Set hours, minutes, and reset seconds/milliseconds
      const startParts = convertTo24HourFormat(start);
      const endParts = convertTo24HourFormat(end);

      if (!startParts || !endParts) return false;

      startTime.setHours(startParts[0], startParts[1], 0, 0);
      endTime.setHours(endParts[0], endParts[1], 0, 0);

      // Compare current time with the given range
      return now >= startTime && now <= endTime;
    } catch (error) {
      console.error("Error checking time range:", error);
      return false;
    }
  }

  function convertTo24HourFormat(timeStr) {
    if (!timeStr) return null;

    try {
      // More flexible regex for time format: handles formats like "1:00 P.M" and "1:00 P.M."
      const timeRegex = /(\d+)(?::(\d+))?\s*([AP]\.?M\.?)/i;
      const match = timeStr.match(timeRegex);

      if (!match) {
        console.log(`No match for time format: ${timeStr}`);
        return null;
      }

      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      const period = match[3];

      // Convert to 24-hour format
      const isPM = period.toUpperCase().startsWith("P");

      if (isPM && hours !== 12) {
        hours += 12; // Convert PM to 24-hour format
      } else if (!isPM && hours === 12) {
        hours = 0; // Convert 12 AM to 00 hours
      }

      return [hours, minutes];
    } catch (error) {
      console.error(`Error parsing time format: ${timeStr}`, error);
      return null;
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm sm:text-base">Loading schedule...</p>
        </div>
      </div>
    );

  if (error)
    return (
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

  if (!schedule)
    return (
      <div className="text-center p-4 text-gray-500 text-sm sm:text-base">
        No schedule available
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] pb-6 px-3 sm:px-4 md:px-6"
    >
      {schedule.map((weekData, weekIndex) => (
        <div key={weekIndex} className="mb-4">
          {/* Week Section */}
          <div
            className="flex justify-between border border-slate-300 items-center p-3 rounded-xl select-none cursor-pointer sticky top-0 bg-white z-10 shadow-md transition-all hover:bg-gray-50"
            onClick={() => handleWeekExpand(weekIndex)}
          >
            <div className="p-1 sm:p-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <span className="font-bold text-base sm:text-lg text-gray-800">
                {weekData.week} {weekData.dateRange ? "-" : ""}
              </span>
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

          {/* Days Inside a Week */}
          {expandedWeek === weekIndex &&
            weekData.days.map((dayData, dayIndex) => {
              // Only render if the day matches the current day
              const isCurrentDay = dayIndex + 1 === getCurrentDayNumber();

              return (
                <div key={dayIndex} data-day-index={dayIndex} className="mt-3">
                  <div
                    className="my-2 flex justify-between border border-slate-300 p-2 sm:p-3 rounded-md select-none cursor-pointer sticky top-16 bg-white z-10 shadow-sm transition-all hover:bg-gray-50"
                    onClick={() => handleDayExpand(dayIndex)}
                  >
                    <div className="p-1 sm:p-2 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <span className="font-bold text-sm sm:text-md text-gray-800">
                        {dayData.day}
                        {dayData.date ? " -" : ""}
                      </span>
                      <span className="text-slate-700 text-xs sm:text-sm">
                        {dayData.date}
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

                  {/* Classes Inside a Day */}
                  {expandedDay === dayIndex && (
                    <div className="max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 rounded-md bg-gray-50 p-2">
                      {dayData.classes.map((classData, classIndex) => {
                        // Modify live check to ensure it's only for current day and current time
                        const isLive =
                          isCurrentDay &&
                          classData.isLive &&
                          isCurrentTimeInRange(classData.time);

                        return (
                          <div
                            key={classIndex}
                            className="m-2 sm:m-3 my-3 sm:my-4 flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100"
                          >
                            <div className="flex-shrink-0 bg-gray-50 p-1 rounded-md">
                              <img
                                src={classData.image || python} // Default to Python if no image
                                className="w-8 h-8 sm:w-12 sm:h-12 object-contain pointer-events-none"
                                alt={classData.subject}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h1 className="font-medium text-sm sm:text-base md:text-lg truncate text-gray-800">
                                {classData.subject}
                                {classData.topic ? " - " + classData.topic : ""}
                              </h1>
                              <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-600 mt-1">
                                <span className="font-light truncate">
                                  {classData.time}
                                </span>
                                <LuDot className="hidden sm:block mx-1" />
                                {isLive ? (
                                  <span className="flex items-center text-red-600 cursor-pointer font-medium ml-1 sm:ml-0">
                                    <Link
                                      to={classData.isLive}
                                      className="flex justify-center items-center space-x-2"
                                    >
                                      <span>Live</span>
                                      <CiStreamOn className="ml-1 text-lg sm:text-xl text-red-600" />
                                    </Link>
                                  </span>
                                ) : (
                                  <span className="text-green-600 cursor-pointer font-medium ml-1 sm:ml-0">
                                    {" "}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default CourseTab;
