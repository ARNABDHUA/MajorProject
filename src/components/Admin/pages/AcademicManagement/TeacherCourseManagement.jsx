import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Users,
  Award,
  BookOpen,
  Save,
  X,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import axios from "axios";

const TeacherCourseManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingCourseCodes, setEditingCourseCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCourseCodes, setAvailableCourseCodes] = useState([]);

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.c_roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get available courses for HOD assignment (only courses teacher is enrolled in)
  const getHODEligibleCourses = (teacher) => {
    return teacher.course_code || [];
  };

  // Fetch teachers data
  const fetchTeachers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/teachers/teachers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }

      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      setError("Failed to load teachers data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Assign teacher as HOD
  const assignHOD = async (c_roll, course_code) => {
    if (!course_code) {
      setError("Please select a course code to assign HOD");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/teachers/teachers-hod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            c_roll: c_roll,
            course_code: course_code,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign HOD");
      }

      setSuccess(
        `Successfully assigned teacher as HOD for course ${course_code}`
      );
      await fetchTeachers(); // Refresh data
    } catch (err) {
      setError("Failed to assign HOD: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update teacher course codes
  const updateTeacherCourseCodes = async (c_roll, courseCodes) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/teachers/teacher-coursecode-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            c_roll: c_roll,
            courseCodes: courseCodes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update course codes");
      }

      setSuccess(`Successfully updated course codes for teacher ${c_roll}`);
      setEditingTeacher(null);
      setEditingCourseCodes([]);
      await fetchTeachers(); // Refresh data
    } catch (err) {
      setError("Failed to update course codes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing course codes
  const startEditingCourseCodes = (teacher) => {
    setEditingTeacher(teacher._id);
    setEditingCourseCodes([...teacher.course_code]);
  };

  // Add course code to editing list
  const addCourseCode = (courseCode) => {
    if (!editingCourseCodes.includes(courseCode)) {
      setEditingCourseCodes([...editingCourseCodes, courseCode]);
    }
  };

  // Remove course code from editing list
  const removeCourseCode = (courseCodeToRemove) => {
    setEditingCourseCodes(
      editingCourseCodes.filter((code) => code !== courseCodeToRemove)
    );
  };

  // Save course code changes
  const saveCourseCodes = (teacher) => {
    updateTeacherCourseCodes(teacher.c_roll, editingCourseCodes);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTeacher(null);
    setEditingCourseCodes([]);
  };

  // Available course codes for selection

  // const availableCourseCodes = [
  //   "101",
  //   "102",
  //   "103",
  //   "104",
  //   "105",
  //   "301",
  //   "302",
  // ];
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseCodesAvailable = await axios.get(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        if (courseCodesAvailable.data) {
          const courseData = courseCodesAvailable.data.map(
            (cId) => cId.course_id
          );

          setAvailableCourseCodes(courseData);
        }
      } catch (err) {
        console.log("An Error Occured by accessing Course Code", err);
      }
    };
    fetchCourseData();
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-violet-600 mb-2 flex items-center gap-3">
            <Users className="text-indigo-600" />
            Teacher Course Management
          </h1>
          <p className="text-blue-600">
            Manage teacher course assignments and HOD positions
          </p>
        </div>

        {/* Action Buttons and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button
            onClick={fetchTeachers}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Users className="w-5 h-5" />
            {loading ? "Loading..." : "Refresh Teachers"}
          </button>

          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent placeholder:text-red-200 text-violet-300 "
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Teachers Grid */}
        {loading && teachers.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        ) : filteredTeachers.length === 0 && teachers.length > 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No teachers found matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-indigo-600 hover:text-indigo-800"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {/* Results Counter */}
            {searchTerm && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  Showing {filteredTeachers.length} of {teachers.length}{" "}
                  teachers
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 ">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* Teacher Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-violet-400 flex items-center gap-2">
                        {teacher.name}
                        {teacher.hod && (
                          <Award
                            className="w-5 h-5 text-yellow-500"
                            title="HOD"
                          />
                        )}
                      </h3>
                      <p className="text-gray-300">{teacher.c_roll}</p>
                      <p className="text-sm text-gray-400">{teacher.email}</p>
                    </div>
                  </div>

                  {/* Teacher Details */}
                  <div className="space-y-3 mb-4">
                    {/* <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-200">
                        Salary:
                      </span>
                      <span className="text-sm text-green-600">
                        ₹{teacher.salary?.toLocaleString() || "Not set"}
                      </span>
                    </div> */}

                    <div>
                      <span className="text-sm font-medium text-violet-400">
                        Expertise:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {teacher.expertise?.length > 0 ? (
                          teacher.expertise.map((exp, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-violet-900 text-xs px-2 py-1 rounded-full"
                            >
                              {exp}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-violet-900">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-violet-400">
                        Qualifications:
                      </span>
                      <div className="mt-1">
                        {teacher.qualification?.length > 0 ? (
                          teacher.qualification.map((qual, index) => (
                            <div
                              key={index}
                              className="text-xs text-violet-400"
                            >
                              {qual.degree} from {qual.institution} ({qual.year}
                              )
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-violet-400">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Codes Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-violet-400">
                        Course Codes:
                      </span>
                      {editingTeacher !== teacher._id && (
                        <button
                          onClick={() => startEditingCourseCodes(teacher)}
                          className="bg-blue-500 px-3 py-1 rounded-3xl text-indigo-100 hover:text-indigo-200 text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>

                    {editingTeacher === teacher._id ? (
                      <div className="space-y-3">
                        {/* Current editing course codes */}
                        <div className="flex flex-wrap gap-1">
                          {editingCourseCodes.map((code) => (
                            <span
                              key={code}
                              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                            >
                              {code}
                              <button
                                onClick={() => removeCourseCode(code)}
                                className="text-indigo-600 hover:text-indigo-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Available course codes to add */}
                        <div>
                          <div className="text-xs text-gray-600 mb-1">
                            Add course codes:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {availableCourseCodes
                              .filter(
                                (code) => !editingCourseCodes.includes(code)
                              )
                              .map((code) => (
                                <button
                                  key={code}
                                  onClick={() => addCourseCode(code)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  {code}
                                </button>
                              ))}
                          </div>
                        </div>

                        {/* Save/Cancel buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveCourseCodes(teacher)}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1 disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {teacher.course_code?.length > 0 ? (
                          teacher.course_code.map((code) => (
                            <span
                              key={code}
                              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                            >
                              {code}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">
                            No courses assigned
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* HOD Assignment */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-600">
                        HOD Status:
                      </span>
                      <div className="flex items-center gap-2">
                        {teacher.hod ? (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            HOD
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignHOD(teacher.c_roll, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              disabled={
                                loading ||
                                getHODEligibleCourses(teacher).length === 0
                              }
                            >
                              <option value="">
                                {getHODEligibleCourses(teacher).length === 0
                                  ? "No courses assigned"
                                  : "Assign as HOD"}
                              </option>
                              {getHODEligibleCourses(teacher).map((code) => (
                                <option key={code} value={code}>
                                  Course {code}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {teachers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No teachers found. Click "Refresh Teachers" to load data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseManagement;
