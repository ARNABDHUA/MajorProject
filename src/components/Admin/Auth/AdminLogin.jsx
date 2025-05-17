import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { IoMdPlanet } from "react-icons/io";
import { TbSparkles, TbCircuitDiode } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // For animated background particles
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate random particles for background effect
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
      });
    }
    setParticles(newParticles);
  }, []);

  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!email.endsWith("@gmail.com")) {
      setEmailError("Email must end with @gmail.com");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/admin/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data) {
        const { item, user } = response.data;
        const admin_email = user.email;
        const userData = { ...user, role: "admin" };
        localStorage.setItem("item", item);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User Data:", userData);
        // Make the second API call to get chat user data
        try {
          const chatResponse = await axios.post(
            "https://e-college-data.onrender.com/v1/chat/chat-user-data",
            {
              email: email, // Using the email as admin_email
            }
          );

          // Store the response data in localStorage as requested
          // Store the response data in localStorage as requested
          console.log("Chat user added successfully:");
          if (chatResponse.data) {
            localStorage.setItem(
              "userInfo",
              JSON.stringify(chatResponse.data.user)
            );
          }

          // Redirect to admin page on successful login
          navigate("/admin");
        } catch (chatErr) {
          console.error("Error fetching chat user data:", chatErr);
          // Still redirect even if second call fails
          navigate("/admin");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // CSS for grid pattern and animations
  const gridPatternStyle = {
    backgroundImage: `linear-gradient(
      to right,
      rgba(128, 90, 213, 0.1) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(128, 90, 213, 0.1) 1px,
      transparent 1px
    )`,
    backgroundSize: "40px 40px",
  };

  // Define the shine animation in a style element that will be inserted in the document head
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes shine {
        from {
          transform: translateX(-100%) skewX(-12deg);
        }
        to {
          transform: translateX(300%) skewX(-12deg);
        }
      }
      .animate-shine {
        animation: shine 3s infinite;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-purple-600/30 pointer-events-none"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: 0.2,
          }}
          animate={{
            x: `${(particle.x + 10) % 100}%`,
            y: `${(particle.y + 10) % 100}%`,
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: particle.duration,
            ease: "linear",
          }}
          style={{ fontSize: `${particle.size}rem` }}
        >
          {particle.id % 3 === 0 ? (
            <TbSparkles />
          ) : particle.id % 3 === 1 ? (
            <IoMdPlanet />
          ) : (
            <TbCircuitDiode />
          )}
        </motion.div>
      ))}

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={gridPatternStyle}
      ></div>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Login card */}
        <div className="backdrop-blur-lg bg-black/40 border border-purple-900/50 rounded-2xl p-6 shadow-xl shadow-purple-600/10">
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 1.5, type: "spring" }}
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-800 to-purple-500 flex items-center justify-center">
                <div className="absolute inset-1 rounded-full bg-black/90 flex items-center justify-center">
                  <TbCircuitDiode className="text-purple-500 text-4xl" />
                </div>
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mt-2 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ADMIN PORTAL
            </motion.h1>
            <motion.div
              className="h-1 w-16 bg-gradient-to-r from-purple-800 to-purple-500 mx-auto my-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <motion.div
                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-purple-500"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FaUser />
              </motion.div>
              <motion.input
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                type="email"
                className={`w-full pl-10 pr-4 py-3 bg-black/60 text-purple-100 placeholder-purple-400/50 border ${
                  emailError ? "border-red-500" : "border-purple-800/50"
                } focus:border-purple-500 rounded-lg outline-none transition-all focus:ring-2 focus:ring-purple-600/50`}
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1 pl-3"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            <div className="relative">
              <motion.div
                className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-purple-500"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <FaLock />
              </motion.div>
              <motion.input
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                type={showPassword ? "text" : "password"}
                className={`w-full pl-10 pr-12 py-3 bg-black/60 text-purple-100 placeholder-purple-400/50 border ${
                  passwordError ? "border-red-500" : "border-purple-800/50"
                } focus:border-purple-500 rounded-lg outline-none transition-all focus:ring-2 focus:ring-purple-600/50`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <motion.button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-purple-500 hover:text-purple-400 cursor-pointer"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.15 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </motion.button>
              {passwordError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs mt-1 pl-3"
                >
                  {passwordError}
                </motion.p>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center py-2"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white rounded-lg font-medium flex items-center justify-center space-x-2 overflow-hidden relative group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <span className="relative z-10">
                {isLoading ? "Authenticating..." : "Access System"}
              </span>
              <motion.span
                className="relative z-10"
                initial={{ x: -5 }}
                animate={{ x: 0 }}
                transition={{ delay: 1.3 }}
              >
                <FaArrowRight />
              </motion.span>
              <div className="absolute inset-0 w-1/6 h-full bg-white/20 skew-x-12 -translate-x-32 group-hover:animate-shine" />
            </motion.button>
          </form>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 0.7, width: 128 }}
          transition={{ delay: 1.4, duration: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 0.7, width: 128 }}
          transition={{ delay: 1.4, duration: 1 }}
        />
      </motion.div>
    </div>
  );
}
