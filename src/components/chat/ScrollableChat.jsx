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
    // console.log(messages);
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
    <ScrollableFeed className="px-3 sm:px-4 md:px-6 lg:px-8">
      {messages &&
        messages.map((m, i) => {
          const isMine = m.sender._id === user?._id;
          const showSenderInfo = !isSameUser(messages, m, i, user?._id) && !isMine;
          const isConsecutiveMessage = isSameUser(messages, m, i, user?._id);

          return (
            <div className="flex flex-col w-full" key={m._id}>
              <div
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                } w-full ${
                  isConsecutiveMessage ? "mt-1" : "mt-3"
                }`}
              >
                {!isMine && (
                  <div className={`flex-shrink-0 ${showSenderInfo ? "visible" : "invisible"}`}>
                    <img
                      className="h-8 w-8 rounded-full object-cover mt-1 mr-2"
                      src={
                        m.sender.pic ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender.name)}`
                      }
                      alt={m.sender.name}
                    />
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[75%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] shadow-md ${
                    isMine
                      ? "bg-blue-100 text-gray-800 rounded-t-2xl rounded-bl-2xl rounded-br-md"
                      : "bg-green-100 text-gray-800 rounded-t-2xl rounded-br-2xl rounded-bl-md"
                  } ${showSenderInfo ? "" : isMine ? "rounded-tr-md" : "rounded-tl-md"}`}
                >
                  {!isMine && showSenderInfo && (
                    <div className="px-3 pt-2 pb-1 border-b border-green-200">
                      <span className="block text-xs md:text-sm font-semibold text-purple-800">
                        {m.sender.name}
                      </span>
                      <span className="block md:text-xs text-[6px] text-gray-500">
                        {m.sender.email}
                      </span>
                    </div>
                  )}

                  <div className="px-3 py-2 text-xs md:text-sm">
                    <span className="break-words block max-h-[250px] overflow-auto custom-scroll">
                      {isValidUrl(m.content) ? (
                        <a
                          href={m.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600  underline break-all hover:text-blue-800"
                        >
                          {m.content}
                        </a>
                      ) : (
                        m.content
                      )}
                    </span>
                   
                    <span className="text-[10px] text-gray-500 block text-right mt-1">
                      {formatTimestamp(m.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;