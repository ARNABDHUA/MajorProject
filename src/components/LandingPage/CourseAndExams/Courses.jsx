import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { RiLiveFill } from "react-icons/ri";
import axios from "axios";
import MCA from "/images/artificial-intelligence.png";
import BCA from "/images/computer-science.png";
import BTECH from "/images/data-science.png";
import MBA from "/images/leadership-development.png";
import BBA from "/images/program.png";
import MTECH from "/images/www.png";
import BSCDS from "/images/training-program.png";
import { FiClock } from "react-icons/fi";
import HashLoader from "react-spinners/HashLoader"; // Assuming you're using the same loader as in Login component

const Courses = () => {
  const navigate = useNavigate();
  const imageMap = {
    MCA: MCA,
    BCA: BCA,
    BTECH: BTECH,
    MBA: MBA,
    BBA: BBA,
    MTECH: MTECH,
    "BSC-CS": BSCDS,
  };

  const [reactions, setReactions] = useState({}); // Track reactions for each course by index
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsLoading(true); // Set loading to true when starting the API call
    axios
      .post("https://e-college-data.onrender.com/v1/adminroutine/course-all")
      .then((res) => {
        setCourses(res.data);
        setIsLoading(false); // Set loading to false after data is loaded
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false); // Also set loading to false if there's an error
      });
  }, []);

  const toggleReaction = (index) => {
    setReactions((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the reaction for the clicked course
    }));
  };

  // Function to handle navigation with scroll to top
  const handleCourseClick = (courseId) => {
    window.scrollTo(0, 0); // Scroll to top first
    navigate(`/courseModules/${courseId}`);
  };

  // Show loader while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <HashLoader size={50} color="#3B82F6" />
        <p className="ml-4 text-gray-600 font-medium">Loading courses...</p>
      </div>
    );
  }

  // Show message if no courses are available
  if (!isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-600 text-lg">
          No courses available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-wrap gap-2 md:gap-6 lg:gap-8 items-center justify-center">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col w-72 rounded-xl shadow-lg shadow-gray-300"
          >
            <img
              src={imageMap[course.code]}
              alt={course.name}
              className={`w-72 rounded-t-lg ${course.bgColor} opacity-85 p-8 h-55`}
            />
            <div className="flex justify-between items-center px-4 pt-2">
              <div className="flex space-x-2 justify-between items-center">
                <span className="bg-violet-200 text-violet-600 text-xs px-2 py-1 mt-2 rounded">
                  {course.code}
                </span>
              </div>
              <span
                onClick={() => toggleReaction(index)}
                className="cursor-pointer"
              >
                {reactions[index] ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <CiHeart className="text-gray-500" />
                )}
              </span>
            </div>
            <div className="flex px-4 pt-4 flex-col">
              <div className="border-gray-300 space-y-4 min-h-[170px] border-b">
                <div
                  onClick={() => handleCourseClick(course.course_id)}
                  className="cursor-pointer"
                >
                  <h1 className="text-md md:text-xl font-[500] h-1/3 hover:text-blue-900">
                    {course.name}
                  </h1>
                </div>
                <p className="text-md text-gray-500">
                  {course.description.slice(0, 70)}...
                </p>
              </div>
            </div>
            <div className="m-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FiClock className="text-red-500 text-md" />
                <h6>{course.duration}</h6>
              </div>
              <div>
                <span>
                  <RiLiveFill className="text-md text-green-400" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
