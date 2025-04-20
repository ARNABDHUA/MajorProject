import React from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Marks = () => {
    useEffect(() => {
     console.log("hello Arnab")
    }, [])
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-3">📚 Marks</h2>
        <p className="text-gray-600 text-base mb-6">by Arnab</p>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Marks</th>
              </tr>
            </thead>
            <tbody>
              {[
                { subject: 'Mathematics', marks: 95 },
                { subject: 'Physics', marks: 88 },
                { subject: 'Chemistry', marks: 91 },
                { subject: 'English', marks: 85 },
              ].map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-left text-gray-800">{item.subject}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{item.marks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Marks;
