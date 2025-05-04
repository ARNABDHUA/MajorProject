import { useState, useEffect } from "react";
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
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import os from "/images/os.gif";
import Swal from "sweetalert2";

// Cities data organized by state
const citiesByState = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Kadapa",
    "Tirupati",
    "Rajahmundry",
    "Kakinada",
  ],
  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Pasighat",
    "Tawang",
    "Ziro",
    "Bomdila",
    "Aalo",
    "Tezu",
  ],
  Assam: [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Tezpur",
    "Karimganj",
  ],
  Bihar: [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
    "Purnia",
    "Arrah",
    "Begusarai",
  ],
  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Raigarh",
    "Jagdalpur",
    "Ambikapur",
    "Durg",
  ],
  Goa: [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Bicholim",
    "Curchorem",
    "Canacona",
  ],
  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Junagadh",
  ],
  Haryana: [
    "Faridabad",
    "Gurgaon",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Dharamshala",
    "Mandi",
    "Solan",
    "Nahan",
    "Bilaspur",
    "Hamirpur",
    "Kullu",
  ],
  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Hazaribagh",
    "Deoghar",
    "Giridih",
    "Ramgarh",
  ],
  Karnataka: [
    "Bangalore",
    "Mysore",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Gulbarga",
    "Davanagere",
    "Shimoga",
  ],
  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Kollam",
    "Palakkad",
    "Alappuzha",
    "Kannur",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Amravati",
  ],
  Manipur: [
    "Imphal",
    "Thoubal",
    "Bishnupur",
    "Churachandpur",
    "Ukhrul",
    "Chandel",
    "Senapati",
    "Tamenglong",
  ],
  Meghalaya: [
    "Shillong",
    "Tura",
    "Jowai",
    "Nongstoin",
    "Williamnagar",
    "Baghmara",
    "Resubelpara",
    "Ampati",
  ],
  Mizoram: [
    "Aizawl",
    "Lunglei",
    "Champhai",
    "Serchhip",
    "Kolasib",
    "Lawngtlai",
    "Mamit",
    "Saiha",
  ],
  Nagaland: [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Zunheboto",
    "Mon",
    "Phek",
  ],
  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Sambalpur",
    "Puri",
    "Balasore",
    "Bhadrak",
  ],
  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Mohali",
    "Pathankot",
    "Hoshiarpur",
  ],
  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
    "Bhilwara",
  ],
  Sikkim: [
    "Gangtok",
    "Namchi",
    "Gyalshing",
    "Mangan",
    "Ravangla",
    "Singtam",
    "Rangpo",
    "Jorethang",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
  ],
  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
    "Ramagundam",
    "Mahbubnagar",
    "Nalgonda",
  ],
  Tripura: [
    "Agartala",
    "Udaipur",
    "Dharmanagar",
    "Kailashahar",
    "Belonia",
    "Ambassa",
    "Khowai",
    "Teliamura",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Meerut",
    "Allahabad",
    "Ghaziabad",
    "Noida",
  ],
  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Rudrapur",
    "Kashipur",
    "Rishikesh",
    "Nainital",
  ],
  "West Bengal": [
    "Bankura",
    "Purulia",
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bardhaman",
    "Baharampur",
    "Malda",
  ],
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Car Nicobar",
    "Havelock Island",
    "Neil Island",
    "Mayabunder",
    "Diglipur",
    "Rangat",
    "Little Andaman",
  ],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Silvassa",
    "Daman",
    "Diu",
    "Amli",
    "Naroli",
    "Vapi",
    "Dunetha",
  ],
  Delhi: [
    "New Delhi",
    "Delhi",
    "Noida",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
    "Greater Noida",
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Kathua",
    "Udhampur",
    "Sopore",
    "Poonch",
  ],
  Ladakh: ["Leh", "Kargil", "Diskit", "Zanskar", "Nubra", "Khaltse", "Drass"],
  Lakshadweep: [
    "Kavaratti",
    "Agatti",
    "Amini",
    "Andrott",
    "Minicoy",
    "Kiltan",
    "Kadmat",
    "Kalpeni",
  ],
  Puducherry: [
    "Puducherry",
    "Karaikal",
    "Mahe",
    "Yanam",
    "Villianur",
    "Ozhukarai",
    "Thirubhuvanai",
  ],
};

const StudentSignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // Start with OTP verification (step 0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    phoneNumber: "",
    password: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [availableCities, setAvailableCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      setAvailableCities(citiesByState[formData.state] || []);
      // Reset city when state changes
      if (
        formData.city &&
        !citiesByState[formData.state]?.includes(formData.city)
      ) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  // Timer for OTP resend countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const basicPattern = /^[5-9]\d{9}$/;

    if (!basicPattern.test(phoneNumber)) return false;

    // Disallow fully increasing or decreasing sequences
    const isSequentialInc = "1234567890";
    const isSequentialDec = "9876543210";
    if (
      isSequentialInc.includes(phoneNumber) ||
      isSequentialDec.includes(phoneNumber)
    ) {
      return false;
    }

    // Disallow same digit repeated after first digit (e.g., 7000000000)
    const firstDigit = phoneNumber[0];
    const rest = phoneNumber.slice(1);
    const allSame = rest.split("").every((d) => d === rest[0]);
    if (allSame) return false;

    return true;
  };

  const validateEmail = (email) => {
    return /^[a-zA-Z][a-zA-Z0-9.]{5,29}@gmail\.com$/.test(email);
  };
  

  const validateOtpStep = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = `1. It must start with a letter (a–z).
      2. It can contain numbers, letters, and periods (.).
      3. It cannot contain special characters like !, #, %, etc.
      4. It must be between 6 and 30 characters long.`;
    }

    if (otpSent) {
      if (!otp.trim()) {
        newErrors.otp = "OTP is required";
      } else if (!/^\d{4}$/.test(otp)) {
        newErrors.otp = "OTP must be 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = () => {
    let newErrors = {};
    const {
      name,
      email,
      gender,
      phoneNumber,
      password,
      address,
      state,
      city,
      pincode,
    } = formData;

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = "Name is required";
      } else if (!/^[A-Za-z ]{3,}$/.test(name)) {
        newErrors.name =
          "Name must be at least 3 characters long and contain only letters";
      }

      if (!gender) {
        newErrors.gender = "Gender is required";
      }

      if (Object.keys(newErrors).length > 0) {
        showPopup(
          "Please correct the errors and fill all required fields",
          "error"
        );
      }
    } else if (step === 2) {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!isValidPhoneNumber(phoneNumber)) {
        newErrors.phoneNumber =
          "Invalid phone number format. Please enter a 10-digit valid Indian mobile number";
      }

      if (!password) {
        newErrors.password = "Password is required";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
        newErrors.password =
          "Password must have at least 8 characters with 1 uppercase letter,1 lowercase latter and 1 special character";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(newErrors).length > 0) {
        showPopup(
          "Please correct the errors and fill all required fields",
          "error"
        );
      }
    } else if (step === 3) {
      if (!address.trim()) {
        newErrors.address = "Address is required";
      }

      if (!state) {
        newErrors.state = "State is required";
      }

      if (!city) {
        newErrors.city = "City is required";
      }

      if (!pincode.trim()) {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(pincode)) {
        newErrors.pincode = "Invalid pincode. Please enter a 6-digit pincode";
      }

      if (Object.keys(newErrors).length > 0) {
        showPopup(
          "Please correct the errors and fill all required fields",
          "error"
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateOtpStep()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-mail-otp",
        { email: formData.email }
      );

      if (response.data) {
        setOtpSent(true);
        setIsResendDisabled(true);
        setResendTimer(30); // 30 seconds countdown
        showPopup("OTP sent successfully! Check your email", "success");
      } else {
        showPopup("Failed to send OTP. Please try again.", "error");
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      showPopup(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtpStep()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/students/student-mail-otp-validate",
        {
          email: formData.email,
          otp: otp,
        }
      );

      if (response.data.success) {
        setOtpVerified(true);
        showPopup("OTP verified successfully!", "success");
        setStep(1); // Move to personal details step
      } else {
        showPopup("Invalid OTP. Please try again.", "error");
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      showPopup(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const passwordQuery = () => {
    Swal.fire({
      title: "Password Guidelines",
      text: "Your password must be at least 8 characters long and include at least one uppercase letter ,one lowercase letter and one special character.",
      icon: "info",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input and limit to 6 characters
    if ((/^\d*$/.test(value) && value.length <= 6) || value === "") {
      setOtp(value);
      if (errors.otp) {
        setErrors((prev) => ({ ...prev, otp: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
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
          if (chatUser.data) {
            localStorage.setItem("userInfo", JSON.stringify(chatUser.data));
          }
        } catch (chatError) {
          console.error("Chat user registration error:", chatError);
          // Optionally show a warning that chat registration failed but account was created
          showPopup("Account created but chat registration failed", "warning");
        }

        setTimeout(() => navigate("/"), 2000);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Progress bar with animation for each step
  const ProgressIndicator = () => {
    // Calculate progress percentage: OTP verification + 3 normal steps = 4 steps total
    const currentStep = step === 0 ? 0 : step; // OTP step doesn't count in the progress bar
    const progressPercentage = (currentStep / 3) * 100;

    return (
      <div className="w-full mb-8">
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercentage}%` }}
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
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}

      {/* Popup Notification */}
      {popup.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`fixed top-29 left-1/2 transform -translate-x-1/2 p-4 text-white text-center rounded-lg shadow-lg z-50 ${
            popup.type === "success"
              ? "bg-green-500"
              : popup.type === "warning"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {popup.type === "success"
                ? "✓"
                : popup.type === "warning"
                ? "⚠️"
                : "✕"}
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

            {step > 0 && <ProgressIndicator />}

            {/* OTP Verification Step */}
            {step === 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Email Field */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Email Address <span className="text-red-500">*</span>
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={otpSent}
                      required
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

                {/* OTP Field - Show only after OTP is sent */}
                {otpSent && (
                  <motion.div
                    variants={itemVariants}
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-gray-700 font-medium">
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IoShieldCheckmarkOutline className="text-gray-400 text-lg" />
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="Enter 4-digit OTP"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                        maxLength={6}
                      />
                    </div>
                    {errors.otp && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.otp}
                      </motion.p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Didn't receive the OTP?{" "}
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isResendDisabled}
                        className={`font-medium ${
                          isResendDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:underline"
                        }`}
                      >
                        {isResendDisabled
                          ? `Resend in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="pt-4">
                  {!otpSent ? (
                    <motion.button
                      onClick={handleSendOtp}
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all"
                    >
                      Send OTP
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleVerifyOtp}
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-green-700 transition-all"
                    >
                      Verify OTP & Continue
                    </motion.button>
                  )}
                </motion.div>

                {/* Sign In Link */}
                <motion.div
                  variants={itemVariants}
                  className="text-center pt-2"
                >
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <motion.span
                      onClick={() => navigate("/login")}
                      className="text-blue-600 font-medium cursor-pointer hover:underline"
                      whileHover={{ scale: 1.05 }}
                    >
                      Sign In
                    </motion.span>
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Email Display (Non-editable) */}
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
                      value={formData.email}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      disabled
                    />
                  </div>
                </motion.div>

                {/* Full Name */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserAlt className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      required
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

                {/* Gender Selection */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Female</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Other</span>
                    </label>
                  </div>
                  {errors.gender && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.gender}
                    </motion.p>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between pt-4"
                >
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <MdOutlineNavigateBefore className="mr-1" size={20} />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-8 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  >
                    Next
                    <MdOutlineNavigateNext className="ml-1" size={20} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Account Setup */}
            {step === 2 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Phone Number */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Phone Number <span className="text-red-500">*</span>
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
                      placeholder="Enter your 10-digit phone number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      maxLength={10}
                      required
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

                {/* Password */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-gray-700 font-medium">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <FaRegCircleQuestion
                      className="text-gray-500 cursor-pointer hover:text-blue-600"
                      onClick={passwordQuery}
                    />
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <IoEyeOutline className="text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
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

                {/* Confirm Password */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Confirm Password <span className="text-red-500">*</span>
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
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <IoEyeOutline className="text-gray-400 hover:text-gray-600" />
                      )}
                    </div>
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
                  className="flex justify-between pt-4"
                >
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <MdOutlineNavigateBefore className="mr-1" size={20} />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={nextStep}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-8 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
                  >
                    Next
                    <MdOutlineNavigateNext className="ml-1" size={20} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: Address Details */}
            {step === 3 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Address */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-gray-400 text-lg" />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your full address"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      rows="3"
                      required
                    ></textarea>
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

                {/* State and City - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State Dropdown */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(citiesByState)
                        .sort()
                        .map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                    </select>
                    {errors.state && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.state}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* City Dropdown */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-gray-700 font-medium">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.city}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Pincode */}
                <motion.div variants={itemVariants} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={6}
                    required
                  />
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

                {/* Navigation & Submit Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between pt-4 gap-2"
                >
                  <motion.button
                    onClick={prevStep}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <MdOutlineNavigateBefore className="mr-1" size={20} />
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center px-8 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
                  >
                    Complete Registration
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentSignUp;
