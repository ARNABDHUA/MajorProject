import { useEffect, useState } from "react";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const [me, setMe] = useState();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setMe(userInfo);
  }, []);

  const displayName = me?._id === user._id ? "ME" : user.name;

  return (
    <div
      className="inline-flex items-center justify-between px-2 py-1 m-1 text-[10px] sm:text-xs md:text-sm font-medium text-white bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-all duration-200"
      onClick={handleFunction}
    >
      <span className="truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px]">
        {admin?._id === user._id && (
          <span className="ml-1 text-white bg-blue-600 rounded-full cursor-pointer">
            (Admin)
          </span>
        )}
        {displayName}
      </span>
      <svg
        className="ml-1 w-3 h-3 md:w-4 md:h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
};

export default UserBadgeItem;
