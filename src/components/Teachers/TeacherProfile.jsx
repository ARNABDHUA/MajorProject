import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiHash,
  FiDollarSign,
  FiBook,
  FiStar,
  FiEdit,
  FiSave,
  FiX,
  FiPlusCircle,
  FiTrash2,
  FiAward,
  FiBriefcase,
  FiCheck,
} from "react-icons/fi";

const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newQualification, setNewQualification] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve data from localStorage
    const localData = localStorage.getItem("user");

    if (localData) {
      try {
        const parsedData = JSON.parse(localData);
        console.log("Teacher Data from Local Storage:", parsedData);
        setTeacherData(parsedData);
        setPhoneNumber(parsedData.phoneNumber || "");
      } catch (err) {
        console.error("Error parsing teacher data:", err);
      }
    } else {
      console.log("No teacher data found in Local Storage.");
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Build request object based on what's been filled out
      const updateData = {};

      if (phoneNumber && phoneNumber !== teacherData.phoneNumber) {
        updateData.phoneNumber = phoneNumber;
      }

      if (
        newQualification.degree &&
        newQualification.institution &&
        newQualification.year
      ) {
        updateData.degree = newQualification.degree;
        updateData.institution = newQualification.institution;
        updateData.year = newQualification.year;
      }

      if (newExpertise) {
        updateData.expertise = newExpertise;
      }

      // Only make the API call if we have something to update
      if (Object.keys(updateData).length === 0) {
        // Instead of setting an error or exiting, just notify the user
        setSuccess("No changes to update");
        setLoading(false);
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
        }, 1500);
        return;
      }

      // Get c_roll from teacher data
      const c_roll = teacherData?.c_roll;

      if (!c_roll) {
        setError("Teacher roll number not found");
        setLoading(false);
        return;
      }

      console.log("Sending update data:", updateData);

      const response = await fetch(
        `https://e-college-data.onrender.com/v1/teachers/teachers-owndata/${c_roll}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        // Update local storage with new data
        if (result.data) {
          localStorage.setItem("teacherdata", JSON.stringify(result.data));
          setTeacherData(result.data);
        }

        // Reset form fields
        setNewQualification({ degree: "", institution: "", year: "" });
        setNewExpertise("");

        // Close edit mode after a short delay
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
        }, 1500);
      } else {
        setError(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("API error:", err);
      setError(
        "Error connecting to server: " + (err.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQualification = (qualId) => {
    // This would need an API endpoint to handle deletion
    alert(`This would delete qualification with ID: ${qualId}`);
  };

  if (!teacherData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-medium text-gray-600"
        >
          Loading teacher data...
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 flex justify-between items-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Teacher Profile
        </h2>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditToggle}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiEdit size={18} />
            <span>Edit Profile</span>
          </motion.button>
        )}
      </motion.div>

      {!isEditing ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Basic Information Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" size={20} />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Name:</span>
                <span className="text-gray-800">
                  {teacherData.name || "N/A"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Email:</span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiMail size={16} className="text-gray-500" />
                  {teacherData.email || "N/A"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Phone:</span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiPhone size={16} className="text-gray-500" />
                  {teacherData.phoneNumber || "N/A"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">
                  Roll Number:
                </span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiHash size={16} className="text-gray-500" />
                  {teacherData.c_roll || "N/A"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Salary:</span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiDollarSign size={16} className="text-gray-500" />
                  Rs. {teacherData.salary || "N/A"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Rating:</span>
                <span className="text-gray-800 flex items-center gap-2">
                  <FiStar size={16} className="text-yellow-500" />
                  {teacherData.rating !== undefined
                    ? teacherData.rating
                    : "N/A"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Courses Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBook className="text-blue-600" size={20} />
              Courses
            </h3>
            {Array.isArray(teacherData.teacher_course) &&
            teacherData.teacher_course.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacherData.teacher_course.map((course, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses assigned</p>
            )}
          </motion.div>

          {/* Expertise Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" size={20} />
              Expertise
            </h3>
            {Array.isArray(teacherData.expertise) &&
            teacherData.expertise.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacherData.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No expertise listed</p>
            )}
          </motion.div>

          {/* Qualifications Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6 overflow-hidden"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiAward className="text-blue-600" size={20} />
              Qualifications
            </h3>
            {Array.isArray(teacherData.qualification) &&
            teacherData.qualification.length > 0 ? (
              <div className="space-y-3">
                {teacherData.qualification.map((qual) => (
                  <div
                    key={qual._id || qual.degree}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <p className="font-medium text-gray-800">{qual.degree}</p>
                    <p className="text-gray-600 text-sm">
                      {qual.institution} • {qual.year}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No qualifications listed</p>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiEdit className="text-blue-600" size={20} />
              Edit Profile
            </h3>
            <button
              onClick={handleEditToggle}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <FiX className="text-red-500" size={18} />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <FiCheck className="text-green-500" size={18} />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <FiPhone className="text-blue-600" size={18} />
                Update Phone Number
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1 rounded-lg border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* New Qualification Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <FiAward className="text-blue-600" size={18} />
                Add New Qualification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newQualification.degree}
                  onChange={(e) =>
                    setNewQualification({
                      ...newQualification,
                      degree: e.target.value,
                    })
                  }
                  placeholder="Degree"
                  className="rounded-lg border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newQualification.institution}
                  onChange={(e) =>
                    setNewQualification({
                      ...newQualification,
                      institution: e.target.value,
                    })
                  }
                  placeholder="Institution"
                  className="rounded-lg border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newQualification.year}
                  onChange={(e) =>
                    setNewQualification({
                      ...newQualification,
                      year: e.target.value,
                    })
                  }
                  placeholder="Year"
                  className="rounded-lg border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* New Expertise Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                <FiBriefcase className="text-blue-600" size={18} />
                Add New Expertise
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Enter expertise"
                  className="flex-1 rounded-lg border-gray-300 border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Current Qualifications Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700">
                Current Qualifications
              </h4>
              {Array.isArray(teacherData.qualification) &&
              teacherData.qualification.length > 0 ? (
                <div className="space-y-2">
                  {teacherData.qualification.map((qual) => (
                    <motion.div
                      key={qual._id || qual.degree}
                      whileHover={{ scale: 1.01 }}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {qual.degree}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {qual.institution} • {qual.year}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteQualification(qual._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No qualifications listed</p>
              )}
            </div>

            {/* Current Expertise Section */}
            <div className="space-y-2">
              <h4 className="text-lg font-medium text-gray-700">
                Current Expertise
              </h4>
              {Array.isArray(teacherData.expertise) &&
              teacherData.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {teacherData.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No expertise listed</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleEditToggle}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg flex justify-center items-center gap-2"
              >
                <FiX size={18} />
                <span>Cancel</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherProfile;
