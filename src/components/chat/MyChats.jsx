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

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    setToken(userToken);
  }, []);

  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const ownId = userInfo._id;

      const  data  = await axios.post(
        "http://localhost:3000/v1/chat/chat-fatch",
        { ownId:ownId }
      );
      console.log(data.data)
      setChats(data.data);
    } catch (error) {
      toast.error("Failed to Load the chats", {
        duration: 5000,
        position: "bottom-left",
        style: {
          background: "#f87171", // Tailwind red-400
          color: "#fff",
          fontWeight: "500",
          borderRadius: "0.5rem",
          padding: "12px 16px",
        },
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-[31%] rounded-lg border border-gray-300`}
    >
      {/* Header */}
      <div className="pb-3 px-3 text-[28px] md:text-[30px] font-['Work_Sans'] flex justify-between items-center w-full">
        My Chats
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
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="font-semibold">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs mt-1">
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
