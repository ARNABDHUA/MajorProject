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
  
  // Attendance tracking state
  const [attendanceData, setAttendanceData] = useState({});
  const attendanceTimeRef = useRef(null);
  const minimumAttendanceTime = 20 * 60 * 1000; // 15 minutes in milliseconds

  // Get user info
  const user = localStorage.getItem("user");
  const buffer = user ? JSON.parse(user) : null;
  const name = buffer?.name;
  const lowerCase_name=name.toLowerCase()

  // Allowed user verification
  const allowedUsers = ["arnab dhua", "parbat nil bera","sourin dhua","farhan akhtar","shreya manna"];
  const exists = name && allowedUsers.includes(lowerCase_name);

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

  // Process attendance data
  const processAttendance = (userName, joinTime, leaveTime) => {
    const attendanceTime = leaveTime - joinTime;
    const success = attendanceTime >= minimumAttendanceTime;
    
    if (success) {
      console.log("Attendance success for:", userName);
      console.log("Attended for:", Math.floor(attendanceTime / 1000), "seconds");
    } else {
      console.log("Attendance failed for:", userName);
      console.log("Attended for only:", Math.floor(attendanceTime / 1000), "seconds");
      console.log("Required time:", minimumAttendanceTime / 1000, "seconds");
    }
    
    return { userName, joinTime, leaveTime, attendanceTime, success };
  };

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
          
          // Start tracking attendance when user joins
          const joinTime = Date.now();
          console.log(`${name} joined at ${new Date(joinTime).toLocaleTimeString()}`);
          
          // Update attendance data with join time
          setAttendanceData(prev => ({
            ...prev,
            [name]: { joinTime, leaveTime: null }
          }));
          
          // Store join time in ref for quick access during cleanup
          attendanceTimeRef.current = joinTime;
        },
        onLeaveRoom: () => {
          // Process attendance data when leaving room
          const leaveTime = Date.now();
          const joinTime = attendanceTimeRef.current;
          
          if (joinTime) {
            const result = processAttendance(name, joinTime, leaveTime);
            
            // Update attendance data with complete record
            setAttendanceData(prev => ({
              ...prev,
              [name]: { 
                joinTime, 
                leaveTime, 
                duration: result.attendanceTime,
                success: result.success 
              }
            }));
            
            // If successful attendance, we can save it
            if (result.success) {
              console.log("SUCCESS");
              // Here you would typically send this to your backend
              // Since backend is not available, we're just logging it
            }
          }
          
          setJoined(false);
          navigate("/teacher/live-class");
        },
        onUserJoin: (users) => {
          // Track when other users join the room
          const joinTime = Date.now();
          users.forEach(user => {
            console.log(`${user.userName} joined at ${new Date(joinTime).toLocaleTimeString()}`);
            setAttendanceData(prev => ({
              ...prev,
              [user.userName]: { joinTime, leaveTime: null }
            }));
          });
        },
        onUserLeave: (users) => {
          // Process attendance when users leave
          const leaveTime = Date.now();
          users.forEach(user => {
            const userData = attendanceData[user.userName];
            if (userData && userData.joinTime) {
              const result = processAttendance(
                user.userName, 
                userData.joinTime, 
                leaveTime
              );
              
              // Update with complete record
              setAttendanceData(prev => ({
                ...prev,
                [user.userName]: { 
                  joinTime: userData.joinTime, 
                  leaveTime, 
                  duration: result.attendanceTime,
                  success: result.success 
                }
              }));
              
              // If successful attendance, we can save it
              if (result.success) {
                console.log(`SUCCESS for ${user.userName}`);
                // Here you would typically send this to your backend
              }
            }
          });
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
      // If user closes the tab or navigates away without proper leaving
      if (joined && attendanceTimeRef.current) {
        const leaveTime = Date.now();
        const joinTime = attendanceTimeRef.current;
        const result = processAttendance(name, joinTime, leaveTime);
        
        // If successful attendance even on abrupt exit
        if (result.success) {
          console.log("SUCCESS");
        }
      }
      
      if (zpRef.current) {
        zpRef.current.destroy();
        zpRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [location.search, exists, roomId]);

  // Add an effect for debugging and demonstration purposes
  useEffect(() => {
    if (joined) {
      // Log current attendance status every 30 seconds
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const joinTime = attendanceTimeRef.current;
        if (joinTime) {
          const elapsedTime = currentTime - joinTime;
          // console.log(`Current session time: ${Math.floor(elapsedTime / 1000)} seconds`);
          
          // If we've reached the minimum time, log success
          if (elapsedTime >= minimumAttendanceTime && !attendanceData[name]?.success) {
            console.log("SUCCESS - Minimum attendance requirement met!");
            setAttendanceData(prev => ({
              ...prev,
              [name]: { 
                ...prev[name],
                success: true 
              }
            }));
          }
        }
      }, 1000); // Every 10 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [joined, name]);

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
      
      {/* Attendance information panel for teachers/admins */}
      {joined && Object.keys(attendanceData).length > 0 && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded max-w-sm">
          <h3 className="font-bold mb-1">Live Attendance:</h3>
          <ul className="text-sm">
            {Object.entries(attendanceData).map(([userName, data]) => {
              const duration = data.leaveTime 
                ? (data.leaveTime - data.joinTime) / 1000
                : (Date.now() - data.joinTime) / 1000;
              
              return (
                <li key={userName} className="flex justify-between items-center mb-1">
                  <span>{userName}</span>
                  <span className={`px-2 py-1  rounded text-xs ${data.success ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {Math.floor(duration)}s {data.success ? '✓' : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Room;
