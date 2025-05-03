import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  // Function to handle navigation and scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // This scrolls the window to the top
  };

  return (
    <footer className="py-12 bg-white">
      <div className="container mx-auto grid gap-10 grid-cols-1 sm:grid-cols-12 px-6 lg:px-16">
        {/* Logo & About */}
        <div className="sm:col-span-3">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-black">
            <span className="bg-blue-500 text-white p-2 rounded-lg mr-2">
              E-college
            </span>
          </h2>
          <p className="text-black text-sm leading-relaxed">
            Ecollege education theme, built specifically for education centers,
            dedicated to teaching and engaging learners.
          </p>
          {/* Social Media Icons */}
          <div className="flex gap-5 mt-6">
            <div className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <FaFacebook className="text-xl text-blue-500 cursor-pointer" />
            </div>
            <div className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <FaInstagram className="text-xl text-blue-500 cursor-pointer" />
            </div>
            <div className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <FaTwitter className="text-xl text-blue-500 cursor-pointer" />
            </div>
            <div className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-all duration-300">
              <CiLinkedin className="text-xl text-blue-500 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-black">
            Company
          </h2>
          <ul className="text-black space-y-3">
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/about")}
            >
              <span className="mr-2">•</span>About us
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/contact-us")}
            >
              <span className="mr-2">•</span>Contact us
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/newsblog")}
            >
              <span className="mr-2">•</span>News & Blogs
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/library")}
            >
              <span className="mr-2">•</span>Library
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/carrers")}
            >
              <span className="mr-2">•</span>Career
            </li>
          </ul>
        </div>

        {/* Community Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-black">
            Community
          </h2>
          <ul className="text-black space-y-3">
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/documentation")}
            >
              <span className="mr-2">•</span>Documentation
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/faq")}
            >
              <span className="mr-2">•</span>FAQ
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/forum")}
            >
              <span className="mr-2">•</span>Forum
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/sitemap")}
            >
              <span className="mr-2">•</span>Sitemap
            </li>
          </ul>
        </div>

        {/* Teaching Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-black">
            Teaching
          </h2>
          <ul className="text-black space-y-3">
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/howtobecometeacher")}
            >
              <span className="mr-2">•</span>Become a Teacher
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/howtoguide")}
            >
              <span className="mr-2">•</span>How to Guide
            </li>
            <li
              className="hover:text-blue-500 cursor-pointer transition-colors duration-300 flex items-center"
              onClick={() => handleNavigation("/termsandcondion")}
            >
              <span className="mr-2">•</span>Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="sm:col-span-3">
          <h2
            className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200 text-black"
            onClick={() => handleNavigation("/contact-us")}
          >
            Contact
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <p className="text-black text-sm">Toll-Free (9 AM - 8 PM IST)</p>
            <a
              href="tel:+911111111111"
              className="block text-blue-500 font-semibold mt-2 text-lg hover:underline"
            >
              +91 11111 11111
            </a>
            <p className="text-black mt-3 text-sm">
              Email:{" "}
              <a
                href="mailto:ecollege.helper@gmail.com"
                className="text-blue-500 hover:underline"
              >
                ecollege.helper@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto mt-12 border-t border-gray-200 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 lg:px-16">
          <div className="text-black text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Ecollege. All rights reserved.
          </div>
          <div className="flex gap-4 text-black text-sm">
            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/privacy-policy");
              }}
            >
              Privacy Policy
            </a>
            <span>|</span>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/terms-of-service");
              }}
            >
              Terms of Service
            </a>
            <span>|</span>
            <a
              href="#"
              className="hover:text-blue-500 transition-colors duration-300"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/cookie-settings");
              }}
            >
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
