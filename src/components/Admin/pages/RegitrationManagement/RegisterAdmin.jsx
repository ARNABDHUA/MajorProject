import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiUpload,
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiTrash2,
  FiEdit,
  FiEye,
  FiX,
  FiDownload,
  FiList,
} from "react-icons/fi";

export default function RegisterNotice() {
  const [formData, setFormData] = useState({
    label: "",
    short_description: "",
    long_description: "",
    student: true, // Default to "Everyone"
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNoticeId, setCurrentNoticeId] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "myNotices"

  const fileInputRef = useRef(null);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (error) {
      console.error("Error parsing user data:", error);
      return {};
    }
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const userData = getUserData();

      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/admin/get-all-notice"
      );

      if (response.data.status === "success") {
        // Filter notices to only show those created by the current admin
        const userNotices = response.data.data.filter(
          (notice) => notice.sender === userData.name
        );
        setNotices(userNotices);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStudentChange = (value) => {
    setFormData({
      ...formData,
      student: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      setFileName("");
      return;
    }

    // Check file size (1MB = 1048576 bytes)
    if (selectedFile.size > 1048576) {
      setFormError("File size must be less than 1MB");
      setFile(null);
      setFileName("");
      return;
    }

    // Check file type (PDF, images)
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setFormError("Only PDF and image files are allowed");
      setFile(null);
      setFileName("");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFormError("");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validation for required fields
    const requiredFields = editMode
      ? [
          formData.label ||
            formData.short_description ||
            formData.long_description ||
            file,
        ]
      : [
          formData.label,
          formData.short_description,
          formData.long_description,
          file,
        ];

    if (editMode && !requiredFields[0]) {
      setFormError("At least one field must be modified");
      return;
    }

    if (!editMode && requiredFields.some((field) => !field)) {
      setFormError("All fields are required");
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = getUserData();

      if (!userData || !userData.name || !userData.email) {
        setFormError("User data not found in local storage");
        setIsSubmitting(false);
        return;
      }

      const requestData = new FormData();

      if (editMode) {
        // Only add fields that have values for update
        if (formData.label) requestData.append("label", formData.label);
        if (formData.short_description)
          requestData.append("short_description", formData.short_description);
        if (formData.long_description)
          requestData.append("long_description", formData.long_description);
        if (file) requestData.append("file", file);

        // Update notice
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/admin/update-notice/${currentNoticeId}`,
          requestData
        );

        if (response.data.status !== "success") {
          throw new Error("Failed to update notice");
        }
      } else {
        // Add all fields for new notice
        requestData.append("sender", userData.name);
        requestData.append("email", userData.email);
        requestData.append("student", formData.student);
        requestData.append("label", formData.label);
        requestData.append("short_description", formData.short_description);
        requestData.append("long_description", formData.long_description);
        requestData.append("file", file);

        // Create new notice
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/admin/create-notice",
          requestData
        );

        if (response.data.status !== "success") {
          throw new Error("Failed to create notice");
        }
      }

      // Reset form after successful submission
      setFormData({
        label: "",
        short_description: "",
        long_description: "",
        student: true,
      });
      setFile(null);
      setFileName("");
      setSubmitSuccess(true);
      setEditMode(false);
      setCurrentNoticeId(null);

      // Refresh notices list
      fetchNotices();

      // Show success message using SweetAlert2
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Notice ${editMode ? "updated" : "uploaded"} successfully!`,
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#9333ea",
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset success message state after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);

      // Show error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${editMode ? "update" : "submit"}: ${error.message}`,
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#9333ea",
      });

      setFormError(
        `Failed to ${editMode ? "update" : "submit"}: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (noticeId) => {
    // Use SweetAlert2 for delete confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);

        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/admin/delete-notice/${noticeId}`
        );

        if (response.data.status === "success") {
          // Remove the deleted notice from state
          setNotices(notices.filter((notice) => notice._id !== noticeId));

          // Show success message using SweetAlert2
          Swal.fire({
            title: "Deleted!",
            text: "Notice has been deleted.",
            icon: "success",
            background: "#1f2937",
            color: "#fff",
            confirmButtonColor: "#9333ea",
            timer: 2000,
            timerProgressBar: true,
          });

          setSubmitSuccess(true);
          setTimeout(() => {
            setSubmitSuccess(false);
          }, 3000);
        } else {
          throw new Error("Failed to delete notice");
        }
      } catch (error) {
        console.error("Error deleting notice:", error);

        // Show error message using SweetAlert2
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to delete notice: ${error.message}`,
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#9333ea",
        });

        setFormError(`Failed to delete notice: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (notice) => {
    setEditMode(true);
    setCurrentNoticeId(notice._id);
    setFormData({
      label: notice.label,
      short_description: notice.short_description,
      long_description: notice.long_description,
      student: notice.student,
    });
    setActiveTab("upload");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditMode(false);
    setCurrentNoticeId(null);
    setFormData({
      label: "",
      short_description: "",
      long_description: "",
      student: true,
    });
    setFile(null);
    setFileName("");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewNotice = (notice) => {
    setViewingNotice(notice);
  };

  const closeViewNotice = () => {
    setViewingNotice(null);
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-900 rounded-lg overflow-hidden border border-purple-900">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              activeTab === "upload"
                ? "bg-purple-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FiSend className="mr-2" />{" "}
            {editMode ? "Edit Notice" : "Upload Notice"}
          </button>
          <button
            onClick={() => setActiveTab("myNotices")}
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              activeTab === "myNotices"
                ? "bg-purple-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FiList className="mr-2" /> My Notices
          </button>
        </div>

        {/* Success/Error Messages */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-md flex items-center">
            <FiCheckCircle className="text-green-500 mr-2 text-xl" />
            <span>
              Notice {editMode ? "updated" : "uploaded"} successfully!
            </span>
          </div>
        )}

        {formError && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-md flex items-center">
            <FiAlertCircle className="text-red-500 mr-2 text-xl" />
            <span>{formError}</span>
          </div>
        )}

        {/* Upload/Edit Form */}
        {activeTab === "upload" && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-600">
            <h1 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
              <FiSend className="mr-2" />{" "}
              {editMode ? "Edit Notice" : "Upload Admin Notice"}
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-purple-400 mb-2">
                  Notice Type
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="Enter notice type (e.g., Exam, Holiday, Meeting)"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required={!editMode}
                />
              </div>

              {!editMode && (
                <div className="mb-4">
                  <label className="block text-purple-400 mb-2">
                    Notice For
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleStudentChange(true)}
                      className={`px-4 py-2 rounded-md ${
                        formData.student
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}
                    >
                      Everyone
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStudentChange(false)}
                      className={`px-4 py-2 rounded-md ${
                        !formData.student
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}
                    >
                      Teachers Only
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-purple-400 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the notice"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  required={!editMode}
                />
              </div>

              <div className="mb-4">
                <label className="block text-purple-400 mb-2">
                  Detailed Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  placeholder="Enter full details of the notice"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none h-32"
                  required={!editMode}
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-purple-400 mb-2">
                  Attachment (PDF/Image, max 1MB)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required={!editMode}
                />

                <div
                  onClick={triggerFileInput}
                  className="cursor-pointer border-2 border-dashed border-gray-600 rounded-md p-6 flex flex-col items-center justify-center hover:border-purple-500 transition-colors"
                >
                  <FiUpload className="text-purple-500 text-3xl mb-2" />
                  <p className="text-gray-400 text-center">
                    {fileName ||
                      (editMode
                        ? "Click to upload new file (optional)"
                        : "Click to upload (PDF, JPG, PNG - max 1MB)")}
                  </p>
                </div>

                {fileName && (
                  <div className="mt-2 flex items-center text-sm text-green-500">
                    <FiFileText className="mr-1" /> {fileName}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                {editMode && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-700 text-white py-3 px-6 rounded-md font-medium flex items-center hover:bg-gray-600"
                  >
                    <FiX className="mr-2" /> Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-purple-600 text-white py-3 px-6 rounded-md font-medium flex items-center ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />{" "}
                      {editMode ? "Update Notice" : "Upload Notice"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Notices */}
        {activeTab === "myNotices" && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-purple-600">
            <h1 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
              <FiList className="mr-2" /> My Notices
            </h1>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <svg
                  className="animate-spin h-10 w-10 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : notices.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No notices found. Upload a notice to see it here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice._id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-purple-400">
                        {notice.label}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">
                      {notice.short_description}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mb-4">
                      <span
                        className={`px-2 py-1 rounded-full mr-2 ${
                          notice.student
                            ? "bg-green-900 text-green-400"
                            : "bg-blue-900 text-blue-400"
                        }`}
                      >
                        {notice.student ? "Everyone" : "Teachers Only"}
                      </span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewNotice(notice)}
                        className="p-2 bg-gray-700 rounded-md hover:bg-gray-600"
                        title="View Notice"
                      >
                        <FiEye className="text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleEdit(notice)}
                        className="p-2 bg-blue-700 rounded-md hover:bg-blue-600"
                        title="Edit Notice"
                      >
                        <FiEdit className="text-blue-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-2 bg-red-700 rounded-md hover:bg-red-600"
                        title="Delete Notice"
                      >
                        <FiTrash2 className="text-red-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notice Viewer Modal */}
        {viewingNotice && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-600">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-500">
                  {viewingNotice.label}
                </h2>
                <button
                  onClick={closeViewNotice}
                  className="p-2 hover:bg-gray-800 rounded-full"
                >
                  <FiX className="text-gray-400" />
                </button>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-700">
                <span className="text-sm text-gray-400">
                  Posted on {formatDate(viewingNotice.createdAt)} • For{" "}
                  {viewingNotice.student ? "Everyone" : "Teachers Only"}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-purple-400 mb-1 font-medium">
                  Short Description
                </h3>
                <p className="text-gray-300">
                  {viewingNotice.short_description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-purple-400 mb-1 font-medium">
                  Detailed Description
                </h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {viewingNotice.long_description}
                </p>
              </div>

              {viewingNotice.pdf_file && (
                <div className="mb-6">
                  <h3 className="text-purple-400 mb-2 font-medium">
                    Attachment
                  </h3>
                  <a
                    href={viewingNotice.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-800 hover:bg-gray-700 p-3 rounded-md transition-colors"
                  >
                    <FiFileText className="text-purple-500 mr-2" />
                    <span className="text-gray-300">View Attachment</span>
                    <FiDownload className="ml-auto text-gray-400" />
                  </a>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    handleEdit(viewingNotice);
                    closeViewNotice();
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md flex items-center"
                >
                  <FiEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(viewingNotice._id);
                    closeViewNotice();
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md flex items-center"
                >
                  <FiTrash2 className="mr-2" /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
