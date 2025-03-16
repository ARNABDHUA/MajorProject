import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaCertificate,
  FaUserTie,
  FaLaptop,
} from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdOutlineWorkHistory, MdCastForEducation } from "react-icons/md";
import { BsFillPatchCheckFill } from "react-icons/bs";

const HowToBecomeTeacher = () => {
  const [activeSection, setActiveSection] = useState("education");

  const pathSteps = [
    {
      id: "education",
      title: "Education Requirements",
      icon: <FaGraduationCap size={24} />,
      content: `Most teaching positions require at least a bachelor's degree in education or a specific subject area. Some specialized positions may require a master's degree or higher. Educational requirements can vary by state and institution type.`,
      color: "from-blue-500 to-blue-700",
    },
    {
      id: "certification",
      title: "Teacher Certification",
      icon: <FaCertificate size={24} />,
      content: `To teach in public schools, you'll need a teaching certificate or license from your state. Requirements typically include an accredited degree, student teaching experience, and passing scores on certification exams like the Praxis.`,
      color: "from-green-500 to-green-700",
    },
    {
      id: "specialization",
      title: "Choose Specialization",
      icon: <FaBook size={24} />,
      content: `Teachers must decide on their area of specialization, such as early childhood education, elementary education, secondary education with subject focus, special education, or ESL (English as a Second Language).`,
      color: "from-purple-500 to-purple-700",
    },
    {
      id: "experience",
      title: "Gain Teaching Experience",
      icon: <FaChalkboardTeacher size={24} />,
      content: `Student teaching and internships provide hands-on classroom experience. Many aspiring teachers also gain experience through substitute teaching, tutoring, or working in after-school programs before securing a full-time position.`,
      color: "from-red-500 to-red-700",
    },
    {
      id: "skills",
      title: "Develop Key Skills",
      icon: <RiMentalHealthFill size={24} />,
      content: `Successful teachers need strong communication skills, patience, creativity, organizational abilities, and emotional intelligence. Continuous professional development helps strengthen these competencies.`,
      color: "from-amber-500 to-amber-700",
    },
    {
      id: "technology",
      title: "Master Educational Technology",
      icon: <FaLaptop size={24} />,
      content: `Modern teaching requires proficiency with educational software, learning management systems, and digital teaching tools. Tech-savvy teachers can enhance student engagement and streamline administrative tasks.`,
      color: "from-cyan-500 to-cyan-700",
    },
    {
      id: "networking",
      title: "Professional Networking",
      icon: <MdOutlineWorkHistory size={24} />,
      content: `Building a professional network through teacher associations, education conferences, and online communities provides valuable support, resources, and potential job opportunities.`,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      id: "placement",
      title: "Job Application Process",
      icon: <FaUserTie size={24} />,
      content: `The teaching job application process typically involves submitting applications to school districts, preparing a teaching portfolio, writing a strong education-focused resume and cover letter, and excelling in teaching demonstration interviews.`,
      color: "from-pink-500 to-pink-700",
    },
  ];

  const careerOptions = [
    {
      title: "Public School Teacher",
      description:
        "Work in state-funded schools teaching standard curriculum to diverse student populations",
    },
    {
      title: "Private School Teacher",
      description:
        "Teach in independent institutions that may offer specialized programs or religious education",
    },
    {
      title: "Special Education Teacher",
      description:
        "Support students with learning disabilities and special needs through adapted teaching methods",
    },
    {
      title: "ESL Teacher",
      description:
        "Help non-native speakers learn English and navigate cultural differences in education",
    },
    {
      title: "Online Educator",
      description:
        "Develop and deliver curriculum through digital platforms and virtual classrooms",
    },
    {
      title: "Educational Consultant",
      description:
        "Advise schools and organizations on improving educational practices and outcomes",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Elementary School Teacher",
      quote:
        "The most rewarding part of becoming a teacher is seeing that moment when a concept clicks for a student. All the hard work pays off when you witness their growth.",
      years: "12 years experience",
    },
    {
      name: "David Martinez",
      role: "High School Science Teacher",
      quote:
        "Teaching is more than just sharing knowledge—it's about inspiring the next generation of thinkers. The certification process was challenging but incredibly worthwhile.",
      years: "8 years experience",
    },
    {
      name: "Michelle Park",
      role: "Special Education Teacher",
      quote:
        "If you're passionate about making a difference, teaching is the perfect path. Every student deserves an advocate who believes in their potential.",
      years: "15 years experience",
    },
  ];

  const faqs = [
    {
      question: "How long does it take to become a teacher?",
      answer:
        "Typically, it takes 4-5 years to complete a bachelor's degree in education plus certification requirements. Alternative certification programs may take 1-2 years for those who already have a bachelor's degree in another field.",
    },
    {
      question:
        "What's the difference between a teaching license and certification?",
      answer:
        "The terms are often used interchangeably, but a teaching license is the legal document issued by your state that permits you to teach, while certification refers to the process of becoming qualified for that license.",
    },
    {
      question: "Do I need a master's degree to teach?",
      answer:
        "Not always. Many states require only a bachelor's degree for initial licensure, though some require a master's degree within a certain timeframe after beginning teaching. A master's degree may be required for certain specialized roles or for teaching at the community college level.",
    },
    {
      question:
        "Can I teach in a different state than where I received my certification?",
      answer:
        "Yes, but you'll need to look into reciprocity agreements. Many states have interstate agreements that recognize out-of-state credentials, though you may need to meet additional requirements or take specific courses.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-black opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
          <motion.div
            className="absolute -right-10 -bottom-10 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -left-20 -top-20 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative h-full flex flex-col justify-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            How to Become a Teacher
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Embark on a rewarding journey to shape the future through education.
            Follow our comprehensive guide to start your teaching career.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 shadow-lg flex items-center">
              <MdCastForEducation className="mr-2" size={20} />
              Start Your Journey
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300 flex items-center">
              <BsFillPatchCheckFill className="mr-2" size={18} />
              Check Requirements
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Path to Teaching */}
      <section className="py-20 container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            The Path to Becoming a Teacher
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow these essential steps to prepare for a successful teaching
            career. Each stage builds the knowledge, skills, and credentials
            needed to excel in the classroom.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Step Navigator */}
            <div className="flex flex-wrap gap-2 mb-8">
              {pathSteps.map((step) => (
                <motion.button
                  key={step.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    activeSection === step.id
                      ? `bg-gradient-to-r ${step.color} text-white shadow-md`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all duration-300`}
                  onClick={() => setActiveSection(step.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {step.icon}
                  {step.title}
                </motion.button>
              ))}
            </div>

            {/* Step Content */}
            {pathSteps.map((step) => (
              <div
                key={step.id}
                className={activeSection === step.id ? "block" : "hidden"}
              >
                <motion.div
                  className={`p-6 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-full">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-lg leading-relaxed">{step.content}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-xl shadow-xl">
              <h3 className="text-3xl font-bold mb-6">
                Teaching By The Numbers
              </h3>

              <motion.div
                className="grid grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div
                  variants={statsVariants}
                  className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center"
                >
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    3.6M+
                  </div>
                  <div className="text-gray-300">Teachers in the U.S.</div>
                </motion.div>
                <motion.div
                  variants={statsVariants}
                  className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center"
                >
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    $61K
                  </div>
                  <div className="text-gray-300">Average Salary</div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center"
                >
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    4-5
                  </div>
                  <div className="text-gray-300">Years to Qualify</div>
                </motion.div>

                <motion.div
                  variants={statsVariants}
                  className="bg-gray-800 bg-opacity-50 p-6 rounded-lg text-center"
                >
                  <div className="text-4xl font-bold text-orange-400 mb-2">
                    13%
                  </div>
                  <div className="text-gray-300">Job Growth Rate</div>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-8 p-4 bg-blue-600 bg-opacity-30 border-l-4 border-blue-500 rounded"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <p className="text-lg">
                  Teachers with specialized certifications and advanced degrees
                  can earn significantly higher salaries and enjoy greater job
                  security and advancement opportunities.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Teaching Career Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The field of education offers diverse opportunities for teachers
              with different interests, specializations, and career goals.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {careerOptions.map((career, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]"
              >
                <div
                  className={`h-2 bg-gradient-to-r ${
                    index % 3 === 0
                      ? "from-blue-500 to-purple-500"
                      : index % 3 === 1
                      ? "from-green-500 to-teal-500"
                      : "from-orange-500 to-red-500"
                  }`}
                ></div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {career.title}
                  </h3>
                  <p className="text-gray-600">{career.description}</p>
                  <div className="mt-6 flex justify-end">
                    <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1">
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              From Our Teacher Community
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              Hear from educators who've successfully navigated the path to
              becoming impactful teachers.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-blue-700 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-[#FFD700] border-opacity-20 selection:text-red-800"
              >
                <svg
                  className="w-12 h-12 text-yellow-300 mb-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm18-14c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                </svg>
                <p className="text-lg italic mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 flex items-center justify-center text-blue-800 font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex flex-col">
                      <span className="text-blue-200">{testimonial.role}</span>
                      <span className="text-xs text-blue-200">
                        {testimonial.years}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about becoming a teacher and
              starting your education career.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="mb-6 last:mb-0"
              >
                <motion.div
                  className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-6">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                      <svg
                        className="w-6 h-6 text-gray-500 group-open:rotate-180 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Shape the Future?
            </h2>
            <p className="text-xl mb-8">
              Take the first step toward a rewarding career in education. Join
              the ranks of dedicated professionals who make a difference every
              day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="bg-white text-blue-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Begin Your Journey
              </motion.button>
              <motion.button
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:bg-opacity-10 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Resources
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold flex items-center">
                <FaGraduationCap className="mr-2" size={24} />
                Teaching Career Guide
              </h3>
              <p className="text-gray-400 mt-2">
                Your pathway to an impactful education career
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Resources
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Certification
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Job Board
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>
              © {new Date().getFullYear()} Teaching Career Guide. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowToBecomeTeacher;
