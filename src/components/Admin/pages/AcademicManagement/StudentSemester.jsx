import axios from 'axios';
import React, { useState, useEffect } from 'react';

const StudentSemester = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courseCode, setCourseCode] = useState('101');
  const [semester, setSemester] = useState('1');
  const [upgradeSuccess, setUpgradeSuccess] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Semester options
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://e-college-data.onrender.com/v1/adminroutine/course-all-id");
        setCourseOptions(response.data);
      } catch (err) {
        setError('Failed to fetch course data. Please try again.');
        console.error('Error fetching course:', err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch students based on selected course and semester
  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    setUpgradeSuccess('');
    
    try {
      const response = await axios.post('https://e-college-data.onrender.com/v1/students/student-all', {
        "course_code": courseCode,
        "sem": semester
      });
      
      const data = response.data;
      setStudents(data.data || []);
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation dialog
  const handleUpgradeClick = () => {
    setShowConfirmation(true);
  };

  // Cancel upgrade
  const cancelUpgrade = () => {
    setShowConfirmation(false);
  };

  // Upgrade students to next semester
  const upgradeStudents = async () => {
    setLoading(true);
    setError('');
    setUpgradeSuccess('');
    setShowConfirmation(false);
    
    // Calculate next semester
    const nextSemester = String(Math.min(parseInt(semester) + 1, 8));
    
    try {
      const response = await axios.post('https://e-college-data.onrender.com/v1/students/upgradeStudent', {
        "course_code": courseCode,
        "sem": semester
      });
      
      if (!response.data) {
        setError('Failed to upgrade students. Please try again.');
      }
      setUpgradeSuccess(`Students successfully upgraded from semester ${semester} to ${nextSemester}`);
      
      // Update the current semester and refetch students
      setSemester(nextSemester);
    } catch (err) {
      setError('Failed to upgrade students. Please try again. Server problem.');
      console.error('Error upgrading students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on component mount and when filters change
  useEffect(() => {
    fetchStudents();
  }, [courseCode, semester]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Semester Management</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Course</label>
          <select 
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            {courseOptions.map(course => (
              <option key={course.course_id} value={course.course_id}>{course.code}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">Semester</label>
          <select 
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-white"
          >
            {semesterOptions.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <button 
            onClick={fetchStudents}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh List'}
          </button>
        </div>
      </div>
      
      {upgradeSuccess && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {upgradeSuccess}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <button 
          onClick={handleUpgradeClick}
          className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={loading || parseInt(semester) === 8}
        >
          {loading ? 'Processing...' : `Upgrade Students to Semester ${Math.min(parseInt(semester) + 1, 8)}`}
        </button>
        {parseInt(semester) === 8 && (
          <p className="mt-2 text-sm text-gray-600">Students are already in the final semester.</p>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Upgrade</h3>
            <p className="mb-6">
              Are you sure you want to upgrade all students from Semester {semester} to 
              Semester {Math.min(parseInt(semester) + 1, 8)}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpgrade}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={upgradeStudents}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Roll No</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semester</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course Code</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.c_roll || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.c_roll}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.phoneNumber}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.sem}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.course_code}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{student.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  {loading ? 'Loading students...' : 'No students found for the selected criteria'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentSemester;