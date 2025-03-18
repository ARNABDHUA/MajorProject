import React, { useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const APP_ID = 1518614860;
const SECRET = "6ab902e434bfc591027ec25ef201cf39";

const Home = ({ roomCode, userName, subject }) => {
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    const initZegoCloud = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SECRET,
        roomCode,
        Date.now().toString(),
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current = zp;

      try {
        await zp.joinRoom({
          container: videoContainerRef.current,
          showPreJoinView: false,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          maxUsers: 2,
          showScreenSharingButton: true,
          showPreviewTitle: false,
          showUserList: true,
          showRoomTimer: true,
          showLayoutButton: true,
          showNonVideoUser: true,
          showMicrophoneStateButton: true,
          showCameraStateButton: true,
          showAudioVideoSettingsButton: true,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          onJoinRoom: () => {
            console.log("Teacher joined:", subject);
          },
          onLeaveRoom: () => {
            console.log("Teacher left:", subject);
            if (zpRef.current) {
              zpRef.current.destroy();
            }
          },
          onError: (error) => {
            console.error("Zegocloud error:", error);
          },
        });
      } catch (error) {
        console.error("Failed to join room:", error);
      }
    };

    if (roomCode && userName) {
      initZegoCloud();
    }

    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [roomCode, userName, subject]);

  return (
    <div className="h-[calc(100vh-12rem)] w-full">
      <div
        ref={videoContainerRef}
        className="w-full h-full rounded-xl overflow-hidden shadow-lg"
      />
    </div>
  );
};

export default Home;
