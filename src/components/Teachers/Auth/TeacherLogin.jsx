import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import image from "/images/robot.gif";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function TeacherLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    c_roll: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userx, setUserx] = useState(null);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    try {
      const data = JSON.parse(raw);
      if (data && data.role === "teacher") {
        setUserx({ ...data });
      }
    } catch (err) {
      console.error("Failed to parse localStorage user:", err);
    }
  }, []);
  // Validate form inputs (password strength)
  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      showPopup(
        "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character.",
        "error"
      );
      return false;
    }

    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Show popup message
  const showPopup = (message, type) => {
    setPopup({ message, type, visible: true });
    setTimeout(() => setPopup({ message: "", type: "", visible: false }), 3000);
  };

  const navigateAndScrollToTop = (path) => {
    window.scrollTo(0, 0); // Scroll to top first
    navigate(path);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/teachers-login",
        formData
      );
      if (response.data) {
        const { item, user } = response.data;
        const teacher_email = user.email;
        const userData = { ...user, role: "teacher" };
        localStorage.setItem("item", item);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User Data:", userData);

        showPopup("Signin Successful! Redirecting...", "success");

        // Inner API call only happens after successful outer API call
        try {
          const chatUser = await axios.post(
            "https://e-college-data.onrender.com/v1/chat/chat-user-data",
            { email: teacher_email }
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
        setTimeout(() => navigateAndScrollToTop("/teacher-home"), 1000);
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

  useEffect(() => {
    if (userx) {
      navigate("/teacher-home");
    }
  }, [userx]);

  return (
    <div>
      {!userx && (
        <div className="flex mx-5 mt-8 justify-center items-center bg-gray-50">
          {/* Left side - GIF */}
          <div className="hidden lg:flex lg:w-1/2 bg-blue-50 justify-center items-center p-8">
            <div className="flex flex-col items-center">
              <img
                src={image}
                alt="Robot Animation"
                className="w-full max-w-md"
              />
              <h2 className="text-2xl font-bold text-blue-800 mt-6">
                E-Collge
              </h2>
              <p className="text-blue-600 text-center mt-2">
                Empowering educators with advanced technology
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">
                  Teacher Login
                </h2>
                <p className="text-gray-500 mt-3">
                  Welcome back! Please enter your details
                </p>
              </div>

              {/* POPUP MESSAGE */}
              {popup.visible && (
                <div
                  className={`transition-all duration-300 ease-in-out text-center text-white p-3 rounded-lg mb-4 ${
                    popup.type === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {popup.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Teacherid */}
                <div className="space-y-2">
                  <label
                    htmlFor="registerNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Teacher ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="registerNumber"
                      name="c_roll"
                      value={formData.c_roll}
                      onChange={handleChange}
                      autoComplete="off"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your Teacher ID"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                      autoComplete="off"
                    >
                      Password
                    </label>
                    <Link
                      to="/teacher-forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign in Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
