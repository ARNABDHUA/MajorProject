import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { getSender, getSenderFull } from "./config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import { toast } from "react-hot-toast";

const groupImages = [
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg",
  "https://images.pexels.com/photos/2422293/pexels-photo-2422293.jpeg",
  "https://images.pexels.com/photos/1181371/pexels-photo-1181371.jpeg",
  "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
  "https://images.pexels.com/photos/1181351/pexels-photo-1181351.jpeg",
  "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
  "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg",
  "https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg",
  "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg",
  "https://images.pexels.com/photos/3861432/pexels-photo-3861432.jpeg",
  "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg",
  "https://images.pexels.com/photos/2459670/pexels-photo-2459670.jpeg",
  "https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg",
  "https://images.shiksha.com/mediadata/images/articles/1712641804phplFerI0.jpeg", // Replaced #13
  "https://rec.ac.in/images/BCA.jpg", // Replaced #14
  "https://gsbl.in/wp-content/uploads/2023/07/BCA-Course-Subjects-and-Syllabus-in-India-1024x675.png", // Replaced #15
  "https://images.pexels.com/photos/3153201/pexels-photo-3153201.jpeg",
  "https://images.pexels.com/photos/3184632/pexels-photo-3184632.jpeg",
  "https://cdn.itm.ac.in/2024/05/b-tech-cse-a-miracle-for-anyone-who-wants-to-study-engineering.webp",
  "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_800,h_639/https://www.iimtindia.net/Blog/wp-content/uploads/2021/05/Engineering-Applications-of-Machine-Learning.jpeg", // Replaced #19
  "https://images.pexels.com/photos/3228683/pexels-photo-3228683.jpeg",
  "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg",
  "https://images.pexels.com/photos/1181313/pexels-photo-1181313.jpeg",
  "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg",
  "https://www.spsu.ac.in/wp-content/uploads/2023/10/b.tech_.jpg", // Replaced #24
  "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_1024,h_536/https://www.iimtindia.net/Blog/wp-content/uploads/2021/07/bca-vs-btech-1024x536.jpg", // Replaced #25
  "https://cdn.pixabay.com/photo/2015/01/09/11/09/meeting-594091_1280.jpg", // Replaced #26
  "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg",
  "https://images.pexels.com/photos/1181288/pexels-photo-1181288.jpeg",
  "https://images.pexels.com/photos/3182743/pexels-photo-3182743.jpeg"
];

