import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Calendar,
  User,
  Mail,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function TeacherNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 3;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/admin/get-all-notice"
        );

        // Filter notices where student is false
        const filteredNotices = response.data.data.filter(
          (notice) => notice.student === false
        );

        setNotices(filteredNotices);
        setCount(filteredNotices.length);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notices. Please try again later.");
        setLoading(false);
        console.error("Error fetching notices:", err);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get current notices for pagination
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

  // Calculate total pages
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
        <div className="text-green-600 text-lg font-semibold flex items-center">
          <div className="animate-spin mr-2">
            <FileCheck size={24} />
          </div>
          Loading notices...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
        <div className="text-red-600 text-lg font-semibold flex items-center">
          <AlertCircle size={24} className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  // Display message if no notices match the filter
  if (notices.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Notices Found
          </h2>
          <p className="text-green-600">
            There are currently no notices where student is set to false.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Notice Dashboard</h1>
        <div className="bg-green-100 px-4 py-2 rounded-full">
          <span className="text-green-700 font-medium">
            {count} Notice{count !== 1 ? "s" : ""} Found
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        {currentNotices.map((notice) => (
          <div
            key={notice._id}
            className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-green-50 px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {notice.label}
                </h2>
                <div className="flex items-center text-green-700 shrink-0 ml-2">
                  <Calendar size={16} className="mr-1" />
                  <span className="text-sm">
                    {formatDate(notice.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="md:flex md:flex-wrap">
                <div className="md:w-1/2 mb-3">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <User size={18} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        From:
                      </div>
                      <div className="text-green-700">{notice.sender}</div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2 mb-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Mail size={18} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        Email:
                      </div>
                      <div className="text-green-700 break-all">
                        {notice.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Short Description:
                </div>
                <p className="text-gray-800 bg-gray-50 p-2 rounded-md">
                  {notice.short_description}
                </p>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Full Description:
                </div>
                <div className="text-gray-800 bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  {notice.long_description}
                </div>
              </div>

              {notice.pdf_file && (
                <div className="mt-4">
                  <a
                    href={notice.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    <FileText size={16} className="mr-2" />
                    View PDF Document
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-l-lg flex items-center justify-center ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:bg-green-50"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 font-medium ${
                  currentPage === index + 1
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }`}
                aria-label={`Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-r-lg flex items-center justify-center ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:bg-green-50"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Page indicator */}
      {totalPages > 1 && (
        <div className="mt-3 text-center text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
