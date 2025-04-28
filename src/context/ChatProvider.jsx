import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [courseCode, setCourseCode] = useState();
  const [email, setEmail] = useState();
  const [attendance_id,setAttendance_id]=useState(null);

  const history = useNavigate();
  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   const userToken = (localStorage.getItem("token"));
  //   setUser(userInfo);
  //   console.log("context token",userToken)
  //   console.log(userInfo)
  //   setToken(userToken)
  //   if (!userInfo) history("/login");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [history]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        token,
        setToken,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        courseCode,
        setCourseCode,
        email,
        setEmail,
        attendance_id,
        setAttendance_id
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
