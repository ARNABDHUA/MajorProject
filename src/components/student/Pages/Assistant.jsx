import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Assistant = () => {
  const faqs = [
      {
        id: 1,
        question:"What should I do if I encounter a course-related issue?",
        answer: 
          "If you encounter any course-related issue, please contact us via email on Gmail for assistance.",
        
      },
      {
        id: 2,
        question: "What should I do if I am facing any issues related to the scholarship?",
        answer:
          "In case of any scholarship-related concerns, you are advised to contact the accountant for further assistance.",
      },
      {
        id: 3,
        question: "Who should I contact in the college to get a library certificate?",
        answer:
          "You can contact the librarian if you need a library certificate.",
      },
      {
        id: 4,
        question: "Who should I contact if I need a migration certificate?",

        answer:
          "If you need a migration certificate, please contact the college office or the academic section.",
      },
      {
        id: 5,
        question: "Who should I contact if I lose my ID card?",
        answer:
          " If you lose your ID card, please contact the accountant.",
      },
      
    ];
  
    // State to track open FAQ
    const [openId, setOpenId] = useState(null);
  
    // Toggle FAQ
    const toggleFAQ = (id) => {
      setOpenId(openId === id ? null : id);
    };
  
    return (
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Title and Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about eCollege and our courses.
            </p>
          </div>
  
          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden"
              >
                {/* FAQ Question */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center p-6 focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-800 text-left">
                    {faq.question}
                  </h3>
                  <span className="text-blue-600">
                    {openId === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>
  
                {/* FAQ Answer with Animation */}
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  
};

export default Assistant;
