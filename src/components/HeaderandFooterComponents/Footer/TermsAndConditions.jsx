import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaBook,
  FaUserShield,
  FaGraduationCap,
  FaUniversity,
  FaLock,
  FaUserSecret,
  FaExclamationTriangle,
} from "react-icons/fa";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FaBook className="text-indigo-600 text-2xl" />,
      content: `Welcome to eCollege. These Terms and Conditions govern your use of our online learning platform and services. By accessing or using eCollege, you agree to be bound by these terms. Please read them carefully before proceeding with registration or using any of our services.`,
    },
    {
      id: "account",
      title: "Account Registration",
      icon: <FaUserShield className="text-indigo-600 text-2xl" />,
      content: `To access eCollege services, you must register for an account using accurate and complete information. You are responsible for maintaining the confidentiality of your password and account. You agree to immediately notify eCollege of any unauthorized use of your account or any other breach of security. We reserve the right to refuse service, terminate accounts, or remove content at our discretion.`,
    },
    {
      id: "services",
      title: "Educational Services",
      icon: <FaGraduationCap className="text-indigo-600 text-2xl" />,
      content: `eCollege provides online educational content, courses, assessments, and certification programs. Course materials are subject to change. Certification may require completion of specific requirements and passing necessary examinations. eCollege reserves the right to modify or discontinue any service without notice.`,
    },
    {
      id: "conduct",
      title: "User Conduct",
      icon: <FaUniversity className="text-indigo-600 text-2xl" />,
      content: `Users agree not to misuse eCollege services or content. Prohibited behaviors include but are not limited to: sharing account credentials, unauthorized distribution of course materials, plagiarism, cheating on assessments, harassing other users or instructors, and attempting to access administrative functions or other users' accounts.`,
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: <FaLock className="text-indigo-600 text-2xl" />,
      content: `Your privacy is important to us. Our Privacy Policy describes how we collect, use, and disclose information about you. By using eCollege, you consent to the collection and use of information as described in our Privacy Policy, which is incorporated into these Terms and Conditions.`,
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      icon: <FaUserSecret className="text-indigo-600 text-2xl" />,
      content: `All content provided through eCollege, including courses, videos, texts, graphics, logos, and software, is the property of eCollege or its content providers and is protected by intellectual property laws. Users may not copy, distribute, modify, or create derivative works without explicit permission.`,
    },
    {
      id: "disclaimer",
      title: "Disclaimers and Limitations",
      icon: <FaExclamationTriangle className="text-indigo-600 text-2xl" />,
      content: `eCollege services are provided "as is" without warranties of any kind. We do not guarantee that our services will be uninterrupted or error-free. To the maximum extent permitted by law, eCollege shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.`,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        mass: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <motion.div
        className="max-w-6xl mx-auto rounded-2xl overflow-hidden bg-white shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Terms & Conditions
            </h1>
            <p className="text-indigo-100 max-w-2xl">
              Please review our terms and conditions carefully before using
              eCollege's educational platform and services.
            </p>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row">
          {/* Sidebar navigation */}
          <motion.div
            className="md:w-1/3 bg-gray-50 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Sections
            </h2>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                className={`mb-3 cursor-pointer`}
                onClick={() => setActiveSection(index)}
              >
                <div
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    activeSection === index
                      ? "bg-indigo-100 text-indigo-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="mr-3">{section.icon}</div>
                  <span
                    className={`font-medium ${
                      activeSection === index
                        ? "text-indigo-700"
                        : "text-gray-700"
                    }`}
                  >
                    {section.title}
                  </span>
                  {activeSection === index && (
                    <motion.div
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <FaCheckCircle className="text-indigo-600" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content area */}
          <motion.div
            className="md:w-2/3 p-6 md:p-12"
            key={activeSection}
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <div className="flex items-center mb-6">
              <div className="mr-4 p-3 bg-indigo-100 rounded-full">
                {sections[activeSection].icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {sections[activeSection].title}
              </h2>
            </div>

            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {sections[activeSection].content}
              </p>
            </div>

            <div className="mt-12 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg ${
                  activeSection > 0
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() =>
                  activeSection > 0 && setActiveSection(activeSection - 1)
                }
                disabled={activeSection === 0}
              >
                Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg ${
                  activeSection < sections.length - 1
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-300 cursor-not-allowed"
                }`}
                onClick={() =>
                  activeSection < sections.length - 1 &&
                  setActiveSection(activeSection + 1)
                }
                disabled={activeSection === sections.length - 1}
              >
                Next
              </motion.button>
            </div>

            {activeSection === sections.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg"
              >
                <h3 className="text-green-700 font-semibold flex items-center">
                  <FaCheckCircle className="mr-2" /> Accept Terms
                </h3>
                <p className="text-green-700 mt-2 text-sm">
                  By clicking "I Accept" you acknowledge that you have read and
                  agree to all the terms and conditions outlined above.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  I Accept
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="bg-gray-50 p-6 border-t border-gray-200 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Copyright © {new Date().getFullYear()} eCollege. All rights reserved.
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditions;
