import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const MyCourses = () => {
  const [course, setCourse] = useState([]);
  const [user, setUser] = useState(false);
  const [payment, setPayment] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [myCourse, setMyCourse] = useState([]);
  const [myCourseid, setMyCourseid] = useState("");
  const navigate = useNavigate();

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



  const handlepath =() =>{
    const userData =JSON.parse (localStorage.getItem("user"));
    const course_id = userData.course_code;
    console.log("id",course_id)
    navigate(`/courseModules/${course_id}`)

  }

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
        <div className="bg-gray-100 min-h-screen py-8"> 
          <div className="text-3xl font-medium max-w-4xl mx-auto py-5 px-7 rounded-lg shadow-md overflow-hidden text-white bg-blue-600 ">Your current course</div>
          <div className="">
            {myCourse.length > 0 ? (
              myCourse.map((c, index) => (
                <div key={index} className="max-w-4xl mx-auto px-7 py-8 mt-10 bg-white rounded-lg shadow-md overflow-hidden"> 
                  <h3 className="font-bold text-2xl pb-4  text-gray-700">{c.name}</h3>
                  <p className="text-l text-gray-600 ">Code: {c.code}</p>
                  <p className="text-l mt-2 text-gray-600">Duration:  {c.duration}</p>
                  <p className="mt-2 text-l text-gray-600">{c.description}</p>
                  <p className="mt-2 text-l text-gray-600">Instructor: {c.instructor}</p>
                  <button className="mt-12 w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 border border-blue-700 rounded" onClick={()=>handlepath()}>go to the course</button>
                  
                </div>
              ))
            ) : (
              
              <div className="max-w-4xl mx-auto px-7 py-8 mt-10 bg-white rounded-lg shadow-md text-center text-gray-600">
  Loading your course...
</div>

            )}
          </div>
        </div>
      ) }
    </div>
  );
};

export default MyCourses;