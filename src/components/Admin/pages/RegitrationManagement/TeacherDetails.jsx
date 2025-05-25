import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherComponent = () => {
  const [selectedCourse, setSelectedCourse] = useState("101");
  const [teachers, setTeachers] = useState([]);
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
        const c_id = data.map((e) => e.course_id);
        setCourseCodes(c_id);
        if (c_id.length > 0) {
          setSelectedCourse(c_id[0]);
        }
      } catch (error) {
        setError("Failed to fetch course data.");
        console.log(error);
      }
    };
    datafetch();
  }, []);

  const fetchTeachers = async (courseCode) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/teachers-bycoursecode",
        { course_code: courseCode }
      );
      if (response.data) {
        setTeachers(response.data);
      } else {
        setTeachers([]);
        setError("No teacher data found.");
      }
    } catch (err) {
      setError("Failed to fetch teacher data.");
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(selectedCourse);
  }, [selectedCourse]);

  return (
    <div className="min-h-screen bg-[#0d0d2b] text-purple-400 p-6">
      {/* Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-purple-300 font-medium">
          Select Course Code <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-64 border border-purple-500 bg-[#1a1a40] text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          {courseCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Info Table */}
      <h2 className="text-2xl font-bold mb-4 text-purple-300">Teacher Information</h2>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : teachers.length === 0 ? (
        <p className="text-white">No teachers found for course code {selectedCourse}.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-purple-500">
          <table className="min-w-full bg-[#1a1a40] text-white text-sm">
            <thead className="bg-[#26264f] text-purple-200 text-left font-semibold">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Courses</th>
                <th className="px-4 py-2">Expertise</th>
                <th className="px-4 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id} className="border-t border-purple-600">
                  <td className="px-4 py-2">{teacher.name}</td>
                  <td className="px-4 py-2">{teacher.email}</td>
                  <td className="px-4 py-2">{teacher.phoneNumber}</td>
                  <td className="px-4 py-2">
                    {teacher.role}
                    {teacher.hod && (
                      <span className="ml-2 text-xs bg-purple-200 text-purple-900 px-2 py-1 rounded-full">
                        HOD
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {teacher.teacher_course?.join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {teacher.expertise?.join(", ")}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherComponent;
