import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TermsAndCondition = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const termsData = [
    {
      title: "1. Introduction",
      content:
        "Welcome to eCollege! By accessing or using our platform, you agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.",
    },
    {
      title: "2. User Responsibilities",
      content:
        "As a user, you are responsible for maintaining the confidentiality of your account credentials. Any activity conducted through your account is your responsibility. Misuse of the platform may result in account suspension.",
    },
    {
      title: "3. Academic Integrity",
      content:
        "eCollege upholds strict academic integrity policies. Any form of plagiarism, cheating, or misrepresentation of work is strictly prohibited. Violations may lead to account termination or further action.",
    },
    {
      title: "4. Privacy and Data Security",
      content:
        "We value your privacy. Your personal data will be stored securely and will not be shared with third parties without your consent. By using eCollege, you agree to our Privacy Policy.",
    },
    {
      title: "5. Payment and Refund Policy",
      content:
        "Certain services on eCollege may require payment. Refunds will only be processed as per our refund policy, which can be accessed through our support page.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "eCollege is not responsible for any direct or indirect losses incurred through the use of our platform. Users must ensure they comply with all applicable laws while using our services.",
    },
    {
      title: "7. Termination of Account",
      content:
        "We reserve the right to terminate or suspend your account if we find any violations of our Terms and Conditions. Users may also request account deactivation at any time.",
    },
    {
      title: "8. Changes to Terms",
      content:
        "eCollege may update these Terms and Conditions from time to time. Users will be notified of any major changes, and continued usage of our platform will constitute acceptance of the new terms.",
    },
    {
      title: "9. Contact Information",
      content:
        "If you have any questions or concerns regarding these terms, please reach out to our support team via email at support@ecollege.com.",
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.h2
        className="text-3xl font-semibold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Terms and Conditions
      </motion.h2>
      <p className="text-gray-600 text-center mb-6">
        Please read these terms carefully before using the eCollege platform.
      </p>
      <div className="space-y-4">
        {termsData.map((term, index) => (
          <motion.div
            key={index}
            className="border border-gray-300 rounded-xl bg-gray-50 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="font-medium text-gray-700">{term.title}</span>
              {openSections[index] ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>
            {openSections[index] && (
              <motion.div
                className="p-4 text-gray-600"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {term.content}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TermsAndCondition;
