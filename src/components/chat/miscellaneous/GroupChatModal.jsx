import axios from "axios";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatState } from "../../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [toast, setToast] = useState(null);

  const { chats, setChats } = ChatState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    setToken(userToken);
  }, []);

  // Improved toast system with automatic stacking and z-index prioritization
  const showToast = (title, description = "", status = "info") => {
    const toastId = Date.now(); // Unique ID for each toast
    setToast({ id: toastId, title, description, status });
    setTimeout(() => {
      setToast((prevToast) => (prevToast?.id === toastId ? null : prevToast));
    }, 3000);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      showToast("User already added", "This user is already in the group", "warning");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    showToast("User added", "Successfully added to group", "success");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `https://e-college-data.onrender.com/v1/chat/chat-user-all?search=${query}`,
        { _id: user._id }
      );
      setSearchResult(data);
    } catch (error) {
      showToast("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
    showToast(`Removed ${delUser.name || "user"}`, "", "info");
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      showToast("Missing Fields", "Please enter a name and add users", "warning");
      return;
    }

    try {
      const { data } = await axios.post(`https://e-college-data.onrender.com/v1/chat/chat-group`, {
        ownId: user._id,
        name: groupChatName,
        user: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      setChats([data, ...chats]);
      showToast("Success", "Group chat created", "success");
      setIsOpen(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearch("");
    } catch (error) {
      showToast("Error", error.response?.data || error.message, "error");
    }
  };

  // Enhanced animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  // Improved toast animation variants
  const toastVariants = {
    hidden: { opacity: 0, y: -20, x: 0 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 400
      }
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  // Get toast color scheme based on status
  const getToastColors = (status) => {
    switch (status) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-emerald-100",
          border: "border-green-500",
          icon: "bg-green-500",
          shadow: "shadow-green-100"
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-rose-100",
          border: "border-red-500",
          icon: "bg-red-500",
          shadow: "shadow-red-100"
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-yellow-100",
          border: "border-amber-500",
          icon: "bg-amber-500",
          shadow: "shadow-amber-100"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-50 to-indigo-100",
          border: "border-blue-500",
          icon: "bg-blue-500",
          shadow: "shadow-blue-100"
        };
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {/* Toast notification - Positioned with fixed positioning and higher z-index */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={toastVariants}
            className={`fixed top-6 right-6 z-[100] p-4 rounded-xl ${getToastColors(toast.status).bg} border-l-4 ${
              getToastColors(toast.status).border
            } shadow-xl ${getToastColors(toast.status).shadow} max-w-md w-auto md:w-96`}
          >
            <div className="flex items-center">
              <div className={`mr-3 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${getToastColors(toast.status).icon} text-white shadow-md`}>
                {toast.status === "success" && (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.status === "error" && (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.status === "warning" && (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.status === "info" && (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold">{toast.title}</h4>
                {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
              </div>
              <button
                onClick={() => setToast(null)}
                className="ml-3 opacity-70 hover:opacity-100 transition-opacity"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Animated progress bar */}
            <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full ${toast.status === "success" ? "bg-green-500" :
                  toast.status === "error" ? "bg-red-500" :
                  toast.status === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={backdropVariants}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                className="relative w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Header - Enhanced with gradient */}
                <div className="flex justify-between items-center p-5 border-b bg-gradient-to-r from-blue-500 to-indigo-600">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                    </svg>
                    Create Group Chat
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Content - Enhanced with better spacing and effects */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] md:max-h-[70vh] bg-gradient-to-b from-blue-50 to-white">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter Group Name"
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white/70 backdrop-blur-sm group-hover:bg-white"
                    />
                    <svg className="absolute left-3 top-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search users to add"
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 bg-white/70 backdrop-blur-sm group-hover:bg-white"
                    />
                    <svg className="absolute left-3 top-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Selected Users with improved animations */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                      </svg>
                      Selected Users {selectedUsers.length > 0 && `(${selectedUsers.length})`}
                    </h4>
                    <div className="flex flex-wrap gap-2 min-h-8">
                      <AnimatePresence>
                        {selectedUsers.map((u) => (
                          <motion.div
                            key={u._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                            transition={{ duration: 0.2 }}
                          >
                            <UserBadgeItem user={u} handleFunction={() => handleDelete(u)} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Search Results with enhanced UI */}
                  <div className="mt-4 border rounded-lg overflow-hidden shadow-sm bg-white">
                    <h4 className="text-sm font-medium text-gray-600 p-3 bg-gray-50 border-b flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      Search Results
                    </h4>
                    {loading ? (
                      <div className="flex items-center justify-center p-8 bg-gray-50">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-sm text-gray-500 font-medium">Searching users...</span>
                      </div>
                    ) : searchResult && searchResult.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        <AnimatePresence>
                          {searchResult.slice(0, 4).map((u) => (
                            <motion.div
                              key={u._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                            >
                              <UserListItem user={u} handleFunction={() => handleGroup(u)} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    ) : search && (
                      <div className="p-8 text-center bg-gray-50">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-gray-500">No users found matching your search</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer - Enhanced with gradient and better button */}
                <div className="p-5 border-t bg-gradient-to-r from-indigo-50 to-blue-100 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Create Group
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GroupChatModal;