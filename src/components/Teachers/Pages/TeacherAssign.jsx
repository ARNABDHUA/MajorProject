import { useState, useEffect } from "react";
import axios from "axios";
import { RefreshCw, CheckCircle, Award, Trash2, X } from "lucide-react";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [userCourseCodes, setUserCourseCodes] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Get user data from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.course_code && user.course_code.length > 0) {
      setUserCourseCodes(user.course_code);
      setSelectedCourseCode(user.course_code[0]);
      console.log("User course codes:", user.course_code);
    }
  }, []);

  // Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/teachers/teachers"
        );
        setTeachers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teachers:", err);
        setError("Failed to fetch teachers");
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch subjects when course code and semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedCourseCode || !selectedSemester) return;

      try {
        setLoading(true);
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/get-coursecode",
          {
            course_code: selectedCourseCode,
            sem: selectedSemester,
          }
        );

        console.log("API Response:", response.data);

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.papers
        ) {
          // Map through papers to create a list of subjects with both code and name
          const papersList = response.data.data.papers.map((paper) => ({
            code: paper.paper_code,
            displayName: `${paper.paper_code}: ${paper.paper_name}`,
          }));
          setSubjects(papersList);
        } else {
          setSubjects([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to fetch subjects");
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCourseCode, selectedSemester]);

  // Handle teacher selection
  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedSubjects([]);
    setSuccess(false);
    setError("");
  };

  // Handle subject selection
  const handleSubjectSelect = (subject) => {
    // Check if the subject is already selected
    if (selectedSubjects.some((item) => item.code === subject.code)) {
      // If already selected, do nothing
      return;
    }

    // Check if teacher already has this course
    if (selectedTeacher && selectedTeacher.teacher_course) {
      const teacherHasCourse = selectedTeacher.teacher_course.some(
        (courseStr) => courseStr.includes(subject.code)
      );

      if (teacherHasCourse) {
        setError(`Teacher is already assigned to ${subject.code}`);
        return;
      }
    }

    setSelectedSubjects([...selectedSubjects, subject]);
    setError("");
  };

  // Remove a subject from selection
  const removeSelectedSubject = (subjectToRemove) => {
    setSelectedSubjects(
      selectedSubjects.filter(
        (subject) => subject.code !== subjectToRemove.code
      )
    );
  };

  // Handle save subjects assignment
  const handleAssignSubjects = async () => {
    if (!selectedTeacher || selectedSubjects.length === 0) {
      setError("Please select a teacher and at least one subject");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Extract course codes for API request
      const courseCodes = selectedSubjects.map((subject) => subject.code);

      // Get existing courses that the teacher already has
      const existingCourses = selectedTeacher.teacher_course.map(
        (courseStr) => {
          // Extract course code from the string (e.g., "MCA-101: Subject Name" -> "MCA-101")
          const match = courseStr.match(/^([^:]+)/);
          return match ? match[1].trim() : courseStr;
        }
      );

      // Combine existing and new courses for API request
      const allCourseCodes = [...existingCourses, ...courseCodes];

      console.log("Sending course codes to API:", allCourseCodes);

      const response = await axios.post(
        `https://e-college-data.onrender.com/v1/teachers/teachers-courseupdate/${selectedTeacher.c_roll}`,
        {
          teacher_course: allCourseCodes,
        }
      );

      if (response.data) {
        // Create display values for UI
        const newDisplayValues = selectedSubjects.map(
          (subject) => subject.displayName
        );

        // Update the teacher in the local state
        const updatedTeachers = teachers.map((teacher) => {
          if (teacher.c_roll === selectedTeacher.c_roll) {
            return {
              ...teacher,
              teacher_course: [...teacher.teacher_course, ...newDisplayValues],
            };
          }
          return teacher;
        });

        setTeachers(updatedTeachers);
        setSelectedTeacher({
          ...selectedTeacher,
          teacher_course: [
            ...selectedTeacher.teacher_course,
            ...newDisplayValues,
          ],
        });
        setSelectedSubjects([]);
        setSuccess(true);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error assigning subjects:", err);
      setError("Failed to assign subjects to teacher");
      setLoading(false);
    }
  };

  // Handle delete all courses
  const handleDeleteAllCourses = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `https://e-college-data.onrender.com/v1/teachers/teachers-courseupdate/${selectedTeacher.c_roll}`,
        {
          teacher_course: [],
        }
      );

      if (response.data) {
        // Update the teacher in the local state
        const updatedTeachers = teachers.map((teacher) => {
          if (teacher.c_roll === selectedTeacher.c_roll) {
            return {
              ...teacher,
              teacher_course: [],
            };
          }
          return teacher;
        });

        setTeachers(updatedTeachers);
        setSelectedTeacher({
          ...selectedTeacher,
          teacher_course: [],
        });
        setSuccess(true);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error deleting all courses:", err);
      setError("Failed to delete all courses");
      setLoading(false);
    }
  };

  // Reset success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teacher Management System</h1>

      {/* Course Code and Semester Selection */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filter Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Code
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
            >
              <option value="">Select Course Code</option>
              {userCourseCodes.map((code, index) => (
                <option key={index} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem.toString()}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teachers List */}
        <div className="col-span-1 bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Teachers</h2>
          {loading && !teachers.length ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin text-blue-500" />
            </div>
          ) : (
            <ul className="space-y-2">
              {teachers.map((teacher) => (
                <li
                  key={teacher._id}
                  className={`p-3 rounded-md cursor-pointer flex items-center ${
                    selectedTeacher && selectedTeacher._id === teacher._id
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {teacher.image ? (
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {teacher.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="font-medium">{teacher.name}</span>
                      {teacher.hod && (
                        <Award
                          className="ml-1 text-yellow-500 w-4 h-4"
                          title="HOD"
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {teacher.c_roll}
                    </div>
                  </div>
                </li>
              ))}
              {!loading && teachers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No teachers found
                </div>
              )}
            </ul>
          )}
        </div>

        {/* Teacher Details */}
        <div className="col-span-2">
          {selectedTeacher ? (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                {selectedTeacher.image ? (
                  <img
                    src={selectedTeacher.image}
                    alt={selectedTeacher.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-xl font-medium text-gray-600">
                      {selectedTeacher.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedTeacher.name}
                    {selectedTeacher.hod && (
                      <span className="ml-2 text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        HOD
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">ID: {selectedTeacher.c_roll}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{selectedTeacher.phoneNumber}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Current Courses</h3>
                  {selectedTeacher.teacher_course &&
                    selectedTeacher.teacher_course.length > 0 && (
                      <button
                        className="flex items-center text-sm text-red-600 hover:text-red-800"
                        onClick={handleDeleteAllCourses}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete All
                      </button>
                    )}
                </div>

                {selectedTeacher.teacher_course &&
                selectedTeacher.teacher_course.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.teacher_course.map((course, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No courses assigned</p>
                )}
              </div>

              {/* Assign Subject Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Assign New Subjects
                </h3>

                {/* Selected Subjects */}
                {selectedSubjects.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Selected Subjects
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-white">
                      {selectedSubjects.map((subject, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                        >
                          {subject.code}
                          <button
                            onClick={() => removeSelectedSubject(subject)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subject Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Available Subjects
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white p-2">
                    {subjects.length > 0 ? (
                      subjects.map((subject, index) => {
                        // Check if this subject is already assigned to the teacher
                        const isAlreadyAssigned =
                          selectedTeacher.teacher_course.some((courseStr) =>
                            courseStr.includes(subject.code)
                          );

                        // Check if this subject is already in our selection
                        const isAlreadySelected = selectedSubjects.some(
                          (item) => item.code === subject.code
                        );

                        return (
                          <div
                            key={index}
                            className={`p-2 cursor-pointer mb-1 rounded-md ${
                              isAlreadyAssigned || isAlreadySelected
                                ? "bg-gray-100 text-gray-500"
                                : "hover:bg-blue-50"
                            }`}
                            onClick={() => {
                              if (!isAlreadyAssigned && !isAlreadySelected) {
                                handleSubjectSelect(subject);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{subject.displayName}</span>
                              {isAlreadyAssigned && (
                                <span className="text-xs text-gray-500">
                                  (Already assigned)
                                </span>
                              )}
                              {isAlreadySelected && (
                                <span className="text-xs text-blue-500">
                                  (Selected)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        {loading
                          ? "Loading subjects..."
                          : "No subjects available"}
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Operation completed successfully!
                  </div>
                )}

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleAssignSubjects}
                  disabled={loading || selectedSubjects.length === 0}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin mr-2 w-4 h-4" />
                      Processing...
                    </>
                  ) : (
                    "Save Selected Subjects"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center justify-center h-full text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600">
                Select a Teacher
              </h3>
              <p className="text-gray-500 mt-1">
                Select a teacher from the list to view details and assign
                subjects
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
