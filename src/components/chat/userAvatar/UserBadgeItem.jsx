import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setMe(userInfo);
  }, []);

  const isMe = me?._id === user._id;
  const isAdmin = admin?._id === user._id;

  return (
    <motion.div
      className={`
        relative inline-flex items-center gap-1.5 px-2.5 py-1.5 m-1 
        text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-all duration-200
        ${isMe 
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md" 
          : isAdmin 
            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm hover:shadow-md" 
            : "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:shadow-md"
        }
        hover:z-30 z-10
      `}
      onClick={handleFunction}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex items-center gap-1.5">
        {/* Profile Initial Circle */}
        <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[9px] sm:text-[11px] font-bold uppercase">
          {user.name?.charAt(0) || "U"}
        </div>
        
        {/* User info container */}
        <div className="flex flex-col min-w-0">
          {/* Name with truncation */}
          <div className="flex items-center gap-1">
            <span className="truncate max-w-[80px] sm:max-w-[100px] md:max-w-[120px]">
              {isMe ? "You" : user.name}
            </span>
            
            {/* Badge indicators */}
            {isAdmin && (
              <span className="text-[8px] sm:text-[10px] px-1 py-0.5 bg-white/20 rounded-sm ml-0.5">
                Admin
              </span>
            )}
            {isMe && !isAdmin && (
              <span className="text-[8px] sm:text-[10px] px-1 py-0.5 bg-white/20 rounded-sm ml-0.5">
                You
              </span>
            )}
          </div>
          
          {/* Email display - always visible */}
          <span className="text-[8px] sm:text-[9px] text-white/80 truncate max-w-[90px] sm:max-w-[110px] md:max-w-[130px]">
            {user.email || "No email available"}
          </span>
        </div>
      </div>
      
      {/* Close icon */}
      <svg
        className="ml-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 hover:text-white relative z-20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.div>
  );
};

// For when we want a simpler, more compact version for smaller screens
export const CompactUserBadgeItem = ({ user, handleFunction, admin }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setMe(userInfo);
  }, []);

  const isMe = me?._id === user._id;
  const isAdmin = admin?._id === user._id;

  return (
    <motion.div
      className={`
        inline-flex items-center gap-1 px-2 py-1 m-0.5 
        text-[10px] rounded-full cursor-pointer z-10 hover:z-30
        ${isMe 
          ? "bg-blue-500 text-white" 
          : isAdmin 
            ? "bg-purple-500 text-white" 
            : "bg-teal-500 text-white"
        }
      `}
      onClick={handleFunction}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">
          {user.name?.charAt(0) || "U"}
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="truncate max-w-[60px] leading-none">
            {isMe ? "You" : user.name}
          </span>
          <span className="text-[7px] text-white/80 truncate max-w-[60px] leading-tight">
            {user.email || "No email"}
          </span>
        </div>
      </div>
      
      <svg
        className="w-2.5 h-2.5 text-white/70 z-20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </motion.div>
  );
};

export default UserBadgeItem;