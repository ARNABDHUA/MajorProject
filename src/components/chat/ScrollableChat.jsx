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

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, []);

  const formatTimestamp = (isoString) => {
    const messageDate = new Date(isoString);
    const indiaDate = new Date(
      messageDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const hours = indiaDate.getHours() % 12 || 12;
    const minutes = indiaDate.getMinutes().toString().padStart(2, "0");
    const ampm = indiaDate.getHours() >= 12 ? "PM" : "AM";
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const isSameDay =
      indiaDate.getDate() === now.getDate() &&
      indiaDate.getMonth() === now.getMonth() &&
      indiaDate.getFullYear() === now.getFullYear();

    const diffInMs = now.getTime() - indiaDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (isSameDay || diffInHours < 24) {
      return timeStr;
    }

    const dateStr = indiaDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `${dateStr} | ${timeStr}`;
  };

  const isValidUrl = (text) => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  return (
    <ScrollableFeed className="px-2 sm:px-4">
      {messages &&
        messages.map((m, i) => {
          const isMine = m.sender._id === user?._id;
          const showSenderInfo = !isSameUser(messages, m, i, user?._id) && !isMine;

          return (
            <div className="flex flex-col" key={m._id}>
              <div className={`flex items-start gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
                {!isMine && showSenderInfo && (
                  <div className="flex flex-col items-center mt-1">
                    <img
                      className="h-8 w-8 rounded-full shadow-md"
                      src={
                        m.sender.pic ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender.name)}`
                      }
                      alt={m.sender.name}
                    />
                  </div>
                )}

                <div
                  className={`relative flex flex-col max-w-[85%] sm:max-w-[70%] md:max-w-[60%] px-4 py-2 rounded-2xl shadow-md text-sm ${
                    isMine
                      ? "bg-blue-100 text-gray-800 self-end"
                      : "bg-green-100 text-gray-800"
                  }`}
                  style={{
                    marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                    marginTop: isSameUser(messages, m, i, user?._id)
                      ? "3px"
                      : "10px",
                  }}
                >
                  {!isMine && showSenderInfo && (
                    <span className="text-xs sm:text-sm font-semibold text-purple-800 mb-1 flex items-center gap-1">
                      {m.sender.name}
                    </span>
                  )}
                  <span className="break-words max-h-[250px] overflow-auto custom-scroll pr-1">
                    {isValidUrl(m.content) ? (
                      <a
                        href={m.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all hover:text-blue-800"
                      >
                        {m.content}
                      </a>
                    ) : (
                      m.content
                    )}
                  </span>
                  <span className="text-[10px] text-gray-500 text-right mt-1">
                    {formatTimestamp(m.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
