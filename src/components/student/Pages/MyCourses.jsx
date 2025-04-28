import axios from "axios";
import React, { useEffect, useState } from "react";

const MyCourses = () => {
  const [course, setCourse] = useState([]);
  const [user, setUser] = useState(false);
  const [payment, setPayment] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourse, setMyCourse] = useState([]);
  const [myCourseid, setMyCourseid] = useState("");

  useEffect(() => {
    axios.get("https://e-college-data.onrender.com/v1/adminroutine/course-all-id")
      .then((res) => {
        console.log(res.data);
        setAllCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
    
  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      console.log("No user data found");
      return;
    }
    
    const userdata = JSON.parse(userData);
    console.log(userdata.payment);
    setPayment(userdata.payment);
    
    const rollcheck = userdata.c_roll;
    const course_id = userdata.course_code;
    setMyCourseid(course_id);
    console.log(rollcheck);
    console.log(course_id);
    console.log(myCourseid);
    console.log(allCourses);
    
    if (!rollcheck) {
      axios
        .get(`https://e-college-data.onrender.com/v1/adminroutine/course-all-id?course_id=${course_id}`)
        .then((res) => {
          console.log("course", res.data);
          setCourse(res.data);
          setUser(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get("https://e-college-data.onrender.com/v1/adminroutine/course-all-id")
        .then((res) => { 
          setCourse(res.data);
          setUser(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // This useEffect will filter and set your particular course
  useEffect(() => {
    if (myCourseid && allCourses.length > 0) {
      // Convert myCourseid to a number for comparison if it's a string
      const courseIdToCompare = typeof myCourseid === 'string' ? parseInt(myCourseid, 10) : myCourseid;
      
      const filteredCourse = allCourses.filter(course => course.course_id === courseIdToCompare);
      setMyCourse(filteredCourse);
      console.log("My filtered course:", filteredCourse);
    }
  }, [myCourseid, allCourses]);
  
  return (
    <div>
      {payment && (
        <div> 
          <div className="text-xl font-bold mb-4">Your current course</div>
          <div>
            {myCourse.length > 0 ? (
              myCourse.map((c, index) => (
                <div key={index} className="bg-blue-100 p-4 mb-2 rounded"> 
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <img src="" alt="" />
                  <p className="text-sm text-gray-600">Code: {c.code}</p>
                  <p className="text-sm text-gray-600">Duration: {c.duration}</p>
                  <p className="mt-2">{c.description}</p>
                  <p className="mt-2 text-sm">Instructor: {c.instructor}</p>
                  
                </div>
              ))
            ) : (
              <div>Loading your course...</div>
            )}
          </div>
        </div>
      ) }
    </div>
  );
};

export default MyCourses;