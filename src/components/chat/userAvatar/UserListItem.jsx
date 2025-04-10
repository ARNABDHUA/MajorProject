import { useEffect, useState } from "react";

const UserListItem = ({ handleFunction ,user}) => {
//   const [user, setUser] = useState();
  

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     const userToken = localStorage.getItem("token");
//     setUser(userInfo);
//   }, []);

  if (!user) return null;

  return (
    <div
      onClick={handleFunction}
      className="flex items-center w-full px-3 py-2 mb-2 text-black bg-gray-200 rounded-lg cursor-pointer hover:bg-teal-500 hover:text-white"
    >
      <div className="relative mr-2 w-8 h-8 overflow-hidden rounded-full bg-gray-300 flex-shrink-0">
        {user.pic ? (
          <img
            src={user.pic}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-600">
            {user.name?.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <p>{user.name}</p>
        <p className="text-xs">
          <strong>Email: </strong>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
