import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaLightbulb,
  FaPen,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const TeacherHome = () => {
  // Sample initial data
  const [teacherData, setTeacherData] = useState({
    name: "Prof. Jane Smith",
    teacherId: "TCH-2025-0042",
    email: "jane.smith@education.org",
    phone: "(555) 123-4567",
    education: [
      {
        degree: "Ph.D. in Education",
        institution: "Stanford University",
        year: "2015",
      },
      {
        degree: "M.A. in Curriculum Development",
        institution: "UCLA",
        year: "2010",
      },
      { degree: "B.Sc. in Mathematics", institution: "MIT", year: "2008" },
    ],
    expertise: [
      "Advanced Mathematics",
      "Educational Technology",
      "Curriculum Design",
      "Student Assessment",
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(teacherData);
  const [activeSection, setActiveSection] = useState(null);

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

  const handleEdit = () => {
    setEditData(teacherData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setTeacherData(editData);
    setIsEditing(false);
    setActiveSection(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setActiveSection(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleExpertiseChange = (index, value) => {
    const newExpertise = [...editData.expertise];
    newExpertise[index] = value;
    setEditData({ ...editData, expertise: newExpertise });
  };

  const addExpertise = () => {
    setEditData({ ...editData, expertise: [...editData.expertise, ""] });
  };

  const removeExpertise = (index) => {
    const newExpertise = [...editData.expertise];
    newExpertise.splice(index, 1);
    setEditData({ ...editData, expertise: newExpertise });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...editData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEditData({ ...editData, education: newEducation });
  };

  const addEducation = () => {
    setEditData({
      ...editData,
      education: [
        ...editData.education,
        { degree: "", institution: "", year: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = [...editData.education];
    newEducation.splice(index, 1);
    setEditData({ ...editData, education: newEducation });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 flex justify-between items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-white">Teacher Profile</h1>
            <p className="text-blue-100">Dashboard Management System</p>
          </motion.div>

          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="bg-white text-blue-700 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 font-medium"
            >
              <FaPen className="text-blue-600" />
              <span>Edit Profile</span>
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 font-medium"
              >
                <FaSave />
                <span>Save</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 font-medium"
              >
                <FaTimes />
                <span>Cancel</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  activeSection === "basic"
                    ? "border-blue-500"
                    : "border-blue-300"
                } transition-all duration-300 hover:shadow-lg`}
                onClick={() => isEditing && setActiveSection("basic")}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Full Name</div>
                    {isEditing && activeSection === "basic" ? (
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-lg font-semibold">
                        {teacherData.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaIdCard className="mr-2 text-blue-600" />
                      Teacher ID
                    </div>
                    {isEditing && activeSection === "basic" ? (
                      <input
                        type="text"
                        name="teacherId"
                        value={editData.teacherId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-md">
                        {teacherData.teacherId}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  activeSection === "contact"
                    ? "border-blue-500"
                    : "border-blue-300"
                } transition-all duration-300 hover:shadow-lg`}
                onClick={() => isEditing && setActiveSection("contact")}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Email Address</div>
                    {isEditing && activeSection === "contact" ? (
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-lg">{teacherData.email}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaPhone className="mr-2 text-blue-600" />
                      Phone Number
                    </div>
                    {isEditing && activeSection === "contact" ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-lg">{teacherData.phone}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Education & Expertise */}
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  activeSection === "education"
                    ? "border-blue-500"
                    : "border-blue-300"
                } transition-all duration-300 hover:shadow-lg`}
                onClick={() => isEditing && setActiveSection("education")}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {(isEditing && activeSection === "education"
                    ? editData.education
                    : teacherData.education
                  ).map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-gray-50 p-3 rounded-lg"
                    >
                      {isEditing && activeSection === "education" ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleEducationChange(
                                  index,
                                  "degree",
                                  e.target.value
                                )
                              }
                              placeholder="Degree"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeEducation(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "institution",
                                e.target.value
                              )
                            }
                            placeholder="Institution"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "year",
                                e.target.value
                              )
                            }
                            placeholder="Year"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold">{edu.degree}</div>
                          <div className="text-sm text-gray-600">
                            {edu.institution}, {edu.year}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isEditing && activeSection === "education" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addEducation}
                      className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                    >
                      + Add Education
                    </motion.button>
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  activeSection === "expertise"
                    ? "border-blue-500"
                    : "border-blue-300"
                } transition-all duration-300 hover:shadow-lg`}
                onClick={() => isEditing && setActiveSection("expertise")}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaLightbulb className="mr-2 text-blue-600" />
                  Areas of Expertise
                </h2>
                <div className="space-y-3">
                  {(isEditing && activeSection === "expertise"
                    ? editData.expertise
                    : teacherData.expertise
                  ).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      {isEditing && activeSection === "expertise" ? (
                        <div className="flex w-full">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handleExpertiseChange(index, e.target.value)
                            }
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => removeExpertise(index)}
                            className="bg-red-50 text-red-500 px-3 py-2 border border-red-200 rounded-r-md hover:bg-red-100"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium mb-2">
                          {item}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isEditing && activeSection === "expertise" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addExpertise}
                      className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                    >
                      + Add Expertise
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-3 gap-4"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white text-center"
            >
              <div className="text-3xl font-bold">
                {teacherData.education.length}
              </div>
              <div className="text-blue-100">Qualifications</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-xl text-white text-center"
            >
              <div className="text-3xl font-bold">
                {teacherData.expertise.length}
              </div>
              <div className="text-indigo-100">Specializations</div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl text-white text-center"
            >
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-purple-100">Rating</div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherHome;
