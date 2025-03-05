import React from "react";
import {
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaUserTie,
  FaLightbulb,
  FaLaptopCode,
} from "react-icons/fa";

const Careers = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-900 to-gray-900 text-white py-10 text-center shadow-lg">
        <h1 className="text-5xl font-bold">Join Our Team</h1>
        <p className="text-lg mt-2">
          Explore exciting career opportunities with us
        </p>
      </header>

      {/* Careers Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-12 text-gray-900">
          Why Work With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaGraduationCap className="text-6xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Internships</h3>
            <p className="mt-3 text-gray-700">
              Gain hands-on experience and kickstart your career with our
              internship programs.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaBriefcase className="text-6xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Job Openings</h3>
            <p className="mt-3 text-gray-700">
              Explore full-time opportunities and grow with us.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaRocket className="text-6xl text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Career Growth</h3>
            <p className="mt-3 text-gray-700">
              Continuous learning and growth opportunities for professionals.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaUserTie className="text-6xl text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Leadership Roles</h3>
            <p className="mt-3 text-gray-700">
              Take charge and lead teams in various dynamic roles.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaLightbulb className="text-6xl text-yellow-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Innovation</h3>
            <p className="mt-3 text-gray-700">
              Be a part of groundbreaking ideas and bring innovation to life.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-gray-100 p-8 rounded-3xl shadow-lg text-center hover:scale-105 transition-transform hover:shadow-xl">
            <FaLaptopCode className="text-6xl text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Tech Development</h3>
            <p className="mt-3 text-gray-700">
              Work with cutting-edge technology and enhance your coding skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
