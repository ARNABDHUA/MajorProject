import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import CourseTab from "./CourseModulesTab/CourseTab";
import { Link, useParams } from "react-router-dom";

// Import images
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
import RecordedClassPlayer from "./CourseModulesTab/RecordedClassPlayer";

const imageMap = {
  "Master of Computer Application": MCA,
  "Bachelor of Computer Application": BCA,
  "Bachelor of Technology": BTECH,
  "Master of Business Administration": MBA,
  "Bachelor of Business Administration": BBA,
  "Master of Technology": MTECH,
  "Bachelor of Science in Cyber Security": BSCDS,
};

const CoursesModules = () => {
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [role, setRole] = useState("");
  const [submit, setSubmit] = useState();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCourseid, setisCourseId] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setRole(user.role);
        setSubmit(user.submit);
        const checker = user.course_code === id;
        console.log("id from params", id);
        console.log("id from purchased", user.course_code);
        console.log("Superman", checker);
        setisCourseId(checker);
        setPaymentStatus(user.payment || false);
      }
    } catch (error) {
      console.error("Error accessing user data:", error);
      setPaymentStatus(false);
    }

    // Fetch course data from API
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        const courses = response.data;

        // Find the course based on course_id from URL params
        const foundCourse = courses.find((c) => c.course_id === parseInt(id));

        if (foundCourse) {
          // Add imageUrl from the imageMap
          foundCourse.imageUrl = imageMap[foundCourse.name] || MCA;

          // Temporary schedule (you might want to fetch this from another API endpoint)
          foundCourse.schedule = [
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
          ];

          setCourse(foundCourse);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to load course details");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

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
      return (
        <div className="px-4 md:px-7 py-2">
          <RecordedClassPlayer />
        </div>
      );
    } else if (activeTab === "Routine") {
      return (
        <div className="px-4 md:px-7 py-2">
          <Routine />
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <h1 className="text-center text-xl text-red-500">
        {error || "Course Not Found"}
      </h1>
    );
  }

  return (
    <div className="relative">
      <div className="bg-[#1d3b53] text-white  flex flex-col md:flex-row justify-between gap-9 py-30 px-4  md:p-30 selection:text-red-500">
        {/* Left Section */}
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-[39px] font-bold leading-tight">
            {course.name}
          </h1>
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
          {submit && (
            <p className="text-green-300">You are already registered</p>
          )}
          {paymentStatus ? (
            <div className="bg-yellow-500 text-black font-semibold w-full rounded-lg h-12 mt-4 flex items-center justify-center">
              Already paid
            </div>
          ) : (
            role === "student" && (
              <button className="bg-yellow-500 text-black font-semibold w-full rounded-lg h-12 mt-4 hover:bg-yellow-600 transition">
                {submit ? (
                  isCourseid ? (
                    <Link to="Enrollment-course">Check Status</Link>
                  ) : (
                    <p>Under Progress with different course</p>
                  )
                ) : (
                  <Link to="Enrollment-course">Enroll Course</Link>
                )}
              </button>
            )
          )}
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
