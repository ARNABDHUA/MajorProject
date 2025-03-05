import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import os from "/images/os.gif";
import Swal from "sweetalert2";
import ProgressBar from "@ramonak/react-progress-bar";

const StudentSignup = () => {
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
  //password  Query =>
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
        "http://localhost:3000/v1/students/student-singup",
        formData
      );
      if (response.data) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        showPopup("Signup Successful! Redirecting...", "success");
        setTimeout(() => navigate("/"), 3000);
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

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 w-full">
      {/* Popup Notification - Centered */}
      {popup.show && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-white text-center rounded-lg shadow-lg transition-opacity duration-300 ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl h-full w-full flex flex-col md:flex-row">
        <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-100">
          <img
            src={os}
            alt="Illustration"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col h-145 ">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Sign Up
          </h2>
          <h3 className="text-gray-600 text-center mb-6 text-xl">
            Create your account
          </h3>

          {step === 1 && (
            <div className="flex flex-col space-y-6 p-6 bg-white rounded-lg">
              <ProgressBar completed={33} />

              {/* Name Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Next Button & Login Redirect */}
              <div className="text-center">
                <button
                  onClick={nextStep}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
                >
                  Next
                </button>
                <p className="text-gray-600 mt-4">
                  Already have an account?{" "}
                  <span
                    className="text-green-600 font-bold cursor-pointer hover:text-green-400"
                    onClick={() => navigate("/login")}
                  >
                    Log in here
                  </span>
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col space-y-6 p-6 bg-white  rounded-lg">
              <ProgressBar completed={66} />

              {/* Phone Number Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col relative">
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-semibold">
                    Password
                  </label>
                  <FaRegCircleQuestion
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={passwordQuery}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="text-black" />
                  ) : (
                    <IoEyeOutline className="text-black" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col relative">
                <label className="text-gray-700 font-semibold mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <IoEyeOffOutline className="text-black" />
                  ) : (
                    <IoEyeOutline className="text-black" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-md"
                >
                  Next
                </button>
              </div>

              {/* Login Redirect */}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col space-y-6 p-6 bg-white  rounded-lg">
              <ProgressBar completed={99} />

              {/* Address Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Pincode Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 transition shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-md"
                >
                  Register
                </button>
              </div>

              {/* Login Redirect */}
              <p className="text-center text-gray-600 mt-4">
                Already have an account?{" "}
                <span
                  className="text-green-600 font-bold cursor-pointer hover:text-green-400"
                  onClick={() => navigate("/login")}
                >
                  Log in here
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
