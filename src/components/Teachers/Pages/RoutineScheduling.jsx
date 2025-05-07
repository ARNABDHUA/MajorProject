import { useState, useEffect } from "react";
import axios from "axios";
import Schedule from "./Schedule";
import Routine from "../../Courses/CourseModulesTab/Routine";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaGraduationCap,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTable,
  FaSync,
} from "react-icons/fa";

export default function RoutineScheduling() {
  // State variables
  const [semesters] = useState(["1", "2", "3", "4", "5", "6", "7", "8"]);
  const [days] = useState([
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
  ]);
  const [timeSlots] = useState([
    "10:00 A.M - 11:00 A.M",
    "11:00 A.M - 12:00 P.M",
    "12:00 P.M - 1:00 P.M",
    "1:00 P.M - 2:00 P.M",
    "2:00 P.M - 3:00 P.M",
    "3:00 P.M - 4:00 P.M",
    "4:00 P.M - 5:00 P.M",
  ]);

  const [selectedSem, setSelectedSem] = useState("1");
  const [selectedDay, setSelectedDay] = useState("Day 1");
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedPaperCode, setSelectedPaperCode] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showSchedule, setShowSchedule] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const userData = getUserData();
  const courseId = userData?.course_code?.[0] || "";

  // Fetch papers based on selected semester
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/get-coursecode",
          {
            course_code: courseId,
            sem: selectedSem,
          }
        );

        const result = response.data;

        if (result.success && result.data.papers) {
          setPapers(result.data.papers);
          if (result.data.papers.length > 0) {
            setSelectedPaperCode(result.data.papers[0].paper_code);
            setSelectedPaper(result.data.papers[0].paper_name);
          } else {
            setSelectedPaperCode("");
            setSelectedPaper("");
          }
        } else {
          setPapers([]);
          setSelectedPaperCode("");
          setSelectedPaper("");
        }
      } catch (error) {
        console.error("Error fetching papers:", error);
        setMessage({
          text: `Failed to fetch papers: ${
            error.response?.data?.message || error.message
          }`,
          type: "error",
        });
        setPapers([]);
        setSelectedPaperCode("");
        setSelectedPaper("");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchPapers();
    }
  }, [courseId, selectedSem]);

  // Handle paper selection
  const handlePaperChange = (e) => {
    const paperCode = e.target.value;
    const paper = papers.find((p) => p.paper_code === paperCode);
    if (paper) {
      setSelectedPaperCode(paperCode);
      setSelectedPaper(paper.paper_name);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedPaperCode || !selectedPaper) {
      setMessage({ text: "Please select a paper.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        course_id: parseInt(courseId) || courseId, // Handle if courseId is not a number
        sem: selectedSem,
        day: selectedDay,
        time: selectedTime,
        paper: selectedPaper,
        paper_code: selectedPaperCode,
      };

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/adminroutine/add-course-routine",
        requestData
      );

      setMessage({
        text: "Schedule created successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating schedule:", error);
      setMessage({
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSchedule = () => {
    setLoadingSchedule(true);
    setShowSchedule(!showSchedule);
    // Simulate loading for a smoother transition
    setTimeout(() => {
      setLoadingSchedule(false);
    }, 500);
  };

  // If user data is not available
  if (!userData || !courseId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <FaTimesCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-center font-semibold">
            User data not found. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-center mb-6 pb-4 border-b border-gray-100">
            <FaGraduationCap className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">
              Create Class Schedule
            </h1>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                  : "bg-red-50 text-red-800 border-l-4 border-red-500"
              }`}
            >
              {message.type === "success" ? (
                <FaCheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <FaTimesCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaBook className="h-4 w-4 mr-1 text-gray-500" />
                  Course ID
                </label>
                <input
                  type="text"
                  value={courseId}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none text-gray-600"
                />
              </div>

              {/* Semester Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaGraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                  Semester
                </label>
                <div className="relative">
                  <select
                    value={selectedSem}
                    onChange={(e) => setSelectedSem(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="h-4 w-4 mr-1 text-gray-500" />
                  Day
                </label>
                <div className="relative">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaClock className="h-4 w-4 mr-1 text-gray-500" />
                  Time Slot
                </label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Paper Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaBook className="h-4 w-4 mr-1 text-gray-500" />
                  Paper
                </label>
                <div className="relative">
                  <select
                    value={selectedPaperCode}
                    onChange={handlePaperChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-gray-100 disabled:text-gray-500"
                    disabled={loading || papers.length === 0}
                  >
                    {papers.length > 0 ? (
                      papers.map((paper) => (
                        <option key={paper._id} value={paper.paper_code}>
                          {paper.paper_code} - {paper.paper_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No papers available</option>
                    )}
                  </select>
                  <FaChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading || papers.length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <FaSync className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPlus className="h-5 w-5 mr-2" />
                    Create Schedule
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FaUser className="h-5 w-5 mr-2 text-blue-600" />
              Teacher Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700 mr-2">
                      Name:
                    </span>
                    {userData.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700 mr-2">
                      Email:
                    </span>
                    {userData.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700 mr-2">
                      Role:
                    </span>
                    <span className="capitalize">{userData.role}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium text-gray-700 mr-2">HOD:</span>
                    {userData.hod ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700 mr-2">
                      Courses:
                    </span>
                    {userData.teacher_course?.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Button & Display */}
        <div className="flex flex-col items-center">
          <button
            onClick={toggleSchedule}
            className={`flex items-center px-6 py-3 rounded-lg shadow-md font-medium transition-all duration-200 ${
              showSchedule
                ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loadingSchedule ? (
              <FaSync className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <FaTable className="h-5 w-5 mr-2" />
            )}
            {showSchedule ? "Hide Schedule" : "View Current Schedule"}
            {showSchedule ? (
              <FaChevronUp className="h-5 w-5 ml-2" />
            ) : (
              <FaChevronDown className="h-5 w-5 ml-2" />
            )}
          </button>

          {/* Schedule Content */}
          {showSchedule && (
            <div className="w-full mt-6 transition-all duration-300 ease-in-out bg-white rounded-xl shadow-md p-4 overflow-hidden">
              <div className="mb-4 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaCalendarAlt className="h-6 w-6 mr-2 text-indigo-600" />
                  Current Class Schedule
                </h2>
              </div>
              <div className={loadingSchedule ? "opacity-50" : ""}>
                <Routine courseId={parseInt(courseId)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
