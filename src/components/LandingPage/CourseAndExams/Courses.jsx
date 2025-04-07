import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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

// const courses = [
//   {
//     id: 101,
//     name: "Master of Computer Application",
//     code: "MCA",
//     description:
//       "Dive into the world of cutting-edge technology with our comprehensive MCA program. From software engineering.",
//     imageUrl : MCA,
//     bgColor: "bg-gradient-to-r from-blue-900 to-blue-600",
//     duration: "2 years",
//     instructor: "Abby Caldarone",
//     students: 12433,
//   },
//   {
//     id: 201,
//     name: "Bachelor of Computer Application",
//     code: "BCA",
//     description:
//       "A foundational course that introduces students to the basics of computer applications, programming, and web technologies.",
//     imageUrl: BCA,
//     bgColor: "bg-gradient-to-r from-cyan-500 to-blue-400",
//     duration: "3 years",
//     instructor: "John Smith",
//     students: 20433,
//   },
//   {
//     id: 102,
//     name: "Bachelor of Technology",
//     code: "BTECH",
//     description:
//       "An intensive program focused on engineering principles and advanced technical skills to shape future innovators.",
//     imageUrl: BTECH,
//     bgColor: "bg-gradient-to-r from-red-600 to-orange-400",
//     duration: "4 years",
//     instructor: "Sudip Dasgupta",
//     students: 15433,
//   },
//   {
//     id: 103,
//     name: "Master of Business Administration",
//     code: "MBA",
//     description:
//       "A program designed to cultivate leadership and management skills with a focus on business strategy and innovation.",
//     imageUrl: MBA,
//     bgColor: "bg-gradient-to-r from-yellow-500 to-amber-400",
//     duration: "2 years",
//     instructor: "Subham Chopra",
//     students: 9000,
//   },
//   {
//     id: 104,
//     name: "Bachelor of Business Administration",
//     code: "BBA",
//     description:
//       "An undergraduate program emphasizing business principles, communication, and decision-making skills.",
//     imageUrl: BBA,
//     bgColor: "bg-gradient-to-r from-orange-500 to-red-400",
//     duration: "3 years",
//     instructor: "Akash Yadav",
//     students: 12433,
//   },
//   {
//     id: 105,
//     name: "Master of Technology",
//     code: "MTECH",
//     description:
//       "An advanced technical program focused on research, innovation, and specialized engineering concepts.",
//     imageUrl: MTECH,
//     bgColor: "bg-gradient-to-r from-purple-700 to-pink-500",
//     duration: "3 years",
//     instructor: "Manish Singh",
//     students: 2433,
//   },
//   {
//     id: 106,
//     name: "Bachelor of Science in Cyber Security",
//     code: "BSC-CS",
//     description:
//       "A program designed to equip students with skills in ethical hacking, network security, and digital forensics.",
//     imageUrl: BSCDS,
//     bgColor: "bg-gradient-to-r from-green-700 to-teal-500",
//     duration: "3 years",
//     instructor: "Puja Jain",
//     students: 9433,
//   },
// ];

const Courses = () => {
  const [reactions, setReactions] = useState({}); // Track reactions for each course by index
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    axios
      .post("https://e-college-data.onrender.com/v1/adminroutine/course-all")
      .then((res) => {
        console.log(res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggleReaction = (index) => {
    setReactions((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the reaction for the clicked course
    }));
  };

  return (
    <div className="flex justify-center  items-center ">
      <div className="flex flex-wrap  gap-2 md:gap-6 lg:gap-8   items-center justify-center ">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col  w-72  rounded-xl shadow-lg shadow-gray-300"
          >
            <img
              src={course.imageUrl}
              alt={course.name}
              className={`w-72 rounded-t-lg   ${course.bgColor} opacity-85 p-8  h-55`}
            />
            <div className="flex justify-between items-center px-4 pt-2">
              <div className=" flex space-x-2 justify-between items-center">
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
            <div className="flex px-4 pt-4 flex-col ">
              <div className=" border-gray-300  space-y-4 min-h-[170px] border-b ">
                <NavLink to={`/courseModules/${course.id}`}>
                  <h1 className=" text-md md:text-xl font-[500] h-1/3 hover:text-blue-900 ">
                    {course.name}
                  </h1>
                </NavLink>
                <p className="text-md text-gray-500">
                  {course.description.slice(0, 70)}...
                </p>
              </div>
            </div>
            <div className="m-4 flex justify-between items-center ">
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
