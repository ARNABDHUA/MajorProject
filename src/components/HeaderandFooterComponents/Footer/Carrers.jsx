import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaGraduationCap,
  FaUsers,
  FaLaptopCode,
  FaBookOpen,
  FaChalkboardTeacher,
  FaSearch,
} from "react-icons/fa";
import { BsArrowRight, BsSearch } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

const Careers = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { name: "All", icon: <FaUsers /> },
    { name: "Faculty", icon: <FaChalkboardTeacher /> },
    { name: "Technology", icon: <FaLaptopCode /> },
    { name: "Administration", icon: <FaBriefcase /> },
    { name: "Student Services", icon: <FaGraduationCap /> },
    { name: "Research", icon: <FaBookOpen /> },
  ];

  const jobs = [
    {
      id: 1,
      title: "Senior Professor - Computer Science",
      department: "Faculty",
      location: "Main Campus",
      type: "Full-time",
      posted: "2 days ago",
      description:
        "Lead undergraduate and graduate courses in Computer Science with a focus on AI and Machine Learning.",
    },
    {
      id: 2,
      title: "Web Development Instructor",
      department: "Faculty",
      location: "Online",
      type: "Part-time",
      posted: "1 week ago",
      description:
        "Teach modern web development techniques including React, Node.js, and responsive design principles.",
    },
    {
      id: 3,
      title: "Full Stack Developer",
      department: "Technology",
      location: "Remote",
      type: "Full-time",
      posted: "3 days ago",
      description:
        "Build and maintain our education platform with React, Node.js, and AWS infrastructure.",
    },
    {
      id: 4,
      title: "Student Success Coordinator",
      department: "Student Services",
      location: "East Campus",
      type: "Full-time",
      posted: "5 days ago",
      description:
        "Guide students through their academic journey and ensure they have access to needed resources.",
    },
    {
      id: 5,
      title: "Admissions Officer",
      department: "Administration",
      location: "Main Campus",
      type: "Full-time",
      posted: "1 day ago",
      description:
        "Review applications, conduct interviews, and help build our diverse student community.",
    },
    {
      id: 6,
      title: "Research Assistant - Educational Technology",
      department: "Research",
      location: "Innovation Lab",
      type: "Contract",
      posted: "1 week ago",
      description:
        "Support research initiatives exploring the intersection of technology and educational outcomes.",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      activeCategory === "All" || job.department === activeCategory;
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help shape the future of education and make a lasting impact in the
            lives of students around the world.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
            <div className="inline-block p-4 bg-blue-100 rounded-lg mb-4">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inclusive Community</h3>
            <p className="text-gray-600">
              Join a diverse team committed to educational excellence and
              innovation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
            <div className="inline-block p-4 bg-purple-100 rounded-lg mb-4">
              <FaGraduationCap className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
            <p className="text-gray-600">
              Develop your skills with professional development and career
              advancement.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
            <div className="inline-block p-4 bg-green-100 rounded-lg mb-4">
              <FaBriefcase className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
            <p className="text-gray-600">
              Make a difference in education through innovative teaching and
              technology.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search for positions..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.name
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MdLocationOn className="mr-1" />
                          {job.location}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{job.type}</span>
                        <span className="mx-2">•</span>
                        <span>{job.posted}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {job.department}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6">{job.description}</p>

                  <motion.button
                    whileHover={{ x: 5 }}
                    className="flex items-center font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View Details <BsArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-16 text-center">
              <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                No positions found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900">Our Values</h2>
            <p className="text-lg text-gray-600 mt-2">
              The principles that guide our work and culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Innovation",
                description:
                  "We embrace new ideas and technologies to improve education.",
                color: "bg-blue-50 border-blue-200",
              },
              {
                title: "Inclusion",
                description:
                  "We celebrate diversity and create equal opportunities for all.",
                color: "bg-green-50 border-green-200",
              },
              {
                title: "Excellence",
                description:
                  "We strive for the highest standards in everything we do.",
                color: "bg-yellow-50 border-yellow-200",
              },
              {
                title: "Collaboration",
                description:
                  "We work together across disciplines to achieve our goals.",
                color: "bg-purple-50 border-purple-200",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border ${value.color}`}
              >
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-20 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Don't see the right position?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send
            us your resume and we'll keep you in mind for future opportunities.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
          >
            Submit Your Resume
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Careers;
