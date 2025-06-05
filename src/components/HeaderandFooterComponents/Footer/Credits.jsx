import React from "react";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaUsers,
  FaStar,
  FaHeart,
  FaTrophy,
  FaUserTie,
} from "react-icons/fa";
import { HiAcademicCap, HiLightBulb } from "react-icons/hi";
import { RiTeamFill } from "react-icons/ri";

import ArnabDhua from "../../../US/ArnabDhua.jpg";
import ShreyaManna from "../../../US/SHREYAMANNA.jpg";
import ParbatNilBera from "../../../US/PHOTOMT.jpg";
import SourinDhua from "../../../US/SourinDhua.png";
import FarhanAkhtar from "../../../US/FarhanAkhtar.jpg";

const Credits = () => {
  const teamMembers = [
    {
      name: "Arnab Dhua",
      rollNo: "13071023053",
      image: ArnabDhua,
      color: "red",
      bgGradient: "from-red-500 to-red-600",
      borderColor: "border-red-500",
      shadowColor: "shadow-red-500/30",
    },
    {
      name: "Shreya Manna",
      rollNo: "13071023036",
      image: ShreyaManna,
      color: "violet",
      bgGradient: "from-violet-500 to-violet-600",
      borderColor: "border-violet-500",
      shadowColor: "shadow-violet-500/30",
    },
    {
      name: "Parbat Nil Bera",
      rollNo: "13071023024",
      image: ParbatNilBera,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      shadowColor: "shadow-blue-500/30",
    },
    {
      name: "Sourin Dhua",
      rollNo: "13071023059",
      image: SourinDhua,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      borderColor: "border-green-500",
      shadowColor: "shadow-green-500/30",
    },
    {
      name: "Farhan Akhtar",
      rollNo: "13071023015",
      image: FarhanAkhtar,
      color: "yellow",
      bgGradient: "from-yellow-500 to-yellow-600",
      borderColor: "border-yellow-500",
      shadowColor: "shadow-yellow-500/30",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="flex justify-center mb-6"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <FaGraduationCap className="text-6xl text-blue-600" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              PROJECT CREDITS
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-4">
              E-College Management System
            </h2>
            <motion.div
              className="flex justify-center items-center space-x-2 text-lg text-gray-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <FaTrophy className="text-yellow-500" />
              <span>Academic Excellence Project</span>
              <FaTrophy className="text-yellow-500" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Team Members Section */}
      <motion.div
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="flex justify-center items-center space-x-3 mb-6">
            <RiTeamFill className="text-4xl text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Our Amazing Team
            </h2>
            <RiTeamFill className="text-4xl text-blue-600" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="group"
              variants={cardVariants}
              whileHover="hover"
            >
              <div
                className={`relative bg-white rounded-3xl p-6 shadow-2xl ${member.shadowColor} transition-all duration-300 border-2 ${member.borderColor} hover:shadow-3xl`}
              >
                {/* Animated background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${member.bgGradient} opacity-5 rounded-3xl`}
                ></div>

                {/* Profile Image */}
                <motion.div
                  className="relative mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className={`w-32 h-32 mx-auto rounded-full overflow-hidden border-4 ${member.borderColor} shadow-lg`}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${member.bgGradient} rounded-full flex items-center justify-center`}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <FaStar className="text-white text-sm" />
                  </motion.div>
                </motion.div>

                {/* Member Info */}
                <div className="text-center relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-medium mb-4">
                    Roll No: {member.rollNo}
                  </p>
                  <motion.div
                    className={`w-full h-1 bg-gradient-to-r ${member.bgGradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                  ></motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-4 right-4 text-gray-300"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiLightBulb className="text-xl" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Mentor Section */}
      <motion.div
        className="py-16 bg-gradient-to-r from-gray-50 to-blue-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaUserTie className="text-6xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Our Esteemed Mentor
            </h3>
            <h4 className="text-2xl font-semibold text-blue-600 mb-6">
              Prof. (Dr.) Monalisa Banerjee
            </h4>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Project Description */}
      <motion.div
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <motion.div
            className="text-center mb-10"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <div className="flex justify-center items-center space-x-3 mb-6">
              <HiAcademicCap className="text-4xl text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Project Journey
              </h2>
              <HiAcademicCap className="text-4xl text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <p className="text-lg md:text-xl mb-6 text-center font-medium text-gray-800">
              A team of five committed members successfully executed the
              E-College Management System project:
              <span className="font-bold text-red-600"> Arnab Dhua</span>,
              <span className="font-bold text-blue-600"> Parbat Nil Bera</span>,
              <span className="font-bold text-yellow-600"> Farhan Akhtar</span>,
              <span className="font-bold text-violet-600"> Shreya Manna</span>,
              and
              <span className="font-bold text-green-600"> Sourin Dhua</span>,
              under the expert mentorship of
              <span className="font-bold text-purple-600">
                {" "}
                Prof. (Dr.) Monalisa Banerjee
              </span>
              .
            </p>

            <p className="mb-6">
              Each member contributed equally, demonstrating exceptional
              dedication, teamwork, and technical proficiency throughout the
              project. The team worked collaboratively, ensuring that every task
              was approached with responsibility, innovation, and a shared
              vision for excellence.
            </p>

            <p className="mb-6">
              The guidance and mentorship of Prof. (Dr.) Monalisa Banerjee was
              pivotal to the project's success. Her unwavering support,
              insightful feedback, and willingness to provide additional
              learning resources and community support played a crucial role in
              helping the team navigate through challenges.
            </p>

            <p className="mb-6">
              By conducting extra sessions and dedicating valuable time beyond
              regular schedules, she created an environment that fostered
              growth, learning, and collaboration. Her mentorship not only
              elevated the technical quality of the project but also enriched
              the overall learning experience of the team members.
            </p>

            <p className="text-center font-semibold text-gray-800">
              Through collective effort, consistent communication, and strong
              leadership, the team successfully transformed their ideas into a
              comprehensive project, setting a strong example of
              professionalism, perseverance, and academic excellence.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="bg-gradient-to-r from-gray-800 to-gray-900 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="flex justify-center items-center space-x-2 text-white mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaHeart className="text-red-500" />
            <span className="text-lg">Made with dedication and teamwork</span>
            <FaHeart className="text-red-500" />
          </motion.div>
          <p className="text-gray-400">E-College Management System © 2024</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Credits;
