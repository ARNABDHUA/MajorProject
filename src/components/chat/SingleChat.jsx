import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "./animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "./config/ChatLogics";
import { XCircle } from "lucide-react"; // 👈 Add this for close icon

const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [user, setUser] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    socket.emit("setup", userInfo);

    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${ENDPOINT}/v1/chat/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to Load the Messages", error);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim()) {
      event.preventDefault();
      socket.emit("stop typing", selectedChat._id);
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const { data } = await axios.post(`${ENDPOINT}/v1/chat/chat-messages`, {
          ownId: userInfo._id,
          content: newMessage,
          chatId: selectedChat,
        });
        setNewMessage("");
        setMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
      } catch (error) {
        console.error("Failed to send the Message", error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.find((n) => n._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => {
          const exists = prevMessages.some((msg) => msg._id === newMessageReceived._id);
          return exists ? prevMessages : [...prevMessages, newMessageReceived];
        });
      }
    };

    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [notification, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {selectedChat ? (
        <>
          {/* Header */}
          <div className="flex justify-between items-center w-full px-2 pb-3 text-[22px] md:text-[26px] font-['Work_Sans']">
            <div className="flex items-center gap-2">
              {!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </div>

            {/* ❌ Close Chat Button */}
            <button
              onClick={() => setSelectedChat("")}
              className="text-gray-500 hover:text-red-500 transition duration-200"
              title="Close Chat"
            >
              <XCircle className="w-7 h-7 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Chat Box */}
          <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
            {loading ? (
              <div className="w-20 h-20 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin self-center m-auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Typing animation */}
            {istyping && (
              <div className="mb-4 ml-0">
                <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
              </div>
            )}

            {/* Input */}
            <input
              type="text"
              className="w-full p-2 rounded-md bg-[#E0E0E0] focus:outline-none mt-3"
              placeholder="Enter a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
            />
          </div>
        </>
      ) : (
        // Default view when no chat is selected
        <div className="flex items-center justify-center h-full">
          <p className="text-3xl pb-3 font-['Work_Sans'] text-gray-500 text-center">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
