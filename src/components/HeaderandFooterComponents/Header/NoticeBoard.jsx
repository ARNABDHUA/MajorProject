import { useState, useEffect } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const noticesPerPage = 3;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/admin/get-all-notice"
        );

        if (response.data.status === "success") {
          // Filter notices where student is true
          const studentNotices = response.data.data.filter(
            (notice) => notice.student === true
          );
          setNotices(studentNotices);
        } else {
          setError("Failed to fetch notices");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Get current notices based on pagination
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle notice click
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice Detail Section */}
        <div className="bg-green-900 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            📢 Notice Detail
          </h2>
          {selectedNotice ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{selectedNotice.label}</h3>
              <p className="text-sm">
                <span className="font-medium">From:</span>{" "}
                {selectedNotice.sender} ({selectedNotice.email})
              </p>
              <p className="text-sm">
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedNotice.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <p className="font-medium">Description:</p>
                <p className="mt-1">{selectedNotice.long_description}</p>
              </div>
              {selectedNotice.pdf_file && (
                <div className="mt-4">
                  <a
                    href={selectedNotice.pdf_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-green-900 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition"
                  >
                    View Attachment
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-8">
              Select a notice from the list to view details
            </p>
          )}
        </div>

        {/* Notice List Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            📋 Notice List
          </h2>
          {currentNotices.length > 0 ? (
            <div className="space-y-4">
              {currentNotices.map((notice) => (
                <button
                  key={notice._id}
                  onClick={() => handleNoticeClick(notice)}
                  className={`flex items-start p-4 border rounded-lg hover:bg-gray-100 transition w-full ${
                    selectedNotice && selectedNotice._id === notice._id
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <div className="bg-green-500 text-white p-3 rounded-lg text-center w-12 h-12 flex items-center justify-center">
                    <span className="text-lg">📌</span>
                  </div>
                  <div className="ml-4 text-left">
                    <p className="text-md font-semibold">{notice.label}</p>
                    <p className="text-gray-600 text-sm">
                      {notice.short_description}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              No notices available
            </p>
          )}

          {/* Pagination */}
          {notices.length > noticesPerPage && (
            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex space-x-2">
                  {Array.from({
                    length: Math.ceil(notices.length / noticesPerPage),
                  }).map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
