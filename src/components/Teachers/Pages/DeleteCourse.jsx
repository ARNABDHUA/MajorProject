import { useState, useEffect } from "react";
import axios from "axios";

const dayNames = {
  day1: "Monday",
  day2: "Tuesday",
  day3: "Wednesday",
  day4: "Thursday",
  day5: "Friday",
  day6: "Saturday",
};

// Mapping for API day format
const dayKeyToApiFormat = {
  day1: "Day 1",
  day2: "Day 2",
  day3: "Day 3",
  day4: "Day 4",
  day5: "Day 5",
  day6: "Day 6",
};

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default function ScheduleViewer() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingClassId, setProcessingClassId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Close toast
  const closeToast = () => {
    setToast(null);
  };

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.course_code || !user.course_code[0]) {
          setError("User data or course code not found");
          setLoading(false);
          return;
        }

        const courseCode = Number(user.course_code[0]);

        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/adminroutine/routine-all/${courseCode}/1`
        );

        if (response.data?.data?.[0]) {
          setScheduleData(response.data.data[0]);
          console.log("Schedule data fetched:", response.data.data[0]);
          setError(null);
        } else {
          setError("No schedule data available");
        }
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        setError(
          `Failed to fetch schedule data: ${err.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [refreshTrigger]);

  const handleDelete = async (dayKey, classId, paperCode) => {
    if (!scheduleData) return;

    // Set processing state for this specific class
    setProcessingClassId(classId);

    try {
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.course_code || !user.course_code[0]) {
        throw new Error("User data or course code not found");
      }

      const courseId = Number(user.course_code[0]);

      // Format the request data as specified
      const requestData = {
        course_id: courseId,
        course_name: "MCA", // Hardcoded as requested
        sem: scheduleData.sem,
        day: dayKeyToApiFormat[dayKey], // Convert day key to required format
        paper_code: paperCode,
      };

      console.log("Sending delete request with data:", requestData);

      // Make the API call
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/adminroutine/delete-time-slot",
        requestData
      );

      console.log("Delete response:", response.data);

      // Check if the response message contains "deleted" which indicates success
      // This handles cases where success is true OR false but the deletion actually worked
      if (
        response.data.success ||
        (response.data.message &&
          response.data.message.toLowerCase().includes("deleted"))
      ) {
        // Immediately update the UI after successful deletion
        setScheduleData((prevData) => {
          if (!prevData) return null;

          const updatedData = { ...prevData };
          updatedData.days = { ...prevData.days };
          updatedData.days[dayKey] = prevData.days[dayKey].filter(
            (cls) => cls._id !== classId
          );

          return updatedData;
        });

        // Show success toast notification
        showToast(`Class has been successfully deleted`, "success");
      } else {
        throw new Error(response.data.message || "API returned error");
      }
    } catch (err) {
      console.error("Error deleting time slot:", err);

      // Check if error message actually indicates success (contains "deleted")
      if (err.message && err.message.toLowerCase().includes("deleted")) {
        // This was actually a successful deletion
        setScheduleData((prevData) => {
          if (!prevData) return null;

          const updatedData = { ...prevData };
          updatedData.days = { ...prevData.days };
          updatedData.days[dayKey] = prevData.days[dayKey].filter(
            (cls) => cls._id !== classId
          );

          return updatedData;
        });

        showToast(`Class has been successfully deleted`, "success");
      } else {
        // Show error toast notification for actual errors
        showToast(`Failed to delete class: ${err.message || "Unknown error"}`);

        // Refresh data to ensure UI is in sync with server
        setRefreshTrigger((prev) => prev + 1);
      }
    } finally {
      setProcessingClassId(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded flex justify-between items-center">
        <span>Error: {error}</span>
        <button
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (!scheduleData) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 mb-4">No schedule data available</p>
        <button
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Render schedule data
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Class Schedule - {scheduleData.course_name} (Semester{" "}
          {scheduleData.sem})
        </h1>
        <button
          onClick={() => setRefreshTrigger((prev) => prev + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(scheduleData.days).map(([day, classes]) => (
          <div
            key={day}
            className="border rounded-lg shadow-sm overflow-hidden"
          >
            <div className="bg-blue-50 p-3 font-semibold border-b">
              {dayNames[day]}
            </div>

            {classes.length === 0 ? (
              <div className="p-4 text-gray-500">No classes scheduled</div>
            ) : (
              <div className="divide-y">
                {classes.map((cls) => (
                  <div
                    key={cls._id}
                    className={`p-4 flex justify-between items-center ${
                      processingClassId === cls._id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-blue-800">
                        {cls.paper} ({cls.paper_code})
                      </div>
                      <div className="text-sm text-gray-600">{cls.time}</div>
                    </div>
                    <button
                      onClick={() => handleDelete(day, cls._id, cls.paper_code)}
                      disabled={processingClassId === cls._id}
                      className={`${
                        processingClassId === cls._id
                          ? "bg-gray-400"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white px-3 py-1 rounded-md text-sm flex items-center`}
                    >
                      {processingClassId === cls._id ? (
                        <>
                          <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
