import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaQuestionCircle,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserGraduate className="text-blue-500 text-4xl" />,
    title: "Create an Account",
    description:
      "Register using your email and set up your profile to start exploring eCollege.",
  },
  {
    icon: <FaChalkboardTeacher className="text-green-500 text-4xl" />,
    title: "Enroll in Courses",
    description:
      "Browse available courses and enroll in the subjects that interest you.",
  },
  {
    icon: <FaClipboardCheck className="text-yellow-500 text-4xl" />,
    title: "Track Your Progress",
    description:
      "Monitor your grades, assignments, and course completion in real-time.",
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer:
      "You can reset your password from the login page by clicking on 'Forgot Password'.",
  },
  {
    question: "Can I access courses for free?",
    answer:
      "Some courses are free, while others require enrollment fees depending on the institution.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use the support section in your profile or email us at support@ecollege.com.",
  },
];

const HowtoGuide = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-100">
      {/* Hero Section */}
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          How to Use eCollege
        </h2>
        <p className="text-lg text-gray-600">
          Follow these simple steps to get started and make the most out of your
          learning experience.
        </p>
      </motion.div>

      {/* Steps Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex justify-center">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-700">
              {step.title}
            </h3>
            <p className="text-gray-500 mt-2">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 bg-white shadow-lg rounded-xl p-8 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaQuestionCircle className="mr-2 text-blue-500" /> Frequently Asked
          Questions
        </h3>
        <div className="mt-4 space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="border-b pb-3"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold text-gray-700">
                {faq.question}
              </h4>
              <p className="text-gray-500">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
//guide

export default HowtoGuide;
