import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDocumentVerificationn = () => {
  const [selectedCourse, setSelectedCourse] = useState("101");
  const [students, setstudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseCodes, setCourseCodes] = useState([]);

  useEffect(() => {
    const datafetch = async () => {
      try {
        const response = await axios.get(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        const data = response.data;
        console.log("goooo", data);
        const course_code = [];

        const c_id = data.map((e) => e.course_id);
        console.log("hello", c_id);
        setCourseCodes([...c_id]);
      } catch (error) {
        setError("Failed to fetch student data.");
        console.log(error);
      }
    };
    datafetch();
  }, []);

  const fetchstudents = async (courseCode) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-apply",
        { course_code: courseCode }
      );
      // Ensure the response contains the 'students' array
      console.log("hi", response.data);
      if (response.data) {
        setstudents(response.data);
      } else {
        setstudents([]);
        setError("No student data found.");
      }
    } catch (err) {
      setError("Failed to fetch student data.");
      setstudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchstudents(selectedCourse);
  }, [selectedCourse]);
  return (
    <div className="min-h-screen bg-black text-purple-500 p-6">
      <div className="mb-6">
        <label className="block mb-2 text-purple-300 font-medium">
          Select Course Code <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-64 border border-purple-300 bg-white text-purple-700 rounded px-3 py-2"
        >
          {courseCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {/* student Info Table */}
      <h2 className="text-2xl font-bold mb-4">student Information</h2>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : students.length === 0 ? (
        <p>No students found for course code {selectedCourse}.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-purple-300">
          <table className="min-w-full bg-white text-black text-sm">
            <thead className="bg-purple-100 text-purple-800 font-semibold">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>

                <th className="px-4 py-2 text-left">Rank</th>
                <th className="px-4 py-2 text-left">10th Marks</th>
                <th className="px-4 py-2 text-left">12th Marks</th>
                <th className="px-4 py-2 text-left">UG Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">{student.phoneNumber}</td>
                  <td className="px-4 py-2">{student.rank}</td>
                  <td className="px-4 py-2">{student.tenth_marks}</td>
                  <td className="px-4 py-2">{student.twelfth_marks}</td>
                  <td className="px-4 py-2">{student.ug_marks}</td>

                  <td className="px-4 py-2">{student.other_course_marks}</td>
                  {/* <td className="px-4 py-2">
                    {student.role}
                    {student.hod && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        HOD
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {student.student_course?.join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {student.expertise?.join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {(student.createdAt)}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDocumentVerificationn;