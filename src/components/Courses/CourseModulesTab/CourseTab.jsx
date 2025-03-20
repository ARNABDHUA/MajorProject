import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { CiStreamOn } from "react-icons/ci";
import python from "../../../assets/python.png"; // Sample image
import { useParams } from "react-router-dom";
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
        // Replace this URL with your actual API endpoint
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/adminroutine/routine-all/${id}/1`
        );

        // Transform the API response into the format expected by the component
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
          if (days[dayKey].length > 0) {
            const dayName = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
            const dayClasses = days[dayKey].map((classItem) => ({
              subject: classItem.paper,
              topic: classItem.topic || classItem.paper_code,
              time: classItem.time,
              isLive: classItem.is_live || false,
              image: classItem.image,
            }));

            weekData.days.push({
              day: dayName,
              date: (classItem) => classItem.date || `Day ${index + 1}`,
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading schedule...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center">
        <p className="font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Try Again
        </button>
      </div>
    );

  if (!schedule)
    return (
      <div className="text-center p-4 text-gray-500">No schedule available</div>
    );

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] pb-6 px-2 sm:px-4"
    >
      {schedule.map((weekData, weekIndex) => (
        <div key={weekIndex} className="mb-4">
          {/* Week Section */}
          <div
            className="flex justify-between border border-slate-300 items-center p-2 rounded-xl select-none cursor-pointer sticky top-0 bg-white z-10 shadow-sm"
            onClick={() => handleWeekExpand(weekIndex)}
          >
            <div className="p-1 sm:p-2 text-sm sm:text-md flex flex-col sm:flex-row sm:space-x-4">
              <span className="font-bold text-base sm:text-lg">
                {weekData.week} {!weekData.dateRange ? "" : "-"}
              </span>
              <span className="text-slate-700 text-sm sm:text-base">
                {weekData.dateRange}
              </span>
            </div>
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              {expandedWeek === weekIndex ? (
                <FaMinus className="text-xs sm:text-sm" />
              ) : (
                <FaPlus className="text-xs sm:text-sm" />
              )}
            </div>
          </div>

          {/* Days Inside a Week */}
          {expandedWeek === weekIndex &&
            weekData.days.map((dayData, dayIndex) => (
              <div key={dayIndex} data-day-index={dayIndex} className="mt-3">
                <div
                  className="my-2 flex justify-between border border-slate-300 p-2 rounded-md select-none cursor-pointer sticky top-14 bg-white z-10 shadow-sm"
                  onClick={() => handleDayExpand(dayIndex)}
                >
                  <div className="p-1 sm:p-2 text-xs sm:text-sm">
                    <span className="font-bold text-sm sm:text-md">
                      {dayData.day}{" "}
                      {typeof dayData.date === "function" &&
                      dayData.date(dayData.classes[0])
                        ? "-"
                        : ""}
                    </span>
                    <span className="text-slate-700">
                      {typeof dayData.date === "function"
                        ? dayData.date(dayData.classes[0])
                        : dayData.date}
                    </span>
                  </div>
                  <div className="p-1 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    {expandedDay === dayIndex ? (
                      <FaMinus className="text-xs" />
                    ) : (
                      <FaPlus className="text-xs" />
                    )}
                  </div>
                </div>

                {/* Classes Inside a Day */}
                {expandedDay === dayIndex && (
                  <div className="max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-230px)] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 rounded-md bg-gray-50">
                    {dayData.classes.map((classData, classIndex) => (
                      <div
                        key={classIndex}
                        className="m-2 sm:m-3 my-3 sm:my-5 flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={classData.image || python} // Default to Python if no image
                          className="w-10 sm:w-14 h-10 sm:h-14 object-contain pointer-events-none"
                          alt={classData.subject}
                        />
                        <div className="flex-1 min-w-0">
                          <h1 className="font-medium text-sm sm:text-lg truncate">
                            {classData.subject} - {classData.topic}
                          </h1>
                          <div className="flex items-center space-x-1 sm:space-x-3 text-xs sm:text-sm">
                            <h6 className="text-gray-800 font-light truncate">
                              {classData.time}
                            </h6>
                            <LuDot className="hidden sm:block" />
                            {classData.isLive ? (
                              <h6 className="flex items-center text-red-600 cursor-pointer">
                                Live{" "}
                                <CiStreamOn className="text-lg sm:text-2xl text-red-600" />
                              </h6>
                            ) : (
                              <h6 className="text-green-500 cursor-pointer ml-1 sm:ml-0">
                                Recorded
                              </h6>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default CourseTab;
