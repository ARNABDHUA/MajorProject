import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserCircle,
  FaRegComment,
  FaThumbsUp,
  FaShare,
} from "react-icons/fa";

const Forum = () => {
  // Sample forum posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "John Doe",
      timestamp: "2 hours ago",
      content:
        "What are the best resources to learn React for beginners? I'm looking for something hands-on and practical.",
      likes: 12,
      comments: [
        {
          id: 1,
          user: "Jane Smith",
          timestamp: "1 hour ago",
          content:
            "I recommend starting with the official React documentation. It's very beginner-friendly!",
        },
        {
          id: 2,
          user: "Alice Johnson",
          timestamp: "45 minutes ago",
          content:
            "Check out freeCodeCamp's React course on YouTube. It's great for hands-on learning.",
        },
      ],
    },
    {
      id: 2,
      user: "Alice Johnson",
      timestamp: "5 hours ago",
      content:
        "Has anyone taken the 'Advanced JavaScript' course on eCollege? How was your experience?",
      likes: 8,
      comments: [
        {
          id: 1,
          user: "John Doe",
          timestamp: "3 hours ago",
          content:
            "I took it last month. The course is excellent, especially the modules on closures and async/await.",
        },
      ],
    },
    {
      id: 3,
      user: "Jane Smith",
      timestamp: "1 day ago",
      content:
        "What are some good projects to build to practice front-end development skills?",
      likes: 15,
      comments: [
        {
          id: 1,
          user: "Alice Johnson",
          timestamp: "20 hours ago",
          content:
            "Try building a weather app or a task manager. Both are great for practicing APIs and state management.",
        },
      ],
    },
  ]);

  // State to track expanded comments for each post
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Toggle comments visibility
  const toggleComments = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            eCollege Forum
          </h2>
          <p className="text-xl text-gray-600">
            Join the discussion, ask questions, and share knowledge with the
            eCollege community.
          </p>
        </div>

        {/* Forum Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-lg shadow-md overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <FaUserCircle className="w-8 h-8 text-gray-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.user}
                    </h3>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <p className="text-gray-700">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <FaThumbsUp />
                    <span>{post.likes} Likes</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <FaRegComment />
                    <span>{post.comments.length} Comments</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {expandedPostId === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 border-t border-gray-200"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Comments
                    </h4>
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start space-x-4"
                        >
                          <FaUserCircle className="w-6 h-6 text-gray-500" />
                          <div>
                            <h5 className="text-sm font-semibold text-gray-800">
                              {comment.user}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {comment.timestamp}
                            </p>
                            <p className="text-gray-700 mt-1">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
