import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ChatState } from "../../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat } = ChatState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    setToken(userToken);
  }, []);

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
    if (!query) return;
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.post(
        `http://localhost:3000/v1/chat/chat-user-all?search=${query}`,
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
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.post(`http://localhost:3000/v1/chat/chat-group-rename`, {
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
      setGroupChatName("");
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
      const { data } = await axios.post(`http://localhost:3000/v1/chat/chat-group-add`, {
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

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      showToast("Only admins can remove someone", "", "error");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:3000/v1/chat/chat-group-remove`, {
        chatId: selectedChat._id,
        userId: user1._id,
      });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      showToast("Success", "User removed", "success");
    } catch (error) {
      showToast("Error", error.response?.data?.message || "Failed to remove user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition"
        onClick={() => setIsOpen(true)}
        aria-label="View Group Info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>

          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 md:mx-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="relative px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-center">{selectedChat.chatName}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Scrollable horizontal user badges */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>

              {/* Rename group */}
              <div className="flex gap-2">
                <input
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="New Group Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <button
                  onClick={handleRename}
                  className="bg-teal-500 text-white px-4 rounded-md hover:bg-teal-600 disabled:opacity-60"
                  disabled={renameloading}
                >
                  {renameloading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search users to add"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Scrollable search results */}
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {loading ? (
                  <div className="flex justify-center py-3">
                    <div className="h-6 w-6 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  searchResult.map((user) => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={() => handleRemove(user)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;
