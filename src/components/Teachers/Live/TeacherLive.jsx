import React, { useState, useEffect } from "react";
import axios from "axios";

// Day mapping for consistent day representation
const dayMapping = {
  Sunday: "Day 0",
  Monday: "Day 1",
  Tuesday: "Day 2",
  Wednesday: "Day 3",
  Thursday: "Day 4",
  Friday: "Day 5",
  Saturday: "Day 6",
};

// Semester options
const semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LiveClassScheduler = () => {
  // Generate unique Live Class URL
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paperCode, setPaperCode] = useState([]);

  // Added state for success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all"
        );
        if (response.data) {
          setCourses(response.data);

          // Retrieve user data from localStorage
          const data = localStorage.getItem("user");
          const ok = JSON.parse(data);

          setPaperCode(ok.teacher_course);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const generateLiveClassURL = (courseId, sem, paperCode) => {
    try {
      // Use the current website's origin for more reliable URL generation
      const baseUrl = window.location.origin;

      // Create a more structured room URL
      const roomCode = `${courseId}-sem${sem}-${paperCode}`;
      const uniqueUrl = `${baseUrl}/room/${roomCode}?&timestamp=${Date.now()}&course=${courseId}&semester=${sem}&paperCode=${paperCode}}`;

      return uniqueUrl;
    } catch (error) {
      console.error("Error generating live class URL:", error);
      return ""; // Return empty string if URL generation fails
    }
  };

  // Get current week day
  const getCurrentWeekDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  // Initial form state
  const [formData, setFormData] = useState({
    course_id: "",
    sem: "",
    day: dayMapping[getCurrentWeekDay()],
    paper_code: "",
    is_live: "", // Live class URL
    topic: "",
    image: "", // String for image URL
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing/selecting
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Generate live URL dynamically when relevant fields change
  useEffect(() => {
    if (formData.course_id && formData.sem && formData.paper_code) {
      const newLiveURL = generateLiveClassURL(
        formData.course_id,
        formData.sem,
        formData.paper_code
      );

      setFormData((prev) => ({
        ...prev,
        is_live: newLiveURL,
      }));
    }
  }, [formData.course_id, formData.sem, formData.paper_code]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.course_id) {
      newErrors.course_id = "Please select a course";
    }

    if (!formData.sem) {
      newErrors.sem = "Please select semester";
    }

    if (!formData.paper_code) {
      newErrors.paper_code = "Please enter paper code";
    }

    if (!formData.topic) {
      newErrors.topic = "Please enter topic";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return; // Stop if validation fails

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/adminroutine/teacher-update-time-slot",
        formData
      );

      if (response.data) {
        console.log("Success:", response.data.message);
        setSuccessMessage(response.data.message || "Updated successfully!");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("API Error:", error);
      
      // Improved error handling to show specific error messages
      if (error.response) {
        // Server responded with an error
        const errorMsg = error.response.data.message || 
                         error.response.data.error || 
                         "Failed to update time slot!";
        setErrorMessage(errorMsg);
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from server. Please check your network connection.");
      } else {
        // Something happened in setting up the request
        setErrorMessage("Error in request setup. Please try again.");
      }
    }
  };

  // Handle modal confirmation
  const handleModalConfirm = () => {
    // Open Live Class URL in a new window
    if (formData.is_live) {
      window.open(formData.is_live, "_blank", "noopener,noreferrer");
    }

    // Close modal
    setShowSuccessModal(false);
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          Class Scheduled Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          {successMessage || "Your live class has been scheduled. Click 'Open Class' to join the virtual classroom."}
        </p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={() => setShowSuccessModal(false)}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleModalConfirm}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Open Class
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Schedule Live Class
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Set up your online teaching session
          </p>
        </div>

        {/* Error Message Display - Moved outside the form for better visibility */}
        {errorMessage && (
          <div className="max-w-xl mx-auto mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 space-y-4"
        >
          {/* Course Selection */}
          <div>
            <label
              htmlFor="course_id"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Select Course
            </label>
            <select
              id="course_id"
              name="course_id"
              value={formData.course_id}
              onChange={handleInputChange}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.course_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="mt-1 text-xs text-red-500">{errors.course_id}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="sem"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Semester
            </label>
            <select
              id="sem"
              name="sem"
              value={formData.sem}
              onChange={handleInputChange}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.sem ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
            {errors.sem && (
              <p className="mt-1 text-xs text-red-500">{errors.sem}</p>
            )}
          </div>

          {/* Day */}
          <div>
            <label
              htmlFor="day"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Day
            </label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            >
              {Object.entries(dayMapping).map(([day, dayNumber]) => (
                <option key={day} value={dayNumber}>
                  {dayNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Paper Code */}
          <div>
            <label
              htmlFor="paper_code"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Paper Code
            </label>
            <select
              id="paper_code"
              name="paper_code"
              value={formData.paper_code}
              onChange={handleInputChange}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.paper_code ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Paper Code</option> {/* Default option */}
              {paperCode.length > 0 ? (
                paperCode.map((code, index) => (
                  <option key={index} value={code}>
                    {code}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>

            {errors.paper_code && (
              <p className="mt-1 text-xs text-red-500">{errors.paper_code}</p>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label
              htmlFor="is_live"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Live Class URL
            </label>
            <div
              id="is_live"
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 break-words"
            >
              {formData.is_live || "URL will be generated automatically"}
            </div>
            {formData.is_live && (
              <div className="mt-1 text-xs text-gray-500">
                This URL is uniquely generated based on your course details
              </div>
            )}
          </div>

          {/* Topic */}
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Topic
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Enter topic of the class"
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.topic ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.topic && (
              <p className="mt-1 text-xs text-red-500">{errors.topic}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-4 text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Schedule Class
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default LiveClassScheduler;