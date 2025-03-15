import React from "react";
import ad1 from "/images/ad1.jpg";
import ad2 from "/images/ad2.jpg";
import ad3 from "/images/ad3.jpg";
import ad4 from "/images/ad4.jpg";
import ad5 from "/images/ad5.jpg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", students: 200 },
  { name: "Feb", students: 400 },
  { name: "Mar", students: 600 },
  { name: "Apr", students: 800 },
  { name: "May", students: 1000 },
];

const AboutUs = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">
        About Eduport Portal
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Eduport is designed to support educational centers by providing
        high-quality learning experiences, fostering innovation, and enabling
        students to achieve their goals.
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img
            src={ad1}
            alt="Students discussing"
            className="rounded-xl shadow-lg w-full h-64 object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">35,000+ Happy Students</h2>
          <p className="text-gray-600 mt-4">
            Join thousands of students who have successfully achieved their
            learning objectives with us. Our platform ensures professional and
            easy-to-use software, perfect for any device with pixel-perfect
            design.
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center">
              ✅ Setup and installation takes less time
            </li>
            <li className="flex items-center">
              ✅ Professional and easy to use
            </li>
            <li className="flex items-center">
              ✅ Pixel-perfect responsive design
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mt-16 relative">
        <div>
          <h2 className="text-2xl font-semibold">Our Goal</h2>
          <p className="text-gray-600 mt-4">
            "Be open to new ideas and approaches. Develop your problem-solving
            skills." Our mission is to foster creativity and critical thinking
            among students.
          </p>
          <p className="text-gray-600 mt-4">
            We strive to provide a learning environment that nurtures
            innovation, encourages collaboration, and prepares students for
            real-world challenges. Through our platform, students can explore
            various disciplines, enhance their analytical skills, and build a
            foundation for lifelong learning.
          </p>
        </div>
        <div className="relative">
          <div className="absolute w-40 h-40 bg-red-300 rounded-full opacity-50 -top-10 -left-10"></div>
          <div className="absolute w-40 h-40 bg-green-300 rounded-full opacity-50 -bottom-10 -right-10"></div>
          <img
            src={ad2}
            alt="Student thinking"
            className="rounded-xl shadow-lg w-full h-64 object-cover relative"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-lg">
          <img
            src={ad3}
            alt="Learning"
            className="rounded-xl shadow-md w-full h-64 object-cover"
          />
          <h3 className="text-xl font-semibold mt-4">Interactive Learning</h3>
          <p className="text-gray-600 mt-2">
            Engage in hands-on activities and real-world projects.
          </p>
        </div>
        <div className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-lg">
          <img
            src={ad4}
            alt="Teamwork"
            className="rounded-xl shadow-md w-full h-64 object-cover"
          />
          <h3 className="text-xl font-semibold mt-4">
            Collaborative Environment
          </h3>
          <p className="text-gray-600 mt-2">
            Work together with peers and instructors for better learning.
          </p>
        </div>
        <div className="flex flex-col items-center text-center bg-white p-4 rounded-xl shadow-lg">
          <img
            src={ad5}
            alt="Success"
            className="rounded-xl shadow-md w-full h-64 object-cover"
          />
          <h3 className="text-xl font-semibold mt-4">Achieve Success</h3>
          <p className="text-gray-600 mt-2">
            Reach your educational and career goals with our support.
          </p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Student Growth Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="students"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AboutUs;
