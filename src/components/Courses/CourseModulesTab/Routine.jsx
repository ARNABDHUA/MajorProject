import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaDownload,
  FaClock,
  FaBookOpen,
  FaCode,
  FaSpinner,
  FaExclamationTriangle,
  FaRedo,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";

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

// Register fonts for PDF
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 10,
  },
  tableContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    borderBottomWidth: 1,
    borderBottomColor: "#bfdbfe",
    paddingVertical: 8,
  },
  headerCell: {
    fontSize: 10,
    color: "#1e40af",
    fontWeight: "bold",
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 8,
  },
  evenRow: {
    backgroundColor: "#f8fafc",
  },
  cell: {
    fontSize: 9,
    color: "#334155",
    paddingHorizontal: 5,
  },
  dayCell: {
    width: "20%",
  },
  subjectCell: {
    width: "40%",
  },
  codeCell: {
    width: "20%",
  },
  timeCell: {
    width: "20%",
  },
  footer: {
    marginTop: 20,
    fontSize: 9,
    color: "#64748b",
    textAlign: "center",
  },
  todayTag: {
    fontSize: 8,
    color: "#2563eb",
  },
});

// PDF Document Component
const SchedulePDF = ({ schedule }) => {
  // Get current day for highlighting
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

  const totalClasses = schedule.reduce(
    (total, day) => total + day.classes.length,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Class Schedule</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.dayCell]}>Day</Text>
            <Text style={[styles.headerCell, styles.subjectCell]}>Subject</Text>
            <Text style={[styles.headerCell, styles.codeCell]}>Code</Text>
            <Text style={[styles.headerCell, styles.timeCell]}>Time</Text>
          </View>

          {schedule.map((daySchedule, dayIndex) =>
            daySchedule.classes.map((classItem, classIndex) => (
              <View
                key={`${daySchedule.day}-${classIndex}`}
                style={[
                  styles.row,
                  (dayIndex + classIndex) % 2 === 0 ? styles.evenRow : {},
                ]}
              >
                {classIndex === 0 ? (
                  <Text style={[styles.cell, styles.dayCell]}>
                    {dayMapping[daySchedule.day] || daySchedule.day}
                    {todayDayNumber === daySchedule.day ? ` (Today)` : ""}
                  </Text>
                ) : (
                  <Text style={[styles.cell, styles.dayCell]}></Text>
                )}
                <Text style={[styles.cell, styles.subjectCell]}>
                  {classItem.subject}
                </Text>
                <Text style={[styles.cell, styles.codeCell]}>
                  {classItem.code}
                </Text>
                <Text style={[styles.cell, styles.timeCell]}>
                  {classItem.time}
                </Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer}>Total Classes: {totalClasses || 0}</Text>
      </Page>
    </Document>
  );
};

const Routine = ({ courseId }) => {
  const [activeDay, setActiveDay] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get id either from props or URL params
  const params = useParams();
  const id = courseId || params.id;

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

  // Set activeDay to today's day if not set and today is in the schedule
  useEffect(() => {
    if (!activeDay && todayDayNumber) {
      const todayInSchedule = schedule.find(
        (day) => day.day === todayDayNumber
      );
      if (todayInSchedule) {
        setActiveDay(todayDayNumber);
        // Expand today's schedule by default
        setExpandedDays((prevState) => ({
          ...prevState,
          [todayDayNumber]: true,
        }));
      } else if (schedule.length > 0) {
        // If today is not in the schedule, select the first day
        setActiveDay(schedule[0].day);
        setExpandedDays((prevState) => ({
          ...prevState,
          [schedule[0].day]: true,
        }));
      }
    }
  }, [schedule, activeDay, todayDayNumber]);

  // Toggle day expansion in UI
  const toggleDayExpansion = (day) => {
    setExpandedDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-2 md:mt-4 px-2 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 flex justify-center items-center min-h-[150px]">
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <FaSpinner className="animate-spin mr-2" />
            Loading schedule...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-2 md:mt-4 px-2 md:px-6">
        <div className="bg-white rounded-lg shadow-md p-3 md:p-4 min-h-[150px] flex flex-col justify-center items-center">
          <div className="flex items-center text-red-500 mb-2 text-sm text-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaRedo className="mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  // Main UI Component
  return (
    <div className="w-full max-w-4xl mx-auto my-2 md:my-4 px-2 md:px-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaCalendarAlt className="text-white mr-2" />
            <h2 className="text-lg font-bold text-white">
              Weekly Class Schedule
            </h2>
          </div>
          <p className="text-xs text-blue-100">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Day Selector - Common for both layouts */}
        <div className="bg-blue-50 p-3 border-b border-blue-100">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin scroll-smooth">
            {schedule.map((daySchedule, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveDay(daySchedule.day);
                  // Expand the day when selected in mobile view
                  setExpandedDays((prevState) => ({
                    ...prevState,
                    [daySchedule.day]: true,
                  }));
                }}
                className={`py-1.5 px-3 rounded-full text-xs font-medium whitespace-nowrap focus:outline-none transition-colors flex items-center ${
                  activeDay === daySchedule.day
                    ? "bg-blue-600 text-white"
                    : todayDayNumber === daySchedule.day
                    ? "bg-blue-100 text-blue-800"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {dayMapping[daySchedule.day] || daySchedule.day}
                <span className="ml-1 bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {daySchedule.classes.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout (md and above) */}
        <div className="hidden md:block">
          <div className="overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 text-gray-700 text-xs font-medium">
              <div className="col-span-3 py-2 px-3">Day</div>
              <div className="col-span-9 py-2 px-3">Classes</div>
            </div>

            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
              {schedule.map((daySchedule, index) => (
                <div
                  key={index}
                  className={`border-t border-gray-200 ${
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
                        {todayDayNumber === daySchedule.day && (
                          <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1">
                            Today
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-9 py-2 px-3">
                      <div className="space-y-2">
                        {daySchedule.classes.map((classItem, classIndex) => (
                          <div
                            key={classIndex}
                            className={`flex items-center p-2 rounded-md ${
                              activeDay === daySchedule.day
                                ? "bg-white shadow-sm"
                                : ""
                            }`}
                          >
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  subjectColors[classItem.subject] || "#718096",
                              }}
                            ></div>
                            <div className="flex-1 min-w-0 ml-2">
                              <p className="font-medium text-sm text-gray-800">
                                {classItem.subject}
                              </p>
                              <div className="flex text-xs text-gray-500 mt-1">
                                <div className="flex items-center mr-3">
                                  <FaCode className="mr-1" />
                                  {classItem.code}
                                </div>
                                <div className="flex items-center">
                                  <FaClock className="mr-1" />
                                  {classItem.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout (below md) */}
        <div className="block md:hidden">
          <div className="overflow-hidden">
            {schedule.map((daySchedule, index) => (
              <div
                key={index}
                className={`border-t border-gray-200 ${
                  todayDayNumber === daySchedule.day ? "bg-blue-50" : ""
                }`}
              >
                {/* Day Header - Clickable to expand/collapse */}
                <div
                  className="p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDayExpansion(daySchedule.day)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-1 h-10 rounded-full mr-2 ${
                        todayDayNumber === daySchedule.day
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-gray-800">
                          {dayMapping[daySchedule.day] || daySchedule.day}
                        </p>
                        {todayDayNumber === daySchedule.day && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded-full px-1">
                            Today
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {daySchedule.classes.length} classes
                      </p>
                    </div>
                  </div>
                  {expandedDays[daySchedule.day] ? (
                    <FaChevronDown className="text-blue-500" />
                  ) : (
                    <FaChevronRight className="text-gray-400" />
                  )}
                </div>

                {/* Expandable Class List */}
                {expandedDays[daySchedule.day] && (
                  <div className="px-3 pb-3 space-y-2">
                    {daySchedule.classes.map((classItem, classIndex) => (
                      <div
                        key={classIndex}
                        className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center mb-2">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor:
                                subjectColors[classItem.subject] || "#718096",
                            }}
                          ></div>
                          <p className="font-medium text-gray-800">
                            {classItem.subject}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 ml-5">
                          <div className="flex items-center">
                            <FaCode className="mr-1" />
                            {classItem.code}
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            {classItem.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center">
            <FaBookOpen className="mr-1" />
            {schedule.reduce((total, day) => total + day.classes.length, 0) ||
              0}{" "}
            total classes
          </p>

          {/* Replace react-to-print button with PDFDownloadLink */}
          <PDFDownloadLink
            document={<SchedulePDF schedule={schedule} />}
            fileName="Class_Schedule.pdf"
            className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center"
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <>
                  <FaSpinner className="animate-spin mr-1" /> Preparing PDF...
                </>
              ) : (
                <>
                  <FaDownload className="mr-1" /> Download PDF
                </>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Routine;