// Image Modal Component
const ImageModal = ({ isOpen, imageUrl, onClose, altText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl w-full mx-auto">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="bg-white p-2 rounded-lg shadow-lg">
          <img 
            src={imageUrl} 
            alt={altText || "Enlarged view"}
            className="max-h-[80vh] max-w-full h-auto mx-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/api/placeholder/400/400";
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Image Picker Modal Component
const ImagePickerModal = ({ isOpen, onClose, onSelect, currentImageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Select Group Image</h3>
          <button 
            onClick={onClose}
            className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {groupImages.map((imageUrl, index) => (
            <div 
              key={index} 
              onClick={() => onSelect(imageUrl)}
              className={`cursor-pointer rounded-lg overflow-hidden hover:opacity-80 transition border-2 ${
                currentImageUrl === imageUrl ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
              }`}
            >
              <img 
                src={imageUrl}
                alt={`Group image option ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/api/placeholder/150/150";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [token, setToken] = useState();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [groupImageMap, setGroupImageMap] = useState({});
  const [modalImage, setModalImage] = useState({ isOpen: false, url: '', alt: '' });
  const [imagePicker, setImagePicker] = useState({ isOpen: false, chatId: null, currentUrl: '' });
  const pressTimerRef = useRef(null);
  const [isPressing, setIsPressing] = useState(false);
  const [pressingChatId, setPressingChatId] = useState(null);
  // Add loading state to prevent rendering before user data is ready
  const [isLoading, setIsLoading] = useState(true);
  const [isStudent,setIsStudent]=useState(false);

  const { 
    selectedChat, 
    setSelectedChat, 
    chats, 
    setChats, 
    notification, 
    setNotification 
  } = ChatState();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userToken = localStorage.getItem("token");
        
        // Skip processing if userInfo is not available
        if (!userInfo) {
          console.warn("User info not found in localStorage");
          return false;
        }
        
        const studentData=userInfo.isstudent
        setLoggedUser(userInfo);
        setToken(userToken);
        setIsStudent(studentData);
        
        // Load saved group images from localStorage
        const savedGroupImages = localStorage.getItem("groupChatImages");
        if (savedGroupImages) {
          try {
            const parsedImages = JSON.parse(savedGroupImages);
            setGroupImageMap(parsedImages);
          } catch (error) {
            console.error("Error parsing group images from localStorage:", error);
            // Reset the corrupted localStorage item
            localStorage.removeItem("groupChatImages");
            setGroupImageMap({});
          }
        }
        
        return true;
      } catch (error) {
        console.error("Error loading user data:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Simple hash function to convert chat ID to a number
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  // Save group image map to localStorage
  const saveGroupImagestoLocalStorage = (imageMap) => {
    try {
      localStorage.setItem("groupChatImages", JSON.stringify(imageMap));
      return true;
    } catch (error) {
      console.error("Error saving group images to localStorage:", error);
      return false;
    }
  };

  // Assign random images to group chats and persist to localStorage
  const assignGroupImages = (chatList) => {
    const newGroupImageMap = { ...groupImageMap };
    let mapUpdated = false;
    
    chatList.forEach(chat => {
      if (chat.isGroupChat && !newGroupImageMap[chat._id]) {
        // Assign a random image from the array based on chat ID
        const randomIndex = Math.abs(hashCode(chat._id)) % groupImages.length;
        newGroupImageMap[chat._id] = groupImages[randomIndex];
        mapUpdated = true;
      }
    });
    
    if (mapUpdated) {
      // Save to state
      setGroupImageMap(newGroupImageMap);
      
      // Save to localStorage
      saveGroupImagestoLocalStorage(newGroupImageMap);
    }
  };

  const fetchChats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // Check if userInfo exists before proceeding
      if (!userInfo || !userInfo._id) {
        console.warn("User info not available for fetching chats");
        return;
      }
      
      const ownId = userInfo._id;

      const data = await axios.post(
        "https://e-college-data.onrender.com/v1/chat/chat-fatch",
        { ownId: ownId }
      );
      setChats(data.data);
      assignGroupImages(data.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to Load the chats", {
        duration: 5000,
        position: "bottom-left",
        style: {
          background: "#f87171",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "0.5rem",
          padding: "12px 16px",
        },
      });
    }
  };

  // Get notification count for a specific chat
  const getNotificationCount = (chatId) => {
    return notification.filter(n => n.chat._id === chatId).length;
  };

  // Handle image click to open modal
  const handleImageClick = (e, imageUrl, altText) => {
    e.stopPropagation(); // Prevent chat selection when clicking image
    setModalImage({
      isOpen: true,
      url: imageUrl,
      alt: altText
    });
  };

  // Close image modal
  const closeImageModal = () => {
    setModalImage({
      isOpen: false,
      url: '',
      alt: ''
    });
  };

  // Press and hold handlers for changing group images
  const handlePressStart = (e, chat) => {
    e.stopPropagation();
    if (!chat.isGroupChat) return;
    
    setPressingChatId(chat._id);
    setIsPressing(true);
    
    // Set a timeout to trigger the action after 1 second of pressing
    pressTimerRef.current = setTimeout(() => {
      setImagePicker({
        isOpen: true,
        chatId: chat._id,
        currentUrl: groupImageMap[chat._id] || ""
      });
      setIsPressing(false);
      setPressingChatId(null);
    }, 1000);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimerRef.current);
    setIsPressing(false);
    setPressingChatId(null);
  };

const handleImageSelect = (imageUrl) => {
  try {
    // Create a new object with the updated image
    const updatedImageMap = {
      ...groupImageMap,
      [imagePicker.chatId]: imageUrl
    };
    
    // Update localStorage with stringified JSON data
    localStorage.removeItem("groupChatImages"); // First remove any existing data
    localStorage.setItem("groupChatImages", JSON.stringify(updatedImageMap));
    
    // Force a direct DOM update of localStorage to ensure it's saved
    // This is a hack but sometimes helps with localStorage sync issues
    document.cookie = "forceSyncLocalStorage=" + Date.now();
    
    // Update React state after localStorage
    setGroupImageMap(updatedImageMap);
    
    // Add a flag in localStorage to indicate images have been updated
    localStorage.setItem("groupImagesLastUpdated", Date.now().toString());
    
    toast.success("Group image updated", {
      duration: 2000,
      position: "bottom-left"
    });
  } catch (error) {
    console.error("Failed to save group image:", error);
    toast.error("Failed to save group image", {
      duration: 3000,
      position: "bottom-left"
    });
  }
  
  // Close modal
  setImagePicker({
    isOpen: false,
    chatId: null,
    currentUrl: ''
  });
};

  // Mark messages as read when selecting a chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    
    // Remove notifications for this chat
    if (notification.length > 0) {
      setNotification(notification.filter((n) => n.chat._id !== chat._id));
    }
    
    // Reset unread count for this chat in state
    setUnreadCounts(prev => ({
      ...prev,
      [chat._id]: 0
    }));
  };

  // Get total unread message count
  const getTotalUnreadCount = () => {
    return notification.length;
  };

  // Get user image for single chats or group icon for group chats
  const getChatImage = (chat) => {
    // Guard clause to prevent errors when loggedUser is undefined
    if (!loggedUser) {
      return "/api/placeholder/40/40";
    }
    
    if (chat.isGroupChat) {
      // Use the mapped group image or a fallback
      return groupImageMap[chat._id] || "/api/placeholder/40/40";
    } else {
      try {
        const otherUser = getSenderFull(loggedUser, chat.users);
        return otherUser?.pic || "/api/placeholder/40/40"; // User profile pic or placeholder
      } catch (error) {
        console.error("Error getting sender:", error);
        return "/api/placeholder/40/40"; // Fallback if there's an error
      }
    }
  };

  // Get sender name safely
  const getSenderSafely = (loggedUser, users) => {
    if (!loggedUser || !users || users.length < 2) {
      return "Unknown User";
    }
    
    try {
      return getSender(loggedUser, users);
    } catch (error) {
      console.error("Error getting sender name:", error);
      return "Unknown User";
    }
  };

  // Update unread counts whenever notifications change
  useEffect(() => {
    if (notification.length > 0 && chats.length > 0) {
      const newUnreadCounts = {};
      
      // Group notifications by chat
      chats.forEach(chat => {
        const count = getNotificationCount(chat._id);
        // Only update if this isn't the currently selected chat
        if (selectedChat?._id !== chat._id || count === 0) {
          newUnreadCounts[chat._id] = count;
        } else {
          newUnreadCounts[chat._id] = 0;
        }
      });
      
      setUnreadCounts(newUnreadCounts);
    }
  }, [notification, chats, selectedChat]);

  // Check for any new groups in chats and assign images
  useEffect(() => {
    if (chats && chats.length > 0) {
      // Check if there are any group chats without images
      const needsImages = chats.some(chat => 
        chat.isGroupChat && !groupImageMap[chat._id]
      );
      
      if (needsImages) {
        assignGroupImages(chats);
      }
    }
  }, [chats]);

  // Verify group images in localStorage match current state
  useEffect(() => {
    // Only run this effect when the groupImageMap changes
    if (Object.keys(groupImageMap).length > 0) {
      const savedJson = localStorage.getItem("groupChatImages");
      if (savedJson) {
        try {
          const savedMap = JSON.parse(savedJson);
          // Check if the saved map is different from current state
          const isDifferent = Object.keys(groupImageMap).some(key => 
            groupImageMap[key] !== savedMap[key]
          );
          
          // If different, update localStorage
          if (isDifferent || Object.keys(savedMap).length !== Object.keys(groupImageMap).length) {
            saveGroupImagestoLocalStorage(groupImageMap);
          }
        } catch (error) {
          console.error("Error comparing group images with localStorage:", error);
          // Reset localStorage with current state
          saveGroupImagestoLocalStorage(groupImageMap);
        }
      } else {
        // If no saved data exists, save the current state
        saveGroupImagestoLocalStorage(groupImageMap);
      }
    }
  }, [groupImageMap]);

  // Clean up press timer if component unmounts
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  // Fetch chats when component mounts or fetchAgain changes
  useEffect(() => {
    // Only fetch chats if user data is loaded
    if (loggedUser) {
      fetchChats();
    }
    // eslint-disable-next-line
  }, [fetchAgain, loggedUser]);

  // Show loading state while waiting for user data
  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-300">
        <div className="pb-3 px-3 text-[28px] md:text-[30px] font-['Work_Sans'] flex justify-between items-center w-full">
          My Chats
        </div>
        <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-hidden">
          <ChatLoading />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`${
          selectedChat ? "hidden md:flex" : "flex"
        } flex-col items-center p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-300`}
      >
        {/* Header */}
        <div className="pb-3 px-3 text-[28px] md:text-[30px] font-['Work_Sans'] flex justify-between items-center w-full">
          <div className="flex items-center">
            My Chats
            {/* {getTotalUnreadCount() > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
                {getTotalUnreadCount()}
              </span>
            )} */}
          </div>
          <GroupChatModal>
            {!isStudent &&<button className="flex items-center gap-2 text-[17px] md:text-[10px] lg:text-[17px] px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              New Group Chat <span className="text-lg">+</span>
            </button>}
          </GroupChatModal>
        </div>

        {/* Chat List */}
        <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-hidden">
          {chats && chats.length > 0 ? (
            <div className="flex flex-col gap-2 overflow-y-auto">
              {chats.map((chat) => {
                const notificationCount = getNotificationCount(chat._id);
                const chatImage = getChatImage(chat);
                // Use safe version to prevent errors
                const chatName = !chat.isGroupChat
                  ? getSenderSafely(loggedUser, chat.users)
                  : chat.chatName;
                const isPressingThisChat = isPressing && pressingChatId === chat._id;
                
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`cursor-pointer px-3 py-2 rounded-lg ${
                      selectedChat === chat
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-black"
                    } relative`}
                  >
                    <div className="flex items-center">
                      {/* User/Group Image - Clickable and Press-holdable for Group Chats */}
                      <div 
                        className={`relative mr-3 flex-shrink-0 ${chat.isGroupChat ? "cursor-pointer" : ""}`}
                        onClick={(e) => handleImageClick(e, chatImage, chatName)}
                        onMouseDown={chat.isGroupChat ? (e) => handlePressStart(e, chat) : null}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={chat.isGroupChat ? (e) => handlePressStart(e, chat) : null}
                        onTouchEnd={handlePressEnd}
                        onTouchCancel={handlePressEnd}
                      >
                        <img 
                          src={chatImage}
                          alt={chatName}
                          className={`h-10 w-10 rounded-full object-cover border-2 ${
                            chat.isGroupChat ? "border-blue-300" : "border-gray-300"
                          } ${
                            isPressingThisChat ? "ring-2 ring-yellow-400 scale-110" : ""
                          } hover:opacity-80 transition-all`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/40/40";
                          }}
                        />
                        
                        {/* Visual feedback for press and hold */}
                        {chat.isGroupChat && (
                          <div className={`absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-30 transition-opacity ${
                            isPressingThisChat ? "opacity-100" : "opacity-0"
                          }`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Chat Info */}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold truncate">
                            {chatName}
                          </p>
                          {notificationCount > 0 && (
                            <span className={`${
                              selectedChat === chat ? "bg-white text-teal-500" : "bg-red-500 text-white"
                            } text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1 ml-1`}>
                              {notificationCount}
                            </span>
                          )}
                        </div>
                        {chat.latestMessage && (
                          <p className={`text-xs mt-1 truncate ${notificationCount > 0 && selectedChat !== chat ? "font-bold" : ""}`}>
                            <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                            {chat.latestMessage.content.length > 30
                              ? chat.latestMessage.content.substring(0, 30) + "..."
                              : chat.latestMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal 
        isOpen={modalImage.isOpen}
        imageUrl={modalImage.url}
        altText={modalImage.alt}
        onClose={closeImageModal}
      />
      
      {/* Image Picker Modal */}
      <ImagePickerModal 
        isOpen={imagePicker.isOpen}
        onClose={() => setImagePicker({ isOpen: false, chatId: null, currentUrl: '' })}
        onSelect={handleImageSelect}
        currentImageUrl={imagePicker.currentUrl}
      />
    </>
  );
};

export default MyChats;