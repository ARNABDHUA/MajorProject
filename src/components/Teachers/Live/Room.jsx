// import React, { useRef, useState, useEffect } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { APP_ID, SECRET } from "./CallConfig.js";
// import { ChatState } from "../../../context/ChatProvider";
// import axios from "axios";

// function Room() {
//   const { roomId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const zpRef = useRef(null);
//   const videoContainerRef = useRef(null);
//   const [joined, setJoined] = useState(false);
//   const [callType, setCallType] = useState("");
//   const [error, setError] = useState(null);
//   const initializingRef = useRef(false);
//   const [userData, setUserData] = useState([]);
//   const [acc, setAcc] = useState(null);
//   const [mediaDevicesReady, setMediaDevicesReady] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 3;

//   //context api call
//   const {
//     attendance_id,
//     setAttendance_id,
//     teacherAttandance,
//     setTeacherAttandance,
//   } = ChatState();
  
//   // Attendance tracking state
//   const [attendanceData, setAttendanceData] = useState({});
//   const attendanceTimeRef = useRef(null);
//   const minimumAttendanceTime = 1 * 60 * 1000; // 1 minute in milliseconds

//   // Room expiration state
//   const [roomExpired, setRoomExpired] = useState(false);
//   const [timeUntilExpiration, setTimeUntilExpiration] = useState(null);
//   const maxRoomLifetime = 75 * 60 * 1000; // 1 hour and 15 minutes in milliseconds

//   // Get user info
//   const user = localStorage.getItem("user");
//   const buffer = user ? JSON.parse(user) : null;
//   const name = buffer?.name;
//   const lowerCase_name = name ? name.toLowerCase() : "";

//   // Enhanced media device checking with retry mechanism
//   async function checkAndReleaseExistingStreams() {
//     try {
//       // Try to enumerate and release any existing streams
//       const existingStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true
//       }).catch(() => null);
      
