import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "./config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import { toast } from "react-hot-toast";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    setToken(userToken);
  }, []);

  const { 
    selectedChat, 
    setSelectedChat, 
    chats, 
    setChats, 
    notification, 
    setNotification 
  } = ChatState();

  const fetchChats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const ownId = userInfo._id;

      const data = await axios.post(
        "https://e-college-data.onrender.com/v1/chat/chat-fatch",
        { ownId: ownId }
      );
      setChats(data.data);
      fetchUnreadCounts(data.data, ownId);
    } catch (error) {
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

  // Fetch unread counts for each chat
  const fetchUnreadCounts = async (chatList, userId) => {
    try {
      const counts = {};
      
      // This would normally be an API call to get unread counts
      // For now, we'll simulate with a mock implementation
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/chat/unread-counts",
        { userId: userId }
      );
      
      // If your backend doesn't have this endpoint yet, you can modify this part
      // to use the existing data structure for now
      if (response && response.data) {
        setUnreadCounts(response.data);
      } else {
        // Fallback mock implementation until backend is updated
        chatList.forEach(chat => {
          if (chat.latestMessage && chat.latestMessage.sender._id !== userId) {
            // Check if notification contains this chat
            const hasNotification = notification.some(n => n.chat._id === chat._id);
            counts[chat._id] = hasNotification ? 1 : 0;
          } else {
            counts[chat._id] = 0;
          }
        });
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
      // Fallback approach using notifications array
      const counts = {};
      chatList.forEach(chat => {
        counts[chat._id] = notification.filter(n => n.chat._id === chat._id).length;
      });
      setUnreadCounts(counts);
    }
  };

  // Mark messages as read when selecting a chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    
    // Remove notifications for this chat
    if (notification.length > 0) {
      setNotification(notification.filter((n) => n.chat._id !== chat._id));
    }
    
    // Reset unread count for this chat
    setUnreadCounts(prev => ({
      ...prev,
      [chat._id]: 0
    }));
    
    // In a real implementation, you would also call an API to mark messages as read
    // For example:
    // axios.post("https://e-college-data.onrender.com/v1/chat/mark-read", {
    //   chatId: chat._id,
    //   userId: loggedUser._id
    // });
  };

  // Get total unread message count
  const getTotalUnreadCount = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain, notification]);

  return (
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
          <button className="flex items-center gap-2 text-[17px] md:text-[10px] lg:text-[17px] px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            New Group Chat <span className="text-lg">+</span>
          </button>
        </GroupChatModal>
      </div>

      {/* Chat List */}
      <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-hidden">
        {chats ? (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                } relative`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </p>
                  {unreadCounts[chat._id] > 0 && (
                    <span className={`${
                      selectedChat === chat ? "bg-white text-teal-500" : "bg-red-500 text-white"
                    } text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1`}>
                      {unreadCounts[chat._id]}
                    </span>
                  )}
                </div>
                {chat.latestMessage && (
                  <p className={`text-xs mt-1 ${unreadCounts[chat._id] > 0 && selectedChat !== chat ? "font-bold" : ""}`}>
                    <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;