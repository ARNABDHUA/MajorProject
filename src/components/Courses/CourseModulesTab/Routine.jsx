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

const Routine = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-center items-center">
          <div className="animate-pulse text-gray-500">Loading schedule...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4 max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">
            Weekly Class Schedule
          </h2>
          <p className="text-xs text-blue-100">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-3">
          <div className="flex overflow-x-auto mb-3 space-x-1 pb-1 scrollbar-thin">
            {schedule &&
              schedule.map((daySchedule, index) => (
                <motion.button
                  key={index}
                  onClick={() =>
                    setActiveDay(
                      activeDay === daySchedule.day ? null : daySchedule.day
                    )
                  }
                  className={`py-1 px-3 rounded-full text-xs font-medium whitespace-nowrap focus:outline-none transition-colors ${
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
              <div className="col-span-3 py-2 pl-3">Day</div>
              <div className="col-span-9 py-2 pl-3">Classes</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {schedule.map((daySchedule, index) => (
                <AnimatePresence key={index}>
                  <motion.div
                    initial={false}
                    animate={{
                      height:
                        activeDay === daySchedule.day || activeDay === null
                          ? "auto"
                          : 40,
                      opacity: 1,
                    }}
                    className={`border-t border-gray-200 overflow-hidden ${
                      todayDayNumber === daySchedule.day ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="grid grid-cols-12 items-center min-h-[40px]">
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

                      <div className="col-span-9 py-2 pl-3 overflow-x-auto">
                        {activeDay === daySchedule.day || activeDay === null ? (
                          <div className="space-y-2">
                            {daySchedule.classes.map(
                              (classItem, classIndex) => (
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
                                  <motion.button
                                    className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 flex-shrink-0"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    View
                                  </motion.button>
                                </motion.div>
                              )
                            )}
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

        <div className="bg-gray-50 px-3 py-2 flex justify-between items-center border-t border-gray-200 text-xs">
          <p className="text-gray-500">
            {schedule.reduce((total, day) => total + day.classes.length, 0) ||
              0}{" "}
            total classes
          </p>
          <motion.button
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
            whileHover={{ scale: 1.03, backgroundColor: "#3182ce" }}
            whileTap={{ scale: 0.97 }}
          >
            Download
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Routine;
