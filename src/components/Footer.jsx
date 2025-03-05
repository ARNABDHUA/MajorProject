import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className=" py-10">
      <div className="container mx-auto grid gap-8 grid-cols-1 sm:grid-cols-12 px-6 lg:px-16">
        {/* Logo & About */}
        <div className="sm:col-span-3">
          <h2 className="text-xl font-bold mb-3">Logo</h2>
          <p className="text-gray-400 text-sm">
            Eduport education theme, built specifically for education centers,
            dedicated to teaching and engaging learners.
          </p>
          {/* Social Media Icons */}
          <div className="flex gap-4 mt-4">
            <FaFacebook className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
            <FaInstagram className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
            <FaTwitter className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
            <CiLinkedin className="text-2xl cursor-pointer hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Company Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Company</h2>
          <ul className="text-gray-400 space-y-2">
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/about")}>About us</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/contact-us")}>Contact us</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/newsblog")}>News & Blogs</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/library")}>Library</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/carrers")}>Career</li>
          </ul>
        </div>

        {/* Community Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Community</h2>
          <ul className="text-gray-400 space-y-2">
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/documentation")}>
              Documentation
            </li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/faq")}>FAQ</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/forum")}>Forum</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/sitemap")}>Sitemap</li>
          </ul>
        </div>

        {/* Teaching Section */}
        <div className="sm:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Teaching</h2>
          <ul className="text-gray-400 space-y-2">
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/howtobecometeacher")}>
              Become a Teacher
            </li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/howtoguide")}>How to Guide</li>
            <li className="hover:text-blue-500 cursor-pointer"onClick={() => navigate("/termsandcondion")}>
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="sm:col-span-3">
          <h2 className="text-lg font-semibold mb-3"onClick={() => navigate("/contact-us")}>Contact</h2>
          <p className="text-gray-400">Toll-Free (9 AM - 8 PM IST)</p>
          <a
            href="tel:+911234567890"
            className="block text-blue-400 font-semibold mt-1"
          >
            +91 1234567890
          </a>
          <p className="text-gray-400">
            Email:{" "}
            <a href="mailto:example@gmail.com" className="text-blue-400">
              example@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Eduport. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
