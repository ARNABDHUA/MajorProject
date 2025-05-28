// import React, { useState, useEffect } from 'react';
// import { RefreshCw, Plus, Trash2, Upload, Eye } from 'lucide-react';

// const EnhancedCourseManager = () => {
//   const [formData, setFormData] = useState({
//     course_id: '',
//     name: '',
//     code: '',
//     description: '',
//     imageUrl: '',
//     bgColor: 'bg-gradient-to-r from-pink-400 to-purple-500',
//     duration: '',
//     instructor: '',
//     students: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [courses, setCourses] = useState([]);
//   const [isLoadingCourses, setIsLoadingCourses] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [activeTab, setActiveTab] = useState('create');

//   const gradientOptions = [
//     { value: 'pink-400 to-purple-500', label: 'Pink to Purple' },
//     { value: 'violet-400 to-blue-500', label: 'Violet to Blue' },
//     { value: 'pink-400 to-red-500', label: 'Pink to Red' },
//     { value: 'blue-400 to-green-500', label: 'Blue to Green' },
//     { value: 'purple-400 to-indigo-500', label: 'Purple to Indigo' }
//   ];

//   useEffect(() => {
//     if (activeTab === 'manage') {
//       fetchCourses();
//     }
//   }, [activeTab]);

//   const fetchCourses = async () => {
//     setIsLoadingCourses(true);
//     try {
//       const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/course-all-id');
//       if (response.ok) {
//         const data = await response.json();
//         setCourses(data);
//       } else {
//         console.error('Failed to fetch courses');
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setIsLoadingCourses(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);

//       // Create preview URL
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreviewUrl(e.target.result);
//       };
//       reader.readAsDataURL(file);

//       // Convert file to base64 or handle as needed for your API
//       const fileReader = new FileReader();
//       fileReader.onload = (e) => {
//         setFormData({ ...formData, imageUrl: e.target.result });
//       };
//       fileReader.readAsDataURL(file);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.course_id) newErrors.course_id = 'Course ID is required';
//     if (!formData.name) newErrors.name = 'Course Name is required';
//     if (!formData.code) newErrors.code = 'Course Code is required';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.duration) newErrors.duration = 'Duration is required';
//     if (!formData.instructor) newErrors.instructor = 'Instructor is required';
//     if (!formData.students || isNaN(formData.students) || formData.students <= 0) {
//       newErrors.students = 'Number of Students must be a positive number';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//     setMessage('');
//   };

//   const handleGradientChange = (e) => {
//     const selectedGradient = e.target.value;
//     setFormData({ ...formData, bgColor: `bg-gradient-to-r from-${selectedGradient}` });
//     setMessage('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setMessage('');

//     try {
//       const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/create-course', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setMessage('Course created successfully!');
//         setFormData({
//           course_id: '',
//           name: '',
//           code: '',
//           description: '',
//           imageUrl: '',
//           bgColor: 'bg-gradient-to-r from-pink-400 to-purple-500',
//           duration: '',
//           instructor: '',
//           students: ''
//         });
//         setSelectedFile(null);
//         setPreviewUrl('');
//       } else {
//         setMessage('Failed to create course.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('An error occurred while creating the course.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteCourse = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) {
//       return;
//     }

//     try {
//       const response = await fetch('https://e-college-data.onrender.com/v1/adminroutine/delete-course', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ course_id: courseId }),
//       });

