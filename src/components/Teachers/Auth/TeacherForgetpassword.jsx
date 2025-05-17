import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Added axios import
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const TeacherForgetpassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    // Check if email ends with @gmail.com
    if (!email.endsWith("@gmail.com")) {
      return "Email must end with @gmail.com";
    }

    // Check if email contains a 10-digit number
    const tenDigitNumberRegex = /\b\d{10}\b/;
    if (tenDigitNumberRegex.test(email)) {
      return "Email should not contain a 10-digit number";
    }

    return "";
  };

  const validateName = (name) => {
    // Check if name contains numbers
    if (/\d/.test(name)) {
      return "Name must not contain any numbers";
    }

    // Check name length
    if (name.length <= 4) {
      return "Name must be more than 4 characters long";
    }

    return "";
  };

  const validatePhone = (phone) => {
    // Check if phone contains only digits
    if (!/^\d+$/.test(phone)) {
      return "Phone number should only contain digits";
    }

    // Check if phone number is exactly 10 digits
    if (phone.length !== 10) {
      return "Phone number must be exactly 10 digits long";
    }

    return "";
  };

  // Password validation function
  const validatePassword = (password) => {
    // Check if password is more than 8 characters
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check if password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Run all validations
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    if (nameError) {
      setError(nameError);
      setLoading(false);
      return;
    }

    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    if (phoneError) {
      setError(phoneError);
      setLoading(false);
      return;
    }

    try {
      // Call the first API endpoint
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/teachers-email-pass",
        {
          email: email,
          phoneNumber: phone
        }
      );

      // Check response and proceed
      if (response.data ) {
        setCurrentStep(2);
      } else {
        setError(response.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to connect to server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call the second API endpoint to validate OTP
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/otp-validate",
        {
          email: email,
          otp: otp.join("")
        }
      );

      // Check response and proceed
      if (response.data && response.data.success) {
        setCurrentStep(3);
      } else {
        setError(response.data?.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to validate OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate the password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Call the third API endpoint to reset password
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/reset-pass",
        {
          email: email,
          newPassword: password
        }
      );

      // Check response and show success
      if (response.data) {
        setSuccess(true);
      } else {
        setError(response.data?.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(
        error.response?.data?.message || 
        "Failed to reset password. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  animate={{ scale: currentStep === step ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {step}
                </motion.div>

                {step < 3 && (
                  <div
                    className={`h-1 w-16 md:w-32 ${
                      currentStep > step ? "bg-green-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2 text-xs md:text-sm text-gray-600">
            <span>Account Info</span>
            <span>Verify OTP</span>
            <span>Reset Password</span>
          </div>
        </div>

        {/* Step 1: Email Form */}
        {currentStep === 1 && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-green-600 p-6">
              <h2 className="text-xl font-bold text-white">Forgot Password</h2>
              <p className="text-green-200 mt-1">
                Enter your details to recover your account
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be more than 4 characters with no numbers
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="5551234567"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Numbers only, no spaces or special characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="your@gmail.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must end with @gmail.com and no 10-digit numbers
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start"
                  >
                    <AlertCircle
                      size={16}
                      className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      Continue <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-green-600 p-6">
              <h2 className="text-xl font-bold text-white">OTP Verification</h2>
              <p className="text-green-200 mt-1">
                Enter the 4-digit code sent to {email}
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Enter OTP
                  </label>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-full aspect-square text-center text-2xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      className="text-green-600 font-medium"
                      onClick={handleEmailSubmit}
                    >
                      Resend
                    </button>
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start"
                  >
                    <AlertCircle
                      size={16}
                      className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-1/3 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-2/3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                    disabled={loading || otp.some((digit) => digit === "")}
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        Verify OTP <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 3: Reset Password */}
        {currentStep === 3 && !success && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-green-600 p-6">
              <h2 className="text-xl font-bold text-white">Reset Password</h2>
              <p className="text-green-200 mt-1">
                Create a new password for your account
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      Password Requirements:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li
                        className={`flex items-center ${
                          password.length >= 8 ? "text-green-600" : ""
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            password.length >= 8
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center ${
                          /[A-Z]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            /[A-Z]/.test(password)
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        One uppercase letter
                      </li>
                      <li
                        className={`flex items-center ${
                          /[a-z]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            /[a-z]/.test(password)
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        One lowercase letter
                      </li>
                      <li
                        className={`flex items-center ${
                          /[!@#$%^&*]/.test(password) ? "text-green-600" : ""
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            /[!@#$%^&*]/.test(password)
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }`}
                        ></div>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start"
                  >
                    <AlertCircle
                      size={16}
                      className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-1/3 border border-green-600 text-green-600 py-2 px-4 rounded-md hover:bg-green-50"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-2/3 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        Reset Password <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* Success Screen */}
        {success && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle size={48} className="text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Password Reset Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your password has been changed successfully.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
                onClick={() => (window.location.href = "/teacher-login")}
              >
                Return to Login
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeacherForgetpassword;