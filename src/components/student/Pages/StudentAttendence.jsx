import { useEventListener } from "@chakra-ui/hooks";
import axios from "axios";
import React, { useState, useEffect } from "react";

const StudentAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [allAttendance, setAllAttendance] = useState(null);
  const [paperCode, setPaperCode] = useState("MCA-101");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Start with null to properly track if user is loaded
  // Initialize paperCodes with a default array instead of null
  const [paperCodes, setPaperCodes] = useState(['MCA-101', 'MCA-102', 'MCA-103', 'MCA-104', 'MCA-105']);
  
  // First, load the user data from localStorage
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      // Check if userData has c_roll before setting user state
      if (userData && userData.c_roll) {
        setUser(userData);
        // Set paper code if available
        if (userData.paper_code) {
          setPaperCodes(userData.paper_code);
        }
      } else {
        console.warn("No valid user data found in localStorage");
        setError("User data not available. Please login again.");
      }
    } catch (err) {
      console.error("Error loading user data:", err);
      setError("Error loading user data. Please login again.");
    }
  }, []);
  
  // Then, fetch attendance data only after user is loaded
  useEffect(() => {
    // Only fetch data if user exists and has c_roll
    if (user && user.c_roll) {
      fetchTodayAttendance();
      fetchAllAttendance();
    }
  }, [user, paperCode]); // Add paperCode as dependency to refetch when it changes
  
  const fetchTodayAttendance = async () => {
    // Don't proceed if user data isn't available
    if (!user || !user.c_roll) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://e-college-data.onrender.com/v1/students/student-attendance-today', { 
        c_roll: user.c_roll 
      });

      const data = response.data;
      setTodayAttendance(data);
    } catch (err) {
      setError("Failed to fetch today's attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllAttendance = async () => {
    // Don't proceed if user data isn't available
    if (!user || !user.c_roll) {
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://e-college-data.onrender.com/v1/students/student-attendance-alldays', {
        c_roll: user.c_roll,
        paper_code: paperCode
      });
     
      setAllAttendance(response.data);
    } catch (err) {
      setError("Failed to fetch all attendance data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaperCodeChange = (e) => {
    setPaperCode(e.target.value);
    // We don't need to fetch immediately here since the useEffect will handle it
  };
  
  // Calculate attendance percentage with null/undefined checks
  const attendancePercentage = allAttendance?.attendanceStats && allAttendance.totalClasses
    ? Math.round((allAttendance.attendanceStats.present / allAttendance.totalClasses) * 100) 
    : 0;
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const isPresent = status?.toLowerCase() === 'present';
    return (
      <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
        isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    );
  };

  // Helper function to calculate duration between join and exit times
  const calculateDuration = (joinTime, exitTime) => {
    if (!joinTime || !exitTime) return 'N/A';
    
    try {
      const joinMatch = joinTime.match(/(\d+):(\d+)\s+(AM|PM)/);
      const exitMatch = exitTime.match(/(\d+):(\d+)\s+(AM|PM)/);
      
      if (!joinMatch || !exitMatch) return 'N/A';
      
      const [joinHour, joinMinute, joinPeriod] = joinMatch.slice(1);
      const [exitHour, exitMinute, exitPeriod] = exitMatch.slice(1);
      
      // Convert to 24-hour format
      let jHour = parseInt(joinHour);
      if (joinPeriod === "PM" && jHour !== 12) jHour += 12;
      if (joinPeriod === "AM" && jHour === 12) jHour = 0;
      
      let eHour = parseInt(exitHour);
      if (exitPeriod === "PM" && eHour !== 12) eHour += 12;
      if (exitPeriod === "AM" && eHour === 12) eHour = 0;
      
      // Calculate minutes difference
      const joinTimeMinutes = jHour * 60 + parseInt(joinMinute);
      const exitTimeMinutes = eHour * 60 + parseInt(exitMinute);
      const diffMinutes = exitTimeMinutes - joinTimeMinutes;
      
      if (diffMinutes < 0) return 'Invalid time';
      
      // Format as hours and minutes
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      if (hours > 0) {
        return `${hours} hr ${minutes} min`;
      } else {
        return `${minutes} min`;
      }
    } catch (err) {
      console.error("Error calculating duration:", err);
      return 'N/A';
    }
  };
  
  // Attendance record card component
  const AttendanceRecordCard = ({ record, index }) => {
    if (!record) return null;
    
    return (
      <div className={`mb-6 pb-6 ${index > 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{record.name || 'Unknown'}</h3>
            <p className="text-gray-500 text-sm mt-1">Roll No: {record.c_roll || 'N/A'}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <StatusBadge status={record.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Paper Code</span>
                <span className="font-medium text-gray-800">{record.paper_code || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Course Code</span>
                <span className="font-medium text-gray-800">{record.course_code || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-800">{record.date || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Join Time</span>
                <span className="font-medium text-gray-800">{record.jointime || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exit Time</span>
                <span className="font-medium text-gray-800">{record.exittime || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-gray-800">
                  {calculateDuration(record.jointime, record.exittime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {/* Header section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Student Attendance Dashboard</h1>
                <p className="text-blue-100">Track your class attendance and performance</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center bg-white/20 rounded-lg p-2">
                  <select
                    id="paperCode"
                    value={paperCode}
                    onChange={handlePaperCodeChange}
                    className="bg-white text-gray-800 border-0 rounded-md py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paperCodes && paperCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            {/* Display an error if no user data */}
            {!user && !loading && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">User data not available. Please login again.</p>
                  </div>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Today's Attendance Card */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 h-full">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-800">Today's Attendance</h2>
                    {todayAttendance?.data?.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Showing {todayAttendance.data.length} record{todayAttendance.data.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  {todayAttendance && todayAttendance.data && todayAttendance.data.length > 0 ? (
                    <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                      <div className="divide-y divide-gray-200">
                        {todayAttendance.data.map((record, index) => (
                          <AttendanceRecordCard key={record._id || index} record={record} index={index} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 flex items-center justify-center">
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                          <svg className="h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Records Found</h3>
                        <p className="mt-2 text-sm text-gray-500">No attendance record found for today.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Overall Attendance Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 h-full">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-800">Overall Attendance</h2>
                  </div>
                  
                  {allAttendance && allAttendance.attendanceStats && (
                    <div className="p-6">
                      <div className="flex justify-center mb-6">
                        <div className="relative h-40 w-40">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className={`text-3xl font-bold ${attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                {attendancePercentage}%
                              </span>
                              <p className="text-sm text-gray-500 mt-1">Attendance</p>
                            </div>
                          </div>
                          <svg className="w-full h-full" viewBox="0 0 120 120">
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="54" 
                              fill="none" 
                              stroke="#e6e6e6" 
                              strokeWidth="12"
                            />
                            <circle 
                              cx="60" 
                              cy="60" 
                              r="54" 
                              fill="none" 
                              stroke={attendancePercentage >= 75 ? '#10b981' : '#ef4444'} 
                              strokeWidth="12"
                              strokeDasharray={`${(attendancePercentage / 100) * 339} 339`}
                              strokeDashoffset="0"
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <span className="block text-2xl font-bold text-green-600">{allAttendance.attendanceStats.present || 0}</span>
                            <span className="text-sm text-gray-600">Classes Attended</span>
                          </div>
                          <div className="bg-red-50 rounded-lg p-4 text-center">
                            <span className="block text-2xl font-bold text-red-600">{allAttendance.attendanceStats.absent || 0}</span>
                            <span className="text-sm text-gray-600">Classes Missed</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <span className="block text-2xl font-bold text-blue-600">{allAttendance.totalClasses || 0}</span>
                          <span className="text-sm text-gray-600">Total Classes</span>
                        </div>
                        
                        {attendancePercentage < 75 && (
                          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-red-700">
                                  Your attendance is below the required 75% threshold
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {(!allAttendance || !allAttendance.attendanceStats) && (
                    <div className="p-6 flex items-center justify-center">
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                          <svg className="h-8 w-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Data Available</h3>
                        <p className="mt-2 text-sm text-gray-500">Overall attendance data could not be loaded.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;