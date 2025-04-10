import { useEffect, useState } from "react";
import Chatbox from "../Chatbox";
import MyChats from "../MyChats";
import SideDrawer from "../miscellaneous/SideDrawer";
import { ChatState } from "../../../context/ChatProvider";
import { Toaster } from "react-hot-toast";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [user,setUser]=useState();
  const [token,setToken]=useState();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userToken = (localStorage.getItem("token"));
    setUser(userInfo);
    // console.log("context token",userToken)
    // console.log(userInfo)
    setToken(userToken)
  }, [])

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <div className="w-full">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full h-[91.5vh] p-2.5">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
    </>
  );
};

export default Chatpage;