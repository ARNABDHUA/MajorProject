import { useState, useEffect } from "react";

// Simple icon components
const IconBell = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="17" x2="12" y2="22"></line>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
  </svg>
);

const IconFilter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconCross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconTrash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default function NoticeComponent() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'salary', 'payment'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    type: "salary",
    dueDate: "",
    isPinned: false,
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  // Fetch notices on component mount and when filter changes
  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      // In a real application, you would call your API here:
      // const response = await fetch(`/api/notices?filter=${filter}`);
      // const data = await response.json();
      // setNotices(data);

      // Mock data for demonstration
      setTimeout(() => {
        const mockNotices = [
          {
            id: 1,
            title: "Staff Salary - May 2025",
            content:
              "Staff salaries for May 2025 will be processed on May 25th. Ensure all attendance and performance records are submitted by May 20th.",
            type: "salary",
            createdAt: "2025-05-01T10:30:00",
            dueDate: "2025-05-25T00:00:00",
            isPinned: true,
            department: "Finance",
          },
          {
            id: 2,
            title: "Student Fee Payment Deadline",
            content:
              "The last date for semester fee payment is May 15th, 2025. Students who fail to pay by the deadline will incur a late fee of $50.",
            type: "payment",
            createdAt: "2025-04-28T09:15:00",
            dueDate: "2025-05-15T23:59:59",
            isPinned: true,
            department: "Accounts",
          },
          {
            id: 3,
            title: "Scholarship Distribution",
            content:
              "Merit scholarship amounts will be credited to student accounts by May 20th. The list of recipients is available on the college portal.",
            type: "payment",
            createdAt: "2025-05-05T14:45:00",
            dueDate: "2025-05-20T00:00:00",
            isPinned: false,
            department: "Scholarships",
          },
          {
            id: 4,
            title: "Overtime Payment Processing",
            content:
              "Overtime hours for April 2025 will be included in the May salary. Submit all overtime claims by May 10th.",
            type: "salary",
            createdAt: "2025-05-03T11:20:00",
            dueDate: "2025-05-10T17:00:00",
            isPinned: false,
            department: "HR & Finance",
          },
          {
            id: 5,
            title: "Library Fine Payment",
            content:
              "All library fines must be cleared before the end of semester exams. Payment can be made online or at the library desk.",
            type: "payment",
            createdAt: "2025-05-02T16:10:00",
            dueDate: "2025-05-30T17:00:00",
            isPinned: false,
            department: "Library",
          },
          {
            id: 6,
            title: "Faculty Reimbursement",
            content:
              "Reimbursement requests for conference attendance and research expenses must be submitted by May 18th for processing with May salary.",
            type: "salary",
            createdAt: "2025-05-04T10:00:00",
            dueDate: "2025-05-18T17:00:00",
            isPinned: false,
            department: "Finance",
          },
        ];

        // Filter notices based on the current filter
        let filteredNotices = mockNotices;
        if (filter !== "all") {
          filteredNotices = mockNotices.filter(
            (notice) => notice.type === filter
          );
        }

        // Sort notices: pinned first, then by due date
        filteredNotices.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });

        setNotices(filteredNotices);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching notices:", error);
      setIsLoading(false);
    }
  };

  const handleAddNotice = () => {
    // In a real application, you would call your API here:
    // await fetch('/api/notices', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newNotice)
    // });

    // For demo purposes, we'll just add it to our state
    const newId = Math.max(...notices.map((n) => n.id), 0) + 1;
    setNotices([
      {
        ...newNotice,
        id: newId,
        createdAt: new Date().toISOString(),
        department: "Finance", // In real app, this might come from user context
      },
      ...notices,
    ]);

    setShowAddModal(false);
    setNewNotice({
      title: "",
      content: "",
      type: "salary",
      dueDate: "",
      isPinned: false,
    });
  };

  const handleOpenDetailModal = (notice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  const confirmDeleteNotice = (notice, event) => {
    // Stop propagation to prevent the detail modal from opening
    event.stopPropagation();
    setNoticeToDelete(notice);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteNotice = () => {
    // In a real application, you would call your API here:
    // await fetch(`/api/notices/${noticeToDelete.id}`, {
    //   method: 'DELETE'
    // });

    // For demo purposes, we'll just update our state
    setNotices(notices.filter((notice) => notice.id !== noticeToDelete.id));

    // Close modals
    setShowDeleteConfirmModal(false);
    setNoticeToDelete(null);
    if (selectedNotice && selectedNotice.id === noticeToDelete.id) {
      setShowDetailModal(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (dueDate) => {
    const daysRemaining = getDaysRemaining(dueDate);

    if (daysRemaining < 0) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Past Due
        </span>
      );
    } else if (daysRemaining <= 3) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Urgent
        </span>
      );
    } else if (daysRemaining <= 7) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Coming Soon
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Upcoming
        </span>
      );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <IconBell className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Finance Notices</h2>
        </div>

        <div className="flex space-x-3">
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notices</option>
              <option value="salary">Salary Notices</option>
              <option value="payment">Payment Notices</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <IconFilter />
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <IconPlus className="mr-2" />
            Add Notice
          </button>
        </div>
      </div>

      {/* All Notices */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Finance Notices
        </h3>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p>No notices found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition cursor-pointer relative group"
                onClick={() => handleOpenDetailModal(notice)}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => confirmDeleteNotice(notice, e)}
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Notice"
                  >
                    <IconTrash />
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <h4 className="text-md font-semibold text-gray-800">
                    {notice.title}
                    {notice.isPinned && (
                      <IconPin className="inline ml-1 text-blue-600" />
                    )}
                  </h4>
                  {getStatusBadge(notice.dueDate)}
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {notice.content}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center mr-3">
                      <IconCalendar className="mr-1" />
                      {formatDate(notice.dueDate)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        notice.type === "salary"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {notice.type === "salary" ? "Salary" : "Payment"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {notice.department}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Add New Notice
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IconCross />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Title
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notice title"
                  value={newNotice.title}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newNotice.type}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, type: e.target.value })
                  }
                >
                  <option value="salary">Salary</option>
                  <option value="payment">Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newNotice.dueDate}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, dueDate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Content
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter notice details"
                  value={newNotice.content}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, content: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPinned"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={newNotice.isPinned}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, isPinned: e.target.checked })
                  }
                />
                <label
                  htmlFor="isPinned"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Pin this notice
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotice}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Detail Modal */}
      {showDetailModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedNotice.title}
                </h3>
                {selectedNotice.isPinned && (
                  <IconPin className="ml-2 text-blue-600" />
                )}
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IconCross />
              </button>
            </div>

            <div className="mb-4 flex items-center space-x-3">
              {getStatusBadge(selectedNotice.dueDate)}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedNotice.type === "salary"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-indigo-100 text-indigo-800"
                }`}
              >
                {selectedNotice.type === "salary"
                  ? "Salary Notice"
                  : "Payment Notice"}
              </span>
              <span className="text-xs text-gray-500">
                {selectedNotice.department}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedNotice.content}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <IconCalendar className="mr-1" />
                <span>Due: {formatDate(selectedNotice.dueDate)}</span>
              </div>
              <div>Posted: {formatDate(selectedNotice.createdAt)}</div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  confirmDeleteNotice(selectedNotice, {
                    stopPropagation: () => {},
                  });
                }}
                className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  // Here you would handle mark as read functionality
                  setShowDetailModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Mark as Read
              </button>

              {selectedNotice.type === "payment" && (
                <button
                  onClick={() => {
                    // Here you would navigate to payment portal
                    alert("Redirecting to payment portal...");
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Make Payment
                </button>
              )}

              {selectedNotice.type === "salary" && (
                <button
                  onClick={() => {
                    // Here you would navigate to salary section
                    alert("Redirecting to salary section...");
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Salary Details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && noticeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
                <IconTrash />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Notice
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete "{noticeToDelete.title}"? This
                action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNotice}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
