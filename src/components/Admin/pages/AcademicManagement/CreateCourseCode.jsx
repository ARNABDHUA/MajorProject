import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, Upload, Eye } from 'lucide-react';

const EnhancedCourseManager = () => {
  const [formData, setFormData] = useState({
    course_id: '',
    name: '',
    code: '',
    description: '',
    imageUrl: '',
    bgColor: 'bg-gradient-to-r from-pink-400 to-purple-500',
    duration: '',
    instructor: '',
    students: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const gradientOptions = [
    { value: 'pink-400 to-purple-500', label: 'Pink to Purple' },
    { value: 'violet-400 to-blue-500', label: 'Violet to Blue' },
    { value: 'pink-400 to-red-500', label: 'Pink to Red' },
    { value: 'blue-400 to-green-500', label: 'Blue to Green' },
    { value: 'purple-400 to-indigo-500', label: 'Purple to Indigo' }
  ];

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchCourses();
    }
  }, [activeTab]);

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/course-all-id');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Convert file to base64 or handle as needed for your API
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setFormData({ ...formData, imageUrl: e.target.result });
      };
      fileReader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course_id) newErrors.course_id = 'Course ID is required';
    if (!formData.name) newErrors.name = 'Course Name is required';
    if (!formData.code) newErrors.code = 'Course Code is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.instructor) newErrors.instructor = 'Instructor is required';
    if (!formData.students || isNaN(formData.students) || formData.students <= 0) {
      newErrors.students = 'Number of Students must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const handleGradientChange = (e) => {
    const selectedGradient = e.target.value;
    setFormData({ ...formData, bgColor: `bg-gradient-to-r from-${selectedGradient}` });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/create-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Course created successfully!');
        setFormData({
          course_id: '',
          name: '',
          code: '',
          description: '',
          imageUrl: '',
          bgColor: 'bg-gradient-to-r from-pink-400 to-purple-500',
          duration: '',
          instructor: '',
          students: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
      } else {
        setMessage('Failed to create course.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/delete-course', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (response.ok) {
        setMessage('Course deleted successfully!');
        fetchCourses(); // Refresh the course list
      } else {
        setMessage('Failed to delete course.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setMessage('An error occurred while deleting the course.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-400">Course Management</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => activeTab === 'manage' && fetchCourses()}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Manage Courses</span>
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.includes('successfully') 
                ? 'bg-green-900 border border-green-700 text-green-300' 
                : 'bg-red-900 border border-red-700 text-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Create New Course</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Course ID</label>
                  <input
                    type="text"
                    name="course_id"
                    placeholder="e.g., 109"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.course_id && <p className="text-red-400 text-sm mt-1">{errors.course_id}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Course Code</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="e.g., B.sc(Math)"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Bachelor of Science in Mathematics"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="4"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Image</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border-2 border-slate-600"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Background Gradient</label>
                <select
                  value={formData.bgColor.replace('bg-gradient-to-r from-', '')}
                  onChange={handleGradientChange}
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {gradientOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className={`mt-2 h-4 rounded ${formData.bgColor}`}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 3 years"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Instructor</label>
                  <input
                    type="text"
                    name="instructor"
                    placeholder="e.g., Arpan Sen"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.instructor && <p className="text-red-400 text-sm mt-1">{errors.instructor}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Students Count</label>
                  <input
                    type="number"
                    name="students"
                    placeholder="e.g., 7000"
                    value={formData.students}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.students && <p className="text-red-400 text-sm mt-1">{errors.students}</p>}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating...' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-slate-900 rounded-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Courses List</h2>
                <span className="text-sm text-slate-400">
                  Total: {courses.length} courses
                </span>
              </div>
            </div>
            
            {isLoadingCourses ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="mt-2 text-slate-400">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No courses found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800 border-b border-slate-700">
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">ID</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Code</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Instructor</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Duration</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Students</th>
                      <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {courses.map((course, index) => (
                      <tr key={course.course_id || index} className="hover:bg-slate-800 transition-colors">
                        <td className="p-4 text-white font-mono">{course.course_id}</td>
                        <td className="p-4 text-white">{course.name}</td>
                        <td className="p-4 text-white">
                          <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-sm">
                            {course.code}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300">{course.instructor}</td>
                        <td className="p-4 text-slate-300">{course.duration}</td>
                        <td className="p-4 text-slate-300">{course.students}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteCourse(course.course_id)}
                            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourseManager;