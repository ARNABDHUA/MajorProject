import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I enroll in a course?",
      answer:
        "To enroll in a course, log in to your eCollege account, browse the available courses, and click the 'Enroll' button on the course page. Follow the prompts to complete your enrollment.",
    },
    {
      id: 2,
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods, including credit/debit cards, PayPal, and bank transfers. You can view all available payment options during the checkout process.",
    },
    {
      id: 3,
      question: "Can I access courses offline?",
      answer:
        "Yes, you can download course materials for offline access. Simply go to the course content page and click the download icon next to the resource you want to save.",
    },
    {
      id: 4,
      question: "How do I reset my password?",
      answer:
        "To reset your password, go to the login page and click 'Forgot Password.' Enter your registered email address, and you'll receive a link to reset your password.",
    },
    {
      id: 5,
      question: "Are there any prerequisites for courses?",
      answer:
        "Some courses may have prerequisites, which will be listed on the course description page. Make sure to review these requirements before enrolling.",
    },
    {
      id: 6,
      question: "How do I contact support?",
      answer:
        "You can contact our support team by emailing ecollege.helper@gmail.com or using the live chat feature on our website. Our team is available 24/7 to assist you.",
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

export default FAQ;
