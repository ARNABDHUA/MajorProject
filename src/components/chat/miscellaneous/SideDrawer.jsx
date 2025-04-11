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

  const notificationRef = useRef();
  const profileRef = useRef();

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
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white w-full px-4 py-2 border-b border-gray-200">
        {/* Search Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
        >
          <FiSearch className="w-5 h-5" />
          <span className="hidden md:flex px-4">Search User</span>
        </button>

        {/* App Title */}
        <p className="text-xl md:text-2xl font-['Work_Sans']">E-college</p>

        {/* Right Section */}
        <div className="flex items-center gap-3 relative">
          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-1"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
            >
              {notification.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
              )}
              <Bell className="w-6 h-6 ml-1" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50 max-h-64 overflow-y-auto">
                {notification.length === 0 ? (
                  <div className="px-4 py-2 text-sm">No New Messages</div>
                ) : (
                  notification.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(notification.filter((n) => n !== notif));
                        setShowNotifications(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(user, notif.chat.users)}`}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          {/* <div className="relative" ref={profileRef}>
            <button
              className="flex items-center gap-2 bg-white border px-2 py-1 rounded hover:bg-gray-100"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
            >
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={user?.pic}
                alt={user?.name}
              />
              <ChevronDown className="w-4 h-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
                <ProfileModal user={user}>
                  <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                    My Profile
                  </div>
                </ProfileModal>
                <hr className="my-1" />
                <div
                  onClick={logoutHandler}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
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
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative bg-white w-full sm:w-[350px] max-w-sm h-full z-50 shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="font-semibold text-lg">Search Users</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col sm:flex-row gap-2 pb-3">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go
                </button>
              </div>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}

              {loadingChat && (
                <div className="flex justify-center mt-2">
                  <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Bottom Close Button */}
            <div className="border-t p-3">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
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
