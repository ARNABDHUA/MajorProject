import { useState } from "react";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([
    "📌 Welcome to the Best Private University in MP",
    "📌 Many desktop publishing packages and web page editors now use Lorem Ipsum.",
    "📌 Various versions have evolved over time, sometimes by accident, sometimes on purpose.",
  ]);

  const events = [
    {
      date: "June 21 2025",
      subject: "Maths & English",
      offer: "Offer With Higher Package Of 40 LPA",
      details:
        "📌 Congratulations! Our top students have secured high-paying offers in reputed companies with packages reaching 40 LPA. Keep striving for excellence!",
    },
    {
      date: "July 10",
      subject: "Science & Research",
      offer: "Scholarship Awards Ceremony",
      details:
        "📌 Top researchers and scholars will be honored in our upcoming Scholarship Awards Ceremony. Stay tuned for more details!",
    },
    {
      date: "August 5",
      subject: "Technology & Innovation",
      offer: "Tech Expo 2025",
      details:
        "📌 Explore the latest advancements in AI, Robotics, and Software Development at our upcoming Tech Expo 2025. Innovate and inspire!",
    },
  ];

  const handleEventClick = (eventDetails) => {
    setNotices((prevNotices) => [eventDetails]);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice Board Section */}
        <div className="bg-green-900 text-white p-6 rounded-lg shadow-lg selection:bg-red-500">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            📢 Notice Board
          </h2>
          <div className="space-y-3">
            {notices.map((notice, index) => (
              <p key={index} className="flex items-start gap-2">
                ✅ {notice}
              </p>
            ))}
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            📅 Recent Events
          </h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <button
                key={index}
                onClick={() => handleEventClick(event.details)}
                className="flex items-center p-4 border rounded-lg hover:bg-gray-100 transition w-full"
              >
                <div className="bg-green-500 text-white p-3 rounded-lg text-center w-16">
                  <p className="text-lg font-bold">
                    {event.date.split(" ")[1]}
                  </p>
                  <p className="text-xs">{event.date.split(" ")[0]}</p>
                </div>
                <div className="ml-4 text-left">
                  <p className="text-gray-600 text-sm">{event.subject}</p>
                  <p className="text-md font-semibold">{event.offer}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
