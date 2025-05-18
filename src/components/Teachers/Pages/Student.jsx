import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDays,
  Users,
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";

const Student = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPaperCode, setSelectedPaperCode] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "online", "offline"
  const [teacherInfo, setTeacherInfo] = useState({
    name: "Teacher",
    paperCodes: [],
    courseCodes: [],
  });

  // Get teacher info from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        setTeacherInfo({
          name: parsedData.name || "Teacher",
          paperCodes: parsedData.teacher_course || [],
          courseCodes: parsedData.course_code || [],
        });

        // Set default selected paper code
        if (parsedData.teacher_course && parsedData.teacher_course.length > 0) {
          setSelectedPaperCode(parsedData.teacher_course[0]);
        }

        // Set default selected course code
        if (parsedData.course_code && parsedData.course_code.length > 0) {
          setSelectedCourseCode(parsedData.course_code[0]);
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }
  }, []);

  useEffect(() => {
    if (!selectedPaperCode || !selectedCourseCode) return;

    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        // Make API call using axios to fetch attendance data
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/students/student-attendance-report",
          {
            course_code: selectedCourseCode,
            paper_code: selectedPaperCode,
          }
        );

        if (response.data && response.data.success) {
          setAttendanceData(response.data);
          console.log(response.data);
        } else {
          throw new Error("Failed to fetch attendance data");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to load attendance data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedPaperCode, selectedCourseCode]);

  const handlePaperCodeChange = (e) => {
    setSelectedPaperCode(e.target.value);
    setExpandedStudent(null); // Reset expanded student when changing course
  };

  const handleCourseCodeChange = (e) => {
    setSelectedCourseCode(e.target.value);
    setExpandedStudent(null); // Reset expanded student when changing course code
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setExpandedStudent(null); // Reset expanded student when changing filter
  };

  const toggleStudentDetails = (studentRoll) => {
    if (expandedStudent === studentRoll) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentRoll);
    }
  };

  // Format ISO date to a more readable format
  const formatDate = (dateString) => {
    try {
      // Handle both formats: ISO date and "DD-MM-YYYY"
      if (dateString.includes("T")) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
      return dateString; // Already in DD-MM-YYYY format
    } catch (error) {
      return dateString; // Return original if there's an error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="text-center p-8">
        <p>No attendance data available. Please select a course.</p>
      </div>
    );
  }

  // Filter students based on the selected filter type
  const filteredStudents = attendanceData.attendanceData.filter((student) => {
    if (filterType === "all") return true;
    if (filterType === "online") return student.type === false;
    if (filterType === "offline") return student.type === true;
    return true;
  });

  // Calculate attendance statistics for filtered students
  const attendanceStatistics = {
    perfect: filteredStudents.filter(
      (student) => student.attendancePercentage === "100.00%"
    ).length,
    good: filteredStudents.filter(
      (student) =>
        parseFloat(student.attendancePercentage) >= 75 &&
        parseFloat(student.attendancePercentage) < 100
    ).length,
    average: filteredStudents.filter(
      (student) =>
        parseFloat(student.attendancePercentage) >= 50 &&
        parseFloat(student.attendancePercentage) < 75
    ).length,
    poor: filteredStudents.filter(
      (student) => parseFloat(student.attendancePercentage) < 50
    ).length,
  };

  // Calculate totals for each type
  const totalOnline = attendanceData.attendanceData.filter(
    (student) => student.type === false
  ).length;
  const totalOffline = attendanceData.attendanceData.filter(
    (student) => student.type === true
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Student Attendance Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {teacherInfo.name}</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4 flex-wrap">
          <div className="flex items-center">
            <label
              htmlFor="courseCodeSelect"
              className="mr-2 font-medium text-gray-700"
            >
              Course Code:
            </label>
            <select
              id="courseCodeSelect"
              value={selectedCourseCode}
              onChange={handleCourseCodeChange}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {teacherInfo.courseCodes.map((code, index) => (
                <option key={`course-${index}`} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="paperCodeSelect"
              className="mr-2 font-medium text-gray-700"
            >
              Paper Code:
            </label>
            <select
              id="paperCodeSelect"
              value={selectedPaperCode}
              onChange={handlePaperCodeChange}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {teacherInfo.paperCodes.map((code, index) => (
                <option key={`paper-${index}`} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label
              htmlFor="filterTypeSelect"
              className="mr-2 font-medium text-gray-700 flex items-center"
            >
              <Filter size={16} className="mr-1" /> Filter:
            </label>
            <select
              id="filterTypeSelect"
              value={filterType}
              onChange={handleFilterChange}
              className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All Students ({attendanceData.totalEnrolledStudents})
              </option>
              <option value="online">Online ({totalOnline})</option>
              <option value="offline">Offline ({totalOffline})</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-600 font-medium">
                {filterType === "all"
                  ? "Total Students"
                  : filterType === "online"
                  ? "Online Students"
                  : "Offline Students"}
              </p>
              <p className="text-xl font-bold">{filteredStudents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full">
              <CalendarDays className="text-green-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-600 font-medium">
                Classes Conducted
              </p>
              <p className="text-xl font-bold">
                {attendanceData.totalClassesConducted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-purple-600 font-medium">Course Code</p>
              <p className="text-xl font-bold">{attendanceData.course_code}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <div className="flex items-center">
            <div className="bg-amber-100 p-2 rounded-full">
              <Award className="text-amber-600" size={24} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-600 font-medium">Paper Code</p>
              <p className="text-xl font-bold">{attendanceData.paper_code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Attendance Statistics
          {filterType !== "all" && (
            <span className="text-gray-600 font-normal">
              ({filterType === "online" ? "Online" : "Offline"} Students)
            </span>
          )}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-100 p-3 rounded-md text-center">
            <h3 className="text-sm font-medium text-green-800">
              Perfect (100%)
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {attendanceStatistics.perfect}
            </p>
          </div>

          <div className="bg-blue-100 p-3 rounded-md text-center">
            <h3 className="text-sm font-medium text-blue-800">Good (75-99%)</h3>
            <p className="text-2xl font-bold text-blue-600">
              {attendanceStatistics.good}
            </p>
          </div>

          <div className="bg-yellow-100 p-3 rounded-md text-center">
            <h3 className="text-sm font-medium text-yellow-800">
              Average (50-74%)
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {attendanceStatistics.average}
            </p>
          </div>

          <div className="bg-red-100 p-3 rounded-md text-center">
            <h3 className="text-sm font-medium text-red-800">
              Poor (Below 50%)
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {attendanceStatistics.poor}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Student Attendance Details
          {filterType !== "all" && (
            <span className="text-gray-600 font-normal ml-2">
              ({filterType === "online" ? "Online" : "Offline"})
            </span>
          )}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left font-medium text-gray-600 uppercase tracking-wider border-b">
                  Roll No.
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 uppercase tracking-wider border-b">
                  Name
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 uppercase tracking-wider border-b">
                  Email
                </th>
                <th className="py-3 px-4 text-left font-medium text-gray-600 uppercase tracking-wider border-b">
                  Type
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600 uppercase tracking-wider border-b">
                  Present
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600 uppercase tracking-wider border-b">
                  Absent
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600 uppercase tracking-wider border-b">
                  Attendance %
                </th>
                <th className="py-3 px-4 text-center font-medium text-gray-600 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <React.Fragment key={`student-${student.c_roll}`}>
                  <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-4 border-b">{student.c_roll}</td>
                    <td className="py-3 px-4 border-b font-medium">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 border-b">{student.email}</td>
                    <td className="py-3 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.type
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {student.type ? "Offline" : "Online"}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {student.presentCount}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      {student.absentCount}
                    </td>
                    <td
                      className={`py-3 px-4 border-b text-center font-medium ${
                        parseFloat(student.attendancePercentage) >= 75
                          ? "text-green-600"
                          : parseFloat(student.attendancePercentage) >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {student.attendancePercentage}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <button
                        onClick={() => toggleStudentDetails(student.c_roll)}
                        className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        aria-label={
                          expandedStudent === student.c_roll
                            ? "Hide Details"
                            : "Show Details"
                        }
                      >
                        {expandedStudent === student.c_roll ? (
                          <>
                            <span className="mr-1">Hide</span>
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            <span className="mr-1">Details</span>
                            <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedStudent === student.c_roll && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50 p-4">
                        <div className="rounded-md border border-gray-200 p-4">
                          <h4 className="text-md font-semibold mb-2">
                            Absent Dates ({student.absentCount})
                          </h4>
                          {student.absentDates.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {student.absentDates.map((date, i) => (
                                <div
                                  key={i}
                                  className="bg-red-50 text-red-700 p-2 rounded-md text-sm"
                                >
                                  {formatDate(date)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              No absences recorded
                            </p>
                          )}

                          {student.presentDates.length > 0 && (
                            <>
                              <h4 className="text-md font-semibold mt-4 mb-2">
                                Present Dates ({student.presentCount})
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {student.presentDates.map((date, i) => (
                                  <div
                                    key={i}
                                    className="bg-green-50 text-green-700 p-2 rounded-md text-sm"
                                  >
                                    {formatDate(date)}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 bg-gray-50 border border-gray-200">
              <p className="text-gray-500">
                No students match the selected filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
