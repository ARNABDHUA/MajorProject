import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChatState } from "../../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { FiEye, FiX, FiSearch, FiPlus, FiLogOut, FiEdit, FiUsers, FiSettings, FiAlertTriangle, FiMail, FiUser, FiMessageSquare, FiLock, FiUnlock } from "react-icons/fi";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [adminOnlyMode, setAdminOnlyMode] = useState(false); // New state for admin-only mode
  const [updatingMode, setUpdatingMode] = useState(false); // New state for loading state when updating mode
  const { selectedChat, setSelectedChat } = ChatState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [activeTab, setActiveTab] = useState("members"); // "members", "add", or "settings"
  const modalRef = useRef(null);
  const [modalMaxHeight, setModalMaxHeight] = useState("85vh");
  const [confirmRemove, setConfirmRemove] = useState(null); // State to track user to remove
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    setToken(userToken);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // Handle responsive height
      const windowHeight = window.innerHeight;
      // Set modal max height based on screen size
      const newMaxHeight = windowHeight < 600 
        ? '95vh' 
        : windowHeight < 800 
          ? '90vh' 
          : '85vh';
      setModalMaxHeight(newMaxHeight);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial values
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && selectedChat) {
      setGroupChatName(selectedChat.chatName);
      // Check if adminOnlyMode is set in the chat document
      setAdminOnlyMode(selectedChat.adminOnlyMode || false);
    }
  }, [isOpen, selectedChat]);

  const showToast = (title, description = "", status = "success") => {
    const message = description ? `${title}: ${description}` : title;
    const options = {
      duration: 3000,
      style: {
        background: status === "error" ? "#fee2e2" : "#d1fae5",
        color: "#1f2937",
        border: "1px solid #e5e7eb",
        padding: "12px 16px",
        borderRadius: "8px",
      },
    };
    if (status === "error") toast.error(message, options);
    else if (status === "success") toast.success(message, options);
    else toast(message, options);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.post(
        `https://e-college-data.onrender.com/v1/chat/chat-user-all?search=${query}`,
        { useId: userInfo._id }
      );
      setSearchResult(data);
    } catch (error) {
      showToast("Error Occurred!", "Failed to load search results", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can rename group", "", "error");
      return;
    }
    if (!groupChatName || groupChatName.trim() === "") {
      showToast("Please enter a group name", "", "error");
      return;
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.post(`https://e-college-data.onrender.com/v1/chat/chat-group-rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      showToast("Success", "Group renamed successfully", "success");
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to rename group", "error");
    } finally {
      setRenameLoading(false);
    }
  };

  // New function to toggle admin-only mode
  const toggleAdminOnlyMode = async () => {
    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can change message permissions", "", "error");
      return;
    }
    
    try {
      setUpdatingMode(true);
      const { data } = await axios.post(`https://e-college-data.onrender.com/v1/chat/chat-group-admin-mode`, {
        chatId: selectedChat._id,
        adminOnlyMode: !adminOnlyMode,
        ownId:user._id
      });
      
      // Update local state
      setAdminOnlyMode(!adminOnlyMode);
      setSelectedChat({...selectedChat, adminOnlyMode: !adminOnlyMode});
      setFetchAgain(!fetchAgain);
      
      showToast(
        "Success", 
        !adminOnlyMode 
          ? "Admin-only messaging enabled" 
          : "Everyone can now send messages", 
        "success"
      );
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to update message permissions", "error");
    } finally {
      setUpdatingMode(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      showToast("User already in group", "", "error");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      showToast("Only admins can add someone", "", "error");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`https://e-college-data.onrender.com/v1/chat/chat-group-add`, {
        chatId: selectedChat._id,
        userId: user1._id,
      });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      showToast("Success", "User added to the group", "success");
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to add user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation dialog before removing
  const confirmRemoveUser = (user1) => {
    setConfirmRemove(user1);
  };

  // Cancel confirmation
  const cancelRemove = () => {
    setConfirmRemove(null);
  };

  // Actually remove the user after confirmation
  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showToast("Only admins can remove someone", "", "error");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`https://e-college-data.onrender.com/v1/chat/chat-group-remove`, {
        chatId: selectedChat._id,
        userId: user1._id,
      });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      showToast("Success", "User removed", "success");
      if (user1._id === user._id) {
        setIsOpen(false);
      }
      setConfirmRemove(null); // Clear confirmation state
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to remove user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const isAdmin = selectedChat?.groupAdmin?._id === user?._id;
  const isMobile = windowWidth < 640;

  // Calculate content height based on screen size
  const getContentMaxHeight = () => {
    const windowHeight = window.innerHeight;
    if (windowHeight < 500) return "30vh";
    if (windowHeight < 700) return "40vh";
    return "50vh";
  };

  // Modified UserBadgeItem component that incorporates user image
  const ModifiedUserBadgeItem = ({ user: badgeUser, admin, handleFunction }) => {
    const canRemove = isAdmin || badgeUser._id === user?._id;
    
    return (
      <motion.div
        className="flex items-center bg-blue-50 text-blue-800 text-xs rounded-full px-2 py-1 max-w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {badgeUser.pic ? (
            <img 
              src={badgeUser.pic} 
              alt={badgeUser.name} 
              className="h-5 w-5 rounded-full object-cover border border-blue-200 flex-shrink-0"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-blue-400 text-white flex items-center justify-center text-xs flex-shrink-0">
              {badgeUser.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{badgeUser.name}</span>
          {badgeUser._id === admin._id && (
            <span className="ml-1 bg-blue-200 text-blue-800 text-xs px-1 rounded flex-shrink-0">
              Admin
            </span>
          )}
        </div>
        {canRemove && (
          <button
            className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none flex-shrink-0"
            onClick={() => confirmRemoveUser(badgeUser)}
            aria-label="Remove user"
          >
            <FiX size={14} />
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <motion.button
        className="flex items-center justify-center p-2 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-600 transition shadow-sm"
        onClick={() => setIsOpen(true)}
        aria-label="View Group Info"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiEye className="h-5 w-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <motion.div 
                ref={modalRef}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                style={{ maxHeight: modalMaxHeight }}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Compact for small screens */}
                <div className="relative px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-teal-500 to-emerald-400">
                  <motion.h2 
                    className="text-lg sm:text-xl font-bold text-white text-center pr-8"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedChat.chatName}
                  </motion.h2>
                  <p className="text-teal-50 text-xs sm:text-sm text-center mt-0.5">
                    {selectedChat.users.length} member{selectedChat.users.length !== 1 ? "s" : ""}
                    {adminOnlyMode && (
                      <span className="ml-2 inline-flex items-center bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded">
                        <FiLock className="mr-1 h-3 w-3" /> Admin Only
                      </span>
                    )}
                  </p>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-2 top-2 sm:right-4 sm:top-4 text-white hover:text-gray-100 focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.button>
                </div>

                {/* Tabs - More visible on smaller screens with icons */}
                <div className="flex border-b border-gray-100">
                  <button
                    className={`flex-1 py-2 sm:py-3 text-center relative ${
                      activeTab === "members" ? "text-teal-600 font-medium" : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("members")}
                  >
                    <div className="flex justify-center items-center gap-1 sm:gap-2">
                      <FiUsers className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Members</span>
                    </div>
                    {activeTab === "members" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                        layoutId="activeTabIndicator"
                      />
                    )}
                  </button>
                  {isAdmin && (
                    <button
                      className={`flex-1 py-2 sm:py-3 text-center relative ${
                        activeTab === "add" ? "text-teal-600 font-medium" : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("add")}
                    >
                      <div className="flex justify-center items-center gap-1 sm:gap-2">
                        <FiPlus className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">Add Users</span>
                      </div>
                      {activeTab === "add" && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                          layoutId="activeTabIndicator"
                        />
                      )}
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className={`flex-1 py-2 sm:py-3 text-center relative ${
                        activeTab === "settings" ? "text-teal-600 font-medium" : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("settings")}
                    >
                      <div className="flex justify-center items-center gap-1 sm:gap-2">
                        <FiSettings className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">Settings</span>
                      </div>
                      {activeTab === "settings" && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                          layoutId="activeTabIndicator"
                        />
                      )}
                    </button>
                  )}
                </div>

                {/* Content area with dynamic height */}
                <div 
                  className="p-3 sm:p-4 space-y-4 overflow-y-auto"
                  style={{ maxHeight: getContentMaxHeight() }}
                >
                  {/* Group members tab */}
                  {activeTab === "members" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-500">Group Members</h3>
                        {isAdmin && (
                          <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pb-2 max-h-32 sm:max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-100">
                        {selectedChat.users.map((u) => (
                          <ModifiedUserBadgeItem
                            key={u._id}
                            user={u}
                            admin={selectedChat.groupAdmin}
                            handleFunction={() => confirmRemoveUser(u)}
                          />
                        ))}
                        {selectedChat.users.length === 0 && (
                          <p className="text-gray-400 text-sm p-2">No members in this group</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Add users tab */}
                  {isAdmin && activeTab === "add" && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-sm font-medium text-gray-500">Add New Members</h3>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search users to add"
                          value={search}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full px-4 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                      </div>

                      {/* Search results - More compact for small screens */}
                      <div className="max-h-32 sm:max-h-40 overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-1 mt-2">
                        {loading ? (
                          <div className="flex justify-center py-4">
                            <div className="h-6 w-6 border-3 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                          </div>
                        ) : searchResult.length > 0 ? (
                          searchResult.map((user) => (
                            <motion.div 
                              key={user._id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <UserListItem 
                                user={user} 
                                handleFunction={() => handleAddUser(user)} 
                                compact={isMobile} // Use compact version for small screens
                              />
                            </motion.div>
                          ))
                        ) : search ? (
                          <div className="text-center py-4 text-gray-500 text-sm">No users found</div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            <FiSearch className="h-5 w-5 mx-auto text-gray-300 mb-1" />
                            Search for users
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Settings tab */}
                  {isAdmin && activeTab === "settings" && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Group Rename Section */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">Rename Group</h3>
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <div className="relative flex-1">
                            <input
                              className="w-full px-4 py-2 pl-9 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                              placeholder="New Group Name"
                              value={groupChatName}
                              onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <FiEdit className="absolute left-3 top-2.5 text-gray-400" />
                          </div>
                          <motion.button
                            onClick={handleRename}
                            className="bg-teal-500 text-white px-3 py-2 text-sm rounded-lg shadow-sm hover:bg-teal-600 disabled:opacity-60 flex items-center justify-center sm:min-w-20"
                            disabled={renameloading}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {renameloading ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              "Update Name"
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Admin-Only Mode Section */}
                      <div className="space-y-2 border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-medium text-gray-500">Message Permissions</h3>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {adminOnlyMode ? (
                                <FiLock className="h-5 w-5 text-orange-500" />
                              ) : (
                                <FiMessageSquare className="h-5 w-5 text-teal-500" />
                              )}
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">
                                  {adminOnlyMode ? "Admin-Only Mode" : "Everyone Can Message"}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {adminOnlyMode 
                                    ? "Only admin can send messages " 
                                    : "All members can send messages "}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              onClick={toggleAdminOnlyMode}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                adminOnlyMode ? "bg-orange-500" : "bg-teal-500"
                              } transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                              disabled={updatingMode}
                              whileTap={{ scale: 0.9 }}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                  adminOnlyMode ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                              {updatingMode && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                </span>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer with leave button */}
                <motion.div 
                  className="flex justify-end p-3 sm:p-4 border-t border-gray-100 bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => confirmRemoveUser(user)}
                    className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-1.5"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiLogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Leave Group</span>
                  </motion.button>
                </motion.div>

                {/* Confirmation dialog */}
                <AnimatePresence>
                  {confirmRemove && (
                    <>
                      <motion.div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div 
                          className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-red-100 p-2 rounded-full text-red-600">
                              <FiAlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Confirm Removal</h3>
                          </div>
                          
                          {/* User info card for who's being removed */}
                          <div className="p-3 bg-gray-50 rounded-lg mb-4 flex items-center gap-3">
                            <div className="flex-shrink-0">
                              {confirmRemove.pic ? (
                                <img 
                                  src={confirmRemove.pic} 
                                  alt={confirmRemove.name} 
                                  className="h-12 w-12 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-blue-400 text-white flex items-center justify-center text-lg">
                                  {confirmRemove.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <FiUser className="h-3.5 w-3.5 text-gray-500" />
                                <span className="truncate">{confirmRemove.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                <FiMail className="h-3.5 w-3.5 text-gray-400" />
                                <span className="truncate">{confirmRemove.email}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4 text-sm sm:text-base leading-tight sm:leading-normal">
                            {confirmRemove._id === user?._id 
                              ? "Are you sure you want to leave this group?" 
                              : windowWidth < 380
                                ? `Remove ${confirmRemove.name}?`
                                : `remove${confirmRemove.name} from this group?`
                            }
                          </p>
                          
                          <div className="flex gap-2 justify-end">
                            <motion.button
                              onClick={cancelRemove}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              Cancel
                            </motion.button>
                            <motion.button
                              onClick={() => handleRemove(confirmRemove)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              disabled={loading}
                            >
                              {loading ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-4" />
                              ) : (
                                confirmRemove._id === user?._id ? "Leave Group" : "Remove"
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UpdateGroupChatModal;