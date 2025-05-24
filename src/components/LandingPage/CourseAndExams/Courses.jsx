import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { RiLiveFill } from "react-icons/ri";
import axios from "axios";
import { FiClock } from "react-icons/fi";
import HashLoader from "react-spinners/HashLoader";

// Skeleton component for individual course card
const CourseSkeleton = () => {
  return (
    <div className="flex flex-col w-72 rounded-xl shadow-lg shadow-gray-300 animate-pulse">
      {/* Image skeleton */}
      <div className="w-72 rounded-t-lg bg-gray-300 p-8 h-55">
        <div className="w-full h-full bg-gray-400 rounded"></div>
      </div>

      {/* Header with badge and heart */}
      <div className="flex justify-between items-center px-4 pt-2">
        <div className="bg-gray-300 h-6 w-16 rounded mt-2"></div>
        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
      </div>

      {/* Content area */}
      <div className="flex px-4 pt-4 flex-col">
        <div className="border-gray-300 space-y-4 min-h-[170px] border-b">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-300 rounded w-full"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="m-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="w-4 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const Courses = () => {
  const navigate = useNavigate();
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

  // Show skeleton loader while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap gap-2 md:gap-6 lg:gap-8 items-center justify-center">
          {/* Render 6 skeleton cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
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
            <div
              className={`w-72 rounded-t-lg ${course.bgColor} opacity-85 p-8 h-55`}
            >
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-contain"
              />
            </div>
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
