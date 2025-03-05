import React from "react";

const Documentation = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Documentation & Resources
          </h2>
          <p className="text-xl text-gray-600">
            Access comprehensive guides, tutorials, and resources to help you
            succeed in your career journey.
          </p>
        </div>

        {/* Documentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Getting Started */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Getting Started
            </h3>
            <p className="text-gray-600">
              Learn how to create an account, set up your profile, and start
              exploring job opportunities.
            </p>
            <a
              href="#getting-started"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* Card 2: Resume Building */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Resume Building
            </h3>
            <p className="text-gray-600">
              Discover tips and templates to create a professional resume that
              stands out to employers.
            </p>
            <a
              href="#resume-building"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* Card 3: Interview Preparation */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Interview Preparation
            </h3>
            <p className="text-gray-600">
              Master the art of interviewing with our step-by-step guides and
              practice questions.
            </p>
            <a
              href="#interview-prep"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* Card 4: Career Planning */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Career Planning
            </h3>
            <p className="text-gray-600">
              Plan your career path with our tools and resources tailored to
              your goals.
            </p>
            <a
              href="#career-planning"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* Card 5: Networking Tips */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Networking Tips
            </h3>
            <p className="text-gray-600">
              Learn how to build and maintain a professional network to advance
              your career.
            </p>
            <a
              href="#networking-tips"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* Card 6: Job Search Strategies */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Job Search Strategies
            </h3>
            <p className="text-gray-600">
              Discover effective strategies to find and apply for the right
              jobs.
            </p>
            <a
              href="#job-search"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read More →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
