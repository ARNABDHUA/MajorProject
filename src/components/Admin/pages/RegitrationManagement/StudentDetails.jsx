import axios from "axios";
import React, { useState, useEffect } from "react";

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseCode, setCourseCode] = useState("101");
  const [semester, setSemester] = useState("1");
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Semester options
  const semesterOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        setCourseOptions(response.data);
      } catch (err) {
        setError("Failed to fetch course data. Please try again.");
        console.error("Error fetching course:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch students based on selected course and semester
  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-all",
        {
          course_code: courseCode,
          sem: semester,
        }
      );

      const data = response.data;
      setStudents(data.data || []);
    } catch (err) {
      setError("Failed to fetch students. Please try again.");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // View student details
  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  // Fetch students on component mount and when filters change
  useEffect(() => {
    fetchStudents();
  }, [courseCode, semester]);

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#101828]">
      <h1 className="text-2xl font-bold mb-6 text-violet-600">
        Student Semester Management
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Course
          </label>
          <select
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-[#1E2939]"
          >
            {courseOptions.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.code}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Semester
          </label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-[#1E2939]"
          >
            {semesterOptions.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchStudents}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh List"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-blue-500 ">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Phone Number
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Semester
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Course Code
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr
                  key={student.c_roll || index}
                  className={index % 2 === 0 ? "bg-[#1E2939]" : "bg-gray-800"}
                >
                  <td className="px-4 py-2 text-sm text-violet-400">
                    {student.c_roll}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    {student.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    {student.phoneNumber}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    {student.sem}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    {student.course_code}
                  </td>
                  <td className="px-4 py-2 text-sm text-white">
                    {student.email}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => viewStudentDetails(student)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:text-gray-300 text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  {loading
                    ? "Loading students..."
                    : "No students found for the selected criteria"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-grey-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Student Details</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="mb-4">
                  {selectedStudent.pic && (
                    <div className="mb-4">
                      <img
                        src={selectedStudent.pic}
                        alt={`${selectedStudent.name}'s profile`}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedStudent.name}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span>{" "}
                        {selectedStudent.gender || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedStudent.phoneNumber}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedStudent.email}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700">Address</h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div>
                        <span className="font-medium">Address:</span>{" "}
                        {selectedStudent.address || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">City:</span>{" "}
                        {selectedStudent.city || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">State:</span>{" "}
                        {selectedStudent.state || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Pincode:</span>{" "}
                        {selectedStudent.pincode || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">
                    Academic Information
                  </h4>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div>
                      <span className="font-medium">College Roll:</span>{" "}
                      {selectedStudent.c_roll}
                    </div>
                    <div>
                      <span className="font-medium">Examination Roll:</span>{" "}
                      {selectedStudent.e_roll || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Course Code:</span>{" "}
                      {selectedStudent.course_code}
                    </div>
                    <div>
                      <span className="font-medium">Semester:</span>{" "}
                      {selectedStudent.sem}
                    </div>
                    <div>
                      <span className="font-medium">Rank:</span>{" "}
                      {selectedStudent.rank || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Payment Status:</span>{" "}
                      {selectedStudent.payment ? "Paid" : "Not Paid"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    Educational Background
                  </h4>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div>
                      <span className="font-medium">10th Marks:</span>{" "}
                      {selectedStudent.tenth_marks || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">10th Year:</span>{" "}
                      {selectedStudent.tenth_year || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">12th Marks:</span>{" "}
                      {selectedStudent.twelfth_marks || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">12th Year:</span>{" "}
                      {selectedStudent.twelfth_year || "N/A"}
                    </div>
                  </div>
                </div>

                {selectedStudent.ug_name && (
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Undergraduate Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div>
                        <span className="font-medium">UG Name:</span>{" "}
                        {selectedStudent.ug_name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">UG Marks:</span>{" "}
                        {selectedStudent.ug_marks || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">UG Duration:</span>{" "}
                        {selectedStudent.ug_start} - {selectedStudent.ug_end}
                      </div>
                    </div>
                  </div>
                )}

                {selectedStudent.other_course && (
                  <div>
                    <h4 className="font-semibold text-gray-700">
                      Other Course Information
                    </h4>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <div>
                        <span className="font-medium">Course Name:</span>{" "}
                        {selectedStudent.other_course || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Marks:</span>{" "}
                        {selectedStudent.other_course_marks || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{" "}
                        {selectedStudent.other_course_start} -{" "}
                        {selectedStudent.other_course_end}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-700">Other Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="font-medium">Created At:</span>{" "}
                  {formatDate(selectedStudent.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated At:</span>{" "}
                  {formatDate(selectedStudent.updatedAt)}
                </div>
                <div>
                  <span className="font-medium">Student ID:</span>{" "}
                  {selectedStudent.s_id}
                </div>
              </div>
            </div>

            {selectedStudent.rank_file && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700">Documents</h4>
                <div className="mt-2">
                  <a
                    href={selectedStudent.rank_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Rank File
                  </a>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
