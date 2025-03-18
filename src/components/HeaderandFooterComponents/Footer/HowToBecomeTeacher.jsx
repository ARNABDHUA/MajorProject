import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaUserCheck,
  FaFileContract,
  FaLaptop,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
import { LuBookOpen } from "react-icons/lu";

const HowToBecomeTeacher = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      id: 1,
      title: "Submit Your Credentials",
      icon: <FaGraduationCap className="text-blue-600 w-8 h-8" />,
      description:
        "Share your academic qualifications and teaching experience with our faculty panel.",
    },
    {
      id: 2,
      title: "Verification Process",
      icon: <MdOutlineVerified className="text-blue-600 w-8 h-8" />,
      description:
        "Our academic team will verify your credentials and expertise in your subject area.",
    },
    {
      id: 3,
      title: "Sample Class Demo",
      icon: <LuBookOpen className="text-blue-600 w-8 h-8" />,
      description:
        "Conduct a brief online teaching demo to showcase your virtual classroom skills.",
    },
    {
      id: 4,
      title: "Join Our Faculty",
      icon: <FaUserCheck className="text-blue-600 w-8 h-8" />,
      description:
        "Upon approval, become part of our diverse and expert teaching community.",
    },
    {
      id: 5,
      title: "Sign Agreements",
      icon: <FaFileContract className="text-blue-600 w-8 h-8" />,
      description:
        "Complete the necessary paperwork and understand our teaching guidelines.",
    },
    {
      id: 6,
      title: "Platform Training",
      icon: <FaLaptop className="text-blue-600 w-8 h-8" />,
      description:
        "Learn to use our state-of-the-art virtual classroom and course management tools.",
    },
  ];

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
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-12 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-blue-200 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-300 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-blue-400" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaChalkboardTeacher className="text-blue-600 w-8 h-8 md:w-10 md:h-10" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How to Become an eCollege Teacher
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join our growing community of online educators and help students
            achieve their academic goals through our cutting-edge virtual
            learning platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              className="bg-white rounded-xl p-6 relative overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <motion.div
                animate={{
                  scale: hoveredStep === step.id ? 1.05 : 1,
                  y: hoveredStep === step.id ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center text-center"
              >
                <div className="p-4 bg-blue-50 rounded-full mb-4 relative">
                  {step.icon}
                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-4 h-4 bg-blue-100 rotate-45 transform origin-bottom-left translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="#apply"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Apply to Teach Today
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            Questions? Contact our faculty relations team at{" "}
            <span className="text-blue-600">faculty@ecollege.edu</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToBecomeTeacher;