//       if (response.ok) {
//         setMessage('Course deleted successfully!');
//         fetchCourses(); // Refresh the course list
//       } else {
//         setMessage('Failed to delete course.');
//       }
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       setMessage('An error occurred while deleting the course.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-800 text-white">
//       {/* Header */}
//       <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-purple-400">Course Management</h1>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => activeTab === 'manage' && fetchCourses()}
//               className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" />
//               <span>Refresh List</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         {/* Tab Navigation */}
//         <div className="mb-6">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setActiveTab('create')}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
//                 activeTab === 'create'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//               }`}
//             >
//               <Plus className="w-4 h-4" />
//               <span>Create Course</span>
//             </button>
//             <button
//               onClick={() => setActiveTab('manage')}
//               className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
//                 activeTab === 'manage'
//                   ? 'bg-purple-600 text-white'
//                   : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
//               }`}
//             >
//               <Eye className="w-4 h-4" />
//               <span>Manage Courses</span>
//             </button>
//           </div>
//         </div>

//         {message && (
//           <div
//             className={`p-4 mb-6 rounded-lg ${
//               message.includes('successfully')
//                 ? 'bg-green-900 border border-green-700 text-green-300'
//                 : 'bg-red-900 border border-red-700 text-red-300'
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {activeTab === 'create' && (
//           <div className="bg-slate-900 rounded-lg border border-slate-700 p-8">
//             <h2 className="text-xl font-semibold text-white mb-6">Create New Course</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Course ID</label>
//                   <input
//                     type="text"
//                     name="course_id"
//                     placeholder="e.g., 109"
//                     value={formData.course_id}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {errors.course_id && <p className="text-red-400 text-sm mt-1">{errors.course_id}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Course Code</label>
//                   <input
//                     type="text"
//                     name="code"
//                     placeholder="e.g., B.sc(Math)"
//                     value={formData.code}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">Course Name</label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="e.g., Bachelor of Science in Mathematics"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//                 {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
//                 <textarea
//                   name="description"
//                   placeholder="Enter course description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   rows="4"
//                 />
//                 {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">Course Image</label>
//                 <div className="flex items-center space-x-4">
//                   <label className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg cursor-pointer transition-colors">
//                     <Upload className="w-4 h-4" />
//                     <span>Upload Image</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="hidden"
//                     />
//                   </label>
//                   {previewUrl && (
//                     <img
//                       src={previewUrl}
//                       alt="Preview"
//                       className="w-16 h-16 object-cover rounded-lg border-2 border-slate-600"
//                     />
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">Background Gradient</label>
//                 <select
//                   value={formData.bgColor.replace('bg-gradient-to-r from-', '')}
//                   onChange={handleGradientChange}
//                   className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 >
//                   {gradientOptions.map((option) => (
//                     <option key={option.value} value={option.value} className="bg-slate-800">
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//                 <div className={`mt-2 h-4 rounded ${formData.bgColor}`}></div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
//                   <input
//                     type="text"
//                     name="duration"
//                     placeholder="e.g., 3 years"
//                     value={formData.duration}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Instructor</label>
//                   <input
//                     type="text"
//                     name="instructor"
//                     placeholder="e.g., Arpan Sen"
//                     value={formData.instructor}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {errors.instructor && <p className="text-red-400 text-sm mt-1">{errors.instructor}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-300 mb-2">Students Count</label>
//                   <input
//                     type="number"
//                     name="students"
//                     placeholder="e.g., 7000"
//                     value={formData.students}
//                     onChange={handleInputChange}
//                     className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   {errors.students && <p className="text-red-400 text-sm mt-1">{errors.students}</p>}
//                 </div>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 px-6 py-3 rounded-lg font-medium transition-colors"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>{isSubmitting ? 'Creating...' : 'Create Course'}</span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {activeTab === 'manage' && (
//           <div className="bg-slate-900 rounded-lg border border-slate-700">
//             <div className="p-6 border-b border-slate-700">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-semibold text-white">Courses List</h2>
//                 <span className="text-sm text-slate-400">
//                   Total: {courses.length} courses
//                 </span>
//               </div>
//             </div>

//             {isLoadingCourses ? (
//               <div className="p-8 text-center">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
//                 <p className="mt-2 text-slate-400">Loading courses...</p>
//               </div>
//             ) : courses.length === 0 ? (
//               <div className="p-8 text-center text-slate-400">
//                 No courses found.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-slate-800 border-b border-slate-700">
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">ID</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Name</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Code</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Instructor</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Duration</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Students</th>
//                       <th className="text-left p-4 text-sm font-medium text-slate-300 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-700">
//                     {courses.map((course, index) => (
//                       <tr key={course.course_id || index} className="hover:bg-slate-800 transition-colors">
//                         <td className="p-4 text-white font-mono">{course.course_id}</td>
//                         <td className="p-4 text-white">{course.name}</td>
//                         <td className="p-4 text-white">
//                           <span className="bg-purple-900 text-purple-300 px-2 py-1 rounded text-sm">
//                             {course.code}
//                           </span>
//                         </td>
//                         <td className="p-4 text-slate-300">{course.instructor}</td>
//                         <td className="p-4 text-slate-300">{course.duration}</td>
//                         <td className="p-4 text-slate-300">{course.students}</td>
//                         <td className="p-4">
//                           <button
//                             onClick={() => handleDeleteCourse(course.course_id)}
//                             className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
//                           >
//                             <Trash2 className="w-3 h-3" />
//                             <span>Delete</span>
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EnhancedCourseManager;

import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiUpload,
  FiX,
  FiUser,
  FiBook,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import axios from "axios";
import Swal from "sweetalert2";

const showAlert = async (type, title, text) => {
  if (type === "success") {
    await Swal.fire({
      icon: "success",
      title: title,
      text: text,
    });
  } else if (type === "error") {
    await Swal.fire({
      icon: "error",
      title: title,
      text: text,
    });
  } else if (type === "warning") {
    const result = await Swal.fire({
      icon: "warning",
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    return result.isConfirmed;
  }
};

const CreateCourseCode = () => {
  const [courses, setCourses] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  const [formData, setFormData] = useState({
    course_id: "",
    name: "",
    code: "",
    description: "",
    duration: "",
    instructor: "",
    students: "",
    bgColor: "bg-gradient-to-r from-pink-400 to-purple-500",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const bgColorOptions = [
    // Existing options
    {
      value: "bg-gradient-to-r from-pink-400 to-purple-500",
      label: "Pink to Purple",
    },
    {
      value: "bg-gradient-to-r from-violet-400 to-blue-500",
      label: "Violet to Blue",
    },
    {
      value: "bg-gradient-to-r from-pink-400 to-red-500",
      label: "Pink to Red",
    },
    {
      value: "bg-gradient-to-r from-blue-400 to-green-500",
      label: "Blue to Green",
    },
    {
      value: "bg-gradient-to-r from-purple-400 to-indigo-500",
      label: "Purple to Indigo",
    },
    {
      value: "bg-gradient-to-r from-cyan-500 to-blue-400",
      label: "Cyan to Blue",
    },
    {
      value: "bg-gradient-to-r from-green-700 to-teal-500",
      label: "Green to Teal",
    },
    {
      value: "bg-gradient-to-r from-orange-500 to-red-400",
      label: "Orange to Red",
    },

    // Additional combinations
    {
      value: "bg-gradient-to-r from-yellow-400 to-red-500",
      label: "Yellow to Red",
    },
    {
      value: "bg-gradient-to-r from-green-400 to-blue-600",
      label: "Green to Blue",
    },
    {
      value: "bg-gradient-to-r from-indigo-500 to-purple-500",
      label: "Indigo to Purple",
    },
    {
      value: "bg-gradient-to-r from-red-400 to-yellow-300",
      label: "Red to Yellow",
    },
    {
      value: "bg-gradient-to-r from-blue-500 to-indigo-600",
      label: "Blue to Indigo",
    },
    {
      value: "bg-gradient-to-r from-teal-400 to-blue-500",
      label: "Teal to Blue",
    },
    {
      value: "bg-gradient-to-r from-emerald-400 to-lime-500",
      label: "Emerald to Lime",
    },
    {
      value: "bg-gradient-to-r from-rose-400 to-fuchsia-500",
      label: "Rose to Fuchsia",
    },
    {
      value: "bg-gradient-to-r from-sky-400 to-indigo-500",
      label: "Sky to Indigo",
    },
    {
      value: "bg-gradient-to-r from-orange-400 to-yellow-500",
      label: "Orange to Yellow",
    },
    {
      value: "bg-gradient-to-r from-zinc-400 to-neutral-600",
      label: "Zinc to Neutral",
    },
    {
      value: "bg-gradient-to-r from-slate-400 to-blue-700",
      label: "Slate to Blue",
    },
    {
      value: "bg-gradient-to-r from-lime-400 to-green-500",
      label: "Lime to Green",
    },
    {
      value: "bg-gradient-to-r from-amber-400 to-orange-500",
      label: "Amber to Orange",
    },
    {
      value: "bg-gradient-to-r from-fuchsia-500 to-violet-600",
      label: "Fuchsia to Violet",
    },
    {
      value: "bg-gradient-to-r from-rose-500 to-red-600",
      label: "Rose to Red",
    },
    {
      value: "bg-gradient-to-r from-cyan-400 to-teal-600",
      label: "Cyan to Teal",
    },
  ];

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
      );
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showAlert("error", "Error", "Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      // Create preview URL for display
      setImagePreview(URL.createObjectURL(file));

      // Store the actual file object for API
      setFormData((prev) => ({
        ...prev,
        image: file, // Store the file object directly
      }));

      // Clear any previous errors
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.course_id.trim())
      newErrors.course_id = "Course ID is required";
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.instructor.trim())
      newErrors.instructor = "Instructor name is required";
    if (!formData.students || formData.students <= 0)
      newErrors.students = "Valid student count is required";
    if (!formData.image) newErrors.image = "Course image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create new course
  // Create new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert(
        "error",
        "Validation Error",
        "Please fill in all required fields correctly."
      );
      return;
    }

    try {
      setLoading(true);

      // Use FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("course_id", formData.course_id.trim());
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("code", formData.code.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("bgColor", formData.bgColor);
      formDataToSend.append("duration", formData.duration.trim());
      formDataToSend.append("instructor", formData.instructor.trim());
      formDataToSend.append("students", parseInt(formData.students));

      // Append the file
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/adminroutine/create-course",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success - Reset form
      setFormData({
        course_id: "",
        name: "",
        code: "",
        description: "",
        duration: "",
        instructor: "",
        students: "",
        bgColor: "bg-gradient-to-r from-pink-400 to-purple-500",
        image: "",
      });
      setImagePreview(null);
      setShowCreateForm(false);
      setErrors({});

      // Show success message
      showAlert("success", "Success!", "Course created successfully!");

      // Refresh courses list
      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create course";
      showAlert("error", "Creation Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Delete course
  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = await showAlert(
      "warning",
      "Confirm Delete",
      "Are you sure you want to delete this course? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading((prev) => ({ ...prev, [courseId]: true }));

      await axios.post(
        "https://e-college-data.onrender.com/v1/adminroutine/delete-course",
        {
          course_id: courseId,
        }
      );

      await showAlert(
        "success",
        "Deleted!",
        "Course has been deleted successfully."
      );

      await fetchCourses(); // Refresh course list
    } catch (error) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete course";
      await showAlert("error", "Delete Failed", errorMessage);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      course_id: "",
      name: "",
      code: "",
      description: "",
      duration: "",
      instructor: "",
      students: "",
      bgColor: "bg-gradient-to-r from-pink-400 to-purple-500",
      image: "",
    });
    setImagePreview(null);
    setErrors({});
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Course Management
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Create and manage courses for your institution
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto"
          >
            <FiPlus className="w-5 h-5" />
            Create New Course
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <p className="mt-4 text-gray-400">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FiBook className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No courses found</p>
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course._id || course.course_id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      course.bgColor ||
                      "bg-gradient-to-r from-pink-400 to-purple-500"
                    } flex items-center justify-center`}
                  >
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FiBook className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course.course_id)}
                    disabled={deleteLoading[course.course_id]}
                    className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    {deleteLoading[course.course_id] ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">ID:</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {course.course_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">Code:</span>
                    <span className="bg-violet-600/20 px-2 py-1 rounded text-violet-300">
                      {course.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUser className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUsers className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Course Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Course</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-6">
                {/* Course ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course ID *
                  </label>
                  <input
                    type="text"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    placeholder="e.g., 101, 102, CS101"
                  />
                  {errors.course_id && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.course_id}
                    </p>
                  )}
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    placeholder="Enter course name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Course Code */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    placeholder="e.g., BCA, MCA, BTECH"
                  />
                  {errors.code && (
                    <p className="text-red-400 text-sm mt-1">{errors.code}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    placeholder="Enter course description"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Duration and Students */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      placeholder="e.g., 3 years"
                    />
                    {errors.duration && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Students Count *
                    </label>
                    <input
                      type="number"
                      name="students"
                      value={formData.students}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      placeholder="e.g., 1000"
                      min="1"
                    />
                    {errors.students && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.students}
                      </p>
                    )}
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Instructor Name *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    placeholder="Enter instructor name"
                  />
                  {errors.instructor && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.instructor}
                    </p>
                  )}
                </div>

                {/* Background Color */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Background Color
                  </label>
                  <select
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  >
                    {bgColorOptions.map((option, index) => (
                      <option
                        key={index}
                        value={option.value}
                        className="bg-gray-800"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className={`mt-2 h-4 rounded ${formData.bgColor}`}></div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course Image * (Max 5MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData((prev) => ({ ...prev, image: "" }));
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg cursor-pointer inline-block transition-colors"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourseCode;
