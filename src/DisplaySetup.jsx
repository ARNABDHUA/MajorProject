import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
//import landing page components
import LandingPage from "./LandingPage";

//error file
import Error404 from "./Error404";
//import CourseModules
import CoursesModules from "./components/Courses/CoursesModules";
// import student login/register

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
// import HomePage from "./components/videoCall/HomePage";
// import Room from "./components/videoCall/Room";
import TermsAndConditions from "./components/HeaderandFooterComponents/Footer/TermsAndConditions";
import Layout from "./components/Teachers/Layout/Layout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Teacherlive from "./components/Teachers/Live/TeacherLive";
import Room from "./components/Teachers/Live/Room";
import Student from "./components/Teachers/Pages/Student";
import Examination from "./components/Teachers/Pages/Examination";
import Courses from "./components/Teachers/Pages/Courses";
import Schedule from "./components/Teachers/Pages/Schedule";
import Reports from "./components/Teachers/Pages/Reports";
import Settings from "./components/Teachers/Pages/Settings";
import Admin from "./components/Admin/Admin";
import TeacherLogin from "./components/Teachers/Auth/TeacherLogin";
import TeacherProfile from "./components/Teachers/TeacherProfile";
import StudentLayout from "./components/student/Layout/StudentLayout";
import StudentProfile from "./components/student/StudentProfile";
import MyCourses from "./components/student/Pages/MyCourses";
import PaymentInfo from "./components/student/Pages/PaymentInfo";
import StudentAttendence from "./components/student/Pages/StudentAttendence";
import Quiz from "./components/student/Pages/Quiz";
import EditProfile from "./components/student/Pages/EditProfile";
import StudentLive from "./components/student/Pages/StudentLive";
import StudentLogin from "./components/student/Auth/StudentLogIn";
import StudentSignup from "./components/student/Auth/StudentSingUp";
import ChatRoom from "./components/student/Pages/ChatRoom";

// Create a layout component with Navbar and Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const DisplaySetup = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Teacher dashboard routes - NO navbar/footer */}
          <Route element={<Layout />}>
            <Route path="/teacher-home" element={<TeacherProfile />} />
            <Route path="/live-teacher" element={<Teacherlive />} />

            <Route path="/teacher-students" element={<Student />} />
            <Route path="/teacher-examination" element={<Examination />} />
            <Route path="/teacher-courses" element={<Courses />} />
            <Route path="/teacher-schedule" element={<Schedule />} />
            <Route path="/teacher-reports" element={<Reports />} />
            <Route path="/teacher-settings" element={<Settings />} />
          </Route>
          {/* Admin */}
          <Route path="/admin" element={<Admin />} />
          {/* Student */}
          <Route element={<StudentLayout />}>
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/student-courses" element={<MyCourses />} />
            <Route path="/student-payments" element={<PaymentInfo />} />
            <Route path="/student-attendance" element={<StudentAttendence />} />
            <Route path="/student-chat" element={<ChatRoom />} />
            <Route path="/student-quiz" element={<Quiz />} />
            <Route path="/student-edit-profile" element={<EditProfile />} />
            <Route path="/student-live-class" element={<StudentLive />} />
            <Route path="/teacher-settings" element={<Settings />} />
          </Route>
          {/* Error404 */}
          <Route path="*" element={<Error404 />} />

          <Route path="/room/:roomId" element={<Room />} />
          {/* Regular routes WITH navbar/footer */}
          <Route element={<MainLayout />}>
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/signup" element={<StudentSignup />} />
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
            <Route
              path="/howtobecometeacher"
              element={<HowToBecomeTeacher />}
            />
            <Route path="/howtoguide" element={<HowtoGuide />} />
            <Route path="/termsandcondion" element={<TermsAndConditions />} />
            <Route path="/notice" element={<NoticeBoard />} />
            {/* <Route path="/teacher-live" element={<HomePage />} />
            <Route path="/room/:roomId" element={<Room />} /> */}
            <Route path="/teacher-login" element={<TeacherLogin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default DisplaySetup;
