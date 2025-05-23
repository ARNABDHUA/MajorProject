import { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  X,
  ChevronDown,
  Search,
  RefreshCw,
  Filter,
} from "lucide-react";
import axios from "axios";

// Main component for the Student Finance Dashboard
export default function StudentFinanceDashboard() {
  // State variables
  const [studentType, setStudentType] = useState("offline");
  const [semester, setSemester] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDueOnly, setShowDueOnly] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await axios.get(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        const courseData = response.data;
        console.log("Courses fetched:", courseData);
        setCourses(Array.isArray(courseData) ? courseData : []);

        // Set the first course as default if courses are available
        if (Array.isArray(courseData) && courseData.length > 0) {
          setSelectedCourse(courseData[0].course_id || courseData[0]);
        }
      } catch (error) {
        console.error("Error in fetching Courses:", error);
        setError("Failed to fetch course data. Please try again.");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students based on type, semester, and selected course
  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
    }
  }, [studentType, semester, showDueOnly, selectedCourse]);

  const fetchStudents = async () => {
    if (!selectedCourse) {
      setError("Please select a course first");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let url;
      if (showDueOnly) {
        url =
          studentType === "offline"
            ? "https://e-college-data.onrender.com/v1/students/student-offline-student-due"
            : "https://e-college-data.onrender.com/v1/students/student-online-student-due";
      } else {
        url =
          studentType === "offline"
            ? "https://e-college-data.onrender.com/v1/students/student-offline-student"
            : "https://e-college-data.onrender.com/v1/students/student-online-student";
      }

      console.log(
        "Fetching from URL:",
        url,
        "with course code:",
        selectedCourse
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_code: selectedCourse }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Ensure data is an array
      const studentArray = Array.isArray(data)
        ? data
        : data.students || data.data || [];

      console.log("Student Array:", studentArray);

      // Filter by semester if not 'all'
      const filteredData =
        semester === "all"
          ? studentArray
          : studentArray.filter(
              (student) => String(student.sem) === String(semester)
            );

      setStudents(filteredData);
    } catch (err) {
      setError("Failed to fetch student data. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const changeAccess = async (email) => {
    console.log("email", email);
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-due-noacc",
        { email: email }
      );
    } catch (err) {
      setError("Already Paid, account can't be blocked");
      console.error("Error updating access:", err);
    }
  };

  // Filter students based on search term
  const filteredStudents = Array.isArray(students)
    ? students.filter(
        (student) =>
          (student.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (student.email || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (student.studentId || "").toString().includes(searchTerm)
      )
    : [];

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="bg-black rounded-lg shadow-sm p-6 border border-purple-600">
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Course ID Selection */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-1 text-white">
                  Course Name
                </label>
                <div className="relative">
                  <select
                    className="block w-full rounded-md border border-purple-600 bg-black py-2 pl-3 pr-10 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-white"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={loadingCourses}
                  >
                    {loadingCourses ? (
                      <option>Loading courses...</option>
                    ) : courses.length === 0 ? (
                      <option>No courses available</option>
                    ) : (
                      courses.map((course, index) => (
                        <option
                          key={index}
                          value={
                            typeof course === "object"
                              ? course.course_id
                              : course
                          }
                        >
                          {typeof course === "object" ? course.code : course}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Student Type Selection */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-1 text-white">
                  Student Type
                </label>
                <div className="relative">
                  <select
                    className="block w-full rounded-md border border-purple-600 bg-black py-2 pl-3 pr-10 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-white"
                    value={studentType}
                    onChange={(e) => setStudentType(e.target.value)}
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Semester Selection */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-1 text-white">
                  Semester
                </label>
                <div className="relative">
                  <select
                    className="block w-full rounded-md border border-purple-600 bg-black py-2 pl-3 pr-10 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-white"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="all">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Due Payments Filter */}
              <div className="w-full md:w-auto flex items-end">
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md border ${
                    showDueOnly
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-black text-white border-purple-600"
                  }`}
                  onClick={() => setShowDueOnly(!showDueOnly)}
                >
                  <Filter size={16} />
                  {showDueOnly ? "Due Payments Only" : "All Payments"}
                </button>
              </div>
            </div>

            {/* Search Box */}
            <div className="w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  className="w-full rounded-md border border-purple-600 bg-black py-2 pl-10 pr-4 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600 text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-purple-600">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              onClick={fetchStudents}
              disabled={!selectedCourse || loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>

          {/* Action Feedback */}
          {actionComplete && (
            <div className="mb-4 p-3 bg-black text-purple-600 rounded-md flex items-center gap-2 border border-purple-600">
              <Check size={16} />
              Action completed successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-black text-white rounded-md flex items-center gap-2 border border-purple-600">
              <AlertCircle size={16} className="text-purple-600" />
              {error}
            </div>
          )}

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-600">
              <thead className="bg-black">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Student ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Payment Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Account Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider"
                  >
                    Access control
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-purple-600">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-white"
                    >
                      Loading student data...
                    </td>
                  </tr>
                ) : !selectedCourse ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-white"
                    >
                      Please select a course to view students.
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-white"
                    >
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.c_roll} className="hover:bg-gray-900">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {student.c_roll || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {student.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {student.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {student.sem || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            student.sem_payment === true
                              ? "bg-black text-purple-600 border border-purple-600"
                              : "bg-black text-white border border-purple-600"
                          }`}
                        >
                          {student.sem_payment ? "Paid" : "Due"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                            student.payment
                              ? "bg-black text-purple-600 border border-purple-600"
                              : "bg-black text-white border border-purple-600"
                          }`}
                        >
                          {student.payment ? (
                            <Check size={12} />
                          ) : (
                            <X size={12} />
                          )}
                          {student.payment ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => changeAccess(student.email)}
                          className="text-purple-600 hover:text-purple-400 hover:underline"
                        >
                          Block Account
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Card */}
          <div className="mt-6 bg-black rounded-lg p-4 border border-purple-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black p-4 rounded-md shadow-sm border border-purple-600">
                <p className="text-sm text-purple-600">Total Students</p>
                <p className="text-2xl font-bold text-white">
                  {filteredStudents.length}
                </p>
              </div>
              <div className="bg-black p-4 rounded-md shadow-sm border border-purple-600">
                <p className="text-sm text-purple-600">Payments Pending</p>
                <p className="text-2xl font-bold text-white">
                  {
                    filteredStudents.filter((s) => s.sem_payment === false)
                      .length
                  }
                </p>
              </div>
              <div className="bg-black p-4 rounded-md shadow-sm border border-purple-600">
                <p className="text-sm text-purple-600">Active Accounts</p>
                <p className="text-2xl font-bold text-white">
                  {filteredStudents.filter((s) => s.payment === true).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
