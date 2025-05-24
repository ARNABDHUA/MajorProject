import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Book,
  Star,
  Edit,
  Save,
  X,
  PlusCircle,
  Trash2,
  Award,
  Briefcase,
  Check,
  Image,
  Upload,
  Globe,
  Calendar,
  MapPin,
  Target,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Skeleton Loader Component
const SkeletonLoader = () => {
  const shimmer = {
    initial: { x: "-100%" },
    animate: { x: "100%" },
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  };

  const SkeletonCard = ({ className, children }) => (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          {...shimmer}
        />
        {children}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card Skeleton */}
        <SkeletonCard className="lg:col-span-1 p-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-40 h-40 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full animate-pulse" />
            <div className="space-y-3 w-full">
              <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full animate-pulse w-3/4 mx-auto" />
            </div>
            <div className="space-y-3 w-full">
              <div className="h-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full animate-pulse w-5/6" />
            </div>
          </div>
        </SkeletonCard>

        {/* Content Cards Skeleton */}
        <div className="lg:col-span-3 space-y-8">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full animate-pulse w-1/3" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6]
                    .slice(0, Math.floor(Math.random() * 4) + 3)
                    .map((j) => (
                      <div
                        key={j}
                        className="h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl animate-pulse"
                      />
                    ))}
                </div>
              </div>
            </SkeletonCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TeacherProfile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit form states - restored original functionality
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newQualification, setNewQualification] = useState({
    degree: "",
    institution: "",
    year: "",
  });
  const [newExpertise, setNewExpertise] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [teacherMail, setTeacherMail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve data from localStorage with skeleton loading
    const loadData = async () => {
      setLoading(true);

      // Show skeleton for at least 1 second for better UX
      const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1000));

      const localData = localStorage.getItem("user");

      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          if (parsedData.role !== "teacher") {
            navigate("/teacher-login");
          }
          const teacher_data = parsedData.email;
          setTeacherMail(teacher_data);
          setTeacherData(parsedData);
          setPhoneNumber(parsedData.phoneNumber || "");

          // Set profile image if available
          if (parsedData.image) {
            setProfileImage(parsedData.image);
          }
        } catch (err) {
          console.error("Error parsing teacher data:", err);
        }
      } else {
        console.log("No teacher data found in Local Storage.");
      }

      await minLoadTime;
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  // Restored original handler functions with full API functionality
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    setNewImageFile(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get c_roll from teacher data
      const c_roll = teacherData?.c_roll;

      if (!c_roll) {
        setError("Teacher roll number not found");
        setSubmitLoading(false);
        return;
      }

      // Build `FormData` if image is being uploaded
      let formData = null;
      let hasImageUpdate = false;

      // When handling image upload section
      if (imageFile) {
        try {
          formData = new FormData();
          formData.append("image", imageFile);
          hasImageUpdate = true;
        } catch (err) {
          console.error("Image preparation error:", err);
          setError(
            "Failed to prepare image for upload. Please try again with a different image."
          );
          setSubmitLoading(false);
          return;
        }
      }

      // Build JSON data for other fields
      const updateData = {};

      if (phoneNumber && phoneNumber !== teacherData.phoneNumber) {
        updateData.phoneNumber = phoneNumber;
      }

      if (
        newQualification.degree &&
        newQualification.institution &&
        newQualification.year
      ) {
        // Match these field names to what backend expects
        updateData.degree = newQualification.degree;
        updateData.institution = newQualification.institution;
        updateData.year = newQualification.year;
      }

      if (newExpertise) {
        updateData.expertise = newExpertise;
      }

      // Only make the API call if we have something to update
      if (Object.keys(updateData).length === 0 && !hasImageUpdate) {
        setSuccess("No changes to update");
        setSubmitLoading(false);
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
        }, 1500);
        return;
      }

      let response;

      // If we have an image update, use FormData
      if (hasImageUpdate) {
        // Add other fields to FormData
        Object.keys(updateData).forEach((key) => {
          formData.append(key, updateData[key]);
        });

        response = await axios.post(
          `https://e-college-data.onrender.com/v1/teachers/teachers-owndata/${c_roll}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          const imageResponse = await axios.post(
            `https://e-college-data.onrender.com/v1/chat/teacherimageget`,
            { email: teacherMail },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
      } else {
        // Regular JSON API call for non-image updates
        response = await axios.post(
          `https://e-college-data.onrender.com/v1/teachers/teachers-owndata/${c_roll}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess("Profile updated successfully!");

        // Update local storage with new data
        if (response.data.data) {
          const updatedData = {
            ...teacherData,
            ...response.data.data,
          };

          // Save updated user data to localStorage
          localStorage.setItem("user", JSON.stringify(updatedData));
          setTeacherData(updatedData);

          // If image was updated, update profile image
          if (hasImageUpdate && response.data.data.image) {
            setProfileImage(response.data.data.image);
          }
        }

        // Reset form fields
        setNewQualification({ degree: "", institution: "", year: "" });
        setNewExpertise("");
        setImageFile(null);
        setNewImageFile(null);

        // Close edit mode after a short delay
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("API error:", err);
      setError(
        "Error connecting to server: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteQualification = async (qualDegree) => {
    try {
      setSubmitLoading(true);

      const c_roll = teacherData?.c_roll;
      if (!c_roll) {
        setError("Teacher roll number not found");
        setSubmitLoading(false);
        return;
      }

      // Fixed structure - send degree directly without nesting in a data object
      const response = await axios.post(
        `https://e-college-data.onrender.com/v1/teachers/teachers-qualification/${c_roll}`,
        { degree: qualDegree }, // Send degree directly as an object key
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update local data by filtering out the deleted qualification
        const updatedQualifications = teacherData.qualification.filter(
          (qual) => qual.degree !== qualDegree
        );

        const updatedTeacherData = {
          ...teacherData,
          qualification: updatedQualifications,
        };

        // Update state and localStorage
        setTeacherData(updatedTeacherData);
        localStorage.setItem("user", JSON.stringify(updatedTeacherData));

        setSuccess("Qualification deleted successfully!");

        setTimeout(() => {
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to delete qualification");
      }
    } catch (err) {
      console.error("Delete qualification error:", err);
      setError(
        "Error deleting qualification: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteExpertise = async (expertise) => {
    try {
      setSubmitLoading(true);

      const c_roll = teacherData?.c_roll;
      if (!c_roll) {
        setError("Teacher roll number not found");
        setSubmitLoading(false);
        return;
      }

      const response = await axios.post(
        `https://e-college-data.onrender.com/v1/teachers/teachers-qualification/${c_roll}`,
        { expertise },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update local data by filtering out the deleted expertise
        const updatedExpertise = teacherData.expertise.filter(
          (exp) => exp !== expertise
        );

        const updatedTeacherData = {
          ...teacherData,
          expertise: updatedExpertise,
        };

        // Update state and localStorage
        setTeacherData(updatedTeacherData);
        localStorage.setItem("user", JSON.stringify(updatedTeacherData));

        setSuccess("Expertise deleted successfully!");

        setTimeout(() => {
          setSuccess("");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to delete expertise");
      }
    } catch (err) {
      console.error("Delete expertise error:", err);
      setError(
        "Error deleting expertise: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Show skeleton loader
  if (loading) {
    return <SkeletonLoader />;
  }

  if (!teacherData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl font-semibold text-green-600"
        >
          No teacher data found
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
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-teal-200/20 to-green-300/20 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Teacher Profile
            </h1>
            <p className="text-green-600/70 text-lg">
              Manage your academic profile and expertise
            </p>
          </div>

          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditToggle}
              className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <Edit
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-4 rounded-2xl shadow-lg flex items-center gap-3"
            >
              <X className="text-red-500 flex-shrink-0" size={20} />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 text-green-700 p-4 rounded-2xl shadow-lg flex items-center gap-3"
            >
              <Check className="text-green-500 flex-shrink-0" size={20} />
              <span className="font-medium">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isEditing ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Profile Card */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-green-100/50 relative overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-400/10 to-green-500/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10 flex flex-col items-center space-y-6">
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  className="relative"
                >
                  <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-gradient-to-r from-green-400 to-emerald-400 shadow-2xl relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Teacher Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center">
                        <User size={72} className="text-green-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star size={16} className="text-white" />
                  </div>
                </motion.div>

                <div className="text-center space-y-3">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {teacherData.name || "Teacher Name"}
                  </h2>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {teacherData.c_roll || "Teacher ID"}
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl group"
                  >
                    <Mail
                      size={18}
                      className="text-green-500 group-hover:text-green-600 transition-colors"
                    />
                    <span className="text-gray-700 text-sm">
                      {teacherData.email || "N/A"}
                    </span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl group"
                  >
                    <Phone
                      size={18}
                      className="text-green-500 group-hover:text-green-600 transition-colors"
                    />
                    <span className="text-gray-700 text-sm">
                      {teacherData.phoneNumber || "N/A"}
                    </span>
                  </motion.div>
                </div>

                {/* Stats */}
                <div className="w-full grid grid-cols-3 gap-3 pt-4 border-t border-green-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {teacherData.teacher_course?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">
                      {teacherData.expertise?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-600">
                      {teacherData.qualification?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Degrees</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="lg:col-span-3 space-y-8">
              {/* Courses Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/5 to-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white shadow-lg">
                      <Book size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Courses
                      </h3>
                      <p className="text-green-600">Teaching Excellence</p>
                    </div>
                  </div>

                  {Array.isArray(teacherData.teacher_course) &&
                  teacherData.teacher_course.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teacherData.teacher_course.map((course, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/item"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-sm group-hover/item:shadow-md transition-shadow" />
                            <span className="font-semibold text-gray-700 group-hover/item:text-green-700 transition-colors">
                              {course}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Book size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="italic">No courses assigned</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Expertise Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100/50 relative overflow-hidden group"
              >
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/5 to-teal-500/5 rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl text-white shadow-lg">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Expertise
                      </h3>
                      <p className="text-emerald-600">Professional Skills</p>
                    </div>
                  </div>

                  {Array.isArray(teacherData.expertise) &&
                  teacherData.expertise.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {teacherData.expertise.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group/skill"
                        >
                          <div className="flex items-center gap-2">
                            <Target
                              size={14}
                              className="text-emerald-500 group-hover/skill:text-emerald-600 transition-colors"
                            />
                            <span className="font-medium text-emerald-700 group-hover/skill:text-emerald-800 transition-colors">
                              {skill}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Briefcase
                        size={48}
                        className="mx-auto mb-3 opacity-50"
                      />
                      <p className="italic">No expertise listed</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Qualifications Card */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-green-100/50 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-teal-400/5 to-green-500/5 rounded-full -translate-y-20 -translate-x-20 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl text-white shadow-lg">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        Qualifications
                      </h3>
                      <p className="text-teal-600">Academic Achievements</p>
                    </div>
                  </div>

                  {Array.isArray(teacherData.qualification) &&
                  teacherData.qualification.length > 0 ? (
                    <div className="space-y-4">
                      {teacherData.qualification.map((qual, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.15 }}
                          whileHover={{ x: 5, scale: 1.01 }}
                          className="bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/qual"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-full flex items-center justify-center shadow-md group-hover/qual:shadow-lg transition-shadow">
                              <Award size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 text-lg group-hover/qual:text-teal-700 transition-colors">
                                {qual.degree}
                              </h4>
                              <p className="text-gray-600 font-medium mt-1">
                                {qual.institution}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar size={14} className="text-teal-500" />
                                <span className="text-sm text-gray-500 font-medium">
                                  {qual.year}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Award size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="italic">No qualifications listed</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Edit Mode */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-green-100/50 relative overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 rounded-3xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/5 to-emerald-500/5 rounded-full -translate-y-32 translate-x-32" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Edit Profile
                  </h2>
                  <p className="text-green-600/70 mt-1">
                    Update your information and qualifications
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </motion.button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Image Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <Image className="text-green-500" size={24} />
                    Profile Image
                  </h3>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-300 shadow-lg">
                        {newImageFile || profileImage ? (
                          <img
                            src={newImageFile || profileImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <User size={48} className="text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Change Profile Picture
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Upload size={16} />
                          Choose Image
                        </label>
                        {imageFile && (
                          <span className="text-sm text-green-600 font-medium">
                            {imageFile.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Phone Number Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200/50"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <Phone className="text-emerald-500" size={24} />
                    Contact Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                {/* Add New Qualification Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-2xl border border-teal-200/50"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <Award className="text-teal-500" size={24} />
                    Add New Qualification
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={newQualification.degree}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            degree: e.target.value,
                          })
                        }
                        placeholder="e.g., Master of Science"
                        className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={newQualification.institution}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            institution: e.target.value,
                          })
                        }
                        placeholder="e.g., Harvard University"
                        className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        value={newQualification.year}
                        onChange={(e) =>
                          setNewQualification({
                            ...newQualification,
                            year: e.target.value,
                          })
                        }
                        placeholder="e.g., 2020"
                        className="w-full px-4 py-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Add New Expertise Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                    <TrendingUp className="text-green-500" size={24} />
                    Add New Expertise
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expertise/Skill
                    </label>
                    <input
                      type="text"
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      placeholder="e.g., Machine Learning, Data Analysis"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                {/* Current Qualifications Management */}
                {Array.isArray(teacherData.qualification) &&
                  teacherData.qualification.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200/50"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                        <Trash2 className="text-red-500" size={24} />
                        Manage Existing Qualifications
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teacherData.qualification.map((qual, index) => (
                          <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm border border-red-200/50 p-4 rounded-xl flex items-center justify-between group hover:shadow-md transition-all duration-300"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 truncate">
                                {qual.degree}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {qual.institution}
                              </p>
                              <p className="text-xs text-gray-500">
                                {qual.year}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() =>
                                handleDeleteQualification(qual.degree)
                              }
                              className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                              disabled={submitLoading}
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                {/* Current Expertise Management */}
                {Array.isArray(teacherData.expertise) &&
                  teacherData.expertise.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl border border-red-200/50"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                        <Trash2 className="text-red-500" size={24} />
                        Manage Existing Expertise
                      </h3>

                      <div className="flex flex-wrap gap-3">
                        {teacherData.expertise.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm border border-red-200/50 px-4 py-2 rounded-full flex items-center gap-2 group hover:shadow-md transition-all duration-300"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {skill}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              type="button"
                              onClick={() => handleDeleteExpertise(skill)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all duration-200"
                              disabled={submitLoading}
                            >
                              <X size={14} />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center pt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={submitLoading}
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-12 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
