import { useState, useEffect } from 'react';
import { Users,Calendar, Clock, User, Book, Award, CheckCircle, XCircle,UserX, ArrowLeft, ArrowRight, ChevronDown,UserCheck ,RefreshCw } from 'lucide-react';
import axios from 'axios';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestAttendance, setLatestAttendance] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });
  const [selectedPaperCode, setSelectedPaperCode] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const itemsPerPage = 7;

  // For demo - use this to sort by date properly
  const parseDateString = (dateStr) => {
    if (dateStr.includes('GMT')) {
      return new Date(dateStr);
    } else {
      // Parse date format like "06-05-2025"
      const [day, month, year] = dateStr.split('-');
      return new Date(`${year}-${month}-${day}`);
    }
  };

  useEffect(() => {
    // Get teacher data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    setTeacherData(userData);
    
    // Set default selected paper code if available
    if (userData && userData.teacher_course && userData.teacher_course.length > 0) {
      setSelectedPaperCode(userData.teacher_course[0].paper_code);
    }
    
    // Get latest attendance data from localStorage
    const latestData = JSON.parse(localStorage.getItem('teacherAttendanceData'));
    setLatestAttendance(latestData);
  }, []);
  
  // Fetch attendance data when selected paper code changes
  useEffect(() => {
    if (selectedPaperCode && teacherData) {
      fetchAttendanceData();
      fetchAttendance()
    }
  }, [selectedPaperCode]);


  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('https://e-college-data.onrender.com/v1/students/student-attendance-onedayforteacher', {
       paper_code:selectedPaperCode
      });
      const data = response.data;
      setStudentAttendanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // Fetch attendance data based on selected paper code
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://e-college-data.onrender.com/v1/teachers/teachers-all-attendance',
        { paper_code: selectedPaperCode, c_roll: teacherData.c_roll }
      );
      
      if (response.data && response.data.data) {
        // Sort by date descending (most recent first)
        const sortedData = response.data.data.sort((a, b) => {
          return parseDateString(b.date) - parseDateString(a.date);
        });
        
        setAttendanceData(sortedData);
        
        // Calculate statistics
        const presentCount = sortedData.filter(item => item.status === 'present').length;
        const totalCount = sortedData.length;
        
        setStats({
          present: presentCount,
          absent: totalCount - presentCount,
          total: totalCount
        });
        
        // Update latest attendance
        if (sortedData.length > 0) {
          setLatestAttendance(sortedData[0]);
          localStorage.setItem('teacherAttendanceData', JSON.stringify(sortedData[0]));
        }
      }
    } catch (err) {
      setError('Failed to fetch attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  
  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = attendanceData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle paper code selection
  const handlePaperCodeChange = (paperCode) => {
    setSelectedPaperCode(paperCode);
    setDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when changing paper code
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = parseDateString(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString; // Fallback to the original string
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    return timeString || 'N/A';
  };

  // Calculate class duration
  const calculateDuration = (joinTime, exitTime) => {
    if (!joinTime || !exitTime) return 'N/A';
    
    try {
      // Convert 12-hour time format to minutes
      const parseTime = (time) => {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
      };
      
      const startMinutes = parseTime(joinTime);
      const endMinutes = parseTime(exitTime);
      
      let diffMinutes = endMinutes - startMinutes;
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Adjust for crossing midnight
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      if (hours === 0) {
        return `${minutes} mins`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    } catch (e) {
      return 'N/A';
    }
  };

  // Get course name from paper code
  const getCourseNameByPaperCode = (paperCode) => {
    if (!teacherData || !teacherData.teacher_course) return paperCode;
    
    const course = teacherData.teacher_course.find(course => course.paper_code === paperCode);
    return course ? `${paperCode} - ${course.paper_name}` : paperCode;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Paper Code Dropdown */}
        {teacherData && teacherData.teacher_course && teacherData.teacher_course.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Select Course</h3>
              <div className=" relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full md:w-96 bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="block truncate">
                      {selectedPaperCode ? getCourseNameByPaperCode(selectedPaperCode) : 'Select Course'}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
                
                {dropdownOpen && (
                  <div className=" z-100 mt-1 w-full md:w-96 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {teacherData.teacher_course.map((course) => (
                      <div
                        key={course}
                        className={`cursor-pointer select-none text-amber-400 relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                          selectedPaperCode === course ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => handlePaperCodeChange(course)}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{course}</span>
                        </div>
                        {selectedPaperCode === course && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                            <CheckCircle className="h-5 w-5" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Teacher Profile Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white flex flex-col justify-center items-center md:w-64">
              <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                {teacherData?.image ? (
                  <img 
                    src={teacherData.image} 
                    alt={teacherData?.name || "Teacher"} 
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold">{teacherData?.name || "Teacher Name"}</h2>
              <p className="text-blue-100 text-sm mt-1">{teacherData?.email || "email@example.com"}</p>
              <div className="mt-4 bg-white/10 rounded-lg p-2 px-3">
                <p className="text-sm">ID: {teacherData?.c_roll || "N/A"}</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 w-full">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Book className="mr-2 text-blue-600" size={20} />
                    Subject Details
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Paper Code:</span> {selectedPaperCode || (latestAttendance?.paper_code || "N/A")}</p>

                    <p className="text-gray-600"><span className="font-medium">Role:</span> {teacherData?.role || "Teacher"}</p>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Award className="mr-2 text-blue-600" size={20} />
                    Attendance Stats
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">Present</p>
                      <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-700">Absent</p>
                      <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">Total</p>
                      <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Attendance for student */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden my-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Users className="w-7 h-7" />
                  Total Students ({studentAttendanceData.totalStudents})
                </h2>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <UserCheck className="w-7 h-7" />
                  Present Students ({studentAttendanceData.presentCount})
                </h2>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <RefreshCw className="w-7 h-7" />
                  Attendance ({studentAttendanceData.attendancePercentage})
                </h2>
              </div>

              {studentAttendanceData.presentStudents && studentAttendanceData.presentStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student Details
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          College Roll
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exit Time
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentAttendanceData.presentStudents.map((student, index) => (
                        <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white font-bold text-lg">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">{student.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.c_roll}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Clock className="w-4 h-4 mr-2 text-green-500" />
                              {student.jointime}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Clock className="w-4 h-4 mr-2 text-red-500" />
                              {student.exittime}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Present
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Present</h3>
                  <p className="text-gray-500">No students have attended the class today.</p>
                </div>
              )}
            </div>

        {/* Latest Attendance */}
        {latestAttendance && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-l-4 border-green-500">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Latest Class Attendance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(latestAttendance.date)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{formatTime(latestAttendance.jointime)} - {formatTime(latestAttendance.exittime)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`mr-3 ${latestAttendance.status === 'present' ? 'text-green-500' : 'text-red-500'}`}>
                    {latestAttendance.status === 'present' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-medium capitalize ${latestAttendance.status === 'present' ? 'text-green-700' : 'text-red-700'}`}>
                      {latestAttendance.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Attendance History</h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedPaperCode ? `Showing records for ${getCourseNameByPaperCode(selectedPaperCode)}` : 'Please select a course'}
            </p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading attendance records...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : !selectedPaperCode ? (
            <div className="p-8 text-center text-gray-600">Please select a course to view attendance records.</div>
          ) : attendanceData.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No attendance records found for this course.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Time</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((item, index) => (
                      <tr key={item._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatTime(item.jointime)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatTime(item.exittime || 'N/A')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {calculateDuration(item.jointime, item.exittime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, attendanceData.length)}
                      </span>{' '}
                      of <span className="font-medium">{attendanceData.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(totalPages).keys()].map(number => {
                        // Only show a few page numbers and ellipsis for the rest
                        if (
                          number + 1 === 1 || 
                          number + 1 === totalPages || 
                          (number + 1 >= currentPage - 1 && number + 1 <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={number}
                              onClick={() => paginate(number + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === number + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                                {number + 1}
                            </button>
                          );
                        } else if (
                          number + 1 === currentPage - 2 || 
                          number + 1 === currentPage + 2
                        ) {
                          return (
                            <span
                              key={number}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;