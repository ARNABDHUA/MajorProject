import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherReg = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    tenth_marks: "",
    tenth_year: "",
    twelfth_marks: "",
    twelfth_year: "",
    ug_name: "",
    ug_marks: "",
    ug_start: "",
    ug_end: "",
    other_course: "",
    other_course_marks: "",
    other_course_start: "",
    other_course_end: "",
    cv_file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  // Course options for dropdown
  const courseOptions = [
    "B.Tech Computer Science",
    "B.Tech Information Technology",
    "B.Tech Electronics",
    "B.Sc Computer Science",
    "B.Sc Mathematics",
    "B.Sc Physics",
    "BCA",
    "B.Com",
    "BA English",
    "BA Economics",
  ];

  const validateForm = () => {
    const newErrors = {};
    const isValidPhoneNumber = (phoneNumber) => {
      const basicPattern = /^[5-9]\d{9}$/;

      if (!basicPattern.test(phoneNumber)) return false;

      // Disallow fully increasing or decreasing sequences
      const isSequentialInc = "1234567890";
      const isSequentialDec = "9876543210";
      if (
        isSequentialInc.includes(phoneNumber) ||
        isSequentialDec.includes(phoneNumber)
      ) {
        return false;
      }

      // Disallow same digit repeated after first digit (e.g., 7000000000)
      const firstDigit = phoneNumber[0];
      const rest = phoneNumber.slice(1);
      const allSame = rest.split("").every((d) => d === rest[0]);
      if (allSame) return false;

      return true;
    };
    const validateEmail = (email) => {
      return /^[a-zA-Z][a-zA-Z0-9.]{5,29}@gmail\.com$/.test(email);
    };
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    //email is required
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = `1. It must start with a letter (a–z).
      2. It can contain numbers, letters, and periods (.).
      3. It cannot contain special characters like !, #, %, etc.
      4. It must be between 6 and 30 characters long.`;
    }
    //form is required
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Invalid phone number format. Please enter a 10-digit valid Indian mobile number";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // 10th marks validation
    if (!formData.tenth_marks) {
      newErrors.tenth_marks = "10th percentage is required";
    } else if (parseFloat(formData.tenth_marks) < 60) {
      newErrors.tenth_marks = "10th percentage must be at least 60%";
    }

    // 10th year validation
    if (!formData.tenth_year) {
      newErrors.tenth_year = "10th passing year is required";
    } else {
      const year = parseInt(formData.tenth_year);
      if (year < 1990 || year > 2020) {
        newErrors.tenth_year = "Year must be between 1990 and 2020";
      }
    }

    // 12th marks validation
    if (!formData.twelfth_marks) {
      newErrors.twelfth_marks = "12th percentage is required";
    } else if (parseFloat(formData.twelfth_marks) < 60) {
      newErrors.twelfth_marks = "12th percentage must be at least 60%";
    }

    // 12th year validation
    if (!formData.twelfth_year) {
      newErrors.twelfth_year = "12th passing year is required";
    } else if (
      formData.tenth_year &&
      parseInt(formData.twelfth_year) < parseInt(formData.tenth_year) + 2
    ) {
      newErrors.twelfth_year = "12th year must be at least 2 years after 10th";
    }

    // UG course validation
    if (!formData.ug_name) {
      newErrors.ug_name = "Please select a course";
    }

    // UG marks validation
    if (!formData.ug_marks) {
      newErrors.ug_marks = "UG percentage is required";
    } else if (parseFloat(formData.ug_marks) < 60) {
      newErrors.ug_marks = "UG percentage must be at least 60%";
    }

    // UG start year validation
    if (!formData.ug_start) {
      newErrors.ug_start = "UG start year is required";
    } else if (
      formData.twelfth_year &&
      parseInt(formData.ug_start) < parseInt(formData.twelfth_year)
    ) {
      newErrors.ug_start = "UG start year must be after 12th completion";
    }

    // UG end year validation
    if (!formData.ug_end) {
      newErrors.ug_end = "UG end year is required";
    } else if (
      formData.ug_start &&
      parseInt(formData.ug_end) < parseInt(formData.ug_start) + 2
    ) {
      newErrors.ug_end = "UG end year must be at least 2 years after start";
    }

    // CV file validation
    if (!formData.cv_file) {
      newErrors.cv_file = "Resume is required";
    } else if (formData.cv_file.size > 2 * 1024 * 1024) {
      newErrors.cv_file = "File size must be less than 2MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      cv_file: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "cv_file") {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/teachers-apply",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSubmitStatus({
        success: true,
        message: "Application submitted successfully!",
      });

      // Reset form after successful submission
      setFormData({
        ...formData,
        name: "",
        address: "",
        tenth_marks: "",
        tenth_year: "",
        twelfth_marks: "",
        twelfth_year: "",
        ug_name: "",
        ug_marks: "",
        ug_start: "",
        ug_end: "",
        other_course: "",
        other_course_marks: "",
        other_course_start: "",
        other_course_end: "",
        cv_file: null,
      });

      // Use timeout for navigation after successful submission
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle key press to prevent form submission on Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800 border-b-2 border-indigo-200 pb-4">
        Teacher Registration Form
      </h2>

      {submitStatus.message && (
        <div
          className={`mb-6 p-4 rounded-lg shadow ${
            submitStatus.success
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : "bg-red-100 text-red-800 border-l-4 border-red-500"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
        className="space-y-8"
      >
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="name"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300  text-gray-600"
                placeholder="Your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="phoneNumber"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-gray-300  text-gray-600"
                placeholder="Your phone number"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="address"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.address
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Enter your full address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education: 10th Standard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            10th Standard
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="tenth_marks"
              >
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tenth_marks"
                name="tenth_marks"
                value={formData.tenth_marks}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.tenth_marks
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Enter percentage (min 60%)"
              />
              {errors.tenth_marks && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tenth_marks}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="tenth_year"
              >
                Passing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tenth_year"
                name="tenth_year"
                value={formData.tenth_year}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.tenth_year
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Year (1990-2020)"
              />
              {errors.tenth_year && (
                <p className="text-red-500 text-sm mt-1">{errors.tenth_year}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education: 12th Standard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            12th Standard
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="twelfth_marks"
              >
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="twelfth_marks"
                name="twelfth_marks"
                value={formData.twelfth_marks}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.twelfth_marks
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Enter percentage (min 60%)"
              />
              {errors.twelfth_marks && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.twelfth_marks}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="twelfth_year"
              >
                Passing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="twelfth_year"
                name="twelfth_year"
                value={formData.twelfth_year}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.twelfth_year
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Year (at least 2 years after 10th)"
              />
              {errors.twelfth_year && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.twelfth_year}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Education: Undergraduate Degree */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            Undergraduate Degree
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="ug_name"
              >
                Course Name <span className="text-red-500">*</span>
              </label>
              <select
                id="ug_name"
                name="ug_name"
                value={formData.ug_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.ug_name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
              >
                <option value="">Select Course</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              {errors.ug_name && (
                <p className="text-red-500 text-sm mt-1">{errors.ug_name}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="ug_marks"
              >
                Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="ug_marks"
                name="ug_marks"
                value={formData.ug_marks}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.ug_marks
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Enter percentage (min 60%)"
              />
              {errors.ug_marks && (
                <p className="text-red-500 text-sm mt-1">{errors.ug_marks}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="ug_start"
              >
                Start Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="ug_start"
                name="ug_start"
                value={formData.ug_start}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.ug_start
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Year (after 12th completion)"
              />
              {errors.ug_start && (
                <p className="text-red-500 text-sm mt-1">{errors.ug_start}</p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="ug_end"
              >
                End Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="ug_end"
                name="ug_end"
                value={formData.ug_end}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={`w-full px-4 py-3 rounded-lg focus:ring ${
                  errors.ug_end
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-indigo-200"
                } focus:border-indigo-500 outline-none transition-all`}
                placeholder="Year (at least 2 years after start)"
              />
              {errors.ug_end && (
                <p className="text-red-500 text-sm mt-1">{errors.ug_end}</p>
              )}
            </div>
          </div>
        </div>

        {/* Education: Additional Course (Optional) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            Additional Course{" "}
            <span className="text-sm font-normal text-gray-500">
              (Optional)
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="other_course"
              >
                Course Name
              </label>
              <input
                type="text"
                id="other_course"
                name="other_course"
                value={formData.other_course}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter course name (if any)"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="other_course_marks"
              >
                Percentage (%)
              </label>
              <input
                type="number"
                id="other_course_marks"
                name="other_course_marks"
                value={formData.other_course_marks}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                placeholder="Enter percentage"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="other_course_start"
              >
                Start Year
              </label>
              <input
                type="number"
                id="other_course_start"
                name="other_course_start"
                value={formData.other_course_start}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                placeholder="Start year"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="other_course_end"
              >
                End Year
              </label>
              <input
                type="number"
                id="other_course_end"
                name="other_course_end"
                value={formData.other_course_end}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-lg border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
                placeholder="End year"
              />
            </div>
          </div>
        </div>

        {/* Upload CV */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b border-gray-200 pb-2">
            Resume/CV
          </h3>

          <div className="mb-2">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="cv_file"
            >
              Upload Resume (Max 2MB) <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label
                htmlFor="cv_file"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 px-4 py-6 ${
                  errors.cv_file ? "border-red-300" : "border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="mb-3 w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC or DOCX (MAX. 2MB)
                  </p>
                </div>
                <input
                  id="cv_file"
                  type="file"
                  name="cv_file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
            {errors.cv_file && (
              <p className="text-red-500 text-sm mt-2">{errors.cv_file}</p>
            )}
            {formData.cv_file && (
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Selected file: {formData.cv_file.name} (
                {(formData.cv_file.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>

        {/* Info Text */}
        <div className="text-center text-gray-500 text-sm mt-4">
          <p>
            Fields marked with <span className="text-red-500">*</span> are
            required.
          </p>
          <p className="mt-2">
            By submitting this form, you agree to our terms and conditions.
          </p>
        </div>
      </form>
    </div>
  );
};

export default TeacherReg;
