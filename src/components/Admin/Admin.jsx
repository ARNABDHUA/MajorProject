import React, { useEffect } from "react";

const Admin = () => {
  useEffect(() => {
    const UserData = JSON.parse(localStorage.getItem("user"));
    console.log("UserData From Admin:", UserData);
  }, []);
  return <div>admin</div>;
};

export default Admin;
