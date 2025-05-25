// import React, { useEffect, useState } from 'react';

// const TeacherCourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [data, setData] = useState({});
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [expandedSems, setExpandedSems] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [editingPaper, setEditingPaper] = useState(null);
//   const [updateForm, setUpdateForm] = useState({
//     paper_name: '',
//     new_paper_code: ''
//   });

//   // Fetch all courses on component mount
//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Filter courses based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredCourses(courses);
//     } else {
//       const filtered = courses.filter(course =>
//         course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         course.course_id.toString().includes(searchTerm)
//       );
//       setFilteredCourses(filtered);
//     }
//   }, [courses, searchTerm]);

//   const fetchCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/course-all-id');
//       const data = await response.json();
//       setCourses(data);
//       setFilteredCourses(data);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleCourse = (course_id) => {
//     setExpandedCourses(prev => ({
//       ...prev,
//       [course_id]: !prev[course_id]
//     }));
//   };

//   const toggleSemester = (course_id, sem) => {
//     const key = `${course_id}-${sem}`;
//     if (!expandedSems[key]) {
//       fetchPapers(course_id, sem);
//     }
//     setExpandedSems(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const fetchPapers = async (course_id, sem) => {
//     try {
//       const response = await fetch(
//         'https://e-college-data.onrender.com/v1/paper-code/get-coursecode',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ course_code: course_id, sem })
//         }
//       );
//       const result = await response.json();
//       if (result.success) {
//         const key = `${course_id}-${sem}`;
//         setData(prev => ({
//           ...prev,
//           [key]: result.data.papers
//         }));
//       }
//     } catch (err) {
//       console.error('Error fetching papers:', err);
//     }
//   };

//   const handleDeleteCourse = async (course_id, sem) => {
//     if (!window.confirm(`Are you sure you want to delete all papers from Course ${course_id}, Semester ${sem}?`)) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         'https://e-college-data.onrender.com/v1/paper-code/delete-courseCode',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ course_code: course_id, sem })
//         }
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         alert('Course papers deleted successfully');
//         // Remove from local state
//         const key = `${course_id}-${sem}`;
//         setData(prev => {
//           const newData = { ...prev };
//           delete newData[key];
//           return newData;
//         });
//         setExpandedSems(prev => ({
//           ...prev,
//           [key]: false
//         }));
//       }
//     } catch (err) {
//       console.error('Error deleting course papers:', err);
//       alert('Error deleting course papers');
//     }
//   };

//   const handleDeletePaper = async (course_id, sem, paper_code) => {
//     if (!window.confirm(`Are you sure you want to delete paper ${paper_code}?`)) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         'https://e-college-data.onrender.com/v1/paper-code/remove-papercode',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ course_code: course_id, sem, paper_code })
//         }
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         alert('Paper removed successfully');
//         // Remove from local state
//         const key = `${course_id}-${sem}`;
//         setData(prev => ({
//           ...prev,
//           [key]: prev[key].filter(paper => paper.paper_code !== paper_code)
//         }));
//       }
//     } catch (err) {
//       console.error('Error removing paper:', err);
//       alert('Error removing paper');
//     }
//   };

//   const handleUpdatePaper = async (course_id, sem, paper_code) => {
//     try {
//       const response = await fetch(
//         'https://e-college-data.onrender.com/v1/paper-code/update-papercode',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             paper_name: updateForm.paper_name,
//             new_paper_code: updateForm.new_paper_code,
//             course_code: course_id,
//             sem: sem,
//             paper_code: paper_code
//           })
//         }
//       );
//       const result = await response.json();
      
//       if (result.success) {
//         alert('Paper updated successfully');
//         // Update local state
//         const key = `${course_id}-${sem}`;
//         setData(prev => ({
//           ...prev,
//           [key]: prev[key].map(paper => 
//             paper.paper_code === paper_code 
//               ? { ...paper, paper_name: updateForm.paper_name, paper_code: updateForm.new_paper_code }
//               : paper
//           )
//         }));
//         setEditingPaper(null);
//         setUpdateForm({ paper_name: '', new_paper_code: '' });
//       }
//     } catch (err) {
//       console.error('Error updating paper:', err);
//       alert('Error updating paper');
//     }
//   };

