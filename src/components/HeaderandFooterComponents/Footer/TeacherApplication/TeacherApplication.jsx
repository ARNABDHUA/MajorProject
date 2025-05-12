import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaArrowRight,
  FaTimesCircle,
} from "react-icons/fa";

export default function TeacherCheckForm() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [isrejected, setIsRejected] = useState(false);
  const [isVerfied, setIsVerfied] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[a-zA-Z][a-zA-Z0-9.]{5,29}@gmail\.com$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation - only letters and spaces
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should only contain letters and spaces";
    }

    // Phone validation - at least 10 digits
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (at least 10 digits)";
    }

    // Email validation - must end with @gmail.com
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = `1. It must start with a letter (a–z).
      2. It can contain numbers, letters, and periods (.).
      3. It cannot contain special characters like !, #, %, etc.
      4. It must be between 6 and 30 characters long.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/teachers/teachers-apply-check",
          {
            phoneNumber: formData.phoneNumber,
            email: formData.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setApiResponse(response.data);
        if (response.data.data.rejected) {
          setIsRejected(response.data.data.rejected);
        }
        if (response.data.data.verify) {
          setIsVerfied(response.data.data.verify);
        }
      } catch (error) {
        console.error("Error checking teacher:", error);
        setApiResponse({
          success: false,
          message:
            error.response?.data?.message || "Error connecting to server",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRedirect = () => {
    navigate("/teacher-register");
  };

  const renderStatusResult = () => {
    if (!apiResponse) return null;

    if (!apiResponse.success) {
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-600 text-xl mr-3 mt-1" />
            <div>
              <p className="font-semibold">No Application Found</p>
              <p className="text-sm mt-1">
                We couldn't locate any application with this information. Please
                verify your details or consider applying now.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Application was found (success: true)
    if (isrejected === true) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm">
          <div className="flex items-start">
            <FaTimesCircle className="text-red-600 text-xl mr-3 mt-1" />
            <div>
              <p className="font-semibold">Application Rejected</p>
              <p className="text-sm mt-1">
                We regret to inform you that your application has been reviewed
                and not selected to proceed further in the hiring process at
                this time.
              </p>
              <p className="text-sm mt-3 font-medium">
                You can apply again after 6 months from the date of your
                application.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (isVerfied === true) {
      return (
        <div className="flex items-start bg-green-50 border border-green-200 rounded-lg p-4">
          <FaCheckCircle className="text-green-600 text-xl mt-1 mr-3" />
          <div>
            <p className="font-semibold text-lg mb-1">Congratulations!</p>
            <p className="mb-2">You have been shortlisted for the interview.</p>
            <p className="mb-1 font-medium">
              Please ensure you report to the following location on the
              scheduled date:
            </p>
            <p className="ml-2 text-sm text-gray-700">
              <strong>Address:</strong> EM‐4/1, Sector‐V, Salt Lake, Kolkata –
              700091
            </p>
            <p className="mt-3 font-medium">Documents to Carry:</p>
            <ul className="list-disc list-inside ml-2 text-sm text-gray-700">
              <li>
                All mark sheets starting from 10th grade up to your most recent
                degree
              </li>
              <li>Updated resume</li>
              <li>Valid passport</li>
            </ul>
          </div>
        </div>
      );
    } else {
      // Default case - application found but neither verified nor rejected
      return (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 text-xl mr-3" />
            <div>
              <p className="font-semibold">Application Found</p>
              <p className="text-sm mt-1">
                You have already applied. Please keep tracking your application,
                if you are shortlisted, you will be notified here.
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
          <FaUser className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Teacher Application Status
        </h2>
        <p className="text-gray-500 mt-2 text-center">
          Check if your application has already been submitted
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className="flex items-center text-gray-700 text-sm font-semibold mb-2"
            htmlFor="name"
          >
            <FaUser className="mr-2 text-blue-600" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition duration-200 ${
              errors.name
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="flex items-center text-red-500 text-xs mt-2">
              <FaExclamationCircle className="mr-1" /> {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            className="flex items-center text-gray-700 text-sm font-semibold mb-2"
            htmlFor="phoneNumber"
          >
            <FaPhone className="mr-2 text-blue-600" />
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition duration-200 ${
              errors.phoneNumber
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="flex items-center text-red-500 text-xs mt-2">
              <FaExclamationCircle className="mr-1" /> {errors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label
            className="flex items-center text-gray-700 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            <FaEnvelope className="mr-2 text-blue-600" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition duration-200 ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <div className="mt-2 text-red-500 text-xs">
              <div className="flex items-start">
                <FaExclamationCircle className="mr-1 mt-1 flex-shrink-0" />
                <div>Email requirements: {errors.email}</div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 disabled:bg-blue-400 shadow-md flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              Checking...
            </>
          ) : (
            "Check Application Status"
          )}
        </button>
      </form>

      {apiResponse && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-3 text-gray-800">
            Status Result
          </h3>
          {renderStatusResult()}
        </div>
      )}

      {/* Looking to apply section - moved to the end as requested */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm">
        <p className="text-gray-700 text-center mb-4">
          Looking to apply for the Teacher role?
          <span className="block font-medium text-blue-700 mt-1">
            Click here to submit your application
          </span>
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleRedirect}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-6 rounded-full text-sm font-medium transition duration-200 shadow-md"
          >
            Apply Now
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
