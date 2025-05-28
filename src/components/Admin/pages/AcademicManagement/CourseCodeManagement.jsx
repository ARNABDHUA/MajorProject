import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaGraduationCap,
  FaUser,
  FaClock,
  FaUsers,
  FaCode,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaSpinner,
  FaSave,
  FaTimes,
  FaMinus,
  FaExclamationTriangle,
} from "react-icons/fa";
import Swal from "sweetalert2";

const CourseCodeManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [semesterPapers, setSemesterPapers] = useState({});
  const [loadingSemesters, setLoadingSemesters] = useState({});
  const [showCreateForm, setShowCreateForm] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState({});
  const [creatingPapers, setCreatingPapers] = useState({});
  const [deletingAllPapers, setDeletingAllPapers] = useState({});
  const [deletingIndividualPaper, setDeletingIndividualPaper] = useState({});
  const [updatingPaper, setUpdatingPaper] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      console.log("data=data=", data);
      setCourses(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses. Please try again.");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSemesters = (duration) => {
    if (!duration) return 0;
    const years = parseInt(duration.split(" ")[0]);
    return years * 2; // Each year = 2 semesters
  };

  const fetchSemesterPapers = async (courseId, semester) => {
    const semesterKey = `${courseId}-${semester}`;

    if (semesterPapers[semesterKey]) {
      return; // Already fetched
    }

    try {
      setLoadingSemesters((prev) => ({ ...prev, [semesterKey]: true }));
      console.log("semester os", semester.toString());
      console.log("course_id is", courseId);
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/paper-code/get-coursecode",
        {
          course_code: courseId,
          sem: semester.toString(),
        }
      );

      if (response.data && response.data.success && response.data.data) {
        setSemesterPapers((prev) => ({
          ...prev,
          [semesterKey]: response.data.data.papers || [],
        }));
      } else {
        setSemesterPapers((prev) => ({
          ...prev,
          [semesterKey]: [],
        }));
      }
    } catch (err) {
      console.error("Error fetching semester papers:", err);
      setSemesterPapers((prev) => ({
        ...prev,
        [semesterKey]: [],
      }));
    } finally {
      setLoadingSemesters((prev) => ({ ...prev, [semesterKey]: false }));
    }
  };

  const deleteIndividualPaper = async (
    courseId,
    semester,
    paperCode,
    semesterKey
  ) => {
    const paperKey = `${semesterKey}-${paperCode}`;

    const confirmResult = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete the paper "${paperCode}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setDeletingIndividualPaper((prev) => ({ ...prev, [paperKey]: true }));

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/paper-code/remove-papercode",
        {
          course_code: courseId,
          sem: semester.toString(),
          paper_code: paperCode,
        }
      );

      if (response.data && response.data.success) {
        setSemesterPapers((prev) => ({
          ...prev,
          [semesterKey]: prev[semesterKey].filter(
            (paper) => paper.paper_code !== paperCode
          ),
        }));

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Paper deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Failed to delete paper");
      }
    } catch (err) {
      console.error("Error deleting paper:", err);
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to delete paper. Please try again.",
      });
    } finally {
      setDeletingIndividualPaper((prev) => ({ ...prev, [paperKey]: false }));
    }
  };

  const deleteAllPapers = async (courseId, semester, semesterKey) => {
    const confirmResult = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to delete all papers from Semester ${semester}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setDeletingAllPapers((prev) => ({ ...prev, [semesterKey]: true }));

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/paper-code/delete-courseCode",
        {
          course_code: courseId,
          sem: semester.toString(),
        }
      );

      if (response.data && response.data.success) {
        setSemesterPapers((prev) => ({
          ...prev,
          [semesterKey]: [],
        }));

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "All papers deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Failed to delete papers");
      }
    } catch (err) {
      console.error("Error deleting papers:", err);
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to delete papers. Please try again.",
      });
    } finally {
      setDeletingAllPapers((prev) => ({ ...prev, [semesterKey]: false }));
    }
  };

  const toggleSemester = async (courseId, semester) => {
    const semesterKey = `${courseId}-${semester}`;
    const isExpanded = expandedSemesters[semesterKey];

    if (!isExpanded) {
      await fetchSemesterPapers(courseId, semester);
    }

    setExpandedSemesters((prev) => ({
      ...prev,
      [semesterKey]: !isExpanded,
    }));
  };

  const UpdatePaperForm = ({ courseId, semester, semesterKey, paper }) => {
    const [newPaperCode, setNewPaperCode] = useState(paper.paper_code);
    const [paperName, setPaperName] = useState(paper.paper_name);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!newPaperCode.trim() || !paperName.trim()) {
        await Swal.fire({
          icon: "warning",
          title: "Incomplete Form",
          text: "Please fill in both paper code and paper name.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/update-papercode",
          {
            paper_name: paperName.trim(),
            new_paper_code: newPaperCode.trim(),
            course_code: courseId,
            sem: semester.toString(),
            paper_code: paper.paper_code,
          }
        );

        if (response.data && response.data.success) {
          setSemesterPapers((prev) => ({
            ...prev,
            [semesterKey]: prev[semesterKey].map((p) =>
              p.paper_code === paper.paper_code
                ? {
                    ...p,
                    paper_code: newPaperCode.trim(),
                    paper_name: paperName.trim(),
                  }
                : p
            ),
          }));

          const updateKey = `${semesterKey}-${paper.paper_code}`;
          setShowUpdateForm((prev) => ({
            ...prev,
            [updateKey]: false,
          }));

          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Paper updated successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Failed to update paper");
        }
      } catch (err) {
        console.error("Error updating paper:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update paper. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      const updateKey = `${semesterKey}-${paper.paper_code}`;
      setShowUpdateForm((prev) => ({
        ...prev,
        [updateKey]: false,
      }));
      setNewPaperCode(paper.paper_code);
      setPaperName(paper.paper_name);
    };

    return (
      <div className="mt-4 bg-gray-800 p-6 rounded-lg border border-yellow-600">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <FaEdit className="mr-2 text-yellow-400" />
            Update Paper in Semester {semester}
          </h4>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 bg-gray-700 p-4 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Paper Code
              </label>
              <input
                type="text"
                placeholder="Paper Code (e.g., BSCDS-402)"
                value={newPaperCode}
                onChange={(e) => setNewPaperCode(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Paper Name
              </label>
              <input
                type="text"
                placeholder="Paper Name (e.g., Data Science)"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Update Paper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const CreatePaperForm = ({ courseId, semester, semesterKey }) => {
    const [papers, setPapers] = useState([{ paper_code: "", paper_name: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addPaperField = () => {
      setPapers([...papers, { paper_code: "", paper_name: "" }]);
    };

    const removePaperField = (index) => {
      if (papers.length > 1) {
        setPapers(papers.filter((_, i) => i !== index));
      }
    };

    const updatePaper = (index, field, value) => {
      const updatedPapers = papers.map((paper, i) =>
        i === index ? { ...paper, [field]: value } : paper
      );
      setPapers(updatedPapers);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate papers
      const validPapers = papers.filter(
        (paper) => paper.paper_code.trim() && paper.paper_name.trim()
      );

      if (validPapers.length === 0) {
        await Swal.fire({
          icon: "warning",
          title: "No Valid Papers",
          text: "Please add at least one paper with both code and name.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/create-course-code-all",
          {
            course_code: courseId,
            sem: semester.toString(),
            papers: validPapers,
          }
        );

        if (response.data && response.data.success) {
          setSemesterPapers((prev) => ({
            ...prev,
            [semesterKey]: validPapers,
          }));

          setShowCreateForm((prev) => ({
            ...prev,
            [semesterKey]: false,
          }));

          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Papers created successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Failed to create papers");
        }
      } catch (err) {
        console.error("Error creating papers:", err);
        await Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: "Failed to create papers. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      setShowCreateForm((prev) => ({
        ...prev,
        [semesterKey]: false,
      }));
    };

    return (
      <div className="mt-4 bg-gray-800 p-4 sm:p-6 rounded-lg border border-violet-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <FaPlus className="mr-2 text-violet-400" />
            Create Papers for Semester {semester}
          </h4>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors self-end sm:self-auto"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {papers.map((paper, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-start xl:items-center gap-2 sm:gap-3 bg-gray-700 p-3 sm:p-4 lg:p-5 rounded-lg"
            >
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-0 sm:space-x-3 sm:flex sm:flex-col xl:flex-row xl:space-y-0">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Paper Code (e.g., BSCDS-401)"
                    value={paper.paper_code}
                    onChange={(e) =>
                      updatePaper(index, "paper_code", e.target.value)
                    }
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex-1 min-w-0 sm:mt-2 xl:mt-0">
                  <input
                    type="text"
                    placeholder="Paper Name (e.g., Artificial Intelligence)"
                    value={paper.paper_name}
                    onChange={(e) =>
                      updatePaper(index, "paper_name", e.target.value)
                    }
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
                    required
                  />
                </div>
              </div>
              {papers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePaperField(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors self-end sm:self-start xl:self-center w-auto sm:w-auto shrink-0"
                >
                  <FaMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={addPaperField}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base font-medium order-2 sm:order-1"
            >
              <FaPlus className="w-4 h-4" />
              <span className="whitespace-nowrap">Add Another Paper</span>
            </button>

            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base font-medium order-2 xs:order-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium order-1 xs:order-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin w-4 h-4" />
                    <span className="whitespace-nowrap">Creating...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span className="whitespace-nowrap">Create Papers</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const AddPaperForm = ({ courseId, semester, semesterKey }) => {
    const [paperCode, setPaperCode] = useState("");
    const [paperName, setPaperName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!paperCode.trim() || !paperName.trim()) {
        await Swal.fire({
          icon: "warning",
          title: "Incomplete Form",
          text: "Please fill in both paper code and paper name.",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/add-papercode",
          {
            paper_code: paperCode.trim(),
            paper_name: paperName.trim(),
            course_code: courseId,
            sem: semester.toString(),
          }
        );

        if (response.data && response.data.success) {
          const newPaper = {
            paper_code: paperCode.trim(),
            paper_name: paperName.trim(),
          };

          setSemesterPapers((prev) => ({
            ...prev,
            [semesterKey]: [...(prev[semesterKey] || []), newPaper],
          }));

          setShowAddForm((prev) => ({
            ...prev,
            [semesterKey]: false,
          }));

          setPaperCode("");
          setPaperName("");

          await Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Paper added successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error("Failed to add paper");
        }
      } catch (err) {
        console.error("Error adding paper:", err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add paper. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleCancel = () => {
      setShowAddForm((prev) => ({
        ...prev,
        [semesterKey]: false,
      }));
      setPaperCode("");
      setPaperName("");
    };

    return (
      <div className="mt-4 bg-gray-800 p-4 sm:p-6 rounded-lg border border-green-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h4 className="text-lg font-semibold text-white flex items-center">
            <FaPlus className="mr-2 text-green-400" />
            Add Paper to Semester {semester}
          </h4>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors self-end sm:self-auto"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-3 lg:space-y-0 bg-gray-700 p-3 sm:p-4 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Paper Code (e.g., BSCDS-402)"
                value={paperCode}
                onChange={(e) => setPaperCode(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Paper Name (e.g., Data Science)"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Paper</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradientClass = (bgColor) => {
    return bgColor || "bg-gradient-to-r from-violet-600 to-purple-600";
  };

  const SemesterView = ({ course }) => {
    const totalSemesters = calculateSemesters(course.duration);

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <FaGraduationCap className="mr-2 sm:mr-3 text-violet-400 text-lg sm:text-xl" />
            <span className="truncate">{course.name} - Semesters</span>
          </h2>
          <button
            onClick={() => setSelectedCourse(null)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base shrink-0"
          >
            Back to Courses
          </button>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {Array.from({ length: totalSemesters }, (_, index) => {
            const semester = index + 1;
            const semesterKey = `${course.course_id}-${semester}`;
            const isExpanded = expandedSemesters[semesterKey];
            const papers = semesterPapers[semesterKey] || [];
            const isLoading = loadingSemesters[semesterKey];
            const showCreateFormForSemester = showCreateForm[semesterKey];
            const showAddFormForSemester = showAddForm[semesterKey];
            const isDeletingAll = deletingAllPapers[semesterKey];

            return (
              <div
                key={semester}
                className="bg-gray-900 rounded-lg border border-violet-800 overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => toggleSemester(course.course_id, semester)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    {isExpanded ? (
                      <FaChevronDown className="text-violet-400 text-sm sm:text-base shrink-0" />
                    ) : (
                      <FaChevronRight className="text-violet-400 text-sm sm:text-base shrink-0" />
                    )}
                    <div className="bg-violet-600 p-1.5 sm:p-2 rounded-full shrink-0">
                      <FaBook className="text-white text-xs sm:text-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        Semester {semester}
                      </h3>
                      <p className="text-violet-300 text-xs sm:text-sm">
                        Click to view papers
                      </p>
                    </div>
                  </div>
                  {isLoading && (
                    <FaSpinner className="text-violet-400 animate-spin text-sm sm:text-base shrink-0" />
                  )}
                </div>

                {isExpanded && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-700">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6 sm:py-8">
                        <FaSpinner className="text-violet-400 animate-spin mr-2 text-sm sm:text-base" />
                        <span className="text-violet-300 text-sm sm:text-base">
                          Loading papers...
                        </span>
                      </div>
                    ) : papers.length > 0 ? (
                      <div className="space-y-3 mt-3 sm:mt-4">
                        {/* Action Buttons */}
                        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <button
                            onClick={() =>
                              deleteAllPapers(
                                course.course_id,
                                semester,
                                semesterKey
                              )
                            }
                            disabled={isDeletingAll}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 text-xs sm:text-sm lg:text-base flex-1 xs:flex-initial"
                          >
                            {isDeletingAll ? (
                              <>
                                <FaSpinner className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap">
                                  Deleting...
                                </span>
                              </>
                            ) : (
                              <>
                                <FaExclamationTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap">
                                  Delete All Papers
                                </span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              setShowAddForm((prev) => ({
                                ...prev,
                                [semesterKey]: true,
                              }))
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-xs sm:text-sm lg:text-base flex-1 xs:flex-initial"
                          >
                            <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="whitespace-nowrap">Add Paper</span>
                          </button>
                        </div>

                        {/* Existing Papers */}
                        {papers.map((paper, index) => {
                          const paperKey = `${semesterKey}-${paper.paper_code}`;
                          const isDeletingPaper =
                            deletingIndividualPaper[paperKey];
                          const showUpdateFormForPaper =
                            showUpdateForm[paperKey];

                          return (
                            <div key={index} className="space-y-2">
                              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium text-sm sm:text-base break-words">
                                      {paper.paper_name}
                                    </h4>
                                    <p className="text-violet-300 text-xs sm:text-sm mt-1 break-all">
                                      Code: {paper.paper_code}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
                                    <div className="bg-violet-600 px-2 sm:px-3 py-1 rounded-full">
                                      <span className="text-white text-xs font-medium break-all">
                                        {paper.paper_code}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      <button
                                        onClick={() =>
                                          setShowUpdateForm((prev) => ({
                                            ...prev,
                                            [paperKey]: !prev[paperKey],
                                          }))
                                        }
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9"
                                        title="Update this paper"
                                      >
                                        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteIndividualPaper(
                                            course.course_id,
                                            semester,
                                            paper.paper_code,
                                            semesterKey
                                          )
                                        }
                                        disabled={isDeletingPaper}
                                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 min-w-[32px] sm:min-w-[36px] h-8 sm:h-9"
                                        title="Delete this paper"
                                      >
                                        {isDeletingPaper ? (
                                          <FaSpinner className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                                        ) : (
                                          <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Update Form */}
                              {showUpdateFormForPaper && (
                                <div className="w-full">
                                  <UpdatePaperForm
                                    courseId={course.course_id}
                                    semester={semester}
                                    semesterKey={semesterKey}
                                    paper={paper}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Add Paper Form */}
                        {showAddFormForSemester && (
                          <div className="w-full">
                            <AddPaperForm
                              courseId={course.course_id}
                              semester={semester}
                              semesterKey={semesterKey}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <FaBookOpen className="text-gray-400 text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4" />
                        <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base px-4">
                          No papers found for Semester {semester}
                        </p>
                        <button
                          onClick={() =>
                            setShowCreateForm((prev) => ({
                              ...prev,
                              [semesterKey]: true,
                            }))
                          }
                          className="bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors text-sm sm:text-base"
                        >
                          <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Create Papers</span>
                        </button>

                        {/* Create Paper Form */}
                        {showCreateFormForSemester && (
                          <CreatePaperForm
                            courseId={course.course_id}
                            semester={semester}
                            semesterKey={semesterKey}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-violet-400 text-4xl animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-400 text-4xl mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {selectedCourse ? (
          <SemesterView course={selectedCourse} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap">
                <FaGraduationCap className="mr-2 sm:mr-3 text-violet-400 text-xl sm:text-2xl" />
                <span>Course Code Management</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Manage paper codes for all courses and semesters
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.course_id}
                  className="bg-gray-900 rounded-lg border border-violet-800 p-6 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${getGradientClass(
                        course.bgColor
                      )} p-3 rounded-full`}
                    >
                      <FaGraduationCap className="text-white text-xl" />
                    </div>
                    <div className="bg-violet-600 px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-medium">
                        {course.code}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {course.name}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <FaUser className="mr-2 text-violet-400" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FaClock className="mr-2 text-violet-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FaUsers className="mr-2 text-violet-400" />
                      <span>
                        {calculateSemesters(course.duration)} Semesters
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-violet-300 text-sm font-medium flex items-center">
                        <FaCode className="mr-1" />
                        Manage Papers
                      </span>
                      <FaChevronRight className="text-violet-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No courses found matching your search
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCodeManagement;
