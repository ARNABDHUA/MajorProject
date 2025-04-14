import React, { useEffect } from "react";

const EditProfile = () => {
  useEffect(() => {
  const data=JSON.parse(localStorage.getItem("user"))
  const userEmail=data.email
  console.log(userEmail)
  },[])
  
  return <div></div>;
};

export default EditProfile;
