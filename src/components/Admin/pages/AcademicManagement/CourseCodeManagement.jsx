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
  const [addingPapers, setAddingPapers] = useState(null);
  const [bulkPapersForm, setBulkPapersForm] = useState({
    papers: [{ paper_code: '', paper_name: '' }]
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onConfirm: null });

  const [singlePaperForm, setSinglePaperForm] = useState({
    course_id: '',
    course_code: '',
    sem: '',
    paper_code: '',
    paper_name: ''
  });
  const [showSingleForm, setShowSingleForm] = useState('');
  const [newPaper, setNewPaper] = useState({});
  const [showAddForm, setShowAddForm] = useState({});


  // Modal functions - defined after state declarations
  const showPopup = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closePopup = () => {
    setShowModal(false);
    setModalMessage('');
  };

  // Confirmation modal functions
  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ show: true, message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmModal.onConfirm) {
      confirmModal.onConfirm();
    }
    setConfirmModal({ show: false, message: '', onConfirm: null });
  };

  const handleCancel = () => {
    setConfirmModal({ show: false, message: '', onConfirm: null });
  };

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
      showPopup('Error fetching courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSinglePaper = async (courseCode, sem, key) => {
    const paper = newPaper[key];

    if (!paper?.paper_code || !paper?.paper_name) {
      alert("Both fields are required");
      return;
    }

    try {
      const response = await fetch('https://e-college-data.onrender.com/v1/paper-code/add-papercode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_code: paper.paper_code,
          paper_name: paper.paper_name,
          course_code: courseCode,
          sem: sem.toString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Something went wrong");

      // Optionally refresh the papers for that semester
      fetchPapers(courseCode, sem);

      // Clear the input
      setNewPaper((prev) => ({
        ...prev,
        [key]: { paper_code: '', paper_name: '' },
      }));
      setShowAddForm((prev) => ({
        ...prev,
        [key]: false,
      }));

    } catch (err) {
      alert("Error: " + err.message);
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
          [key]: result.data.papers || []
        }));
      } else {
        // Even if not successful, set empty array to show "No papers assigned"
        const key = `${course_id}-${sem}`;
        setData(prev => ({
          ...prev,
          [key]: []
        }));
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      showPopup('Error fetching papers. Please try again.');
    }
  };

  const handleDeleteCourse = async (course_id, sem) => {
    showConfirm(
      `Are you sure you want to delete all papers from Course ${course_id}, Semester ${sem}?`,
      async () => {
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
            showPopup('Course papers deleted successfully!');
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
          } else {
            showPopup('Error deleting course papers. Please try again.');
          }
        } catch (err) {
          console.error('Error deleting course papers:', err);
          showPopup('Error deleting course papers. Please try again.');
        }
      }
    );
  };

  const handleDeletePaper = async (course_id, sem, paper_code) => {
    showConfirm(
      `Are you sure you want to delete paper ${paper_code}?`,
      async () => {
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
            showPopup('Paper removed successfully!');
            // Remove from local state
            const key = `${course_id}-${sem}`;
            setData(prev => ({
              ...prev,
              [key]: prev[key].filter(paper => paper.paper_code !== paper_code)
            }));
          } else {
            showPopup('Error removing paper. Please try again.');
          }
        } catch (err) {
          console.error('Error removing paper:', err);
          showPopup('Error removing paper. Please try again.');
        }
      }
    );
  };

  const handleUpdatePaper = async (course_id, sem, paper_code) => {
    // Validation
    if (!updateForm.paper_name.trim() || !updateForm.new_paper_code.trim()) {
      showPopup('Please fill in both paper name and paper code.');
      return;
    }

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
        showPopup('Paper updated successfully!');
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
      } else {
        showPopup(result.message || 'Error updating paper. Please try again.');
      }
    } catch (err) {
      console.error('Error updating paper:', err);
      showPopup('Error updating paper. Please check your connection and try again.');
    }
  };

  const handleCreateBulkPapers = async (course_id, sem) => {
    // Validate form
    const validPapers = bulkPapersForm.papers.filter(paper =>
      paper.paper_code.trim() && paper.paper_name.trim()
    );

    if (validPapers.length === 0) {
      showPopup('Please add at least one paper with both code and name filled.');
      return;
    }

    // Check for duplicate paper codes
    const paperCodes = validPapers.map(p => p.paper_code);
    const uniqueCodes = new Set(paperCodes);
    if (paperCodes.length !== uniqueCodes.size) {
      showPopup('Duplicate paper codes found. Please ensure all paper codes are unique.');
      return;
    }

    try {
      const response = await fetch(
        'https://e-college-data.onrender.com/v1/paper-code/create-course-code-all',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_code: course_id,
            sem: sem,
            papers: validPapers
          })
        }
      );
      const result = await response.json();

      if (result.success) {
        showPopup('Papers created successfully!');
        // Refresh the papers for this semester
        fetchPapers(course_id, sem);
        setAddingPapers(null);
        setBulkPapersForm({ papers: [{ paper_code: '', paper_name: '' }] });
      } else {
        showPopup(result.message || 'Error creating papers. Please try again.');
      }
    } catch (err) {
      console.error('Error creating papers:', err);
      showPopup('Error creating papers. Please check your connection and try again.');
    }
  };

  const startEdit = (paper) => {
    setEditingPaper(paper._id);
    setUpdateForm({
      paper_name: paper.paper_name,
      new_paper_code: paper.paper_code
    });
  };

  const startAddBulkPapers = (course_id, sem) => {
    setAddingPapers(`${course_id}-${sem}`);
    setBulkPapersForm({ papers: [{ paper_code: '', paper_name: '' }] });
  };

  const addPaperRow = () => {
    setBulkPapersForm(prev => ({
      papers: [...prev.papers, { paper_code: '', paper_name: '' }]
    }));
  };

  const removePaperRow = (index) => {
    if (bulkPapersForm.papers.length > 1) {
      setBulkPapersForm(prev => ({
        papers: prev.papers.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePaperRow = (index, field, value) => {
    setBulkPapersForm(prev => ({
      papers: prev.papers.map((paper, i) =>
        i === index ? { ...paper, [field]: value } : paper
      )
    }));
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

  const cancelAddBulkPapers = () => {
    setAddingPapers(null);
    setBulkPapersForm({ papers: [{ paper_code: '', paper_name: '' }] });
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-2">Course Management</h1>
        <p className="text-gray-400">Manage courses, semesters, and papers</p>
      </div>

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
                  const hasExistingPapers = data[key] && data[key].length > 0;
                  const papersLoaded = data.hasOwnProperty(key);

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
                              startAddBulkPapers(course.course_id, sem);
                            }}
                          >
                            Create Papers
                          </button>
                          {hasExistingPapers && (
                            <button
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCourse(course.course_id, sem);
                              }}
                            >
                              Delete All Papers
                            </button>
                          )}
                          <span className="text-gray-300">
                            {expandedSems[key] ? '▼' : '►'}
                          </span>
                        </div>
                      </div>

                      {expandedSems[key] && (
                        <div className="p-4 bg-gray-900">
                          {/* Create Papers Form */}
                          {addingPapers === key && (
                            <div className="bg-green-900 p-4 rounded-md mb-4 border border-green-600">
                              <h4 className="text-green-400 font-semibold mb-3">Create Papers for Semester {sem}</h4>
                              <div className="space-y-4">
                                {bulkPapersForm.papers.map((paper, index) => (
                                  <div key={index} className="bg-gray-800 p-3 rounded-md">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-green-300 font-medium">Paper {index + 1}</span>
                                      {bulkPapersForm.papers.length > 1 && (
                                        <button
                                          className="text-red-400 hover:text-red-300 text-sm"
                                          onClick={() => removePaperRow(index)}
                                        >
                                          Remove
                                        </button>
                                      )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-green-300 mb-1 text-sm">Paper Code:</label>
                                        <input
                                          type="text"
                                          value={paper.paper_code}
                                          onChange={(e) => updatePaperRow(index, 'paper_code', e.target.value)}
                                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
                                          placeholder="e.g., MCA-401"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-green-300 mb-1 text-sm">Paper Name:</label>
                                        <input
                                          type="text"
                                          value={paper.paper_name}
                                          onChange={(e) => updatePaperRow(index, 'paper_name', e.target.value)}
                                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-green-400"
                                          placeholder="e.g., Artificial Intelligence"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <button
                                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm flex items-center"
                                  onClick={addPaperRow}
                                >
                                  + Add Another Paper
                                </button>

                                <div className="flex space-x-2 pt-2">
                                  <button
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                                    onClick={() => handleCreateBulkPapers(course.course_id, sem)}
                                  >
                                    Create All Papers
                                  </button>
                                  <button
                                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm"
                                    onClick={cancelAddBulkPapers}
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
                                            placeholder="Enter paper name"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-purple-400 mb-1">Paper Code:</label>
                                          <input
                                            type="text"
                                            value={updateForm.new_paper_code}
                                            onChange={(e) => setUpdateForm(prev => ({ ...prev, new_paper_code: e.target.value }))}
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
                                            placeholder="Enter paper code"
                                          />
                                        </div>
                                        <div className="flex space-x-2">
                                          <button
                                            className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium"
                                            onClick={() => handleUpdatePaper(course.course_id, sem, paper.paper_code)}
                                          >
                                            Save Changes
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

                                {/* Show button if form is hidden */}
                                {!showAddForm[key] && (
                                  <button
                                    onClick={() =>
                                      setShowAddForm((prev) => ({ ...prev, [key]: true }))
                                    }
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                                  >
                                    + Add Paper
                                  </button>
                                )}

                                {/* Show form only when state is true */}
                                {showAddForm[key] && (
                                  <div className="mt-4 p-4 bg-gray-800 rounded-md border border-purple-600">
                                    <h4 className="text-purple-400 font-semibold mb-2">Add a New Paper</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                      <div>
                                        <label className="block text-sm text-purple-300 mb-1">Paper Code:</label>
                                        <input
                                          type="text"
                                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-400"
                                          value={newPaper[key]?.paper_code || ''}
                                          onChange={(e) =>
                                            setNewPaper((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...(prev[key] || {}),
                                                paper_code: e.target.value,
                                              },
                                            }))
                                          }
                                          placeholder="e.g., BCA-103"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm text-purple-300 mb-1">Paper Name:</label>
                                        <input
                                          type="text"
                                          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-purple-400"
                                          value={newPaper[key]?.paper_name || ''}
                                          onChange={(e) =>
                                            setNewPaper((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...(prev[key] || {}),
                                                paper_name: e.target.value,
                                              },
                                            }))
                                          }
                                          placeholder="e.g., Java"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleAddSinglePaper(course.code, sem, key)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                      >
                                        Add Paper
                                      </button>
                                      <button
                                        onClick={() =>
                                          setShowAddForm((prev) => ({ ...prev, [key]: false }))
                                        }
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}



                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-gray-400 mb-3">No papers assigned for this semester</p>
                                <button
                                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                                  onClick={() => startAddBulkPapers(course.course_id, sem)}
                                >
                                  Create Papers
                                </button>
                              </div>
                            )
                          ) : (
                            <p className="text-gray-400 text-center py-4">Loading Papers...</p>
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

      {/* Enhanced Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border-2 border-purple-600 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl transform animate-pulse">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-white mb-6 text-lg">{modalMessage}</p>
              <button
                onClick={closePopup}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <p className="text-white mb-6 text-lg">{confirmModal.message}</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourseManagement;