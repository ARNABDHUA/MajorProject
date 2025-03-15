//import inbuilt package
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import landing page components
import LandingPage from "./LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
//error file
import Error404 from "./Error404";
//import CourseModules
import CoursesModules from "./components/Courses/CoursesModules";
// import student login/register
import StudentLogIn from "./components/student/StudentLogIn";
import StudentSingUp from "./components/student/StudentSingUp";
//import header footer components
import ContactUs from "./components/HeaderandFooterComponents/ContactUs";
import About from "./components/HeaderandFooterComponents/About";
import Carrers from "./components/HeaderandFooterComponents/Footer/Carrers";
import Documentation from "./components/HeaderandFooterComponents/Footer/Documentation";
import NewsBlog from "./components/HeaderandFooterComponents/Footer/NewsBlog";
import Library from "./components/HeaderandFooterComponents/Footer/Library";
import FAQ from "./components/HeaderandFooterComponents/Footer/FAQ";
import Forum from "./components/HeaderandFooterComponents/Footer/Forum";
import HowToBecomeTeacher from "./components/HeaderandFooterComponents/Footer/HowToBecomeTeacher";
import SiteMap from "./components/HeaderandFooterComponents/Footer/SiteMap";
import HowtoGuide from "./components/HeaderandFooterComponents/Footer/HowtoGuide";
import NoticeBoard from "./components/HeaderandFooterComponents/Header/NoticeBoard";
import HomePage from "./components/videoCall/HomePage";
import Room from "./components/videoCall/Room";
import TermsAndConditions from "./components/HeaderandFooterComponents/Footer/TermsAndConditions";
const DisplaySetup = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<Error404 />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<StudentLogIn />} />
          <Route path="/signup" element={<StudentSingUp />} />
          <Route path="/courseModules" element={<CoursesModules />} />
          <Route path="/courseModules/:id" element={<CoursesModules />} />
          <Route path="/about" element={<About />} />
          <Route path="/carrers" element={<Carrers />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/newsblog" element={<NewsBlog />} />
          <Route path="/library" element={<Library />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/howtobecometeacher" element={<HowToBecomeTeacher />} />
          <Route path="/howtoguide" element={<HowtoGuide />} />
          <Route path="/termsandcondion" element={<TermsAndConditions />} />
          <Route path="/notice" element={<NoticeBoard />} />
          <Route path="/teacher-live" element={<HomePage />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default DisplaySetup;
