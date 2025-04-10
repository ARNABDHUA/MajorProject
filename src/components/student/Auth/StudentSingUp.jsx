import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaGraduationCap, FaUserAlt } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoLocationOutline,
  IoKeyOutline,
} from "react-icons/io5";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import os from "/images/os.gif";
import Swal from "sweetalert2";

const StudentSignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    pincode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const validateStep = () => {
    let newErrors = {};
    const { name, email, phoneNumber, password, address, pincode } = formData;

    if (step === 1) {
      if (!/^[A-Za-z ]{3,}$/.test(name))
        newErrors.name = "Name must be at least 3 characters long";
      if (!/^\S+@gmail\.com$/.test(email))
        newErrors.email = "Email must be a valid @gmail.com address";
      if (!formData.name || !formData.email) {
        showPopup("Please fill in all fields!", "error");
        return;
      }
    } else if (step === 2) {
      if (!/^[56789]\d{9}$/.test(phoneNumber))
        newErrors.phoneNumber = "Invalid phone number";
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password))
        newErrors.password = "Weak password";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Password not matched";
      if (!formData.phoneNumber || !formData.password) {
        showPopup("Please fill in all fields!", "error");
        return;
      }
    } else if (step === 3) {
      if (!address.trim()) newErrors.address = "Address is required";
      if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Invalid pincode";
      if (!formData.address || !formData.pincode) {
        showPopup("Please fill in all fields!", "error");
        return;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep() && setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const passwordQuery = () => {
    Swal.fire({
      title: "Password Guidelines",
      text: "Your password must be at least 8 characters long and include at least one uppercase letter and one special character.",
      icon: "info",
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
      if (!validateStep()) return;
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/students/student-singup",
          formData
        );
        
        if (response.data) {
          const { token, user } = response.data;
          const userData = { ...user, role: "student" };
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));
          
          showPopup("Signup Successful! Redirecting...", "success");
          
          // Inner API call only happens after successful outer API call
          try {
            const chatUser = await axios.post(
              "https://e-college-data.onrender.com/v1/chat/chat-user-add",
              { name: formData.name, email: formData.email } 
            );
            console.log("Chat user added successfully:");
            if(chatUser.data){
              localStorage.setItem("userInfo", JSON.stringify(chatUser.data));
            }
          } catch (chatError) {
            console.error("Chat user registration error:", chatError);
            // Optionally show a warning that chat registration failed but account was created
            showPopup("Account created but chat registration failed", "warning");
          }
          
          setTimeout(() => navigate("/"), 5000);
        }
      } catch (error) {
        console.error("Signup Error:", error);
    
        if (error.response && error.response.status === 400) {
          showPopup(
            error.response.data.message || "Signup Failed. Try again!",
            "error"
          );
        } else {
          showPopup("Something went wrong. Please try again later!", "error");
        }
      }
    };

  // Progress bar with animation for each step
  const ProgressIndicator = () => {
    return (
      <div className="w-full mb-8">
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${step * 33.33}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <motion.div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step >= 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              1
            </motion.div>
            <motion.div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step >= 2 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              2
            </motion.div>
            <motion.div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                step >= 3 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              3
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full relative p-4">
      {/* Popup Notification */}
      {popup.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-29 left-1/2 transform -translate-x-1/2 p-4 text-white text-center rounded-lg shadow-lg z-50 ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {popup.type === "success" ? "✓" : "✕"}
            </span>
            <span>{popup.message}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
          {/* Left side - Image with overlay */}
          <div className="hidden md:block w-1/2 relative">
            <img
              src={os}
              alt="Illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200/30 to-indigo-400/60 flex items-center justify-center">
              <motion.div
                className="text-center p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="mb-4 inline-block"
                >
                  <FaGraduationCap className="text-white text-6xl mx-auto" />
                </motion.div>
                <h2 className="text-white text-3xl font-bold mb-4">
                  Welcome to E-College
                </h2>
                <p className="text-white/80 text-lg">
                  Join our community of learners and start your educational
                  journey today.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Student Sign Up
              </h2>
              <p className="text-gray-600">
                Create your account in just a few steps
              </p>
            </motion.div>

            <ProgressIndicator />

            {step === 1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Name Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMailOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Next Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-400/20 hover:shadow-blue-500/30 transition-all"
                  >
                    Continue <MdOutlineNavigateNext className="text-xl" />
                  </motion.button>

                  <motion.p
                    variants={itemVariants}
                    className="text-center text-gray-600 mt-6"
                  >
                    Already have an account?{" "}
                    <motion.span
                      className="text-blue-600 font-semibold cursor-pointer hover:underline"
                      onClick={() => navigate("/login")}
                      whileHover={{ scale: 1.05 }}
                    >
                      Log in here
                    </motion.span>
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Phone Number Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPhonePortraitOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.phoneNumber}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-gray-700 font-medium">
                      Password
                    </label>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={passwordQuery}
                    >
                      <FaRegCircleQuestion className="text-gray-500 cursor-pointer" />
                    </motion.div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoKeyOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="text-gray-600 text-xl" />
                      ) : (
                        <IoEyeOutline className="text-gray-600 text-xl" />
                      )}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoKeyOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <motion.button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline className="text-gray-600 text-xl" />
                      ) : (
                        <IoEyeOutline className="text-gray-600 text-xl" />
                      )}
                    </motion.button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between pt-4 gap-4"
                >
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                  >
                    <MdOutlineNavigateBefore className="text-xl" /> Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-400/20 hover:shadow-blue-500/30 transition-all"
                  >
                    Continue <MdOutlineNavigateNext className="text-xl" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Address Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.address && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.address}
                    </motion.p>
                  )}
                </motion.div>

                {/* Pincode Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Pincode
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter your pincode"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.pincode && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.pincode}
                    </motion.p>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between pt-4 gap-4"
                >
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                  >
                    <MdOutlineNavigateBefore className="text-xl" /> Back
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-400/20 hover:shadow-green-500/30 transition-all"
                  >
                    Complete Registration
                  </motion.button>
                </motion.div>

                {/* Login Redirect */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-gray-600 mt-6"
                >
                  Already have an account?{" "}
                  <motion.span
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate("/login")}
                    whileHover={{ scale: 1.05 }}
                  >
                    Log in here
                  </motion.span>
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile only banner */}
        <motion.div
          className="mt-6 text-center text-gray-600 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaGraduationCap className="text-blue-500 text-3xl mx-auto mb-2" />
          <p className="font-medium">E-College - Empowering Education</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentSignUp;
