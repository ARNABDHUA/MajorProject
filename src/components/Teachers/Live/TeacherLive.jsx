import React, { useState, useEffect } from "react";
import { FiVideo, FiRefreshCw, FiUsers, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Teacherlive = () => {
  const [roomCode, setRoomCode] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
  ];

  useEffect(() => {
    // Load user name from localStorage if available
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (savedUser.name) {
      setUserName(savedUser.name);
      setIsLoggedIn(true); // Set logged in status to true if name exists
    }
  }, []);

  const generateRoomCode = () => {
    if (!selectedSubject) {
      setErrors((prev) => ({
        ...prev,
        subject: "Please select a subject first",
      }));
      return null;
    }

    const prefix = selectedSubject.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    setErrors((prev) => ({ ...prev, subject: "" }));

    if (subject) {
      const newCode = generateRoomCode();
      if (newCode) setRoomCode(newCode);
    } else {
      setRoomCode("");
    }
  };

  const handleGenerateNewCode = () => {
    const newCode = generateRoomCode();
    if (newCode) setRoomCode(newCode);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!selectedSubject) {
      newErrors.subject = "Please select a subject";
    }

    if (!roomCode) {
      newErrors.roomCode = "Room code is required";
    }

    if (!userName.trim()) {
      newErrors.userName = "Please enter your name";
    } else if (userName.trim().length < 2) {
      newErrors.userName = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartClass = (type) => {
    if (!validateInputs()) {
      return;
    }

    try {
      // Store user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: userName.trim(),
          subject: selectedSubject,
          roomCode: roomCode,
          type: type,
          timestamp: Date.now(),
        })
      );

      // Create the full URL with the absolute path to ensure it opens correctly
      // Use the current origin of the website to create an absolute URL
      const baseUrl = window.location.origin;
      const roomUrl = `${baseUrl}/room/${roomCode}?type=${type}&subject=${encodeURIComponent(
        selectedSubject
      )}&name=${encodeURIComponent(userName.trim())}`;

      // Open in new tab with the full URL
      window.open(roomUrl, "_blank", "noopener,noreferrer");

      // Reset form except name
      setRoomCode("");
      setSelectedSubject("");
      setErrors({});
    } catch (error) {
      console.error("Error starting class:", error);
      alert("Failed to start class. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Start Live Class</h1>
        <p className="text-gray-600">Create a virtual classroom session</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Select Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="roomCode"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Room Code
            </label>
            <div className="flex gap-2">
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                readOnly
                className={`flex-1 p-2 bg-gray-50 border rounded-md ${
                  errors.roomCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Select subject to generate code"
              />
              <button
                onClick={handleGenerateNewCode}
                disabled={!selectedSubject}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                title="Generate new code"
                aria-label="Generate new room code"
              >
                <FiRefreshCw className="w-5 h-5" />
              </button>
            </div>
            {errors.roomCode && (
              <p className="mt-1 text-sm text-red-500">{errors.roomCode}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Your Name
            </label>
            {isLoggedIn ? (
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md">
                {userName}
              </div>
            ) : (
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, userName: "" }));
                  }
                }}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.userName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your name"
                maxLength={50}
              />
            )}
            {errors.userName && (
              <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
            )}
          </div>

          <div className="pt-2 pb-2">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-md flex items-start">
              <FiInfo className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                Starting a class will create a new room. Share the room code
                with others to let them join.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleStartClass("one-on-one")}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <FiVideo className="w-5 h-5" />
              One-on-One Class
            </button>

            <button
              onClick={() => handleStartClass("group-call")}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <FiUsers className="w-5 h-5" />
              Group Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacherlive;
