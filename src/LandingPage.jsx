import React from "react";
import TrendCourse from "./components/LandingPage/TrendCourse";
import Feedback from "./components/LandingPage/Feedback";
import CoursesAndExam from "./components/LandingPage/CoursesAndExam";
import HeroSection from "./components/LandingPage/HeroSection";

const LandingPage = () => {
  console.log("Sourin");
  console.log("Dhua");
  return (
    <div>
      <HeroSection />
      <CoursesAndExam />
      <TrendCourse />
      <Feedback />
    </div>
  );
};

export default LandingPage;
