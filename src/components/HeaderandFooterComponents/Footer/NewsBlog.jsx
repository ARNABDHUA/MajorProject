import React from "react";

const NewsBlog = () => {
  // Sample data for news and blogs
  const posts = [
    {
      id: 1,
      title: "Top 10 Skills to Learn in 2024",
      description:
        "Discover the most in-demand skills for 2024 and how to acquire them to boost your career.",
      date: "October 10, 2023",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80",
    },
    {
      id: 2,
      title: "How to Build a Strong Professional Network",
      description:
        "Learn effective strategies to build and maintain a professional network that can help you grow in your career.",
      date: "October 5, 2023",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      id: 3,
      title: "The Future of Remote Work",
      description:
        "Explore the trends and challenges of remote work and how it is shaping the future of the workplace.",
      date: "September 28, 2023",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            News & Blogs
          </h2>
          <p className="text-xl text-gray-600">
            Stay updated with the latest news, insights, and trends in education
            and career development.
          </p>
        </div>

        {/* News and Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Image */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <p className="text-sm text-gray-500">{post.date}</p>
                <a
                  href={`#post-${post.id}`}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsBlog;
