import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { APP_ID, SECRET } from "./CallConfig.js";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";

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
  const [userData, setUserData] = useState([]);
  const [acc,setAcc]=useState(null);

  //context api call
  const {
    attendance_id,
    setAttendance_id,
    teacherAttandance,
    setTeacherAttandance,
  } = ChatState();
  // Attendance tracking state
  const [attendanceData, setAttendanceData] = useState({});
  const attendanceTimeRef = useRef(null);
  const minimumAttendanceTime = 10 * 60 * 1000; // 20 minutes in milliseconds

  // Room expiration state
  const [roomExpired, setRoomExpired] = useState(false);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState(null);
  const maxRoomLifetime = 75 * 60 * 1000; // 1 hour and 15 minutes in milliseconds

  // Get user info
  const user = localStorage.getItem("user");
  const buffer = user ? JSON.parse(user) : null;
  const name = buffer?.name;
  const lowerCase_name = name ? name.toLowerCase() : "";

  // Allowed user verification
  // const allowedUsers = [
  //   "arnab dhua",
  //   "parbat nil bera",
  //   "sourin dhua",
  //   "farhan akhtar",
  //   "shreya manna",
  //   "teacher x",
  //   "teacher y",
  // ];
  // const exists = name && allowedUsers.includes(lowerCase_name);

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
  useEffect(() => {
    const teacherAttandanceId = localStorage.getItem("teacherAtten");
    setAttendance_id(teacherAttandanceId);
    const userDetails = JSON.parse(localStorage.getItem("user"));
    setUserData(userDetails);
    setAcc(userDetails.c_roll)// add
  }, []);

  // Process attendance data
  const processAttendance = (userName, joinTime, leaveTime) => {
    const attendanceTime = leaveTime - joinTime;
    const success = attendanceTime >= minimumAttendanceTime;

    if (success) {
      console.log("Attendance success for:", userName);
      console.log(
        "Attended for:",
        Math.floor(attendanceTime / 1000),
        "seconds"
      );
    } else {
      console.log("Attendance failed for:", userName);
      console.log(
        "Attended for only:",
        Math.floor(attendanceTime / 1000),
        "seconds"
      );
      console.log("Required time:", minimumAttendanceTime / 1000, "seconds");
    }

    return { userName, joinTime, leaveTime, attendanceTime, success };
  };

  const exists =acc;// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadddddd
  // Check if the room URL has expired
  const checkRoomExpiration = () => {
    // Extract creation timestamp from URL or use localStorage
    const query = new URLSearchParams(location.search);
    let creationTime = parseInt(query.get("created"));

    // If not in URL, try to get from localStorage
    if (!creationTime) {
      const storedTime = localStorage.getItem(`room_${roomId}_created`);
      creationTime = storedTime ? parseInt(storedTime) : null;
    }

    // If still no creation time, this might be a first visit, set it now
    if (!creationTime) {
      creationTime = Date.now();
      // Store in localStorage for future reference
      localStorage.setItem(`room_${roomId}_created`, creationTime.toString());

      // Add to URL for sharing with consistent expiration
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("created", creationTime.toString());
      window.history.replaceState({}, "", newUrl);
    }

    // Calculate time passed since creation
    const currentTime = Date.now();
    const timeElapsed = currentTime - creationTime;
    const timeLeft = maxRoomLifetime - timeElapsed;

    // Check if room has expired
    if (timeLeft <= 0) {
      setRoomExpired(true);
      return { expired: true, timeLeft: 0, creationTime };
    }

    return { expired: false, timeLeft, creationTime };
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

      // Check if room has expired
      const { expired } = checkRoomExpiration();
      if (expired) {
        throw new Error(
          "This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached."
        );
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
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
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
          console.log(
            `${name} joined at ${new Date(joinTime).toLocaleTimeString()}`
          );

          // Update attendance data with join time
          setAttendanceData((prev) => ({
            ...prev,
            [name]: { joinTime, leaveTime: null },
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
            setAttendanceData((prev) => ({
              ...prev,
              [name]: {
                joinTime,
                leaveTime,
                duration: result.attendanceTime,
                success: result.success,
              },
            }));

            // If successful attendance, we can save it
            if (result.success) {
              console.log("SUCCESS");
              // Here you would typically send this to your backend
              // Since backend is not available, we're just logging it
            }
          }

          setJoined(false);
          navigate("/");
        },
        onUserJoin: (users) => {
          // Track when other users join the room
          const joinTime = Date.now();
          users.forEach((user) => {
            console.log(
              `${user.userName} joined at ${new Date(
                joinTime
              ).toLocaleTimeString()}`
            );
            setAttendanceData((prev) => ({
              ...prev,
              [user.userName]: { joinTime, leaveTime: null },
            }));
          });
        },
        onUserLeave: (users) => {
          // Process attendance when users leave
          const leaveTime = Date.now();
          users.forEach((user) => {
            const userData = attendanceData[user.userName];
            if (userData && userData.joinTime) {
              const result = processAttendance(
                user.userName,
                userData.joinTime,
                leaveTime
              );

              // Update with complete record
              setAttendanceData((prev) => ({
                ...prev,
                [user.userName]: {
                  joinTime: userData.joinTime,
                  leaveTime,
                  duration: result.attendanceTime,
                  success: result.success,
                },
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

    // Check room expiration first
    const { expired, timeLeft } = checkRoomExpiration();
    setRoomExpired(expired);
    setTimeUntilExpiration(timeLeft);

    // Only initialize if room is valid and not expired
    if (type && exists && !joined && !initializingRef.current && !expired) {
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

  // Effect for tracking expiration timer
  useEffect(() => {
    // Only run timer if not expired yet
    if (!roomExpired) {
      const intervalId = setInterval(() => {
        const { expired, timeLeft } = checkRoomExpiration();

        setTimeUntilExpiration(timeLeft);

        // If newly expired, handle room termination
        if (expired && !roomExpired) {
          setRoomExpired(true);

          // Alert users that the room has expired
          alert(
            "This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached."
          );

          // Exit the room if joined
          if (joined && zpRef.current) {
            handleExit();
          }
        }
      }, 1000); // Check every second

      return () => clearInterval(intervalId);
    }
  }, [roomExpired, joined]);

  // Effect for attendance tracking
  useEffect(() => {
    if (joined) {
      // Log current attendance status every second
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const joinTime = attendanceTimeRef.current;
        if (joinTime) {
          const elapsedTime = currentTime - joinTime;

          // If we've reached the minimum time, log success
          if (
            elapsedTime >= minimumAttendanceTime &&
            !attendanceData[name]?.success
          ) {
            console.log("SUCCESS - Minimum attendance requirement met!");
            console.log("Arnab ", attendance_id);
            const updateAttendanceRecord = async () => {
              try {
                const response = await axios.post(
                  `https://e-college-data.onrender.com/v1/teachers/teachers-attendance-end`,
                  {
                    attendance_id: attendance_id,
                  }
                );
                console.log("Attendance record updated:", response.data);
                if (response.data) {
                  const teacherData = response.data.data.attendance;
                  localStorage.setItem(
                    "teacherAttendanceData",
                    JSON.stringify(teacherData)
                  );
                  // console.log(
                  //   "Attendance details:",
                  //   response.data.data.attendance
                  // );
                }
              } catch (error) {
                console.error("Failed to update attendance record:", error);
              }
            };

            const updateAttendanceRecordstudent= async()=>{

              try {
                const userDetails = JSON.parse(localStorage.getItem("attendanceid"));
                const response = await axios.post(
                  `https://e-college-data.onrender.com/v1/students/student-attendance-end`,
                  {
                    attendance_id: userDetails,
                  }
                );
                // console.log("Attendance record updated:", response.data);
                if (response.data) {
                  console.log(" Student attendance")
                }
              } catch (error) {
                console.error("Failed to update attendance record:", error);
              }
            }

            // Call the async function
            if (userData.role === "teacher") updateAttendanceRecord();
            if (userData.role==="student") updateAttendanceRecordstudent();
            setAttendanceData((prev) => ({
              ...prev,
              [name]: {
                ...prev[name],
                success: true,
              },
            }));
          }
        }
      }, 60000); // Every second

      return () => clearInterval(intervalId);
    }
  }, [joined, name]);

  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }
    setJoined(false);
    navigate("/");
  };

  // Format time remaining for display
  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds === null) return "";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Expired room screen
  if (roomExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Room Expired</h1>
        <p className="text-lg mb-6">
          This room URL has expired. The maximum session time (1 hour 15
          minutes) has been reached.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

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

      {/* URL expiration timer */}
      {timeUntilExpiration !== null && (
        <div className="absolute top-9 right-18 bg-black bg-opacity-70 text-white p-2 rounded sm:top-4 sm:right-4">
          <div className="text-sm font-light sm:font-bold ">
            Room Expires In: {formatTimeRemaining(timeUntilExpiration)}
          </div>
          <div className="text-xs mt-1"></div>
        </div>
      )}

      {/* Attendance information panel for teachers/admins */}
    </div>
  );
}

export default Room;
