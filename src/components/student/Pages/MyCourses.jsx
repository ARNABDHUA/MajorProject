import axios from "axios";
import React, { useEffect, useState } from "react";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .post(
        `https://e-college-data.onrender.com/v1/adminroutine/course-all?course_id=101`
      )
      .then((res) => {
        console.log("Data@1234", res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <div>hi</div>;
};

export default MyCourses;
