import axios from "axios";
import { useState, useEffect } from "react";
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

  const showToast = (title, description = "", status = "info") => {
    setToast({ title, description, status });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      showToast("User already added", "This user is already in the group", "warning");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
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

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-xl w-[90%] max-w-md bg-white border-l-4 ${
            toast.status === "success"
              ? "border-green-500"
              : toast.status === "error"
              ? "border-red-500"
              : "border-yellow-500"
          }`}
        >
          <div className="text-sm font-semibold">
            {toast.status === "success" && "✅ "}
            {toast.status === "error" && "❌ "}
            {toast.status === "warning" && "⚠️ "}
            {toast.title}
          </div>
          {toast.description && <p className="text-xs text-gray-600 mt-1">{toast.description}</p>}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800">Create Group Chat</h3>
              <button onClick={() => setIsOpen(false)}>
                <svg className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <input
                type="text"
                placeholder="Enter Group Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="text"
                placeholder="Search users to add"
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
              />

              {/* Selected Users */}
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((u) => (
                  <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                ))}
              </div>

              {/* Search Results */}
              {loading ? (
                <div className="text-center text-sm text-gray-500">Searching...</div>
              ) : (
                <div className="space-y-2">
                  {searchResult?.slice(0, 4).map((u) => (
                    <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
