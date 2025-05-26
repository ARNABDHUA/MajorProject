import React, { useState, useEffect } from 'react';
import { Search, Users, ArrowUp, Check, X, AlertTriangle } from 'lucide-react';

const StudentSemester = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [courseCode, setCourseCode] = useState('101');
  const [semester, setSemester] = useState('1');
  const [upgradeSuccess, setUpgradeSuccess] = useState('');
  const [courseOptions, setCourseOptions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://e-college-data.onrender.com/v1/adminroutine/course-all-id");
        const data = await response.json();
        setCourseOptions(data);
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
      const response = await fetch('https://e-college-data.onrender.com/v1/students/student-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "course_code": courseCode,
          "sem": semester
        })
      });
      
      const data = await response.json();
      setStudents(data.data || []);
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    setShowConfirmation(true);
  };

  const cancelUpgrade = () => {
    setShowConfirmation(false);
  };

  const upgradeStudents = async () => {
    setLoading(true);
    setError('');
    setUpgradeSuccess('');
    setShowConfirmation(false);
    
    // Calculate next semester
    const nextSemester = String(Math.min(parseInt(semester) + 1, 8));
    
    try {
      const response = await fetch('https://e-college-data.onrender.com/v1/students/upgradeStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "course_code": courseCode,
          "sem": semester
        })
      });
      
      const data = await response.json();
      
      if (!data) {
        setError('Failed to upgrade students. Please try again.');
        return;
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

  useEffect(() => {
    fetchStudents();
  }, [courseCode, semester]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Student Semester Management</h1>
          </div>
          <p className="text-gray-400">Manage and upgrade student semesters efficiently</p>
        </div>
        
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-6 items-end">
            <div className="flex flex-col min-w-[200px]">
              <label className="mb-2 text-sm font-medium text-gray-300">Course</label>
              <select 
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {courseOptions.map(course => (
                  <option key={course.course_id} value={course.course_id}>{course.code}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col min-w-[200px]">
              <label className="mb-2 text-sm font-medium text-gray-300">Semester</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {semesterOptions.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={fetchStudents}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Search className="w-4 h-4" />
              {loading ? 'Loading...' : 'Refresh List'}
            </button>
          </div>
        </div>
        
        {/* Success Message */}
        {upgradeSuccess && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-300 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            {upgradeSuccess}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            {error}
          </div>
        )}
        
        {/* Upgrade Button */}
        <div className="mb-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <button 
            onClick={handleUpgradeClick}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            disabled={loading || parseInt(semester) === 8}
          >
            <ArrowUp className="w-5 h-5" />
            {loading ? 'Processing...' : `Upgrade Students to Semester ${Math.min(parseInt(semester) + 1, 8)}`}
          </button>
          {parseInt(semester) === 8 && (
            <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Students are already in the final semester.
            </p>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Confirm Upgrade</h3>
              </div>
              <p className="mb-6 text-gray-300 leading-relaxed">
                Are you sure you want to upgrade all students from Semester {semester} to 
                Semester {Math.min(parseInt(semester) + 1, 8)}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelUpgrade}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={upgradeStudents}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Confirm Upgrade
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Students Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Students List</h2>
            <p className="text-sm text-gray-400">Total: {students.length} students</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {students.length > 0 ? (
                  students.map((student, index) => (
                    <tr key={student.c_roll || index} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium">{student.c_roll}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{student.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                          Sem {student.sem}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{student.course_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{student.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400">
                          {loading ? 'Loading students...' : 'No students found for the selected criteria'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSemester;