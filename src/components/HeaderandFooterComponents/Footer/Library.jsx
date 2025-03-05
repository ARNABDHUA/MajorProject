import React from "react";

const Library = () => {
  // Sample data for library resources
  const resources = [
    {
      id: 1,
      title: "Introduction to Computer Science",
      type: "Book",
      description:
        "A comprehensive guide to the fundamentals of computer science, perfect for beginners.",
      image:
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      type: "Video",
      description:
        "Master advanced JavaScript concepts like closures, promises, and async/await.",
      image:
        "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "Data Structures and Algorithms",
      type: "Article",
      description:
        "Learn about essential data structures and algorithms for coding interviews.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      type: "Book",
      description:
        "An introduction to machine learning concepts and practical applications.",
      image:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 5,
      title: "Web Development Roadmap",
      type: "Article",
      description:
        "A step-by-step guide to becoming a professional web developer.",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 6,
      title: "Python for Data Science",
      type: "Video",
      description:
        "Learn how to use Python for data analysis, visualization, and machine learning.",
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            eCollege Library
          </h2>
          <p className="text-xl text-gray-600">
            Explore a vast collection of books, articles, and videos to enhance
            your learning experience.
          </p>
        </div>

        {/* Library Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                {/* Resource Type Badge */}
                <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                  {resource.type}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4">{resource.description}</p>

                {/* Action Button */}
                <a
                  href={`#resource-${resource.id}`}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View Resource
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
