import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import os from "/images/os.gif"; // Ensure this path is correct for your project

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailRegex.test(formData.email)) {
      showPopup("Email must be a valid @gmail.com address.", "error");
      return false;
    }

    return true;
  };

  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => setPopup({ message: "", type: "", visible: false }), 3000);
  };

  // Function to navigate and scroll to top
  const navigateAndScrollToTop = (path) => {
    window.scrollTo(0, 0); // Scroll to top first
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-singin",
        formData
      );
      if (response.data) {
        const { token, user } = response.data;
        const userData = { ...user, role: "student" };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User Data:", userData);
        showPopup("Signin Successful! Redirecting...", "success");

        // Inner API call only happens after successful outer API call
        try {
          const chatUser = await axios.post(
            "https://e-college-data.onrender.com/v1/chat/chat-user-data",
            { email: formData.email }
          );
          console.log("Chat user added successfully:");
          if (chatUser.data) {
            localStorage.setItem(
              "userInfo",
              JSON.stringify(chatUser.data.user)
            );
          }
        } catch (chatError) {
          console.error("Chat user registration error:", chatError);
          // Optionally show a warning that chat registration failed but account was created
          showPopup("Account created but chat registration failed", "warning");
        }

        // Scroll to top before navigating
        window.scrollTo(0, 0);
        setTimeout(() => navigateAndScrollToTop("/"), 3000);
      } else {
        showPopup("Invalid email or password.", "error");
      }
    } catch (error) {
      console.error("Signin Error:", error);

      if (error.response && error.response.status === 400) {
        showPopup(
          error.response.data.message || "Signin Failed. Try again!",
          "error"
        );
      } else if (error.response && error.response.status === 404) {
        showPopup(
          error.response.data.message || "Signin Failed. Try again!",
          "error"
        );
      } else {
        showPopup("Something went wrong. Please try again later!", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl">
        {/* Left Section (Form) */}
        <div className="flex flex-col justify-center p-6 md:p-12 w-full md:w-1/2 min-h-145">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Welcome to ECollege
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Welcome back! Please enter your details.
          </p>

          {popup.visible && (
            <div
              className={`text-center text-white p-3 rounded-lg mb-4 ${
                popup.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {popup.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
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
            </div>

            <div className="flex justify-between items-center mb-4">
              <div></div>
              <span
                className="text-sm font-bold text-blue-600 cursor-pointer"
                onClick={() => navigateAndScrollToTop("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <HashLoader size={20} color="#fff" /> : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <span
              className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
              onClick={() => navigateAndScrollToTop("/signup")}
            >
              Sign up for free
            </span>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-100">
          <img
            src={os}
            alt="Illustration"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
