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
  const user = localStorage.getItem("user");
  const buffer = JSON.parse(user);
  const name = buffer.name;
  const namedata = ["arnab dhua", "Parbat Bera"];
  const exists = namedata.includes(name);
  console.log(buffer.name);

  const myMeeting = (type) => {
    const appID = APP_ID;
    const serverSecret = SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      name
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: videoContainerRef.current,
      showPreJoinView: false,
      // sharedLinks: [
      //   {
      //     name: "Video Call Link",
      //     url:
      //       window.location.protocol +
      //       "//" +
      //       window.location.host +
      //       window.location.pathname +
      //       "?type=" +
      //       encodeURIComponent(type),
      //   },
      // ],

      scenario: {
        mode:
          type === "one-on-one"
            ? ZegoUIKitPrebuilt.OneONoneCall
            : ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: type === "one-on-one" ? 2 : 10,
      onJoinRoom: () => {
        setJoined(true);
      },
      onLeaveRoom: () => {
        navigate("/");
      },
    });
    const linkData = {
      name: "Video Call Link",
      url:
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?type=" +
        encodeURIComponent(type),
    };
    // console.log(linkData.url);
    localStorage.setItem("link", linkData);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");

    setCallType(type);
  }, [location.search]);

  useEffect(() => {
    if (callType && exists) {
      myMeeting(callType);
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
    navigate("/");
  };

  if (!exists) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">No User Found</h1>
        <p className="text-lg mb-6">
          The user you are trying to join as does not exist.
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

  return (
    <div className="flex flex-col h-screen relative">
      {!joined && (
        <>
          <header className="bg-gray-800 text-white p-4 text-center text-2xl">
            {callType === "one-on-one"
              ? "One-on-One Video Call"
              : "Group Video Call"}
          </header>
          <button
            onClick={handleExit}
            className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 transition"
          >
            Exit
          </button>
        </>
      )}
      <div
        ref={videoContainerRef}
        className="flex justify-center items-center h-[calc(100vh-3rem)]"
      />
    </div>
  );
}

export default Room;
