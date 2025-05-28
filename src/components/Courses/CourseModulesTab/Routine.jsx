import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";

// Map subjects to colors for visual distinction
const subjectColors = {
  Python: "#4299e1", // blue
  Java: "#f6ad55", // orange
  DBMS: "#9f7aea", // purple
  "C++": "#f56565", // red
  Networking: "#48bb78", // green
  OS: "#ed64a6", // pink
  "Web Dev": "#667eea", // indigo
};

// Map day numbers to weekdays
const dayMapping = {
  day1: "Monday",
  day2: "Tuesday",
  day3: "Wednesday",
  day4: "Thursday",
  day5: "Friday",
  day6: "Saturday",
};

const Routine = ({ courseId }) => {
  const [activeDay, setActiveDay] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sem, setSem] = useState();

  // Get id either from props or URL params
  const params = useParams();
  const id = courseId || params.id;

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!id) {
        setError("No course ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Replace this URL with your actual API endpoint
        const parsedUser = JSON.parse(localStorage.getItem("user"));

        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/adminroutine/routine-all/${id}/${parsedUser.sem}`
        );

        // Transform the API response into the format expected by the component
        const transformedData = [];
        const daysData = response.data.data[0].days;

        Object.keys(daysData).forEach((day) => {
          if (daysData[day].length > 0) {
            transformedData.push({
              day: day,
              classes: daysData[day].map((classItem) => ({
                subject: classItem.paper,
                time: classItem.time,
                code: classItem.paper_code,
              })),
            });
          }
        });

        setSchedule(transformedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schedule data");
        setLoading(false);
        console.error("Error fetching schedule:", err);
      }
    };

    fetchSchedule();
  }, [id]);

  // Get current day of the week
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[new Date().getDay()];

  // Find the day number that matches today
  const todayDayNumber = Object.keys(dayMapping).find(
    (day) => dayMapping[day] === currentDay
  );

  // Set activeDay to today's day if not set and today is in the schedule
  useEffect(() => {
    if (!activeDay && todayDayNumber) {
      const todayInSchedule = schedule.find(
        (day) => day.day === todayDayNumber
      );
      if (todayInSchedule) {
        setActiveDay(todayDayNumber);
      } else if (schedule.length > 0) {
        // If today is not in the schedule, select the first day
        setActiveDay(schedule[0].day);
      }
    }
  }, [schedule, activeDay, todayDayNumber]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-2 md:mt-4 px-2 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 flex justify-center items-center min-h-[150px]">
          <div className="animate-pulse text-gray-500 text-sm">
            Loading schedule...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-2 md:mt-4 px-2 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 min-h-[150px] flex flex-col justify-center items-center">
          <div className="text-red-500 mb-2 text-sm text-center">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Desktop Layout (md and above)
  const DesktopLayout = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Weekly Class Schedule</h2>
        <p className="text-xs text-blue-100">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="p-4">
        <div className="flex overflow-x-auto mb-3 space-x-2 pb-2 scrollbar-thin">
          {schedule &&
            schedule.map((daySchedule, index) => (
              <motion.button
                key={index}
                onClick={() =>
                  setActiveDay(
                    activeDay === daySchedule.day ? null : daySchedule.day
                  )
                }
                className={`py-1.5 px-3 rounded-full text-xs font-medium whitespace-nowrap focus:outline-none transition-colors ${
                  activeDay === daySchedule.day
                    ? "bg-blue-600 text-white"
                    : todayDayNumber === daySchedule.day
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {dayMapping[daySchedule.day] || daySchedule.day}
              </motion.button>
            ))}
        </div>

        <div className="rounded-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-12 bg-gray-50 text-gray-700 text-xs font-medium">
            <div className="col-span-3 py-2 px-3">Day</div>
            <div className="col-span-9 py-2 px-3">Classes</div>
          </div>

          <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
            {schedule.map((daySchedule, index) => (
              <AnimatePresence key={index}>
                <motion.div
                  initial={false}
                  animate={{
                    height:
                      activeDay === daySchedule.day || activeDay === null
                        ? "auto"
                        : 48,
                    opacity: 1,
                  }}
                  className={`border-t border-gray-200 overflow-hidden ${
                    todayDayNumber === daySchedule.day ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="grid grid-cols-12 items-center min-h-[48px]">
                    <div className="col-span-3 py-2 pl-3 flex items-center space-x-2">
                      <div
                        className={`w-1 h-6 rounded-full ${
                          todayDayNumber === daySchedule.day
                            ? "bg-blue-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {dayMapping[daySchedule.day] || daySchedule.day}
                        </p>
                        <p className="text-xs text-gray-500">
                          {daySchedule.day}
                        </p>
                        {todayDayNumber === daySchedule.day && (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1">
                            Today
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-9 py-2 px-3">
                      {activeDay === daySchedule.day || activeDay === null ? (
                        <div className="space-y-2">
                          {daySchedule.classes.map((classItem, classIndex) => (
                            <motion.div
                              key={classIndex}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: classIndex * 0.05 }}
                              className="flex items-center space-x-2"
                            >
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    subjectColors[classItem.subject] ||
                                    "#718096",
                                }}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs text-gray-800 truncate">
                                  {classItem.subject}
                                  <span className="ml-1 text-gray-500">
                                    ({classItem.code})
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  {classItem.time}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => setActiveDay(daySchedule.day)}
                          className="text-xs text-blue-600 underline"
                        >
                          {daySchedule.classes.length} classes
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 text-xs">
        <p className="text-gray-500">
          {schedule.reduce((total, day) => total + day.classes.length, 0) || 0}{" "}
          total classes
        </p>
      </div>
    </motion.div>
  );

  // Mobile Layout (below md)
  const MobileLayout = () => {
    const activeDayData =
      schedule.find((day) => day.day === activeDay) ||
      (schedule.length > 0 ? schedule[0] : null);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-2 px-3 flex justify-between items-center">
          <h2 className="text-base font-bold text-white">Class Schedule</h2>
          <p className="text-xs text-blue-100">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Day Selector - Pills Design */}
        <div className="bg-gray-50 p-2 border-b border-gray-200">
          <div className="flex overflow-x-auto space-x-1 pb-1 scrollbar-thin scroll-smooth no-scrollbar">
            {schedule.map((daySchedule, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveDay(daySchedule.day)}
                className={`py-1 px-2 rounded-full text-xs font-medium whitespace-nowrap focus:outline-none transition-colors flex-shrink-0 ${
                  activeDay === daySchedule.day
                    ? "bg-blue-600 text-white"
                    : todayDayNumber === daySchedule.day
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {dayMapping[daySchedule.day] || daySchedule.day}
                {daySchedule.classes.length > 0 && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1 inline-block">
                    {daySchedule.classes.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Day Header */}
        {activeDayData && (
          <div className="p-2 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div
                className={`w-1 h-10 rounded-full ${
                  todayDayNumber === activeDayData.day
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
              ></div>
              <div>
                <p className="font-medium text-sm text-gray-800">
                  {dayMapping[activeDayData.day] || activeDayData.day}
                </p>
                {todayDayNumber === activeDayData.day && (
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1">
                    Today
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {activeDayData.classes.length} classes
            </div>
          </div>
        )}

        {/* Classes List - Card Style for Mobile */}
        <div className="p-2 max-h-[calc(100vh-12rem)] overflow-y-auto bg-gray-50">
          {activeDayData ? (
            <div className="space-y-2">
              {activeDayData.classes.map((classItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-2 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                          style={{
                            backgroundColor:
                              subjectColors[classItem.subject] || "#718096",
                          }}
                        ></div>
                        <p className="font-medium text-sm text-gray-800 truncate">
                          {classItem.subject}
                        </p>
                      </div>
                      <div className="mt-1 ml-4 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <p>{classItem.code}</p>
                          <p>{classItem.time}</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex-shrink-0"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No classes scheduled
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-3 py-2 flex justify-between items-center border-t border-gray-200 text-xs">
          <p className="text-gray-500">
            {schedule.reduce((total, day) => total + day.classes.length, 0) ||
              0}{" "}
            total classes
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Display desktop layout on md screens and up, mobile layout on smaller screens */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </div>
  );
};

export default Routine;
