import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bell, ChevronDown, X } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import { getSender } from "../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../../context/ChatProvider";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState();
  const [groupedNotifications, setGroupedNotifications] = useState({});

  const notificationRef = useRef();
  const profileRef = useRef();
  const searchInputRef = useRef(null);

  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isDrawerOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [isDrawerOpen]);

  // Process notifications to group by sender and ensure latest messages are shown
  useEffect(() => {
    const grouped = {};
    
    // Sort notifications by createdAt timestamp to ensure we process them in chronological order
    const sortedNotifications = [...notification].sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    
    sortedNotifications.forEach(notif => {
      if (notif.chat.isGroupChat) {
        // For group chats, group by chat ID
        const chatId = notif.chat._id;
        if (!grouped[chatId]) {
          grouped[chatId] = {
            chat: notif.chat,
            count: 1,
            lastMessage: notif,
            isGroup: true,
            timestamp: new Date(notif.createdAt || Date.now())
          };
        } else {
          grouped[chatId].count += 1;
          // Update lastMessage only if this notification is newer
          const notifTimestamp = new Date(notif.createdAt || Date.now());
          const currentTimestamp = grouped[chatId].timestamp;
          
          if (notifTimestamp > currentTimestamp) {
            grouped[chatId].lastMessage = notif;
            grouped[chatId].timestamp = notifTimestamp;
          }
        }
      } else {
        // For direct messages, group by sender ID
        const senderId = notif.sender ? notif.sender._id : 
                        notif.chat.users.find(u => u._id !== user?._id)?._id;
        
        if (senderId) {
          if (!grouped[senderId]) {
            grouped[senderId] = {
              chat: notif.chat,
              count: 1,
              lastMessage: notif,
              isGroup: false,
              sender: getSender(user, notif.chat.users),
              timestamp: new Date(notif.createdAt || Date.now())
            };
          } else {
            grouped[senderId].count += 1;
            // Update lastMessage only if this notification is newer
            const notifTimestamp = new Date(notif.createdAt || Date.now());
            const currentTimestamp = grouped[senderId].timestamp;
            
            if (notifTimestamp > currentTimestamp) {
              grouped[senderId].lastMessage = notif;
              grouped[senderId].timestamp = notifTimestamp;
            }
          }
        }
      }
    });
    
    setGroupedNotifications(grouped);
  }, [notification, user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.error("Please enter something in search", { position: "bottom-left" });
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const useId = userInfo._id;

      const { data } = await axios.post(
        `https://e-college-data.onrender.com/v1/chat/chat-user-all?search=${search}`,
        { useId }
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load search results", { position: "bottom-left" });
      setLoading(false);
    }
  };

  // Handle Enter key in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const ownId = userInfo._id;

      const { data } = await axios.post(
        `https://e-college-data.onrender.com/v1/chat/chat-create`,
        { userId, ownId }
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Error fetching the chat", { position: "bottom-left" });
      setLoadingChat(false);
    }
  };

  // Clear notifications for a specific chat
  const handleNotificationClick = (chat) => {
    setSelectedChat(chat);
    
    // Remove all notifications for this chat
    const updatedNotifications = notification.filter(
      (n) => n.chat._id !== chat._id
    );
    
    setNotification(updatedNotifications);
    setShowNotifications(false);
  };

  // Get total notification count
  const getTotalNotificationCount = () => {
    return Object.values(groupedNotifications).reduce((sum, group) => sum + group.count, 0);
  };

  // Format time for notifications
  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return "";
    
    const msgDate = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (msgDate.toDateString() === now.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date without year
    if (msgDate.getFullYear() === now.getFullYear()) {
      return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date with year
    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full px-2 sm:px-4 py-2 border-b border-gray-200 shadow-sm sticky top-0 z-10">
        {/* Search Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-full transition-all duration-200"
        >
          <FiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span className="hidden md:block text-sm font-medium">Search User</span>
        </button>

        {/* App Title */}
        <p className="text-lg sm:text-xl md:text-2xl font-['Work_Sans'] font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">E-college</p>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3 relative">
          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-label="Notifications"
            >
              {getTotalNotificationCount() > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs rounded-full h-5 min-w-5 px-1 border-2 border-white">
                  {getTotalNotificationCount() > 99 ? "99+" : getTotalNotificationCount()}
                </span>
              )}
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white rounded-lg shadow-lg z-50 max-h-[70vh] overflow-hidden flex flex-col border border-gray-200 transform origin-top-right transition-all duration-200 ease-out">
                <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 font-medium text-sm border-b flex items-center justify-between">
                  <span className="text-blue-800">Notifications</span>
                  {getTotalNotificationCount() > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {getTotalNotificationCount()}
                    </span>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {Object.keys(groupedNotifications).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                      <div className="text-gray-400 mb-2">
                        <Bell className="w-12 h-12 mx-auto opacity-30" />
                      </div>
                      <p className="text-gray-500 text-sm text-center">No new notifications</p>
                    </div>
                  ) : (
                    // Sort groups by timestamp (newest first)
                    Object.values(groupedNotifications)
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((group) => (
                        <div
                          key={group.chat._id + (group.isGroup ? 'group' : group.sender)}
                          onClick={() => handleNotificationClick(group.chat)}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium truncate flex-1 text-gray-800">
                              {group.isGroup
                                ? `${group.chat.chatName}`
                                : `${group.sender}`}
                            </span>
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2 font-medium">
                              {group.count}
                            </span>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-1 pr-2">
                              {group.isGroup && group.lastMessage.sender && (
                                <p className="text-xs font-medium text-blue-600 mb-0.5">
                                  {group.lastMessage.sender?.name || 'Unknown'}:
                                </p>
                              )}
                              <p className="text-gray-600 truncate leading-snug">
                                {group.lastMessage.content?.length > 40
                                  ? `${group.lastMessage.content.substring(0, 40)}...`
                                  : group.lastMessage.content}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">
                              {formatNotificationTime(group.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                
                {getTotalNotificationCount() > 0 && (
                  <div className="border-t px-4 py-2 bg-gray-50">
                    <button 
                      onClick={() => {
                        setNotification([]);
                        setShowNotifications(false);
                      }}
                      className="w-full py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Clear all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile - Uncomment when needed */}
          {/* <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 bg-white border px-2 py-1 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <img
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200"
                src={user?.pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
                alt={user?.name}
              />
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200 transform origin-top-right transition-all duration-200 ease-out">
                <ProfileModal user={user}>
                  <div className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                    My Profile
                  </div>
                </ProfileModal>
                <hr className="my-1" />
                <div
                  onClick={logoutHandler}
                  className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150 flex items-center text-red-500"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Logout
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>

      {/* Search Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          <div className="relative bg-white w-full sm:w-[350px] max-w-sm h-full z-50 shadow-xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="font-semibold text-lg text-gray-800">Search Users</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-600 hover:text-red-500 p-1 rounded-full hover:bg-white transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-2 pb-4">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FiSearch className="w-4 h-4" />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  Search
                  {loading && (
                    <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
              </div>

              <div className="mt-2">
                {loading ? (
                  <ChatLoading />
                ) : (
                  <>
                    {searchResult && searchResult.length > 0 ? (
                      <div className="space-y-2">
                        {searchResult.map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => accessChat(user._id)}
                          />
                        ))}
                      </div>
                    ) : (
                      search && !loading && (
                        <div className="text-center py-8 text-gray-500">
                          No users found
                        </div>
                      )
                    )}
                  </>
                )}

                {loadingChat && (
                  <div className="flex justify-center my-4">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Close Button */}
            <div className="border-t p-4">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 py-2.5 rounded-lg transition-colors duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideDrawer;