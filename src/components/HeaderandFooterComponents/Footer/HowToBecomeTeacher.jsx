import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaBookReader,
  FaClipboardCheck,
  FaChalkboardTeacher,
  FaUniversity,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaGraduationCap className="text-4xl text-blue-600" />,
    title: "Earn a Bachelor's Degree",
    description:
      "A degree in education or a related subject is essential. Specializing in a teaching subject will help in career prospects.",
  },
  {
    icon: <FaBookReader className="text-4xl text-green-600" />,
    title: "Gain Teaching Experience",
    description:
      "Complete internships or student teaching programs to understand classroom management and real-world teaching.",
  },
  {
    icon: <FaClipboardCheck className="text-4xl text-red-600" />,
    title: "Pass Required Examinations",
    description:
      "Certification exams like TET or state-specific tests are needed to qualify for teaching roles.",
  },
  {
    icon: <FaChalkboardTeacher className="text-4xl text-yellow-600" />,
    title: "Obtain a Teaching License",
    description:
      "Apply for the necessary licenses and certifications to be legally eligible for teaching in institutions.",
  },
  {
    icon: <FaUniversity className="text-4xl text-purple-600" />,
    title: "Apply for Teaching Positions",
    description:
      "Start applying for jobs in schools, colleges, or online teaching platforms based on expertise and certification.",
  },
];

const HowToBecomeTeacher = () => {
  return (
    <section className="py-16 px-6 bg-gray-100 text-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4 text-gray-800"
        >
          How to Become a Teacher
        </motion.h2>
        <p className="text-lg text-gray-600 mb-8">
          Follow these steps to kickstart your teaching career.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {step.icon}
            <h3 className="text-xl font-semibold mt-4 text-gray-800">
              {step.title}
            </h3>
            <p className="text-gray-600 mt-2">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowToBecomeTeacher;
