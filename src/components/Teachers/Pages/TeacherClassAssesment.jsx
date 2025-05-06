import React, { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa6";
import {  
  BookOpen, 
  Download, 
  FileText, 
  PenTool, 
  Save, 
  Search, 
  Upload, 
  User,
  Check,
  Filter,
  ChevronDown
} from "lucide-react";

const TeacherClassAssessment = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    paper_code: "",
    cas: "",
  });
  const [allPaperCode, setAllPaperCode] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Define CA options
  const allCa = ["CA1", "CA2", "CA3", "CA4"];

  // Define table
  const initialStudents = [
    { id: 1, roll: '1001', name: 'Alex Johnson', email: 'alex@example.com', file: 'Assignment1.pdf', marks: 85, status: 'submitted' },
    { id: 2, roll: '1002', name: 'Sarah Williams', email: 'sarah@example.com', file: 'Assignment1.pdf', marks: 92, status: 'submitted' },
    { id: 3, roll: '1003', name: 'Michael Brown', email: 'michael@example.com', file: 'Assignment1.pdf', marks: 78, status: 'submitted' },
    { id: 4, roll: '1004', name: 'Emily Davis', email: 'emily@example.com', file: 'Assignment1.pdf', marks: 90, status: 'submitted' },
    { id: 5, roll: '1005', name: 'David Wilson', email: 'david@example.com', file: 'Assignment1.pdf', marks: 88, status: 'submitted' },
    { id: 6, roll: '1006', name: 'Jessica Taylor', email: 'jessica@example.com', file: null, marks: null, status: 'pending' },
    { id: 7, roll: '1007', name: 'Ryan Miller', email: 'ryan@example.com', file: null, marks: null, status: 'pending' },
  ];
  
  const [students, setStudents] = useState(initialStudents);
  const [editingId, setEditingId] = useState(null);
  const [editedMarks, setEditedMarks] = useState("");

  const handleEdit = (studentId) => {
    setEditingId(studentId);
    const student = students.find(s => s.id === studentId);
    setEditedMarks(student.marks?.toString() || "");
  };

  const handleUpload = (studentId) => {
    const marks = parseInt(editedMarks) || 0;
    
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, marks: marks, status: 'submitted' } 
        : student
    ));
    
    setEditingId(null);
    
    // Show success toast
    showToast("Marks updated successfully!");
  };

  const handleMarksChange = (e) => {
    setEditedMarks(e.target.value);
  };

  // Toast notification
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    
    if (data) {
      setUser(data);
      setAllPaperCode(data.teacher_course || []);
      setFormData({
        cas: "",
        paper_code: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If CA changes, update paper codes
    if (name === "cas") {
      setAllPaperCode(allPaperCode || []);
      setFormData((prev) => ({ ...prev, teacher_course: "" }));
    }

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cas) newErrors.cas = "Please select a CA";
    if (!formData.paper_code) newErrors.paper_code = "Please select a paper code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    setShowFilters(false);
  };

  const filteredStudents = students
    .filter(student => {
      // Apply status filter
      if (filterStatus !== "all" && student.status !== filterStatus) {
        return false;
      }
      
      // Apply search term
      return (
        searchTerm === "" ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      showToast("Assessment criteria applied!");
    }
  };

  const handleBulkDownload = () => {
    showToast("Downloading all submissions...");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Class Assessment Management</h2>
        <p className="text-gray-600">Manage and grade student assessments</p>
      </div>
      
      {/* Assessment Selection Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Assessment Type (CA) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <FaGraduationCap className="mr-2 text-blue-600" size={20} />
              Assessment Type <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="cas"
                value={formData.cas}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                  errors.cas ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select Assessment</option>
                {allCa.map((cas) => (
                  <option key={cas} value={cas}>
                    {cas}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
            </div>
            {errors.cas && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                {errors.cas}
              </p>
            )}
          </div>

          {/* Paper Code */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <BookOpen className="mr-2 text-blue-600" size={20} />
              Paper Code <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                name="paper_code"
                value={formData.paper_code}
                onChange={handleChange}
                disabled={!formData.cas}
                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                  errors.paper_code ? "border-red-500 bg-red-50" : "border-gray-300"
                } ${!formData.cas ? "bg-gray-100 cursor-not-allowed" : ""}`}
              >
                <option value="">Select Paper Code</option>
                {allPaperCode.map((paper_code) => (
                  <option key={paper_code} value={paper_code}>
                    {paper_code}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
            </div>
            {errors.paper_code && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                {errors.paper_code}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center"
          >
            <Check size={18} className="mr-2" />
            Apply
          </button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-500" />
        </div>
        
        <div className="flex gap-3 items-center w-full md:w-auto justify-between md:justify-end">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="border border-gray-300 bg-white hover:bg-gray-50 rounded-lg px-4 py-2.5 flex items-center text-gray-700 font-medium"
            >
              <Filter size={18} className="mr-2 text-gray-600" />
              Filter
              <ChevronDown size={16} className="ml-2 text-gray-600" />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <ul>
                  <li>
                    <button 
                      onClick={() => handleFilter("all")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterStatus === "all" ? "bg-blue-50 text-blue-600" : ""}`}
                    >
                      All Students
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFilter("submitted")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterStatus === "submitted" ? "bg-blue-50 text-blue-600" : ""}`}
                    >
                      Submitted
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleFilter("pending")}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filterStatus === "pending" ? "bg-blue-50 text-blue-600" : ""}`}
                    >
                      Pending
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleBulkDownload} 
            className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center"
          >
            <Download size={18} className="mr-2" />
            Download All
          </button>
        </div>
      </div>
      
      {/* Students Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          {/* Table headers */}
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Roll</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Name</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Email</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Status</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">File</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Marks</th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Action</th>
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{student.roll}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        <User size={16} />
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{student.email}</td>
                  <td className="py-4 px-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status === 'submitted' ? 'Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {student.file ? (
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-blue-500" />
                        <span className="mr-2">{student.file}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No file</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {editingId === student.id ? (
                      <input
                        type="number"
                        className="border rounded-md py-1.5 px-3 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editedMarks}
                        onChange={handleMarksChange}
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span className="font-medium">
                        {student.marks !== null ? student.marks : '-'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {student.status === 'submitted' ? (
                      editingId === student.id ? (
                        <button
                          onClick={() => handleUpload(student.id)}
                          className="flex items-center text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Save size={16} className="mr-1.5" />
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(student.id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <PenTool size={16} className="mr-1.5" />
                          Edit
                        </button>
                      )
                    ) : (
                      <button className="flex items-center text-gray-400 bg-gray-100 cursor-not-allowed px-3 py-1.5 rounded-md">
                        <PenTool size={16} className="mr-1.5" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No students found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{students.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-800 mb-2">Submitted</h3>
          <p className="text-3xl font-bold text-green-600">
            {students.filter(s => s.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {students.filter(s => s.status === 'pending').length}
          </p>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
          <Check className="mr-2 text-green-400" size={18} />
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default TeacherClassAssessment;