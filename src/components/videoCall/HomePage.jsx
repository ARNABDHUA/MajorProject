import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString().slice(-4); // Fixed slice to get last 4 digits
    setRoomId(randomId + timestamp);
  };

  const handleOneAndOneCall = () => {
    if (!roomId) {
      alert("Please Generate Room Id First");
      return;
    }
    const absoluteUrl = `${window.location.origin}/room/${roomId}?type=one-on-one`;
    window.open(absoluteUrl);
    // navigate(`room/${roomId}?type=one-on-one`);
  };

  const handleGroupCall = () => {
    if (!roomId) {
      alert("Please Generate Room Id First");
      return;
    }
    const Url = `room/${roomId}?type=group-call`;
    window.open(Url);
    // navigate(`room/${roomId}?type=group-call`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-300 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Welcome to Video Calling App
        </h1>
        <p className="text-gray-600">
          Start a video call with a randomly generated Room ID.
        </p>

        {/* Room ID Input & Generate Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Generated Room ID"
            value={roomId}
            readOnly
          />
          <button
            onClick={handleRoomIdGenerate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Generate
          </button>
        </div>

        {/* Call Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleOneAndOneCall}
            disabled={!roomId}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              roomId
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            One-on-One Call
          </button>
          <button
            onClick={handleGroupCall}
            disabled={!roomId}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              roomId
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Group Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
