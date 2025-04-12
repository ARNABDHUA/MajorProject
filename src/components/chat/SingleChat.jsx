import "./styles.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "./animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "./config/ChatLogics";
import { XCircle, Smile } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";

const ENDPOINT = "https://e-college-data.onrender.com";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [user, setUser] = useState();

  // Common emojis array organized in categories for better user experience
  const emojiCategories = [
    {
      name: "Smileys",
      emojis: [
        "😊", "😂", "🤣", "😍", "😘", "🥰", "😎", "🤔", "😇", "😉", "😋", "🤗", "😆", "😅",
        "😛", "😜", "😝", "🤩", "😌", "😺", "😸", "😻", "😽"
      ]
    },
    {
      name: "Gestures",
      emojis: [
        "👍", "👏", "🙏", "🤝", "👋", "✌️", "👌", "🤘", "🤙", "👆", "👉", "👈",
        "👇", "🖖", "🖐️", "✋", "👊", "✊", "🤞", "🫶"
      ]
    },
    {
      name: "Emotions",
      emojis: [
        "❤️", "🔥", "✨", "💯", "💪", "🎉", "👀", "💕", "💓", "💔", "😢", "😭",
        "😡", "😠", "😤", "😬", "😞", "😔", "😟", "😩", "😫"
      ]
    },
    {
      name: "Cloud",
      emojis: [
        "🥺", "😩", "😫", "😖", "😣", "☹️", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱",
        "😨", "😰", "😥", "😓", "🫥", "😶", "🤥", "🫠", "🤫", "🫡", "🫢",
        "👩‍❤️‍💋‍👨", "👨‍❤️‍👨", "💑", "👩‍❤️‍👩", "👩‍❤️‍👨", "👩‍❤️‍💋‍👩", "💏",
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵",
        "🙈", "🙉", "🙊", "🐒"
      ]
    },
    {
      name: "Reactions",
      emojis: [
        "🫠", "🫨", "🫣", "🫡", "🤯", "😵‍💫", "😤", "🥹", "💃", "🕺", "🕳️", "🚶‍♂️", "🏃‍♀️",
        "🤷", "🤦", "🧍", "🧎", "🙇", "🧠", "🦴", "👁️‍🗨️", "🔁", "🔂", "🔄", "⏳", "⏱️"
      ]
    }
  ];
  

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // Close emoji picker when clicking outside
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (event) {
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
    } else if (newMessage.trim()) {
      // For button click or emoji click
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

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    // Focus back on input after emoji selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Close emoji picker on mobile after selection
    if (isMobile) {
      setShowEmojiPicker(false);
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
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center w-full px-2 pb-2 sm:pb-3 text-base sm:text-lg md:text-xl font-['Work_Sans']">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap truncate max-w-[80%]">
              {!selectedChat.isGroupChat ? (
                <>
                  <span className="truncate">{getSender(user, selectedChat.users)}</span>
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  <span className="truncate">{selectedChat.chatName.toUpperCase()}</span>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </div>

            <button
              onClick={() => setSelectedChat("")}
              className="text-gray-500 hover:text-red-500 transition duration-200 flex-shrink-0"
              title="Close Chat"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </button>
          </div>

          {/* Chat Box */}
          <div 
            ref={chatContainerRef}
            className="flex flex-col justify-end p-1 sm:p-2 md:p-3 bg-[#E8E8E8] w-full h-full min-h-[300px] rounded-lg overflow-hidden"
          >
            {loading ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin self-center m-auto" />
            ) : (
              <div className="messages overflow-y-auto overflow-x-hidden max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh]">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Typing animation */}
            {istyping && (
              <div className="mb-2 sm:mb-4 ml-0">
                <Lottie options={defaultOptions} width={40} height={20} style={{ marginBottom: 10, marginLeft: 0 }} />
              </div>
            )}

            {/* Input + Send Button (with conditional Emoji for non-mobile) */}
            <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3 relative">
              {/* Only show emoji button on non-mobile devices */}
              {!isMobile && (
                <div ref={emojiPickerRef} className="relative z-10">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-200"
                    title="Emoji"
                    aria-label="Open emoji picker"
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                  
                  {/* Emoji Picker Dropdown (non-mobile only) */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 bg-white p-2 rounded-lg shadow-lg border border-gray-300 z-20 w-[280px] sm:w-[320px] max-h-[200px] sm:max-h-[300px] overflow-auto">
                      <div className="flex flex-col space-y-2">
                        {emojiCategories.map((category, catIndex) => (
                          <div key={catIndex} className="mb-2">
                            <h3 className="text-xs font-semibold text-gray-500 mb-1 px-1">{category.name}</h3>
                            <div className="grid grid-cols-7 sm:grid-cols-8 gap-1">
                              {category.emojis.map((emoji, emojiIndex) => (
                                <button
                                  key={emojiIndex}
                                  className="text-lg sm:text-xl md:text-2xl hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors"
                                  onClick={() => handleEmojiClick(emoji)}
                                  aria-label={`Emoji ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                className="flex-grow p-1.5 sm:p-2 text-xs sm:text-sm md:text-base rounded-md bg-[#E0E0E0] focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />
              
              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                className="p-1.5 sm:p-2 md:p-2.5 bg-green-500 rounded-md hover:bg-green-600 transition duration-200"
                title="Send Message"
                disabled={!newMessage.trim()}
                aria-label="Send message"
              >
                <FaArrowRight className="text-white text-sm sm:text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center px-3">
          <p className="text-base sm:text-lg md:text-xl font-['Work_Sans'] text-gray-500">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;