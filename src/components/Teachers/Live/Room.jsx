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
  const initializingRef = useRef(false);

  // Get user info
  const user = localStorage.getItem("user");
  const buffer = user ? JSON.parse(user) : null;
  const name = buffer?.name;

  // Allowed user verification
  const allowedUsers = ["arnab dhua", "Parbat Bera"];
  const exists = name && allowedUsers.includes(name);

  // Check permissions before initializing
  async function checkPermissions() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      return true;
    } catch (err) {
      console.error("Media permissions error:", err);
      setError(
        "Please allow camera and microphone access to join the meeting."
      );
      return false;
    }
  }

  const initMeeting = async (type) => {
    // Prevent duplicate initialization
    if (initializingRef.current || joined) {
      console.log(
        "Meeting initialization already in progress or already joined"
      );
      return;
    }

    initializingRef.current = true;

    try {
      if (!exists) {
        throw new Error("You are not authorized to join this room.");
      }

      // Check permissions first
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        initializingRef.current = false;
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SECRET,
        roomId,
        Date.now().toString(),
        name
      );

      // Clean up any previous instance
      if (zpRef.current) {
        zpRef.current.destroy();
      }

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      // Add a small delay to ensure devices are ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        maxUsers: type === "one-on-one" ? 2 : 80,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        useFrontFacingCamera: true,
        videoResolutionList: [
          ZegoUIKitPrebuilt.VideoResolution_720P,
          ZegoUIKitPrebuilt.VideoResolution_360P,
          ZegoUIKitPrebuilt.VideoResolution_180P,
        ],
        audioVideoConfig: {
          video: {
            bitrate: 800,
            frameRate: 30,
            codecType: 1,
          },
          audio: {
            bitrate: 48,
            codecType: 1,
          },
        },
        onJoinRoom: () => {
          setJoined(true);
          initializingRef.current = false;
        },
        onLeaveRoom: () => {
          setJoined(false);
          navigate("/teacher/live-class");
        },
        onMicrophoneError: (err) => {
          console.error("Microphone error:", err);
          setError("Microphone error: " + err.message);
          initializingRef.current = false;
        },
        onCameraError: (err) => {
          console.error("Camera error:", err);
          setError("Camera error: " + err.message);
          initializingRef.current = false;
        },
        onError: (err) => {
          console.error("ZegoCloud error:", err);
          setError("Failed to connect to room. Please try again.");
          initializingRef.current = false;
        },
      });
    } catch (err) {
      console.error("Room Initialization Error:", err);
      setError(err.message);
      initializingRef.current = false;
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");

    // Only set call type if it's different
    if (type !== callType) {
      setCallType(type);
    }

    // Only initialize if not already joined or initializing
    if (type && exists && !joined && !initializingRef.current) {
      initMeeting(type);
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [location.search, exists, roomId]);

  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }
    setJoined(false);
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
