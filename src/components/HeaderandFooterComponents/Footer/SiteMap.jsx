import { motion } from "framer-motion";
import {
  FaGraduationCap,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCog,
  FaBook,
  FaClipboardList,
  FaEnvelope,
  FaLaptopCode,
} from "react-icons/fa";

const SiteMap = () => {
  return (
    <section className="bg-white text-black py-16">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-10 text-blue-400"
        >
          Sitemap
        </motion.h2>

        {/* Sitemap Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 text-gray-300"
        >
          {/* Students Section */}
          <SitemapCard
            icon={<FaUserGraduate className="text-blue-400 text-4xl" />}
            title="Students"
            links={[
              "Dashboard",
              "Courses",
              "Assignments",
              "Exam Results",
              "Profile",
              "Support",
            ]}
          />

          {/* Teachers Section */}
          <SitemapCard
            icon={<FaChalkboardTeacher className="text-yellow-400 text-4xl" />}
            title="Teachers"
            links={[
              "Dashboard",
              "Manage Courses",
              "Upload Assignments",
              "Student Reports",
              "Attendance",
              "Settings",
            ]}
          />

          {/* Admin Section */}
          <SitemapCard
            icon={<FaCog className="text-red-400 text-4xl" />}
            title="Admin"
            links={[
              "User Management",
              "Course Management",
              "Website Settings",
              "Reports & Analytics",
              "System Logs",
              "Permissions",
            ]}
          />

          {/* Academic Resources */}
          <SitemapCard
            icon={<FaBook className="text-green-400 text-4xl" />}
            title="Academic Resources"
            links={[
              "Library",
              "E-Books",
              "Research Papers",
              "Tutorials",
              "Project Guidelines",
              "Scholarships",
            ]}
          />

          {/* Services & Support */}
          <SitemapCard
            icon={<FaClipboardList className="text-purple-400 text-4xl" />}
            title="Services & Support"
            links={[
              "Help Center",
              "Technical Support",
              "Community Forum",
              "FAQs",
              "Contact Us",
              "Feedback",
            ]}
          />

          {/* Careers & Contact */}
          <SitemapCard
            icon={<FaEnvelope className="text-orange-400 text-4xl" />}
            title="Careers & Contact"
            links={[
              "Career Opportunities",
              "Internships",
              "Resume Building",
              "Job Portal",
              "Alumni Network",
              "Get in Touch",
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
};

// 📌 Sitemap Card Component
const SitemapCard = ({ icon, title, links }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-100 text-black rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="hover:text-blue-400 transition duration-300 cursor-pointer"
          >
            ➤ {link}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SiteMap;
