import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import VerificationStatus from "./VerificationStatus";
import axios from "axios";
import RejectionPage from "../../student/HandleRetriction/RejectionPage";
import StudentSidebar from "../../student/Layout/StudentSidebar";

const StudentAcademicForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract course code from URL params

  const [formData, setFormData] = useState({
    course_code: id || "", // Set initial course code from URL
    select_offline: false,
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
    rank: "",
    tenth_file: null,
    twelfth_marks_file: null,
    ug_marks_file: null,
    other_marks_file: null,
    rank_file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formSubmission, setFormSubmission] = useState();
  const currentYear = new Date().getFullYear();

  // Max file size in KB (2000KB = 2MB)
  const MAX_FILE_SIZE = 2000;

  const ugDegrees = [
    { value: "", label: "Select Degree" },
    { value: "BSC", label: "Bachelor of Science (General)" },
    { value: "BSC_CS", label: "BSc in Computer Science" },
    { value: "BSC_IT", label: "BSc in Information Technology" },
    { value: "BSC_MATH", label: "BSc in Mathematics" },
    { value: "BSC_PHY", label: "BSc in Physics" },
    { value: "BSC_CHEM", label: "BSc in Chemistry" },
    { value: "BSC_BIO", label: "BSc in Biology" },
    { value: "BSC_BOT", label: "BSc in Botany" },
    { value: "BSC_ZOO", label: "BSc in Zoology" },
    { value: "BSC_MICRO", label: "BSc in Microbiology" },
    { value: "BSC_BIOTECH", label: "BSc in Biotechnology" },
    { value: "BSC_ENV", label: "BSc in Environmental Science" },
    { value: "BSC_STAT", label: "BSc in Statistics" },
    { value: "BSC_ELECT", label: "BSc in Electronics" },
    { value: "BSC_FOOD", label: "BSc in Food Technology" },
    { value: "BSC_NURSING", label: "BSc in Nursing" },
    { value: "BSC_AGRI", label: "BSc in Agriculture" },
    { value: "BCA", label: "Bachelor of Computer Applications (BCA)" },
    { value: "BA", label: "Bachelor of Arts (BA)" },
    { value: "BCOM", label: "Bachelor of Commerce (BCom)" },
    { value: "BBA", label: "Bachelor of Business Administration (BBA)" },
    { value: "BFA", label: "Bachelor of Fine Arts (BFA)" },
    { value: "BHM", label: "Bachelor of Hotel Management (BHM)" },
    { value: "B.Ed", label: "Bachelor of Education (B.Ed)" },
    { value: "LLB", label: "Bachelor of Laws (LLB)" },
    { value: "BPharm", label: "Bachelor of Pharmacy (BPharm)" },
    { value: "BDS", label: "Bachelor of Dental Surgery (BDS)" },
    {
      value: "MBBS",
      label: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
    },
    { value: "BVoc", label: "Bachelor of Vocation (BVoc)" },
    { value: "BDes", label: "Bachelor of Design (BDes)" },
    { value: "BArch", label: "Bachelor of Architecture (BArch)" },
    { value: "BMS", label: "Bachelor of Management Studies (BMS)" },
    { value: "BPT", label: "Bachelor of Physiotherapy (BPT)" },
    { value: "BStat", label: "Bachelor of Statistics (BStat)" },
    { value: "BElEd", label: "Bachelor of Elementary Education (B.El.Ed)" },
  ];

  // Fetch user data from localStorage on component mount and set course code from URL
  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const submissionStatus = userData.submit;

        setFormSubmission(submissionStatus);
        setUserData(userData);
      }

      // Set course code from URL parameter if available
      if (id) {
        setFormData((prevState) => ({
          ...prevState,
          course_code: id,
        }));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [id]);

  // Check file size
  const validateFileSize = (file) => {
    if (!file) return true;

    const fileSizeKB = file.size / 1024;
    return fileSizeKB <= MAX_FILE_SIZE;
  };

  const validateForm = () => {
    const newErrors = {};

    // Course code validation
    if (!formData.course_code) {
      newErrors.course_code = "Course code is required";
    }

    // Tenth marks validation
    if (!formData.tenth_marks) {
      newErrors.tenth_marks = "10th marks are required";
    } else if (
      parseFloat(formData.tenth_marks) < 45 ||
      parseFloat(formData.tenth_marks) > 100
    ) {
      newErrors.tenth_marks = "10th marks must be between 45% and 100%";
    }

    // Tenth year validation
    if (!formData.tenth_year) {
      newErrors.tenth_year = "10th year is required";
    } else if (
      parseInt(formData.tenth_year) < 2000 ||
      parseInt(formData.tenth_year) > currentYear
    ) {
      newErrors.tenth_year = `10th year must be between 2000 and ${currentYear}`;
    }

    // Twelfth marks validation
    if (!formData.twelfth_marks) {
      newErrors.twelfth_marks = "12th marks are required";
    } else if (
      parseFloat(formData.twelfth_marks) < 45 ||
      parseFloat(formData.twelfth_marks) > 100
    ) {
      newErrors.twelfth_marks = "12th marks must be between 45% and 100%";
    }

    // Twelfth year validation
    if (!formData.twelfth_year) {
      newErrors.twelfth_year = "12th year is required";
    } else if (
      parseInt(formData.twelfth_year) <
      parseInt(formData.tenth_year) + 2
    ) {
      newErrors.twelfth_year = `12th year must be at least ${
        parseInt(formData.tenth_year) + 2
      }`;
    }

    // UG details validation if course code is 101
    if (formData.course_code === "101") {
      if (!formData.ug_name) {
        newErrors.ug_name = "UG degree name is required";
      }

      if (!formData.ug_marks) {
        newErrors.ug_marks = "UG marks are required";
      } else if (
        parseFloat(formData.ug_marks) < 0 ||
        parseFloat(formData.ug_marks) > 100
      ) {
        newErrors.ug_marks = "UG marks must be between 0% and 100%";
      }

      if (!formData.ug_start) {
        newErrors.ug_start = "UG start year is required";
      }

      if (!formData.ug_end) {
        newErrors.ug_end = "UG end year is required";
      } else if (parseInt(formData.ug_end) <= parseInt(formData.ug_start)) {
        newErrors.ug_end = "UG end year must be after start year";
      }

      if (!formData.ug_marks_file) {
        newErrors.ug_marks_file = "UG marks file is required";
      } else if (!validateFileSize(formData.ug_marks_file)) {
        newErrors.ug_marks_file = `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`;
      }
    }

    // Rank validation
    if (!formData.rank) {
      newErrors.rank = "Rank is required";
    }

    // File validations with size check
    if (!formData.tenth_file) {
      newErrors.tenth_file = "10th marks file is required";
    } else if (!validateFileSize(formData.tenth_file)) {
      newErrors.tenth_file = `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`;
    }

    if (!formData.twelfth_marks_file) {
      newErrors.twelfth_marks_file = "12th marks file is required";
    } else if (!validateFileSize(formData.twelfth_marks_file)) {
      newErrors.twelfth_marks_file = `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`;
    }

    if (!formData.rank_file) {
      newErrors.rank_file = "Rank file is required";
    } else if (!validateFileSize(formData.rank_file)) {
      newErrors.rank_file = `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`;
    }

    // If there are other course details, validate them too
    if (formData.other_course) {
      if (!formData.other_course_marks) {
        newErrors.other_course_marks = "Other course marks are required";
      }

      if (!formData.other_course_start) {
        newErrors.other_course_start = "Other course start year is required";
      }

      if (!formData.other_course_end) {
        newErrors.other_course_end = "Other course end year is required";
      } else if (
        parseInt(formData.other_course_end) <=
        parseInt(formData.other_course_start)
      ) {
        newErrors.other_course_end = "End year must be after start year";
      }

      if (
        formData.other_marks_file &&
        !validateFileSize(formData.other_marks_file)
      ) {
        newErrors.other_marks_file = `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      // For file inputs, check file size before setting
      const file = files[0] || null;

      setFormData({
        ...formData,
        [name]: file,
      });

      // Validate file size on change
      if (file && !validateFileSize(file)) {
        setErrors({
          ...errors,
          [name]: `File size must be less than ${MAX_FILE_SIZE}KB (2MB)`,
        });
      } else if (errors[name] && errors[name].includes("size")) {
        // Clear error if new file is valid size
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    } else if (type === "checkbox" || type === "radio") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();
      // Add form fields to FormData
      for (const key in formData) {
        if (key.includes("_file") && formData[key]) {
          // Make sure the file is actually a File object
          if (formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          }
        } else {
          // Convert non-string values to strings when needed
          formDataToSend.append(
            key,
            formData[key] !== null && formData[key] !== undefined
              ? formData[key]
              : ""
          );
        }
      }
      // Add user data from localStorage if it exists
      if (userData) {
        formDataToSend.append("email", userData.email || "");
        formDataToSend.append("gender", userData.gender || "");
        formDataToSend.append("phoneNumber", userData.phoneNumber || "");
      }

      // Send data to API using axios
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-academic",
        formDataToSend,
        {
          headers: {
            // Axios will automatically set the Content-Type to multipart/form-data with boundary
            // No need to manually set it
          },
        }
      );

      // Axios automatically throws errors for non-2xx responses
      // and parses JSON, so response.data is already the parsed data
      const data = response.data;
      //added
      const user = JSON.parse(localStorage.getItem("user")); // assuming it's saved as 'user'
      user.submit = true;
      localStorage.setItem("user", JSON.stringify(user));

      // Show success message
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "You have registered successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);

      // Extract error message from axios error object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error submitting form. Please try again.";

      // More user-friendly error handling
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  if (formSubmission && userData.verify && !userData.rejected) {
    navigate("/student-profile");
  }

  if (formSubmission && !userData.rejected) {
    return <VerificationStatus />;
  }
  if (formSubmission && !userData.verify && userData.rejected) {
    return <RejectionPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Student Academic Information
        </h1>

        {userData && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{userData.phoneNumber}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Code - Now read-only since it comes from URL */}
            <div className="col-span-1">
              <label
                htmlFor="course_code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md bg-gray-100 ${
                  errors.course_code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter course code"
                readOnly
              />
              {errors.course_code && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.course_code}
                </p>
              )}
            </div>

            {/* Select Offline */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode of Study <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="offline_yes"
                    name="select_offline"
                    checked={formData.select_offline === true}
                    onChange={() =>
                      setFormData({ ...formData, select_offline: true })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="offline_yes" className="text-sm">
                    Offline
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="offline_no"
                    name="select_offline"
                    checked={formData.select_offline === false}
                    onChange={() =>
                      setFormData({ ...formData, select_offline: false })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="offline_no" className="text-sm">
                    Online
                  </label>
                </div>
              </div>
            </div>

            {/* 10th Details */}
            <div className="col-span-1">
              <label
                htmlFor="tenth_marks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                10th Marks (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tenth_marks"
                name="tenth_marks"
                value={formData.tenth_marks}
                onChange={handleChange}
                min="45"
                max="100"
                step="0.01"
                className={`w-full p-2 border rounded-md ${
                  errors.tenth_marks ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter percentage (45-100)"
              />
              {errors.tenth_marks && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tenth_marks}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <label
                htmlFor="tenth_year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                10th Passing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tenth_year"
                name="tenth_year"
                value={formData.tenth_year}
                onChange={handleChange}
                min="2000"
                max={currentYear}
                className={`w-full p-2 border rounded-md ${
                  errors.tenth_year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter year (2000-${currentYear})`}
              />
              {errors.tenth_year && (
                <p className="mt-1 text-sm text-red-600">{errors.tenth_year}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="tenth_file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                10th Marksheet (PDF, max 2MB){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="tenth_file"
                name="tenth_file"
                onChange={handleChange}
                accept=".pdf"
                className={`w-full p-2 border rounded-md ${
                  errors.tenth_file ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tenth_file && (
                <p className="mt-1 text-sm text-red-600">{errors.tenth_file}</p>
              )}
            </div>

            {/* 12th Details */}
            <div className="col-span-1">
              <label
                htmlFor="twelfth_marks"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                12th Marks (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="twelfth_marks"
                name="twelfth_marks"
                value={formData.twelfth_marks}
                onChange={handleChange}
                min="45"
                max="100"
                step="0.01"
                className={`w-full p-2 border rounded-md ${
                  errors.twelfth_marks ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter percentage (45-100)"
              />
              {errors.twelfth_marks && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.twelfth_marks}
                </p>
              )}
            </div>

            <div className="col-span-1">
              <label
                htmlFor="twelfth_year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                12th Passing Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="twelfth_year"
                name="twelfth_year"
                value={formData.twelfth_year}
                onChange={handleChange}
                min={
                  formData.tenth_year ? parseInt(formData.tenth_year) + 2 : 2002
                }
                max={currentYear}
                className={`w-full p-2 border rounded-md ${
                  errors.twelfth_year ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter year (must be ≥ 10th year + 2)`}
              />
              {errors.twelfth_year && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.twelfth_year}
                </p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="twelfth_marks_file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                12th Marksheet (PDF, max 2MB){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="twelfth_marks_file"
                name="twelfth_marks_file"
                onChange={handleChange}
                accept=".pdf"
                className={`w-full p-2 border rounded-md ${
                  errors.twelfth_marks_file
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.twelfth_marks_file && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.twelfth_marks_file}
                </p>
              )}
            </div>

            {/* UG Details - Only required if course code is 101 */}
            {formData.course_code === "101" && (
              <>
                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">
                    Undergraduate Details
                  </h3>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="ug_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UG Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ug_name"
                    name="ug_name"
                    value={formData.ug_name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.ug_name ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {ugDegrees.map((degree) => (
                      <option key={degree.value} value={degree.value}>
                        {degree.label}
                      </option>
                    ))}
                  </select>
                  {errors.ug_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ug_name}
                    </p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="ug_marks"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UG Marks (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ug_marks"
                    name="ug_marks"
                    value={formData.ug_marks}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full p-2 border rounded-md ${
                      errors.ug_marks ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter percentage (0-100)"
                  />
                  {errors.ug_marks && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ug_marks}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="ug_start"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UG Start Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ug_start"
                    name="ug_start"
                    value={formData.ug_start}
                    onChange={handleChange}
                    min={formData.twelfth_year}
                    max={currentYear}
                    className={`w-full p-2 border rounded-md ${
                      errors.ug_start ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter start year`}
                  />
                  {errors.ug_start && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ug_start}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="ug_end"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UG End Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="ug_end"
                    name="ug_end"
                    value={formData.ug_end}
                    onChange={handleChange}
                    min={
                      formData.ug_start ? parseInt(formData.ug_start) + 1 : ""
                    }
                    max={currentYear}
                    className={`w-full p-2 border rounded-md ${
                      errors.ug_end ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Enter end year`}
                  />
                  {errors.ug_end && (
                    <p className="mt-1 text-sm text-red-600">{errors.ug_end}</p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="ug_marks_file"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    UG Marksheet (PDF, max 2MB){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="ug_marks_file"
                    name="ug_marks_file"
                    onChange={handleChange}
                    accept=".pdf"
                    className={`w-full p-2 border rounded-md ${
                      errors.ug_marks_file
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.ug_marks_file && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ug_marks_file}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Other Course Details - Optional */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold text-lg mb-2 text-blue-700">
                Other Course Details (Optional)
              </h3>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="other_course"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Other Course Name
              </label>
              <input
                type="text"
                id="other_course"
                name="other_course"
                value={formData.other_course}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.other_course ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter other course name (if any)"
              />
              {errors.other_course && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.other_course}
                </p>
              )}
            </div>

            {formData.other_course && (
              <>
                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="other_course_marks"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Other Course Marks (%)
                  </label>
                  <input
                    type="number"
                    id="other_course_marks"
                    name="other_course_marks"
                    value={formData.other_course_marks}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className={`w-full p-2 border rounded-md ${
                      errors.other_course_marks
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter percentage (0-100)"
                  />
                  {errors.other_course_marks && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.other_course_marks}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="other_course_start"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Other Course Start Year
                  </label>
                  <input
                    type="number"
                    id="other_course_start"
                    name="other_course_start"
                    value={formData.other_course_start}
                    onChange={handleChange}
                    min="2000"
                    max={currentYear}
                    className={`w-full p-2 border rounded-md ${
                      errors.other_course_start
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Enter start year`}
                  />
                  {errors.other_course_start && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.other_course_start}
                    </p>
                  )}
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="other_course_end"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Other Course End Year
                  </label>
                  <input
                    type="number"
                    id="other_course_end"
                    name="other_course_end"
                    value={formData.other_course_end}
                    onChange={handleChange}
                    min={
                      formData.other_course_start
                        ? parseInt(formData.other_course_start) + 1
                        : ""
                    }
                    max={currentYear}
                    className={`w-full p-2 border rounded-md ${
                      errors.other_course_end
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={`Enter end year`}
                  />
                  {errors.other_course_end && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.other_course_end}
                    </p>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="other_marks_file"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Other Course Marksheet (PDF, max 2MB)
                  </label>
                  <input
                    type="file"
                    id="other_marks_file"
                    name="other_marks_file"
                    onChange={handleChange}
                    accept=".pdf"
                    className={`w-full p-2 border rounded-md ${
                      errors.other_marks_file
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.other_marks_file && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.other_marks_file}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Rank Details */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-semibold text-lg mb-2 text-blue-700">
                Entrance Exam Details
              </h3>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="rank"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Entrance Exam Rank <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                min="1"
                className={`w-full p-2 border rounded-md ${
                  errors.rank ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your rank"
              />
              {errors.rank && (
                <p className="mt-1 text-sm text-red-600">{errors.rank}</p>
              )}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label
                htmlFor="rank_file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rank Certificate (PDF, max 2MB){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="rank_file"
                name="rank_file"
                onChange={handleChange}
                accept=".pdf"
                className={`w-full p-2 border rounded-md ${
                  errors.rank_file ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.rank_file && (
                <p className="mt-1 text-sm text-red-600">{errors.rank_file}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Academic Information"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAcademicForm;
