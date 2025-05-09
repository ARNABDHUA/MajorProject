import React, { useState, useEffect } from "react";
import { FaImage, FaVideo, FaTrash, FaUpload } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { ListVideo, Loader } from "lucide-react";
import axios from "axios";

const UploadRecordedClass = () => {
  const [formData, setFormData] = useState({
    course_code: "",
    topic_name: "",
    sem: "",
    paper_code: "",
  });

  const [teacherInfo, setTeacherInfo] = useState({
    teacher_id: "",
    teacher_name: "",
    teacher_course: [],
  });

  const [courseCodes, setCourseCodes] = useState([]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLectures, setShowLectures] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const courses = Array.isArray(user.teacher_course) ? user.teacher_course : [];
      const courseCodesFromStorage = Array.isArray(user.course_code) ? user.course_code : [];

      setTeacherInfo({
        teacher_id: user.c_roll || "",
        teacher_name: user.name || "",
        teacher_course: courses,
      });

      setCourseCodes(courseCodesFromStorage);

      setFormData((prev) => ({
        ...prev,
        paper_code: courses[0] || "",
        course_code: courseCodesFromStorage[0] || "",
      }));
    }
  }, []);

  useEffect(() => {
    if (!showLectures || !formData.course_code || !formData.paper_code) return;

    const fetchTopics = async () => {
      setTopicsLoading(true);
      setMessage("");
      try {
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/video/show-video`,
          {
            course_code: formData.course_code,
            paper_code: formData.paper_code,
          }
        );
        setTopics(response.data.data || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setTopicsLoading(false);
      }
    };

    fetchTopics();
  }, [showLectures, formData.course_code, formData.paper_code]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (e.target.name === "image") {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (e.target.name === "video") {
      setVideo(file);
      setVideoUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const paperCodeRes = await axios.post(
        "https://e-college-data.onrender.com/v1/paper-code/get-papercode-name",
        { paper_code: formData.paper_code }
      );
      const paper_name =
        paperCodeRes.data?.data?.paper_details?.paper_name || "";

      const data = new FormData();
      data.append("course_code", formData.course_code);
      data.append("topic_name", formData.topic_name);
      data.append("sem", formData.sem);
      data.append("paper_code", formData.paper_code);
      data.append("paper_name", paper_name);
      data.append("teacher_id", teacherInfo.teacher_id);
      data.append("teacher_name", teacherInfo.teacher_name);
      if (image) data.append("image", image);
      if (video) data.append("video", video);

      await axios.post("https://e-college-data.onrender.com/v1/video/course-video", data);

      setMessage("Lecture uploaded successfully!");
      setFormData({
        course_code: courseCodes[0] || "",
        topic_name: "",
        sem: "",
        paper_code: teacherInfo.teacher_course[0] || "",
      });
      setImage(null);
      setVideo(null);
      setImagePreview(null);
      setVideoUploaded(false);
    } catch (err) {
      console.error("Upload error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (topicName) => {
    setDeleteLoading((prev) => ({ ...prev, [topicName]: true }));
    setMessage("");

    try {
      await axios.post("https://e-college-data.onrender.com/v1/video/delete-video", {
        topic_name: topicName,
      });
      setTopics(topics.filter((topic) => topic.topic_name !== topicName));
      setSelectedVideo(null);
      setMessage("Lecture deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [topicName]: false }));
    }
  };

  const handleTopicClick = (topic) => {
    // Toggle the selected video: if the same topic is clicked, deselect it; otherwise, select the new topic
    setSelectedVideo(selectedVideo?.topic_name === topic.topic_name ? null : topic);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center">
          <FaUpload className="mr-2 text-indigo-600" />
          Upload Lecture
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
            <select
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {courseCodes.map((code, idx) => (
                <option key={idx} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paper Code *</label>
            <select
              name="paper_code"
              value={formData.paper_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {teacherInfo.teacher_course.map((code, idx) => (
                <option key={idx} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name *</label>
            <input
              type="text"
              name="topic_name"
              value={formData.topic_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
            <select
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files *</label>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-contain rounded-lg"
                    />
                  ) : (
                    <FaImage className="text-4xl text-gray-400" />
                  )}
                </div>
                <p className="text-center mt-2 text-sm text-gray-500">Image</p>
              </div>

              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  {videoUploaded ? <IoMdCheckmarkCircleOutline className="text-4xl text-indigo-600" /> : <FaVideo className="text-4xl text-gray-400"></FaVideo>}
                </div>
                <p className="text-center mt-2 text-sm text-gray-500">Video</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowLectures(!showLectures)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              {showLectures ? "Hide Lectures" : "Show Lectures"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Uploading..." : "Upload Lecture"}
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center font-medium p-3 rounded-lg bg-green-100 text-green-700">
            {message}
          </p>
        )}

        {showLectures && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <ListVideo className="mr-2 text-indigo-600" />
              Uploaded Lectures
            </h2>
            {topicsLoading ? (
              <div className="flex items-center justify-center h-20">
                <Loader className="animate-spin text-indigo-600 w-6 h-6" />
                <span className="ml-2 text-gray-600">Loading lectures...</span>
              </div>
            ) : topics.length > 0 ? (
              <div className="space-y-4">
                {topics.map((topic, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <span
                        onClick={() => handleTopicClick(topic)}
                        className="text-indigo-600 font-medium cursor-pointer hover:underline"
                      >
                        {topic.topic_name}
                      </span>
                      <button
                        onClick={() => handleDelete(topic.topic_name)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-2"
                        disabled={deleteLoading[topic.topic_name]}
                      >
                        {deleteLoading[topic.topic_name] ? (
                          <Loader className="animate-spin w-5 h-5" />
                        ) : (
                          <FaTrash className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {selectedVideo && selectedVideo.topic_name === topic.topic_name && (
                      <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="w-full aspect-video bg-black">
                          <video
                            key={selectedVideo.video}
                            className="w-full h-full object-contain"
                            controls
                            poster={selectedVideo.image}
                          >
                            <source src={selectedVideo.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">You don't have anything to watch.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRecordedClass;