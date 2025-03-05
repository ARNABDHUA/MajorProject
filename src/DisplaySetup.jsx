import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Error404 from "./Error404";
import ContactUs from "./components/ContactUs";
import CoursesModules from "./components/Courses/CoursesModules";
import StudentLogIn from "./components/student/StudentLogIn";
import StudentSingUp from "./components/student/StudentSingUp";
import About from "./components/About";
import Carrers from "./components/Carrers";
import Documentation from "./components/Documentation";
import NewsBlog from "./components/NewsBlog";
import Library from "./components/Library";
import FAQ from "./FAQ";
import Forum from "./Forum";
import HowToBecomeTeacher from "./HowToBecomeTeacher";
import SiteMap from "./components/SiteMap";
import HowtoGuide from "./components/HowtoGuide";
import Termsandcondion from "./Termsandcondion";
import NoticeBoard from "./components/NoticeBoard";
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
          <Route path="/termsandcondion" element={<Termsandcondion />} />
          <Route path="/notice" element={<NoticeBoard />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default DisplaySetup;
