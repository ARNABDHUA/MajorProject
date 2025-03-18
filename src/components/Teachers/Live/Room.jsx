import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SECRET } from "./CallConfig.js";

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [callType, setCallType] = useState("");
  const [error, setError] = useState(null);

  // Get user info
  const user = localStorage.getItem("user");
  const buffer = user ? JSON.parse(user) : null;
  const name = buffer?.name;

  // Allowed user verification
  const allowedUsers = ["arnab dhua", "Parbat Bera"];
  const exists = name && allowedUsers.includes(name);

  const initMeeting = async (type) => {
    try {
      if (!exists) {
        throw new Error("You are not authorized to join this room.");
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SECRET,
        roomId,
        Date.now().toString(),
        name
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      await zp.joinRoom({
        container: videoContainerRef.current,
        scenario: {
          mode:
            type === "one-on-one"
              ? ZegoUIKitPrebuilt.OneONoneCall
              : ZegoUIKitPrebuilt.GroupCall,
        },
        showPreJoinView: false,
        showScreenSharingButton: true,
        showUserList: true,
        showRoomTimer: true,
        showLayoutButton: true,
        showNonVideoUser: true,
        showMicrophoneStateButton: true,
        showCameraStateButton: true,
        showAudioVideoSettingsButton: true,
        maxUsers: type === "one-on-one" ? 2 : 10,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        onJoinRoom: () => setJoined(true),
        onLeaveRoom: () => navigate("/teacher/live-class"),
        onError: (err) => {
          console.error("ZegoCloud error:", err);
          setError("Failed to connect to room. Please try again.");
        },
      });
    } catch (err) {
      console.error("Room Initialization Error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");

    setCallType(type);

    if (type && exists) {
      initMeeting(type);
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [callType, exists, roomId, navigate]);

  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
    }
    navigate("/teacher/live-class");
  };

  // Unauthorized user screen
  if (!exists) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-lg mb-6">
          You are not authorized to join this room.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen relative">
      {!joined && (
        <>
          <header className="bg-gray-800 text-white p-4 text-center text-2xl">
            {callType === "one-on-one" ? "One-on-One Class" : "Group Class"}
          </header>
          <button
            onClick={handleExit}
            className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
          >
            Exit Class
          </button>
        </>
      )}
      <div ref={videoContainerRef} className="flex-1 w-full bg-gray-900" />
    </div>
  );
}

export default Room;
