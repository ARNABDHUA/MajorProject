import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import CourseTab from "./CourseModulesTab/CourseTab";

import { Link, useParams } from "react-router-dom";
//it is not good practice when we use dynamic data we have to change
import MCA from "/images/artificial-intelligence.png";
import BCA from "/images/computer-science.png";
import BTECH from "/images/data-science.png";
import MBA from "/images/leadership-development.png";
import BBA from "/images/program.png";
import MTECH from "/images/www.png";
import BSCDS from "/images/training-program.png";
import python from "/images/python.png";
import java from "/images/java.png";
import cpp from "/images/cpp.png";
import dbms from "/images/dbms.png";
import Routine from "./CourseModulesTab/Routine";
//In backend we have to get every data
const courses = [
  {
    id: 101,
    name: "Master of Computer Application",
    code: "MCA",
    description:
      "Dive into the world of cutting-edge technology with our comprehensive MCA program. From software engineeringu.",
    imageUrl: MCA,
    bgColor: "bg-gradient-to-r from-blue-900 to-blue-600",
    duration: "2 years",
    instructor: "Abby Caldarone",
    students: 99999,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 102,
    name: "Bachelor of Computer Application",
    code: "BCA",
    description:
      "A foundational course that introduces students to the basics of computer applications, programming, and web technologies.",
    imageUrl: BCA,
    bgColor: "bg-gradient-to-r from-cyan-500 to-blue-400",
    duration: "3 years",
    instructor: "John Smith",
    students: 20433,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "DataBase Management System",
                topic: "Normalization",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: dbms,
              },
              {
                subject: "C++",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: cpp,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "Java",
                topic: "Java Operator Overloading",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "Python",
                topic: "Numpy",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 103,
    name: "Bachelor of Technology",
    code: "BTECH",
    description:
      "An intensive program focused on engineering principles and advanced technical skills to shape future innovators.",
    imageUrl: BTECH,
    bgColor: "bg-gradient-to-r from-red-600 to-orange-400",
    duration: "4 years",
    instructor: "Sudip Dasgupta",
    students: 15433,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 103,
    name: "Master of Business Administration",
    code: "MBA",
    description:
      "A program designed to cultivate leadership and management skills with a focus on business strategy and innovation.",
    imageUrl: MBA,
    bgColor: "bg-gradient-to-r from-yellow-500 to-amber-400",
    duration: "2 years",
    instructor: "Subham Chopra",
    students: 9000,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 104,
    name: "Bachelor of Business Administration",
    code: "BBA",
    description:
      "An undergraduate program emphasizing business principles, communication, and decision-making skills.",
    imageUrl: BBA,
    bgColor: "bg-gradient-to-r from-orange-500 to-red-400",
    duration: "3 years",
    instructor: "Akash Yadav",
    students: 12433,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 105,
    name: "Master of Technology",
    code: "MTECH",
    description:
      "An advanced technical program focused on research, innovation, and specialized engineering concepts.",
    imageUrl: MTECH,
    bgColor: "bg-gradient-to-r from-purple-700 to-pink-500",
    duration: "3 years",
    instructor: "Manish Singh",
    students: 2433,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 106,
    name: "Bachelor of Science in Cyber Security",
    code: "BSC-CS",
    description:
      "A program designed to equip students with skills in ethical hacking, network security, and digital forensics.",
    imageUrl: BSCDS,
    bgColor: "bg-gradient-to-r from-green-700 to-teal-500",
    duration: "3 years",
    instructor: "Puja Jain",
    students: 9433,
    schedule: [
      {
        week: "Week 1",
        dateRange: "February 10 - 15",
        days: [
          {
            day: "Day 1",
            date: "10th February 2025",
            classes: [
              {
                subject: "Python",
                topic: "Garbage Collection",
                time: "2:00 P.M - 3:00 P.M",
                isLive: true,
                image: python,
              },
              {
                subject: "Java",
                topic: "OOP Concepts",
                time: "4:00 P.M - 5:00 P.M",
                isLive: false,
                image: java,
              },
            ],
          },
          {
            day: "Day 2",
            date: "11th February 2025",
            classes: [
              {
                subject: "C++",
                topic: "STL Overview",
                time: "3:00 P.M - 4:00 P.M",
                isLive: true,
                image: cpp,
              },
              {
                subject: "DBMS",
                topic: "Normalization",
                time: "5:00 P.M - 6:00 P.M",
                isLive: false,
                image: dbms,
              },
            ],
          },
        ],
      },
    ],
  },
];

const CoursesModules = () => {
  const { id } = useParams();
  // Find the course based on id
  const course = courses.find((c) => c.id === parseInt(id));
  console.log("Courses:", course);

  if (!course) {
    return (
      <h1 className="text-center text-xl text-red-500">Course Not Found</h1>
    );
  }
  const tabSection = ["Course", "Recorded Classes", "Routine"];
  const [activeTab, setActiveTab] = useState("Course");

  const renderContent = () => {
    if (activeTab === "Course") {
      return (
        <div className="px-4 md:px-7 py-2">
          <CourseTab course={course} />
        </div>
      );
    } else if (activeTab === "Recorded Classes") {
      return <div className="px-4 md:px-7 py-2">notes</div>;
    } else if (activeTab === "Routine") {
      return (
        <div className="px-4 md:px-7 py-2">
          <Routine />
        </div>
      );
    }
  };
  return (
    <div className="relative">
      <div className="bg-[#1d3b53] text-white  flex flex-col md:flex-row justify-between gap-9 py-30 px-4  md:p-30 selection:text-red-500">
        {/* Left Section */}
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-[39px] font-bold leading-tight">
            {course.name}
          </h1>
          {/* <h1 className="text-3xl md:text-4xl font-bold ">12 Courses in 1</h1> */}
          <p className="mt-4 text-sm">{course.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <p className="font-semibold">{course.instructor}</p>
            <p className="flex items-center md:px-3 text-yellow-400 font-bold">
              <FaStar className="text-yellow-500 mr-1" /> 4.5/5.0
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/4 flex flex-col md:p-2">
          <h1 className="text-xl md:text-xl  flex items-center gap-2">
            <FaUserGraduate className="text-yellow-500" />
            {course.students} already enrolled
          </h1>
          <button className="bg-yellow-500 text-black font-semibold w-full rounded-lg h-12 mt-4 hover:bg-yellow-600 transition">
            <Link to="Enrollment-course">Enroll Course</Link>
          </button>
        </div>
      </div>

      {/* Tab section */}
      <div className="relative min-h-screen pb-20">
        <div className="mx-2 bg-white sm:mx-4 md:mx-10 lg:mx-28 rounded-md shadow-xl flex flex-col gap-4 border absolute -top-10 sm:-top-15 md:-top-20 left-0 right-0 z-10">
          <div className="border-b-2 border-slate-300 overflow-x-auto">
            <div className="flex min-w-max">
              {tabSection.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 sm:py-5 md:py-6 px-4 sm:px-5 md:px-7 whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-700 hover:text-blue-600 border-b-4 border-blue-700 font-medium"
                      : "text-black hover:text-blue-600 font-medium"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="pb-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default CoursesModules;