//   const startEdit = (paper) => {
//     setEditingPaper(paper._id);
//     setUpdateForm({
//       paper_name: paper.paper_name,
//       new_paper_code: paper.paper_code
//     });
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   const cancelEdit = () => {
//     setEditingPaper(null);
//     setUpdateForm({ paper_name: '', new_paper_code: '' });
//   };

//   // Generate semesters based on duration
//   const getSemesters = (duration) => {
//     if (!duration) return [];
//     const years = parseInt(duration.split(' ')[0]);
//     const totalSems = years * 2;
//     return Array.from({ length: totalSems }, (_, i) => (i + 1).toString());
//   };

//   return (
//     <div className="p-6 min-h-screen bg-black text-white">
//       <h2 className="text-2xl font-semibold text-purple-500 mb-6">Teacher Course Management</h2>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <div className="relative max-w-md">
//           <input
//             type="text"
//             placeholder="Search courses by name, code, or ID..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="w-full p-3 pl-4 pr-10 bg-gray-800 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
//           />
//           {searchTerm && (
//             <button
//               onClick={clearSearch}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
//             >
//               ✕
//             </button>
//           )}
//         </div>
//         {searchTerm && (
//           <p className="text-sm text-purple-300 mt-2">
//             Showing {filteredCourses.length} of {courses.length} courses
//           </p>
//         )}
//       </div>

//       {loading && (
//         <div className="text-center text-purple-400">Loading courses...</div>
//       )}

//       <div className="space-y-4">
//         {filteredCourses.map((course) => (
//           <div key={course._id} className="border border-purple-600 rounded-md">
//             <div
//               className="p-4 bg-purple-700 cursor-pointer hover:bg-purple-600 flex justify-between items-center"
//               onClick={() => toggleCourse(course.course_id)}
//             >
//               <div>
//                 <span className="font-semibold">{course.code} - {course.name}</span>
//                 <p className="text-sm text-purple-200">Duration: {course.duration}</p>
//               </div>
//               <span className="text-purple-300">
//                 {expandedCourses[course.course_id] ? '▼' : '►'}
//               </span>
//             </div>

//             {expandedCourses[course.course_id] && (
//               <div className="space-y-2 p-2">
//                 {getSemesters(course.duration).map((sem) => {
//                   const key = `${course.course_id}-${sem}`;
//                   return (
//                     <div key={sem} className="border border-gray-600 rounded-md ml-4">
//                       <div
//                         className="p-3 bg-gray-800 cursor-pointer hover:bg-gray-700 flex justify-between items-center"
//                         onClick={() => toggleSemester(course.course_id, sem)}
//                       >
//                         <span>Semester: {sem}</span>
//                         <div className="flex space-x-2 items-center">
//                           <button
//                             className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDeleteCourse(course.course_id, sem);
//                             }}
//                           >
//                             Delete All Papers
//                           </button>
//                           <span className="text-gray-300">
//                             {expandedSems[key] ? '▼' : '►'}
//                           </span>
//                         </div>
//                       </div>

//                       {expandedSems[key] && (
//                         <div className="p-4 bg-gray-900">
//                           {data[key] ? (
//                             data[key].length > 0 ? (
//                               <div className="space-y-3">
//                                 {data[key].map((paper) => (
//                                   <div
//                                     key={paper._id}
//                                     className="bg-gray-800 p-3 rounded-md hover:bg-gray-700"
//                                   >
//                                     {editingPaper === paper._id ? (
//                                       <div className="space-y-3">
//                                         <div>
//                                           <label className="block text-purple-400 mb-1">Paper Name:</label>
//                                           <input
//                                             type="text"
//                                             value={updateForm.paper_name}
//                                             onChange={(e) => setUpdateForm(prev => ({ ...prev, paper_name: e.target.value }))}
//                                             className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
//                                           />
//                                         </div>
//                                         <div>
//                                           <label className="block text-purple-400 mb-1">Paper Code:</label>
//                                           <input
//                                             type="text"
//                                             value={updateForm.new_paper_code}
//                                             onChange={(e) => setUpdateForm(prev => ({ ...prev, new_paper_code: e.target.value }))}
//                                             className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
//                                           />
//                                         </div>
//                                         <div className="flex space-x-2">
//                                           <button
//                                             className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
//                                             onClick={() => handleUpdatePaper(course.course_id, sem, paper.paper_code)}
//                                           >
//                                             Save
//                                           </button>
//                                           <button
//                                             className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
//                                             onClick={cancelEdit}
//                                           >
//                                             Cancel
//                                           </button>
//                                         </div>
//                                       </div>
//                                     ) : (
//                                       <div className="flex justify-between items-center">
//                                         <div>
//                                           <p><span className="text-purple-400">Code:</span> {paper.paper_code}</p>
//                                           <p><span className="text-purple-400">Name:</span> {paper.paper_name}</p>
//                                         </div>
//                                         <div className="flex space-x-2">
//                                           <button
//                                             className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
//                                             onClick={() => startEdit(paper)}
//                                           >
//                                             Update
//                                           </button>
//                                           <button
//                                             className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
//                                             onClick={() => handleDeletePaper(course.course_id, sem, paper.paper_code)}
//                                           >
//                                             Delete
//                                           </button>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             ) : (
//                               <p className="text-gray-400 text-center py-4">No papers found for this semester</p>
//                             )
//                           ) : (
//                             <p className="text-gray-400 text-center py-4">Loading papers...</p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {!loading && filteredCourses.length === 0 && searchTerm && (
//         <div className="text-center text-gray-400 mt-8">
//           <p>No courses found matching "{searchTerm}"</p>
//           <button
//             onClick={clearSearch}
//             className="mt-2 text-purple-400 hover:text-purple-300 underline"
//           >
//             Clear search
//           </button>
//         </div>
//       )}

//       {!loading && courses.length === 0 && !searchTerm && (
//         <div className="text-center text-gray-400 mt-8">
//           No courses found
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherCourseManagement;

import React, { useEffect, useState } from 'react';

const TeacherCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [expandedSems, setExpandedSems] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    paper_name: '',
    new_paper_code: ''
  });
  const [addingPaper, setAddingPaper] = useState(null);
  const [addForm, setAddForm] = useState({
    paper_name: '',
    paper_code: ''
  });

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_id.toString().includes(searchTerm)
      );
      setFilteredCourses(filtered);
    }
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/course-all-id');
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (course_id) => {
    setExpandedCourses(prev => ({
      ...prev,
      [course_id]: !prev[course_id]
    }));
  };

  const toggleSemester = (course_id, sem) => {
    const key = `${course_id}-${sem}`;
    if (!expandedSems[key]) {
      fetchPapers(course_id, sem);
    }
    setExpandedSems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const fetchPapers = async (course_id, sem) => {
    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/get-coursecode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course_code: course_id, sem })
        }
      );
      const result = await response.json();
      if (result.success) {
        const key = `${course_id}-${sem}`;
        setData(prev => ({
          ...prev,
          [key]: result.data.papers
        }));
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
    }
  };

  const handleDeleteCourse = async (course_id, sem) => {
    if (!window.confirm(`Are you sure you want to delete all papers from Course ${course_id}, Semester ${sem}?`)) {
      return;
    }

    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/delete-courseCode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course_code: course_id, sem })
        }
      );
      const result = await response.json();
      
      if (result.success) {
        alert('Course papers deleted successfully');
        // Remove from local state
        const key = `${course_id}-${sem}`;
        setData(prev => {
          const newData = { ...prev };
          delete newData[key];
          return newData;
        });
        setExpandedSems(prev => ({
          ...prev,
          [key]: false
        }));
      }
    } catch (err) {
      console.error('Error deleting course papers:', err);
      alert('Error deleting course papers');
    }
  };

  const handleDeletePaper = async (course_id, sem, paper_code) => {
    if (!window.confirm(`Are you sure you want to delete paper ${paper_code}?`)) {
      return;
    }

    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/remove-papercode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course_code: course_id, sem, paper_code })
        }
      );
      const result = await response.json();
      
      if (result.success) {
        alert('Paper removed successfully');
        // Remove from local state
        const key = `${course_id}-${sem}`;
        setData(prev => ({
          ...prev,
          [key]: prev[key].filter(paper => paper.paper_code !== paper_code)
        }));
      }
    } catch (err) {
      console.error('Error removing paper:', err);
      alert('Error removing paper');
    }
  };

  const handleUpdatePaper = async (course_id, sem, paper_code) => {
    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/update-papercode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paper_name: updateForm.paper_name,
            new_paper_code: updateForm.new_paper_code,
            course_code: course_id,
            sem: sem,
            paper_code: paper_code
          })
        }
      );
      const result = await response.json();
      
      if (result.success) {
        alert('Paper updated successfully');
        // Update local state
        const key = `${course_id}-${sem}`;
        setData(prev => ({
          ...prev,
          [key]: prev[key].map(paper => 
            paper.paper_code === paper_code 
              ? { ...paper, paper_name: updateForm.paper_name, paper_code: updateForm.new_paper_code }
              : paper
          )
        }));
        setEditingPaper(null);
        setUpdateForm({ paper_name: '', new_paper_code: '' });
      }
    } catch (err) {
      console.error('Error updating paper:', err);
      alert('Error updating paper');
    }
  };

  const handleAddPaper = async (course_id, sem) => {
    if (!addForm.paper_name.trim() || !addForm.paper_code.trim()) {
      alert('Please fill in both paper name and paper code');
      return;
    }

    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/add-papercode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paper_code: addForm.paper_code,
            paper_name: addForm.paper_name,
            course_code: course_id,
            sem: sem
          })
        }
      );
      const result = await response.json();
      
      if (result.success) {
        alert('Paper added successfully');
        // Add to local state
        const key = `${course_id}-${sem}`;
        const newPaper = {
          _id: Date.now().toString(), // Temporary ID for local state
          paper_code: addForm.paper_code,
          paper_name: addForm.paper_name
        };
        
        setData(prev => ({
          ...prev,
          [key]: prev[key] ? [...prev[key], newPaper] : [newPaper]
        }));
        
        setAddingPaper(null);
        setAddForm({ paper_name: '', paper_code: '' });
      } else {
        alert(result.message || 'Error adding paper');
      }
    } catch (err) {
      console.error('Error adding paper:', err);
      alert('Error adding paper');
    }
  };

  const startEdit = (paper) => {
    setEditingPaper(paper._id);
    setUpdateForm({
      paper_name: paper.paper_name,
      new_paper_code: paper.paper_code
    });
  };

  const startAdd = (course_id, sem) => {
    setAddingPaper(`${course_id}-${sem}`);
    setAddForm({ paper_name: '', paper_code: '' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const cancelEdit = () => {
    setEditingPaper(null);
    setUpdateForm({ paper_name: '', new_paper_code: '' });
  };

  const cancelAdd = () => {
    setAddingPaper(null);
    setAddForm({ paper_name: '', paper_code: '' });
  };

  // Generate semesters based on duration
  const getSemesters = (duration) => {
    if (!duration) return [];
    const years = parseInt(duration.split(' ')[0]);
    const totalSems = years * 2;
    return Array.from({ length: totalSems }, (_, i) => (i + 1).toString());
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h2 className="text-2xl font-semibold text-purple-500 mb-6">Teacher Course Management</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search courses by name, code, or ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-4 pr-10 bg-gray-800 border border-purple-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-sm text-purple-300 mt-2">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        )}
      </div>

      {loading && (
        <div className="text-center text-purple-400">Loading courses...</div>
      )}

      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <div key={course._id} className="border border-purple-600 rounded-md">
            <div
              className="p-4 bg-purple-700 cursor-pointer hover:bg-purple-600 flex justify-between items-center"
              onClick={() => toggleCourse(course.course_id)}
            >
              <div>
                <span className="font-semibold">{course.code} - {course.name}</span>
                <p className="text-sm text-purple-200">Duration: {course.duration}</p>
              </div>
              <span className="text-purple-300">
                {expandedCourses[course.course_id] ? '▼' : '►'}
              </span>
            </div>

            {expandedCourses[course.course_id] && (
              <div className="space-y-2 p-2">
                {getSemesters(course.duration).map((sem) => {
                  const key = `${course.course_id}-${sem}`;
                  return (
                    <div key={sem} className="border border-gray-600 rounded-md ml-4">
                      <div
                        className="p-3 bg-gray-800 cursor-pointer hover:bg-gray-700 flex justify-between items-center"
                        onClick={() => toggleSemester(course.course_id, sem)}
                      >
                        <span>Semester: {sem}</span>
                        <div className="flex space-x-2 items-center">
                          <button
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startAdd(course.course_id, sem);
                            }}
                          >
                            Add Paper
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.course_id, sem);
                            }}
                          >
                            Delete All Papers
                          </button>
                          <span className="text-gray-300">
                            {expandedSems[key] ? '▼' : '►'}
                          </span>
                        </div>
                      </div>

                      {expandedSems[key] && (
                        <div className="p-4 bg-gray-900">
                          {/* Add Paper Form */}
                          {addingPaper === key && (
                            <div className="bg-green-900 p-4 rounded-md mb-4 border border-green-600">
                              <h4 className="text-green-400 font-semibold mb-3">Add New Paper</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-green-300 mb-1">Paper Name:</label>
                                  <input
                                    type="text"
                                    value={addForm.paper_name}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, paper_name: e.target.value }))}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
                                    placeholder="Enter paper name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-green-300 mb-1">Paper Code:</label>
                                  <input
                                    type="text"
                                    value={addForm.paper_code}
                                    onChange={(e) => setAddForm(prev => ({ ...prev, paper_code: e.target.value }))}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
                                    placeholder="Enter paper code (e.g., BCA-1030)"
                                  />
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                                    onClick={() => handleAddPaper(course.course_id, sem)}
                                  >
                                    Add Paper
                                  </button>
                                  <button
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
                                    onClick={cancelAdd}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {data[key] ? (
                            data[key].length > 0 ? (
                              <div className="space-y-3">
                                {data[key].map((paper) => (
                                  <div
                                    key={paper._id}
                                    className="bg-gray-800 p-3 rounded-md hover:bg-gray-700"
                                  >
                                    {editingPaper === paper._id ? (
                                      <div className="space-y-3">
                                        <div>
                                          <label className="block text-purple-400 mb-1">Paper Name:</label>
                                          <input
                                            type="text"
                                            value={updateForm.paper_name}
                                            onChange={(e) => setUpdateForm(prev => ({ ...prev, paper_name: e.target.value }))}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-purple-400 mb-1">Paper Code:</label>
                                          <input
                                            type="text"
                                            value={updateForm.new_paper_code}
                                            onChange={(e) => setUpdateForm(prev => ({ ...prev, new_paper_code: e.target.value }))}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
                                          />
                                        </div>
                                        <div className="flex space-x-2">
                                          <button
                                            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
                                            onClick={() => handleUpdatePaper(course.course_id, sem, paper.paper_code)}
                                          >
                                            Save
                                          </button>
                                          <button
                                            className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                                            onClick={cancelEdit}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p><span className="text-purple-400">Code:</span> {paper.paper_code}</p>
                                          <p><span className="text-purple-400">Name:</span> {paper.paper_name}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                          <button
                                            className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm"
                                            onClick={() => startEdit(paper)}
                                          >
                                            Update
                                          </button>
                                          <button
                                            className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm"
                                            onClick={() => handleDeletePaper(course.course_id, sem, paper.paper_code)}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-center py-4">No papers found for this semester</p>
                            )
                          ) : (
                            <p className="text-gray-400 text-center py-4">Loading papers...</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && filteredCourses.length === 0 && searchTerm && (
        <div className="text-center text-gray-400 mt-8">
          <p>No courses found matching "{searchTerm}"</p>
          <button
            onClick={clearSearch}
            className="mt-2 text-purple-400 hover:text-purple-300 underline"
          >
            Clear search
          </button>
        </div>
      )}

      {!loading && courses.length === 0 && !searchTerm && (
        <div className="text-center text-gray-400 mt-8">
          No courses found
        </div>
      )}
    </div>
  );
};

export default TeacherCourseManagement;