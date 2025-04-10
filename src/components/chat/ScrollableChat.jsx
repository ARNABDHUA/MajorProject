import { useState, useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = localStorage.getItem("token");
    setUser(userInfo);
    // console.log(userInfo);
    setToken(userToken);
  }, []);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user?._id) ||
              isLastMessage(messages, i, user?._id)) && (
              <div className="group relative">
                <img
                  className="mt-2 mr-1 h-8 w-8 rounded-full cursor-pointer"
                  alt={m.sender.name}
                  src={m.sender.pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender.name)}`}
                />
                <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded px-2 py-1 bottom-full mb-1 whitespace-nowrap">
                  {m.sender.name}
                  <div className="absolute top-full left-0 w-0 h-0 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
            <span
              className={`rounded-3xl px-4 py-1 max-w-3/4`}
              style={{
                backgroundColor: m.sender._id === user?._id ? "#BEE3F8" : "#B9F5D0",
                marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                marginTop: isSameUser(messages, m, i, user?._id) ? "3px" : "10px",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;