//       if (existingStream) {
//         existingStream.getTracks().forEach(track => {
//           track.stop();
//         });
//         // Wait for tracks to be fully released
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     } catch (error) {
//       console.log("No existing streams to release");
//     }
//   }

//   async function checkPermissions() {
//     try {
//       // First release any existing streams
//       await checkAndReleaseExistingStreams();
      
//       // Wait a bit more for device to be fully available
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       // Check device availability
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const videoDevices = devices.filter(device => device.kind === 'videoinput');
//       const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
//       if (videoDevices.length === 0) {
//         throw new Error("No camera found. Please connect a camera device.");
//       }
      
//       if (audioDevices.length === 0) {
//         throw new Error("No microphone found. Please connect a microphone device.");
//       }

//       // Use more conservative constraints initially
//       const constraints = {
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//           deviceId: audioDevices[0].deviceId ? { exact: audioDevices[0].deviceId } : undefined
//         },
//         video: {
//           width: { ideal: 640, max: 1280 },
//           height: { ideal: 480, max: 720 },
//           frameRate: { ideal: 15, max: 30 },
//           deviceId: videoDevices[0].deviceId ? { exact: videoDevices[0].deviceId } : undefined
//         }
//       };

//       // Test media access
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
//       // Verify tracks are working
//       const videoTracks = stream.getVideoTracks();
//       const audioTracks = stream.getAudioTracks();
      
//       if (videoTracks.length === 0 || audioTracks.length === 0) {
//         stream.getTracks().forEach(track => track.stop());
//         throw new Error("Failed to access media devices");
//       }

//       // Check track states
//       const videoTrack = videoTracks[0];
//       const audioTrack = audioTracks[0];
      
//       // Wait for tracks to be ready
//       let attempts = 0;
//       while ((videoTrack.readyState !== 'live' || audioTrack.readyState !== 'live') && attempts < 10) {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         attempts++;
//       }
      
//       if (videoTrack.readyState !== 'live' || audioTrack.readyState !== 'live') {
//         stream.getTracks().forEach(track => track.stop());
//         throw new Error("Media devices are not ready. Please check if they're being used by another application.");
//       }

//       // Test the stream briefly
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Clean up test stream
//       stream.getTracks().forEach(track => track.stop());
      
//       // Wait for cleanup
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       setMediaDevicesReady(true);
//       setRetryCount(0);
//       return true;
      
//     } catch (err) {
//       console.error("Media permissions error:", err);
//       setMediaDevicesReady(false);
      
//       // Provide specific error messages
//       if (err.name === 'NotFoundError' || err.message.includes('No camera') || err.message.includes('No microphone')) {
//         setError("Camera or microphone not found. Please check your device connections and refresh the page.");
//       } else if (err.name === 'NotAllowedError') {
//         setError("Please allow camera and microphone access to join the meeting. Check your browser permissions.");
//       } else if (err.name === 'NotReadableError' || err.message.includes('not ready') || err.message.includes('another application')) {
//         setError("Camera or microphone is already in use. Please close other applications using these devices and try again.");
//       } else if (err.name === 'OverconstrainedError') {
//         setError("Your camera or microphone doesn't support the required settings. Please try with different device settings.");
//       } else {
//         setError(`Media device error: ${err.message}`);
//       }
//       return false;
//     }
//   }

//   // Initialize media devices with retry logic
//   async function initializeMediaDevices() {
//     if (retryCount >= maxRetries) {
//       setError("Failed to initialize media devices after multiple attempts. Please refresh the page and try again.");
//       return false;
//     }

//     try {
//       setRetryCount(prev => prev + 1);
      
//       // Wait for page to be fully loaded
//       if (document.readyState !== 'complete') {
//         await new Promise(resolve => {
//           if (document.readyState === 'complete') {
//             resolve();
//           } else {
//             const handler = () => {
//               document.removeEventListener('readystatechange', handler);
//               resolve();
//             };
//             document.addEventListener('readystatechange', handler);
//           }
//         });
//       }
      
//       // Additional wait for device enumeration
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       return await checkPermissions();
      
//     } catch (error) {
//       console.error("Device initialization error:", error);
      
//       if (retryCount < maxRetries) {
//         console.log(`Retrying device initialization... (${retryCount + 1}/${maxRetries})`);
//         setTimeout(() => initializeMediaDevices(), 2000);
//         return false;
//       } else {
//         setError("Failed to initialize media devices. Please refresh the page and ensure no other applications are using your camera or microphone.");
//         return false;
//       }
//     }
//   }

//   useEffect(() => {
//     const teacherAttandanceId = localStorage.getItem("teacherAtten");
//     setAttendance_id(teacherAttandanceId);
//     const userDetails = JSON.parse(localStorage.getItem("user"));
//     setUserData(userDetails);
//     setAcc(userDetails.c_roll);
    
//     // Initialize media devices early with delay
//     setTimeout(() => {
//       initializeMediaDevices();
//     }, 1000);
//   }, []);

//   // Process attendance data
//   const processAttendance = (userName, joinTime, leaveTime) => {
//     const attendanceTime = leaveTime - joinTime;
//     const success = attendanceTime >= minimumAttendanceTime;

//     if (success) {
//       console.log("Attendance success for:", userName);
//       console.log("Attended for:", Math.floor(attendanceTime / 1000), "seconds");
//     } else {
//       console.log("Attendance failed for:", userName);
//       console.log("Attended for only:", Math.floor(attendanceTime / 1000), "seconds");
//       console.log("Required time:", minimumAttendanceTime / 1000, "seconds");
//     }

//     return { userName, joinTime, leaveTime, attendanceTime, success };
//   };

//   const exists = acc !== null && acc !== undefined;

//   // Check if the room URL has expired
//   const checkRoomExpiration = () => {
//     const query = new URLSearchParams(location.search);
//     let creationTime = parseInt(query.get("created"));

//     if (!creationTime) {
//       const storedTime = localStorage.getItem(`room_${roomId}_created`);
//       creationTime = storedTime ? parseInt(storedTime) : null;
//     }

//     if (!creationTime) {
//       creationTime = Date.now();
//       localStorage.setItem(`room_${roomId}_created`, creationTime.toString());
//       const newUrl = new URL(window.location.href);
//       newUrl.searchParams.set("created", creationTime.toString());
//       window.history.replaceState({}, "", newUrl);
//     }

//     const currentTime = Date.now();
//     const timeElapsed = currentTime - creationTime;
//     const timeLeft = maxRoomLifetime - timeElapsed;

//     if (timeLeft <= 0) {
//       setRoomExpired(true);
//       return { expired: true, timeLeft: 0, creationTime };
//     }

//     return { expired: false, timeLeft, creationTime };
//   };

//   const initMeeting = async (type) => {
//     if (initializingRef.current || joined) {
//       console.log("Meeting initialization already in progress or already joined");
//       return;
//     }

//     initializingRef.current = true;

//     try {
//       if (!exists) {
//         throw new Error("You are not authorized to join this room.");
//       }

//       const { expired } = checkRoomExpiration();
//       if (expired) {
//         throw new Error("This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached.");
//       }

//       if (!mediaDevicesReady) {
//         const hasPermissions = await initializeMediaDevices();
//         if (!hasPermissions) {
//           initializingRef.current = false;
//           return;
//         }
//       }

//       // Release any existing streams before creating new ones
//       await checkAndReleaseExistingStreams();

//       const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//         APP_ID,
//         SECRET,
//         roomId,
//         Date.now().toString(),
//         name
//       );

//       // Clean up any previous instance
//       if (zpRef.current) {
//         try {
//           zpRef.current.destroy();
//         } catch (e) {
//           console.log("Error destroying previous instance:", e);
//         }
//         zpRef.current = null;
//       }

//       // Wait for cleanup to complete
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       const zp = ZegoUIKitPrebuilt.create(kitToken);
//       zpRef.current = zp;

//       // Additional wait for everything to be ready
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       await zp.joinRoom({
//         container: videoContainerRef.current,
//         scenario: {
//           mode: type === "one-on-one" 
//             ? ZegoUIKitPrebuilt.OneONoneCall 
//             : ZegoUIKitPrebuilt.GroupCall,
//         },
//         showPreJoinView: false,
//         showScreenSharingButton: true,
//         showUserList: true,
//         showRoomTimer: true,
//         showLayoutButton: true,
//         showNonVideoUser: true,
//         showMicrophoneStateButton: true,
//         showCameraStateButton: true,
//         showAudioVideoSettingsButton: true,
//         maxUsers: type === "one-on-one" ? 2 : 800,
//         turnOnMicrophoneWhenJoining: true,
//         turnOnCameraWhenJoining: true,
//         useFrontFacingCamera: true,
//         videoResolutionList: [
//           ZegoUIKitPrebuilt.VideoResolution_360P,
//           ZegoUIKitPrebuilt.VideoResolution_180P,
//           ZegoUIKitPrebuilt.VideoResolution_720P,
//         ],
//         // More conservative settings to avoid device conflicts
//         audioVideoConfig: {
//           video: {
//             bitrate: 800,
//             frameRate: 15,
//             codecType: 1,
//           },
//           audio: {
//             bitrate: 48,
//             codecType: 1,
//           },
//         },
//         onJoinRoom: () => {
//           setJoined(true);
//           initializingRef.current = false;

//           const joinTime = Date.now();
//           console.log(`${name} joined at ${new Date(joinTime).toLocaleTimeString()}`);

//           setAttendanceData(prev => ({
//             ...prev,
//             [name]: { joinTime, leaveTime: null },
//           }));

//           attendanceTimeRef.current = joinTime;
//         },
//         onLeaveRoom: () => {
//           const leaveTime = Date.now();
//           const joinTime = attendanceTimeRef.current;

//           if (joinTime) {
//             const result = processAttendance(name, joinTime, leaveTime);
//             setAttendanceData(prev => ({
//               ...prev,
//               [name]: {
//                 joinTime,
//                 leaveTime,
//                 duration: result.attendanceTime,
//                 success: result.success,
//               },
//             }));

//             if (result.success) {
//               console.log("SUCCESS");
//             }
//           }

//           setJoined(false);
//           navigate("/");
//         },
//         onUserJoin: (users) => {
//           const joinTime = Date.now();
//           users.forEach(user => {
//             console.log(`${user.userName} joined at ${new Date(joinTime).toLocaleTimeString()}`);
//             setAttendanceData(prev => ({
//               ...prev,
//               [user.userName]: { joinTime, leaveTime: null },
//             }));
//           });
//         },
//         onUserLeave: (users) => {
//           const leaveTime = Date.now();
//           users.forEach(user => {
//             const userData = attendanceData[user.userName];
//             if (userData && userData.joinTime) {
//               const result = processAttendance(user.userName, userData.joinTime, leaveTime);
//               setAttendanceData(prev => ({
//                 ...prev,
//                 [user.userName]: {
//                   joinTime: userData.joinTime,
//                   leaveTime,
//                   duration: result.attendanceTime,
//                   success: result.success,
//                 },
//               }));

//               if (result.success) {
//                 console.log(`SUCCESS for ${user.userName}`);
//               }
//             }
//           });
//         },
//         onMicrophoneError: (err) => {
//           console.error("Microphone error:", err);
//           setError("Microphone error. Please check if it's being used by another application and try again.");
//           initializingRef.current = false;
//         },
//         onCameraError: (err) => {
//           console.error("Camera error:", err);
//           setError("Camera error. Please check if it's being used by another application and try again.");
//           initializingRef.current = false;
//         },
//         onError: (err) => {
//           console.error("ZegoCloud error:", err);
//           if (err.message && err.message.includes('1103065')) {
//             setError("Device access error. Please ensure your camera and microphone are not being used by other applications, then refresh and try again.");
//           } else {
//             setError("Failed to connect to room. Please try again.");
//           }
//           initializingRef.current = false;
//         },
//       });
//     } catch (err) {
//       console.error("Room Initialization Error:", err);
//       setError(err.message);
//       initializingRef.current = false;
//     }
//   };

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const type = query.get("type");

//     if (type !== callType) {
//       setCallType(type);
//     }

//     const { expired, timeLeft } = checkRoomExpiration();
//     setRoomExpired(expired);
//     setTimeUntilExpiration(timeLeft);

//     if (type && exists && !joined && !initializingRef.current && !expired && mediaDevicesReady) {
//       setTimeout(() => {
//         if (!joined && !initializingRef.current) {
//           initMeeting(type);
//         }
//       }, 2000);
//     }

//     return () => {
//       if (joined && attendanceTimeRef.current) {
//         const leaveTime = Date.now();
//         const joinTime = attendanceTimeRef.current;
//         const result = processAttendance(name, joinTime, leaveTime);

//         if (result.success) {
//           console.log("SUCCESS");
//         }
//       }

//       if (zpRef.current) {
//         try {
//           zpRef.current.destroy();
//         } catch (e) {
//           console.log("Error destroying on cleanup:", e);
//         }
//         zpRef.current = null;
//       }
//       initializingRef.current = false;
//     };
//   }, [location.search, exists, roomId, mediaDevicesReady]);

//   // Effect for tracking expiration timer
//   useEffect(() => {
//     if (!roomExpired) {
//       const intervalId = setInterval(() => {
//         const { expired, timeLeft } = checkRoomExpiration();
//         setTimeUntilExpiration(timeLeft);

//         if (expired && !roomExpired) {
//           setRoomExpired(true);
//           alert("This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached.");
//           if (joined && zpRef.current) {
//             handleExit();
//           }
//         }
//       }, 1000);

//       return () => clearInterval(intervalId);
//     }
//   }, [roomExpired, joined]);

//   // Effect for attendance tracking
//   useEffect(() => {
//     if (joined) {
//       const intervalId = setInterval(() => {
//         const currentTime = Date.now();
//         const joinTime = attendanceTimeRef.current;
//         if (joinTime) {
//           const elapsedTime = currentTime - joinTime;

//           if (elapsedTime >= minimumAttendanceTime && !attendanceData[name]?.success) {
//             console.log("SUCCESS - Minimum attendance requirement met!");
//             console.log("Attendance ID:", attendance_id);
            
//             const updateAttendanceRecord = async () => {
//               try {
//                 const response = await axios.post(
//                   `https://e-college-data.onrender.com/v1/teachers/teachers-attendance-end`,
//                   { attendance_id: attendance_id }
//                 );
//                 console.log("Attendance record updated:", response.data);
//                 if (response.data) {
//                   const teacherData = response.data.data.attendance;
//                   localStorage.setItem("teacherAttendanceData", JSON.stringify(teacherData));
//                 }
//               } catch (error) {
//                 console.error("Failed to update attendance record:", error);
//               }
//             };

//             const updateAttendanceRecordStudent = async () => {
//               try {
//                 const userDetails = localStorage.getItem("attendanceid");
//                 console.log("Student attendance_id:", userDetails);
//                 const response = await axios.post(
//                   `https://e-college-data.onrender.com/v1/students/student-attendance-end`,
//                   { attendance_id: userDetails }
//                 );
//                 if (response.data) {
//                   console.log("Student attendance updated");
//                 }
//               } catch (error) {
//                 console.error("Failed to update attendance record:", error);
//               }
//             };

//             if (userData.role === "teacher") updateAttendanceRecord();
//             if (userData.role === "student") updateAttendanceRecordStudent();
            
//             setAttendanceData(prev => ({
//               ...prev,
//               [name]: { ...prev[name], success: true },
//             }));
//           }
//         }
//       }, 60000);

//       return () => clearInterval(intervalId);
//     }
//   }, [joined, name]);

//   const handleExit = () => {
//     if (zpRef.current) {
//       try {
//         zpRef.current.destroy();
//       } catch (e) {
//         console.log("Error destroying on exit:", e);
//       }
//       zpRef.current = null;
//     }
//     setJoined(false);
//     navigate("/");
//   };

//   const handleRetry = async () => {
//     setError(null);
//     setMediaDevicesReady(false);
//     setRetryCount(0);
    
//     // Release any existing streams first
//     await checkAndReleaseExistingStreams();
    
//     setTimeout(() => {
//       initializeMediaDevices();
//     }, 1000);
//   };

//   // Format time remaining for display
//   const formatTimeRemaining = (milliseconds) => {
//     if (milliseconds === null) return "";

//     const totalSeconds = Math.floor(milliseconds / 1000);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;

//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
//     }
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   // Loading screen while media devices are initializing
//   if (!mediaDevicesReady && !error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <h1 className="text-2xl font-bold text-gray-700 mb-2">
//           Initializing Media Devices
//         </h1>
//         <p className="text-lg text-gray-600 mb-2">
//           Please wait while we set up your camera and microphone...
//         </p>
//         {retryCount > 0 && (
//           <p className="text-sm text-gray-500">
//             Attempt {retryCount} of {maxRetries}
//           </p>
//         )}
//       </div>
//     );
//   }

//   // Expired room screen
//   if (roomExpired) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
//         <h1 className="text-3xl font-bold text-red-600 mb-4">Room Expired</h1>
//         <p className="text-lg mb-6">
//           This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached.
//         </p>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Return to Dashboard
//         </button>
//       </div>
//     );
//   }

//   // Unauthorized user screen
//   if (!exists) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
//         <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
//         <p className="text-lg mb-6">You are not authorized to join this room.</p>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Go Back to Home
//         </button>
//       </div>
//     );
//   }

//   // Error screen
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
//         <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
//         <p className="text-lg mb-6 max-w-2xl">{error}</p>
//         <div className="space-y-2">
//           <button
//             onClick={handleRetry}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mr-2"
//           >
//             Retry Connection
//           </button>
//           <button
//             onClick={handleExit}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//         <div className="mt-4 text-sm text-gray-600 max-w-2xl">
//           <p className="font-semibold">Troubleshooting tips:</p>
//           <ul className="list-disc list-inside text-left mt-2 space-y-1">
//             <li>Close other applications using your camera/microphone (Zoom, Teams, etc.)</li>
//             <li>Refresh your browser and allow permissions when prompted</li>
//             <li>Check if your camera/microphone is working in other applications</li>
//             <li>Try using a different browser (Chrome, Firefox, Safari)</li>
//             <li>Restart your device if the problem persists</li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen relative">
//       {!joined && (
//         <>
//           <header className="bg-gray-800 text-white p-4 text-center text-2xl">
//             {callType === "one-on-one" ? "One-on-One Class" : "Group Class"}
//           </header>
//           <button
//             onClick={handleExit}
//             className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition z-10"
//           >
//             Exit Class
//           </button>
//         </>
//       )}
//       <div ref={videoContainerRef} className="flex-1 w-full bg-gray-900" />

//       {/* URL expiration timer */}
//       {timeUntilExpiration !== null && (
//         <div className="absolute top-9 right-18 bg-black bg-opacity-70 text-white p-2 rounded sm:top-4 sm:right-4 z-10">
//           <div className="text-sm font-light sm:font-bold">
//             Room Expires In: {formatTimeRemaining(timeUntilExpiration)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Room;



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
  const [acc, setAcc] = useState(null);
  const [mediaDevicesReady, setMediaDevicesReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

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
  const minimumAttendanceTime = 1 * 60 * 1000; // 1 minute in milliseconds

  // Room expiration state
  const [roomExpired, setRoomExpired] = useState(false);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState(null);
  const maxRoomLifetime = 75 * 60 * 1000; // 1 hour and 15 minutes in milliseconds

  // Get user info
  const user = localStorage.getItem("user");
  const buffer = user ? JSON.parse(user) : null;
  const name = buffer?.name;
  const lowerCase_name = name ? name.toLowerCase() : "";

  // Enhanced media device checking with retry mechanism
  async function checkAndReleaseExistingStreams() {
    try {
      // Try to enumerate and release any existing streams
      const existingStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      }).catch(() => null);
      
      if (existingStream) {
        existingStream.getTracks().forEach(track => {
          track.stop();
        });
        // Wait for tracks to be fully released
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.log("No existing streams to release");
    }
  }

  async function checkPermissions() {
    try {
      // First release any existing streams
      await checkAndReleaseExistingStreams();
      
      // Wait a bit more for device to be fully available
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check device availability
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      if (videoDevices.length === 0) {
        throw new Error("No camera found. Please connect a camera device.");
      }
      
      if (audioDevices.length === 0) {
        throw new Error("No microphone found. Please connect a microphone device.");
      }

      // Use more conservative constraints initially
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          deviceId: audioDevices[0].deviceId ? { exact: audioDevices[0].deviceId } : undefined
        },
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 },
          deviceId: videoDevices[0].deviceId ? { exact: videoDevices[0].deviceId } : undefined
        }
      };

      // Test media access
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Verify tracks are working
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      if (videoTracks.length === 0 || audioTracks.length === 0) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error("Failed to access media devices");
      }

      // Check track states
      const videoTrack = videoTracks[0];
      const audioTrack = audioTracks[0];
      
      // Wait for tracks to be ready
      let attempts = 0;
      while ((videoTrack.readyState !== 'live' || audioTrack.readyState !== 'live') && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (videoTrack.readyState !== 'live' || audioTrack.readyState !== 'live') {
        stream.getTracks().forEach(track => track.stop());
        throw new Error("Media devices are not ready. Please check if they're being used by another application.");
      }

      // Test the stream briefly
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clean up test stream
      stream.getTracks().forEach(track => track.stop());
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMediaDevicesReady(true);
      setRetryCount(0);
      return true;
      
    } catch (err) {
      console.error("Media permissions error:", err);
      setMediaDevicesReady(false);
      
      // Provide specific error messages
      if (err.name === 'NotFoundError' || err.message.includes('No camera') || err.message.includes('No microphone')) {
        setError("Camera or microphone not found. Please check your device connections and refresh the page.");
      } else if (err.name === 'NotAllowedError') {
        setError("Please allow camera and microphone access to join the meeting. Check your browser permissions.");
      } else if (err.name === 'NotReadableError' || err.message.includes('not ready') || err.message.includes('another application')) {
        setError("Camera or microphone is already in use. Please close other applications using these devices and try again.");
      } else if (err.name === 'OverconstrainedError') {
        setError("Your camera or microphone doesn't support the required settings. Please try with different device settings.");
      } else {
        setError(`Media device error: ${err.message}`);
      }
      return false;
    }
  }

  // Initialize media devices with retry logic
  async function initializeMediaDevices() {
    if (retryCount >= maxRetries) {
      setError("Failed to initialize media devices after multiple attempts. Please refresh the page and try again.");
      return false;
    }

    try {
      setRetryCount(prev => prev + 1);
      
      // Wait for page to be fully loaded
      if (document.readyState !== 'complete') {
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            const handler = () => {
              document.removeEventListener('readystatechange', handler);
              resolve();
            };
            document.addEventListener('readystatechange', handler);
          }
        });
      }
      
      // Additional wait for device enumeration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return await checkPermissions();
      
    } catch (error) {
      console.error("Device initialization error:", error);
      
      if (retryCount < maxRetries) {
        console.log(`Retrying device initialization... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => initializeMediaDevices(), 2000);
        return false;
      } else {
        setError("Failed to initialize media devices. Please refresh the page and ensure no other applications are using your camera or microphone.");
        return false;
      }
    }
  }

  useEffect(() => {
    const teacherAttandanceId = localStorage.getItem("teacherAtten");
    setAttendance_id(teacherAttandanceId);
    const userDetails = JSON.parse(localStorage.getItem("user"));
    setUserData(userDetails);
    setAcc(userDetails.c_roll);
    
    // Initialize media devices early with delay
    setTimeout(() => {
      initializeMediaDevices();
    }, 1000);
  }, []);

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

  const exists = acc !== null && acc !== undefined;

  // Check if the room URL has expired
  const checkRoomExpiration = () => {
    const query = new URLSearchParams(location.search);
    let creationTime = parseInt(query.get("created"));

    if (!creationTime) {
      const storedTime = localStorage.getItem(`room_${roomId}_created`);
      creationTime = storedTime ? parseInt(storedTime) : null;
    }

    if (!creationTime) {
      creationTime = Date.now();
      localStorage.setItem(`room_${roomId}_created`, creationTime.toString());
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("created", creationTime.toString());
      window.history.replaceState({}, "", newUrl);
    }

    const currentTime = Date.now();
    const timeElapsed = currentTime - creationTime;
    const timeLeft = maxRoomLifetime - timeElapsed;

    if (timeLeft <= 0) {
      setRoomExpired(true);
      return { expired: true, timeLeft: 0, creationTime };
    }

    return { expired: false, timeLeft, creationTime };
  };

  const initMeeting = async (type) => {
    if (initializingRef.current || joined) {
      console.log("Meeting initialization already in progress or already joined");
      return;
    }

    initializingRef.current = true;

    try {
      if (!exists) {
        throw new Error("You are not authorized to join this room.");
      }

      const { expired } = checkRoomExpiration();
      if (expired) {
        throw new Error("This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached.");
      }

      if (!mediaDevicesReady) {
        const hasPermissions = await initializeMediaDevices();
        if (!hasPermissions) {
          initializingRef.current = false;
          return;
        }
      }

      // Release any existing streams before creating new ones
      await checkAndReleaseExistingStreams();

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SECRET,
        roomId,
        Date.now().toString(),
        name
      );

      // Clean up any previous instance
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (e) {
          console.log("Error destroying previous instance:", e);
        }
        zpRef.current = null;
      }

      // Wait for cleanup to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      // Additional wait for everything to be ready
      await new Promise(resolve => setTimeout(resolve, 1500));

      await zp.joinRoom({
        container: videoContainerRef.current,
        scenario: {
          mode: type === "one-on-one" 
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
        maxUsers: type === "one-on-one" ? 2 : 800,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        useFrontFacingCamera: true,
        videoResolutionList: [
          ZegoUIKitPrebuilt.VideoResolution_360P,
          ZegoUIKitPrebuilt.VideoResolution_180P,
          ZegoUIKitPrebuilt.VideoResolution_720P,
        ],
        // More conservative settings to avoid device conflicts
        audioVideoConfig: {
          video: {
            bitrate: 800,
            frameRate: 15,
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

          const joinTime = Date.now();
          console.log(`${name} joined at ${new Date(joinTime).toLocaleTimeString()}`);

          setAttendanceData(prev => ({
            ...prev,
            [name]: { joinTime, leaveTime: null },
          }));

          attendanceTimeRef.current = joinTime;
        },
        onLeaveRoom: () => {
          const leaveTime = Date.now();
          const joinTime = attendanceTimeRef.current;

          if (joinTime) {
            const result = processAttendance(name, joinTime, leaveTime);
            setAttendanceData(prev => ({
              ...prev,
              [name]: {
                joinTime,
                leaveTime,
                duration: result.attendanceTime,
                success: result.success,
              },
            }));

            if (result.success) {
              console.log("SUCCESS");
            }
          }

          setJoined(false);
          navigate("/");
        },
        onUserJoin: (users) => {
          const joinTime = Date.now();
          users.forEach(user => {
            console.log(`${user.userName} joined at ${new Date(joinTime).toLocaleTimeString()}`);
            setAttendanceData(prev => ({
              ...prev,
              [user.userName]: { joinTime, leaveTime: null },
            }));
          });
        },
        onUserLeave: (users) => {
          const leaveTime = Date.now();
          users.forEach(user => {
            const userData = attendanceData[user.userName];
            if (userData && userData.joinTime) {
              const result = processAttendance(user.userName, userData.joinTime, leaveTime);
              setAttendanceData(prev => ({
                ...prev,
                [user.userName]: {
                  joinTime: userData.joinTime,
                  leaveTime,
                  duration: result.attendanceTime,
                  success: result.success,
                },
              }));

              if (result.success) {
                console.log(`SUCCESS for ${user.userName}`);
              }
            }
          });
        },
        onMicrophoneError: (err) => {
          console.error("Microphone error:", err);
          setError("Microphone error. Please check if it's being used by another application and try again.");
          initializingRef.current = false;
        },
        onCameraError: (err) => {
          console.error("Camera error:", err);
          setError("Camera error. Please check if it's being used by another application and try again.");
          initializingRef.current = false;
        },
        onError: (err) => {
          console.error("ZegoCloud error:", err);
          if (err.message && err.message.includes('1103065')) {
            setError("Device access error. Please ensure your camera and microphone are not being used by other applications, then refresh and try again.");
          } else {
            setError("Failed to connect to room. Please try again.");
          }
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

    if (type !== callType) {
      setCallType(type);
    }

    const { expired, timeLeft } = checkRoomExpiration();
    setRoomExpired(expired);
    setTimeUntilExpiration(timeLeft);

    if (type && exists && !joined && !initializingRef.current && !expired && mediaDevicesReady) {
      setTimeout(() => {
        if (!joined && !initializingRef.current) {
          initMeeting(type);
        }
      }, 2000);
    }

    return () => {
      if (joined && attendanceTimeRef.current) {
        const leaveTime = Date.now();
        const joinTime = attendanceTimeRef.current;
        const result = processAttendance(name, joinTime, leaveTime);

        if (result.success) {
          console.log("SUCCESS");
        }
      }

      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (e) {
          console.log("Error destroying on cleanup:", e);
        }
        zpRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [location.search, exists, roomId, mediaDevicesReady]);

  // Effect for tracking expiration timer
  useEffect(() => {
    if (!roomExpired) {
      const intervalId = setInterval(() => {
        const { expired, timeLeft } = checkRoomExpiration();
        setTimeUntilExpiration(timeLeft);

        if (expired && !roomExpired) {
          setRoomExpired(true);
          alert("This room URL has expired. The maximum session time (1 hour 15 minutes) has been reached.");
          if (joined && zpRef.current) {
            handleExit();
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [roomExpired, joined]);

  // Effect for attendance tracking
  useEffect(() => {
    if (joined) {
      const intervalId = setInterval(() => {
        const currentTime = Date.now();
        const joinTime = attendanceTimeRef.current;
        if (joinTime) {
          const elapsedTime = currentTime - joinTime;

          if (elapsedTime >= minimumAttendanceTime && !attendanceData[name]?.success) {
            console.log("SUCCESS - Minimum attendance requirement met!");
            console.log("Attendance ID:", attendance_id);
            
            const updateAttendanceRecord = async () => {
              try {
                const response = await axios.post(
                  "https://e-college-data.onrender.com/v1/teachers/teachers-attendance-end",
                  { attendance_id: attendance_id }
                );
                console.log("Attendance record updated:", response.data);
                if (response.data) {
                  const teacherData = response.data.data.attendance;
                  localStorage.setItem("teacherAttendanceData", JSON.stringify(teacherData));
                }
              } catch (error) {
                console.error("Failed to update attendance record:", error);
              }
            };

            const updateAttendanceRecordStudent = async () => {
              try {
                const userDetails = localStorage.getItem("attendanceid");
                console.log("Student attendance_id:", userDetails);
                const response = await axios.post(
                  "https://e-college-data.onrender.com/v1/students/student-attendance-end",
                  { attendance_id: userDetails }
                );
                if (response.data) {
                  console.log("Student attendance updated");
                }
              } catch (error) {
                console.error("Failed to update attendance record:", error);
              }
            };

            if (userData.role === "teacher") updateAttendanceRecord();
            if (userData.role === "student") updateAttendanceRecordStudent();
            
            setAttendanceData(prev => ({
              ...prev,
              [name]: { ...prev[name], success: true },
            }));
          }
        }
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [joined, name]);

  const handleExit = () => {
    if (zpRef.current) {
      try {
        zpRef.current.destroy();
      } catch (e) {
        console.log("Error destroying on exit:", e);
      }
      zpRef.current = null;
    }
    setJoined(false);
    navigate("/");
  };

  const handleRetry = async () => {
    setError(null);
    setMediaDevicesReady(false);
    setRetryCount(0);
    
    // Release any existing streams first
    await checkAndReleaseExistingStreams();
    
    setTimeout(() => {
      initializeMediaDevices();
    }, 1000);
  };

  // Format time remaining for display
  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds === null) return "";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // CSS styles as objects instead of JSX
  const floatAnimation = {
    animation: 'float 4s ease-in-out infinite'
  };

  const reverseAnimation = {
    animation: 'reverse 2s linear infinite'
  };

  // Create CSS keyframes in the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) translateX(0px) rotate(0deg); 
          opacity: 0.2;
        }
        25% { 
          transform: translateY(-10px) translateX(5px) rotate(90deg); 
          opacity: 0.5;
        }
        50% { 
          transform: translateY(-20px) translateX(-5px) rotate(180deg); 
          opacity: 0.8;
        }
        75% { 
          transform: translateY(-10px) translateX(10px) rotate(270deg); 
          opacity: 0.5;
        }
      }
      
      @keyframes reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      
      .animate-float {
        animation: float linear infinite;
      }
      
      .animate-reverse {
        animation: reverse linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Loading screen while media devices are initializing
  if (!mediaDevicesReady && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          {/* Enhanced loading spinner */}
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-transparent rounded-full animate-spin border-t-cyan-400 border-r-purple-400"></div>
            <div className="absolute inset-2 w-20 h-20 border-4 border-transparent rounded-full animate-spin animate-reverse border-t-blue-400 border-l-pink-400"></div>
            <div className="absolute inset-4 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-t-violet-400 border-r-indigo-400"></div>
          </div>

          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Initializing Media
            </h1>
            <p className="text-lg text-white/80 mb-4 leading-relaxed">
              Setting up your camera and microphone for an optimal experience...
            </p>
            {retryCount > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-orange-200">
                  Attempt {retryCount} of {maxRetries}
                </span>
              </div>
            )}
          </div>

          {/* Progress indicators */}
          <div className="mt-8 flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Expired room screen
  if (roomExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 relative overflow-hidden">
        {/* Animated warning elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          {/* Warning icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 w-24 h-24 bg-red-500/30 rounded-full animate-ping"></div>
          </div>

          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Session Expired
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              This room URL has expired. The maximum session time of <span className="font-semibold text-pink-300">1 hour 15 minutes</span> has been reached.
            </p>
            <button
              onClick={() => navigate("/")}
              className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
        {/* Animated error elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          {/* Error icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-6">
              Connection Error
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
              <button
                onClick={() => navigate("/")}
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authorization error screen
  if (!exists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          {/* Lock icon */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Glass morphism card */}
          <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 via-slate-500 to-gray-600 bg-clip-text text-transparent mb-6">
              Access Denied
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              You are not authorized to join this room. Please check your credentials and try again.
            </p>
            <button
              onClick={() => navigate("/")}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main room interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative">
      {/* Time remaining indicator */}
      {timeUntilExpiration !== null && timeUntilExpiration > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">
                Time remaining: {formatTimeRemaining(timeUntilExpiration)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Exit button */}
      {joined && (
        <div className="fixed top-4 left-4 z-50">
          {/* <button
            onClick={handleExit}
            className="group backdrop-blur-xl bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-full border border-red-400/30 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-300 group-hover:text-red-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm text-red-300 group-hover:text-red-200 transition-colors">
                Leave Room
              </span>
            </div>
          </button> */}
        </div>
      )}

      {/* Attendance status indicator */}
      {joined && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 px-4 py-2 rounded-full border border-white/20 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                attendanceData[name]?.success ? 'bg-yellow-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm text-white/80">
                {/* {attendanceData[name]?.success ? 'Attendance Recorded' : 'Recording Attendance...'} */}
                Recording Attendance...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Video container */}
      <div 
        ref={videoContainerRef}
        className="w-full h-screen"
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          minHeight: '100vh'
        }}
      />

      {/* Joining overlay */}
      {!joined && !error && mediaDevicesReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl text-center max-w-md w-full mx-4">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Joining Room</h2>
            <p className="text-white/70 mb-4">
              Connecting to room: <span className="font-mono text-blue-300">{roomId}</span>
            </p>
            <p className="text-white/70 text-sm">
              Call type: <span className="font-semibold text-purple-300 capitalize">{callType}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;