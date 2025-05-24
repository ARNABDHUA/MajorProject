import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Check } from "lucide-react";
import Swal from "sweetalert2";

const StudentDocumentVerification = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseCodes, setCourseCodes] = useState([]);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [verifiedStudents, setVerifiedStudents] = useState(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("verifiedStudents");
    if (stored) {
      setVerifiedStudents(new Set(JSON.parse(stored)));
    }
  }, []);

  const addVerifiedStudent = (id) => {
    setVerifiedStudents((prev) => {
      const newSet = new Set(prev.add(id));
      localStorage.setItem("verifiedStudents", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  useEffect(() => {
    const fetchCourseCodes = async () => {
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
        setError("Failed to fetch course codes.");
        console.error(error);
      }
    };
    fetchCourseCodes();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) return;
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/students/student-apply",
          { course_code: selectedCourse }
        );
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else if (Array.isArray(response.data.data)) {
          setStudents(response.data.data);
        } else {
          setStudents([]);
          setError("No student data found.");
        }
      } catch (err) {
        setError("Failed to fetch student data.");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const toggleDetails = (id) => {
    setExpandedStudentId((prevId) => (prevId === id ? null : id));
  };

  const handleVerify = async (email, studentId, onCancel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7f1dff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, verify!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://e-college-data.onrender.com/v1/students/student-verify",
            { email }
          );
          addVerifiedStudent(studentId);
          Swal.fire({
            title: "Verified!",
            text: "Student has been verified.",
            icon: "success",
          });
        } catch (err) {
          toast.error("Failed to verify student.");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (onCancel) onCancel();
      }
    });
  };

  const handleReject = async (email, studentId, onCancel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7f1dff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reject!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://e-college-data.onrender.com/v1/students/student-rejected",
            { email }
          );
          addVerifiedStudent(studentId);
          Swal.fire({
            title: "Rejected!",
            text: "Student has been rejected.",
            icon: "success",
          });
        } catch (err) {
          toast.error("Failed to reject student.");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (onCancel) onCancel();
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-[#c084fc] p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-[#c084fc]">
          Select Course Code <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-64 border border-[#7f1dff] bg-[#2a2a40] text-white rounded px-3 py-2 focus:outline-none focus:ring focus:border-[#7f1dff]"
        >
          {courseCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-[#c084fc]">Student Information</h2>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : students.length === 0 ? (
        <p className="text-white">No students found for course code {selectedCourse}.</p>
      ) : (
        <div className="overflow-x-auto rounded shadow-lg border border-[#7f1dff]">
          <table className="min-w-full bg-[#2a2a40] text-white text-sm">
            <thead className="bg-[#1e1e2f] text-left text-sm font-semibold text-[#c084fc]">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">10th Marks</th>
                <th className="px-4 py-2">12th Marks</th>
                <th className="px-4 py-2">UG Marks</th>
                <th className="px-4 py-2">Other Course</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <React.Fragment key={student._id}>
                  <tr className="border-t border-[#7f1dff] align-middle text-left">
                    <td className="px-4 py-3 flex items-center">
                      {student.name}
                      {verifiedStudents.has(student._id) && (
                        <Check className="ml-2 text-green-400" size={20} strokeWidth={3} />
                      )}
                    </td>
                    <td className="px-4 py-3">{student.select_offline ? "Offline" : "Online"}</td>
                    <td className="px-4 py-3">{student.email}</td>
                    <td className="px-4 py-3">{student.phoneNumber}</td>
                    <td className="px-4 py-3">{student.rank}</td>
                    <td className="px-4 py-3">{student.tenth_marks}</td>
                    <td className="px-4 py-3">{student.twelfth_marks}</td>
                    <td className="px-4 py-3">{student.ug_marks}</td>
                    <td className="px-4 py-3">{student.other_course_marks}</td>
                    <td className="px-4 py-3 space-y-1">
                      <button
                        onClick={() => toggleDetails(student._id)}
                        className="block w-full mb-1 text-sm bg-[#7f1dff] hover:bg-[#6b21a8] text-white px-2 py-0.5 rounded shadow"
                      >
                        {expandedStudentId === student._id ? "Hide" : "Details"}
                      </button>
                      <button
                        onClick={() => handleVerify(student.email, student._id)}
                        className="block w-full mb-1 text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded shadow"
                        disabled={verifiedStudents.has(student._id)}
                      >
                        {verifiedStudents.has(student._id) ? "Verified" : "Verify"}
                      </button>
                      <button
                        onClick={() => handleReject(student.email, student._id)}
                        className="block w-full text-sm bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded shadow"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>

                  {expandedStudentId === student._id && (
                    <tr className="bg-[#2a2a40] text-[#e9d5ff]">
                      <td colSpan="10" className="px-4 py-3">
                        <div className="space-y-2">
                          <p><strong>10th Year:</strong> {student.tenth_year}</p>
                          <p><strong>10th File:</strong> <a href={student.tenth_file} target="_blank" rel="noopener noreferrer" className="text-[#7f1dff] underline">View</a></p>
                          <p><strong>12th Year:</strong> {student.twelfth_year}</p>
                          <p><strong>12th Marks File:</strong> <a href={student.twelfth_marks_file} target="_blank" rel="noopener noreferrer" className="text-[#7f1dff] underline">View</a></p>
                          <p><strong>UG Name:</strong> {student.ug_name}</p>
                          <p><strong>UG Start:</strong> {student.ug_start}</p>
                          <p><strong>UG End:</strong> {student.ug_end}</p>
                          <p><strong>UG Marks File:</strong> <a href={student.ug_marks_file} target="_blank" rel="noopener noreferrer" className="text-[#7f1dff] underline">View</a></p>
                          <p><strong>Rank File:</strong> <a href={student.rank_file} target="_blank" rel="noopener noreferrer" className="text-[#7f1dff] underline">View</a></p>
                          <p><strong>Other Course Name:</strong> {student.other_course}</p>
                          <p><strong>Other Course Start:</strong> {student.other_course_start}</p>
                          <p><strong>Other Course End:</strong> {student.other_course_end}</p>
                          <p><strong>Other Course Marks File:</strong> <a href={student.other_marks_file} target="_blank" rel="noopener noreferrer" className="text-[#7f1dff] underline">View</a></p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDocumentVerification;