import React, { useState } from 'react';

const CreateCourseCode = () => {
  const [formData, setFormData] = useState({
    course_id: '',
    name: '',
    code: '',
    description: '',
    imageUrl: '',
    bgColor: 'bg-gradient-to-r from-pink-400 to-purple-500', // Default gradient
    duration: '',
    instructor: '',
    students: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradientOptions = [
    { value: 'pink-400 to-purple-500', label: 'Pink to Purple' },
    { value: 'violet-400 to-blue-500', label: 'Violet to Blue' },
    { value: 'pink-400 to-red-500', label: 'Pink to Red' },
    { value: 'blue-400 to-green-500', label: 'Blue to Green' },
    { value: 'purple-400 to-indigo-500', label: 'Purple to Indigo' }
  ];

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

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Create New Course</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
        {message && (
          <div
            className={`p-4 mb-4 rounded ${
              message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
            <input
              type="text"
              name="course_id"
              placeholder="e.g., 109"
              value={formData.course_id}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.course_id && <p className="text-red-500 text-sm mt-1">{errors.course_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Bachelor of Science in Mathematics"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g., B.sc(Math)"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
            <input
              type="text"
              name="imageUrl"
              placeholder="e.g., BSC-ANIM"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color Gradient</label>
            <select
              name="bgColor"
              value={formData.bgColor.replace('bg-gradient-to-r from-', '')}
              onChange={handleGradientChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {gradientOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="e.g., 3 years"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <input
              type="text"
              name="instructor"
              placeholder="e.g., Arpan Sen"
              value={formData.instructor}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
            <input
              type="number"
              name="students"
              placeholder="e.g., 7000"
              value={formData.students}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.students && <p className="text-red-500 text-sm mt-1">{errors.students}</p>}
          </div>
          <div className="flex justify-end">
            <button
              className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-purple-300"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseCode;