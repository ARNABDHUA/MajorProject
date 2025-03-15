import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const schedule = [
  {
    day: "Monday",
    classes: [
      { subject: "Python", time: "10:00 AM - 11:00 AM" },
      { subject: "Java", time: "2:00 PM - 3:00 PM" },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      { subject: "DBMS", time: "11:00 AM - 12:00 PM" },
      { subject: "C++", time: "3:00 PM - 4:00 PM" },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      { subject: "Networking", time: "9:00 AM - 10:00 AM" },
      { subject: "Python", time: "2:30 PM - 3:30 PM" },
    ],
  },
  {
    day: "Thursday",
    classes: [
      { subject: "Java", time: "10:00 AM - 11:00 AM" },
      { subject: "OS", time: "1:00 PM - 2:00 PM" },
    ],
  },
  {
    day: "Friday",
    classes: [
      { subject: "C++", time: "12:00 PM - 1:00 PM" },
      { subject: "Web Dev", time: "4:00 PM - 5:00 PM" },
    ],
  },
];

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

const Routine = () => {
  const [activeDay, setActiveDay] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4">
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
          <div className="flex overflow-x-auto mb-3 space-x-1 scrollbar-hide">
            {schedule.map((daySchedule, index) => (
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
                    : currentDay === daySchedule.day
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {daySchedule.day}
              </motion.button>
            ))}
          </div>

          <div className="rounded-md overflow-hidden border border-gray-200">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-700 text-xs font-medium">
              <div className="col-span-3 py-2 pl-3">Day</div>
              <div className="col-span-9 py-2 pl-3">Classes</div>
            </div>

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
                    currentDay === daySchedule.day ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="grid grid-cols-12 items-center min-h-[40px]">
                    <div className="col-span-3 py-2 pl-3 flex items-center space-x-2">
                      <div
                        className={`w-1 h-6 rounded-full ${
                          currentDay === daySchedule.day
                            ? "bg-blue-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">
                          {daySchedule.day}
                        </p>
                        {currentDay === daySchedule.day && (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1">
                            Today
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-9 py-2 pl-3">
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
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    subjectColors[classItem.subject] ||
                                    "#718096",
                                }}
                              ></div>
                              <div className="flex-1">
                                <p className="font-medium text-xs text-gray-800">
                                  {classItem.subject}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {classItem.time}
                                </p>
                              </div>
                              <motion.button
                                className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                View
                              </motion.button>
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

        <div className="bg-gray-50 px-3 py-2 flex justify-between items-center border-t border-gray-200 text-xs">
          <p className="text-gray-500">
            {schedule.reduce((total, day) => total + day.classes.length, 0)}{" "}
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
