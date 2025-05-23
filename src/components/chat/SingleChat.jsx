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
import { XCircle, Smile, LockIcon, Paperclip, X, AlertTriangle, FileText, Image } from "lucide-react";
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
  const [isAdminOnlyMode, setIsAdminOnlyMode] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
  const [uploadingProgress, setUploadingProgress] = useState(0);
  
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const { selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [user, setUser] = useState(null);

  // Common emojis array organized in categories for better user experience
  const emojiCategories = [
    {
      name: "Smileys",
      emojis: [
        "😊", "😂", "🤣", "😍", "😘", "🥰", "😎", "🤔", "😇", "😉", "😋", "🤗", "😆", "😅",
        "😛", "😜", "😝", "🤩", "😌", "😺", "😸", "😻", "😽", "😹", "🙃", "😏", "😈", "👿"
      ]
    },
    {
      name: "Gestures",
      emojis: [
        "👍",
        "👏",
        "🙏",
        "🤝",
        "👋",
        "✌️",
        "👌",
        "🤘",
        "🤙",
        "👆",
        "👉",
        "👈",
        "👇",
        "🖖",
        "🖐️",
        "✋",
        "👊",
        "✊",
        "🤞",
        "🫶",
        "🫱",
        "🫲",
        "🤟",
      ],
    },
    {
      name: "Emotions",
      emojis: [
        "❤️",
        "🔥",
        "✨",
        "💯",
        "💪",
        "🎉",
        "👀",
        "💕",
        "💓",
        "💔",
        "😢",
        "😭",
        "😡",
        "😠",
        "😤",
        "😬",
        "😞",
        "😔",
        "😟",
        "😩",
        "😫",
        "😨",
        "😰",
        "🥵",
        "🥶",
      ],
    },
    {
      name: "Cloud",
      emojis: [
        "🥺",
        "😩",
        "😫",
        "😖",
        "😣",
        "☹️",
        "🤬",
        "🤯",
        "😳",
        "😱",
        "😓",
        "🫥",
        "😶",
        "🤥",
        "🫠",
        "🤫",
        "🫡",
        "🫢",
        "👩‍❤️‍💋‍👨",
        "👨‍❤️‍👨",
        "💑",
        "👩‍❤️‍👩",
        "💏",
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐻‍❄️",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
      ],
    },
    {
      name: "Reactions",
      emojis: [
        "🫠",
        "🫨",
        "🫣",
        "🫡",
        "🤯",
        "😵‍💫",
        "😤",
        "🥹",
        "💃",
        "🕺",
        "🕳️",
        "🚶‍♂️",
        "🏃‍♀️",
        "🤷",
        "🤦",
        "🧍",
        "🧎",
        "🙇",
        "🧠",
        "🦴",
        "👁️‍🗨️",
        "🔁",
        "🔂",
        "🔄",
        "⏳",
        "⏱️",
      ],
    },
    {
      name: "Food",
      emojis: [
        "🍎",
        "🍌",
        "🍇",
        "🍓",
        "🍒",
        "🍉",
        "🥭",
        "🍍",
        "🥝",
        "🍑",
        "🍔",
        "🍟",
        "🌭",
        "🍕",
        "🥪",
        "🌮",
        "🌯",
        "🥗",
        "🍱",
        "🍣",
      ],
    },
    {
      name: "Nature",
      emojis: [
        "🌞",
        "🌝",
        "🌚",
        "🌛",
        "🌜",
        "🌟",
        "🌈",
        "☁️",
        "🌧️",
        "⛈️",
        "🌩️",
        "❄️",
        "🌊",
        "🌬️",
      ],
    },
    {
      name: "Weather",
      emojis: [
        "☀️",
        "🌤️",
        "⛅",
        "🌥️",
        "☁️",
        "🌦️",
        "🌧️",
        "⛈️",
        "🌩️",
        "🌨️",
        "❄️",
        "🌪️",
        "🌫️",
        "🌈",
        "💨",
        "☔",
        "⚡",
      ],
    },
    {
      name: "Daytime",
      emojis: [
        "🌅", // Sunrise
        "🌄", // Sunrise over mountains
        "🌇", // Sunset (evening)
        "🌆", // Cityscape at dusk
        "🌃", // Night with stars
        "🌌", // Milky Way
        "🌉", // Bridge at night
        "🌙", // Crescent moon
        "🕯️", // Candle (night mood)
        "🛏️", // Bed (sleepy night)
        "🛌", // Person in bed
        "🧘", // Meditation (chill evening)
        "🌤️",
        "🌞",
        "☀️", // Day/morning
        "✨",
        "🪷", // Soft evening vibes
      ],
    },
    {
      name: "Time",
      emojis: [
        "⏰",
        "⏱️",
        "⏳",
        "⌛",
        "🕐",
        "🕑",
        "🕒",
        "🕓",
        "🕔",
        "🕕",
        "🕖",
        "🕗",
        "🕘",
        "🕙",
        "🕚",
        "🕛",
      ],
    },
    {
      name: "Objects",
      emojis: [
        "📱",
        "💻",
        "🖥️",
        "🖱️",
        "⌨️",
        "💡",
        "🔦",
        "📷",
        "🎥",
        "🎧",
        "📚",
        "📖",
        "📝",
        "✏️",
      ],
    },
    {
      name: "Transport",
      emojis: [
        "🚗",
        "🚕",
        "🚌",
        "🚎",
        "🏎️",
        "🚓",
        "🚑",
        "🚒",
        "🚚",
        "🚛",
        "🚜",
        "✈️",
        "🚀",
        "🛸",
        "🚁",
      ],
    },
    {
      name: "Symbols",
      emojis: [
        "✔️",
        "❌",
        "⚠️",
        "❗",
        "❓",
        "💤",
        "🆗",
        "🔞",
        "🚫",
        "✅",
        "➕",
        "➖",
        "➗",
        "✖️",
        "🔃",
      ],
    },
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
    // Load user info from localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // console.log("data check",userInfo)
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Error loading user info from localStorage:", error);
    }

    // Close emoji picker when clicking outside
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
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
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        socket.emit("setup", userInfo);
      }
    } catch (error) {
      console.error("Error setting up socket:", error);
    }

    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  // Check if chat is in admin-only mode and if user is an admin
  const checkAdminStatus = async () => {
    if (!selectedChat || !selectedChat._id) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) return;

      const { data } = await axios.post(
        `${ENDPOINT}/v1/chat/chat-admin-mode-find`,
        {
          chatId: selectedChat,
        }
      );

      setIsAdminOnlyMode(data.adminOnlyMode === true);
      // setIsUserAdmin(data.groupAdmin && data.groupAdmin._id === userInfo._id);
      setIsUserAdmin(data.groupAdmin && data?.groupAdmin?.some(admin => admin._id === userInfo?._id));//add today
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat._id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`${ENDPOINT}/v1/chat/${selectedChat._id}`);
      setMessages(data);
      setLoading(false);
      setMessagesLoaded(true);
      
      socket.emit("join chat", selectedChat._id);

      // Check admin status when fetching messages
      await checkAdminStatus();
    } catch (error) {
      console.error("Failed to Load the Messages", error);
      setLoading(false);
      setMessagesLoaded(false);
      showError("Failed to load messages. Please try again.");
    }
  };

  const sendMessage = async (event) => {
    if (!selectedChat || !selectedChat._id) return;

    // Check if user can send messages in admin-only mode
    if (isAdminOnlyMode && !isUserAdmin) {
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo._id) return;

    if (event) {
      if (event.key === "Enter" && newMessage.trim()) {
        event.preventDefault();
        socket.emit("stop typing", selectedChat._id);
        try {
          const { data } = await axios.post(
            `${ENDPOINT}/v1/chat/chat-messages`,
            {
              ownId: userInfo._id,
              content: newMessage,
              chatId: selectedChat,
            }
          );
          setNewMessage("");
          setMessages((prev) => [...prev, data]);
          socket.emit("new message", data);
        } catch (error) {
          console.error("Failed to send the Message", error);
          showError("Failed to send message. Please try again.");
        }
      }
    } else if (newMessage.trim()) {
      // For button click or emoji click
      socket.emit("stop typing", selectedChat._id);
      try {
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
        showError("Failed to send message. Please try again.");
      }
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    // Focus back on input after emoji selection
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Close emoji picker on mobile after selection
    if (isMobile) {
      setShowEmojiPicker(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showError("Invalid file type. Please upload an image (JPEG, PNG, GIF) or PDF.");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("File size exceeds 5MB limit.");
      return;
    }
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.email || !selectedChat || !selectedChat._id) {
      showError("Missing user or chat information.");
      return;
    }
    
    // Create FormData and append required parameters
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', userInfo.email);
    formData.append('chatId', selectedChat._id);
    
    try {
      setFileUploading(true);
      setUploadingProgress(0);
      
      // Send to the correct API with progress tracking
      const { data } = await axios.post(
        `${ENDPOINT}/v1/chat/chat-isteacher-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadingProgress(percentCompleted);
          }
        }
      );
      
      // Add message to chat if the API returns a message object
      if (data && data._id) {
        setMessages((prev) => [...prev, data]);
        
        // Emit socket event if needed
        socket.emit("new message", data);
      } else {
        // If the API doesn't return a message object, refresh messages
        fetchMessages();
      }
      
      setFileUploading(false);
      setUploadingProgress(0);
    } catch (error) {
      console.error("File upload failed:", error);
      setFileUploading(false);
      setUploadingProgress(0);
      
      // Show error popup with specific message if available
      const errorMessage = error.response?.data?.message || "File upload failed. Please try again.";
      showError(errorMessage);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Error handling function
  const showError = (message) => {
    setErrorPopup({
      show: true,
      message
    });
    
    // Auto-close error after 5 seconds
    setTimeout(() => {
      setErrorPopup({ show: false, message: "" });
    }, 5000);
  };

  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      fetchMessages();
      selectedChatCompare = selectedChat;
    } else {
      // Reset messages loaded state when no chat is selected
      setMessagesLoaded(false);
    }
  }, [selectedChat]);

  useEffect(() => {
    const messageListener = (newMessageReceived) => {
      if (!newMessageReceived || !newMessageReceived.chat) return;

      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // If notification state is available
        if (notification) {
          // Check if notification with same ID already exists
          if (
            !notification.find((n) => n && n._id === newMessageReceived._id)
          ) {
            setNotification([newMessageReceived, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        }
      } else {
        setMessages((prevMessages) => {
          // Make sure we have valid previous messages
          if (!prevMessages) return [newMessageReceived];

          // Check if message already exists
          const exists = prevMessages.some(
            (msg) => msg && msg._id === newMessageReceived._id
          );
          return exists ? prevMessages : [...prevMessages, newMessageReceived];
        });
      }
    };

    socket.on("message recieved", messageListener);
    return () => socket.off("message recieved", messageListener);
  }, [notification, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Don't show typing indicator if user can't send messages
    if (
      !socketConnected ||
      !selectedChat ||
      !selectedChat._id ||
      (isAdminOnlyMode && !isUserAdmin)
    )
      return;

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

  // Helper function to safely get sender info with null checks
  const getSafeSenderFull = () => {
    if (
      !user ||
      !selectedChat ||
      !selectedChat.users ||
      !Array.isArray(selectedChat.users) ||
      selectedChat.users.length < 2
    )
      return null;
    return getSenderFull(user, selectedChat.users);
  };

  const getSafeSender = () => {
    if (
      !user ||
      !selectedChat ||
      !selectedChat.users ||
      !Array.isArray(selectedChat.users) ||
      selectedChat.users.length < 2
    )
      return selectedChat?.chatName || "Chat";
    return getSender(user, selectedChat.users);
  };

  // Get sender information safely
  const senderFull = getSafeSenderFull();
  const senderName = getSafeSender();

  // Check if user can send messages
  const canSendMessages = !isAdminOnlyMode || isUserAdmin;
  
  // Check if user is a teacher
  const isTeacher = user && user.isteacher === true;

  // Function to get file icon based on file type
  const getFileTypeIcon = (file) => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4 mr-1 text-blue-600" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4 mr-1 text-red-600" />;
    }
    return null;
  };

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center w-full px-2 pb-2 sm:pb-3 text-base sm:text-lg md:text-xl font-['Work_Sans']">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap truncate max-w-[80%]">
              {selectedChat.isGroupChat === false ? (
                <>
                  {/* User image and name for non-group chat */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* User Image */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={senderFull?.pic || "/default-avatar.png"}
                        alt={senderName || "User"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    {/* User Name */}
                    <span className="truncate font-medium">
                      {senderName || "User"}
                    </span>
                    {senderFull && <ProfileModal user={senderFull} />}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="truncate">
                      {selectedChat.chatName
                        ? selectedChat.chatName.toUpperCase()
                        : "Group Chat"}
                    </span>
                    {/* Show admin-only mode indicator for group chats */}
                    {isAdminOnlyMode && (
                      <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-md">
                        <LockIcon className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Admin Only</span>
                      </span>
                    )}
                  </div>
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
            className="flex flex-col justify-end p-1 sm:p-2 md:p-3 bg-[#E8E8E8] w-full h-full min-h-[300px] rounded-lg overflow-hidden relative"
          >
            {loading ? (
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin self-center m-auto" />
            ) : (
              <div className="messages overflow-y-auto overflow-x-hidden max-h-[70vh] sm:max-h-[65vh] md:max-h-[70vh]">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Typing animation */}
            {istyping && (
              <div className="mb-2 sm:mb-4 ml-0">
                <Lottie
                  options={defaultOptions}
                  width={40}
                  height={20}
                  style={{ marginBottom: 10, marginLeft: 0 }}
                />
              </div>
            )}

            {/* File uploading indicator with progress */}
            {fileUploading && (
              <div className="mb-3 px-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-700 font-medium">Uploading file...</span>
                  <span className="text-xs text-blue-700">{uploadingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${uploadingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Admin-only mode message */}
            {isAdminOnlyMode && !isUserAdmin && messagesLoaded && (
              <div className="bg-gray-100 text-gray-700 p-2 rounded-md text-center text-sm mb-2">
                <LockIcon className="w-4 h-4 inline-block mr-1" />
                This chat is in admin-only mode. Only admins can send messages.
              </div>
            )}

            {/* Input + Send Button (with Upload for teachers) */}
            <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3 relative">
              {/* Emoji Button (non-mobile only) */}
              {!isMobile && canSendMessages && (
                <div ref={emojiPickerRef} className="relative z-10">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 sm:p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition duration-200"
                    title="Emoji"
                    aria-label="Open emoji picker"
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                  
                  {/* Emoji Picker Dropdown */}
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
              
              {/* File Upload Button (for teachers only) */}
              {isTeacher && canSendMessages && (
                <div className="relative z-10">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                    disabled={fileUploading}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-1.5 sm:p-2 ${fileUploading ? 'bg-blue-300 cursor-wait' : 'bg-blue-200 hover:bg-blue-300'} rounded-md transition duration-200 flex items-center justify-center`}
                    title="Upload Image or PDF"
                    aria-label="Upload file"
                    disabled={fileUploading}
                  >
                    <Paperclip className={`w-4 h-4 sm:w-5 sm:h-5 ${fileUploading ? 'text-blue-500' : 'text-blue-700'}`} />
                    <span className="sr-only md:not-sr-only md:ml-1 md:text-xs">Upload</span>
                  </button>
                </div>
              )}
              
              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                className={`flex-grow p-1.5 sm:p-2 text-xs sm:text-sm md:text-base rounded-md bg-[#E0E0E0] focus:outline-none focus:ring-1 focus:ring-blue-400 ${!canSendMessages ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder={canSendMessages ? "Enter a message..." : "Only admins can send messages"}
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={canSendMessages ? sendMessage : null}
                disabled={!canSendMessages}
              />
              
              {/* Send Button */}
              <button
                onClick={() => canSendMessages && sendMessage()}
                className={`p-1.5 sm:p-2 md:p-2.5 ${canSendMessages ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} rounded-md transition duration-200`}
                title={canSendMessages ? "Send Message" : "Only admins can send messages"}
                disabled={!canSendMessages || !newMessage.trim()}
                aria-label="Send message"
              >
                <FaArrowRight className="text-white text-sm sm:text-lg" />
              </button>
            </div>
          </div>
          
          {/* Error Popup */}
          {errorPopup.show && (
            <div className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-80 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md shadow-md flex items-start justify-between z-50 animate-fade-in">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{errorPopup.message}</p>
              </div>
              <button 
                className="ml-2 flex-shrink-0" 
                onClick={() => setErrorPopup({ show: false, message: "" })}
                aria-label="Close error message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
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