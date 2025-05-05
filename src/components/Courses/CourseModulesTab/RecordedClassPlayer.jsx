import { useState, useEffect } from "react";
import {
  Calendar,
  Filter,
  Loader,
  User,
  FileText,
  BookOpen,
  ListVideo,
} from "lucide-react";
import axios from "axios";
import { FaChalkboardTeacher, FaFileAlt, FaRegCalendarAlt } from "react-icons/fa";

const RecordedClassPlayer = () => {
  const [paperCodes, setPaperCodes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedPaperCode, setSelectedPaperCode] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.paper_code) {
      setPaperCodes(user.paper_code);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const course_code = user?.course_code;

    if (!selectedPaperCode || !course_code) return;

    const fetchTopics = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://e-college-data.onrender.com/v1/video/show-video`,
          {
            course_code: course_code,
            paper_code: selectedPaperCode,
          }
        );
        setTopics(response.data.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [selectedPaperCode]);

  const handlePaperChange = (e) => {
    setSelectedPaperCode(e.target.value);
    setSelectedTopic("");
    setSelectedVideo(null);
  };

  const handleTopicChange = (e) => {
    const topicName = e.target.value;
    setSelectedTopic(topicName);
    const topic = topics.find((t) => t.topic_name === topicName);
    setSelectedVideo(topic || null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-y-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] lg:max-h-[80vh] pb-6 px-3 sm:px-4 md:px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-indigo-800">
        Recorded Class Library
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-10">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-semibold">Select Paper & Topic</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paper Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paper Code
            </label>
            {paperCodes.length > 0 ? (
              <select
                value={selectedPaperCode}
                onChange={handlePaperChange}
                className="block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Paper Code</option>
                {paperCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-gray-500">No paper codes available.</div>
            )}
          </div>

          {/* Topic Dropdown */}
          {loading ? (
            <div className="flex items-center justify-center h-20 col-span-full">
              <Loader className="animate-spin text-indigo-600 w-6 h-6" />
              <span className="ml-2 text-gray-600">Loading topics...</span>
            </div>
          ) : topics.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={handleTopicChange}
                className="block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Topic</option>
                {topics.map((topic, idx) => (
                  <option key={idx} value={topic.topic_name}>
                    {topic.topic_name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            selectedPaperCode && (
              <div className="text-gray-500 col-span-full">
                No topics available for the selected paper code.
              </div>
            )
          )}
        </div>
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-20">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <ListVideo className="w-5 h-5 text-indigo-600 mr-2" />
              {selectedVideo.topic_name}
            </h2>

            <p className="text-indigo-700 font-medium mb-4 flex items-center text-lg">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              {selectedVideo.paper_name}
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <FaChalkboardTeacher className="w-4 h-4 text-gray-600" />
                <span className="font-bold">Paper Code: </span>
                <span>{selectedVideo.teacher_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaFileAlt className="w-4 h-4 text-gray-600" />
                <span className="font-bold">Paper Code: </span>
                <span>{selectedPaperCode}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaRegCalendarAlt className="w-4 h-4 text-gray-600" />
                <span className="font-bold">Uploaded: </span>
                <span>{formatDate(selectedVideo.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-gray-600" />
                <span className="font-bold">Course Code: </span>
                <span>
                  {JSON.parse(localStorage.getItem("user"))?.course_code || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="font-bold">Semester: </span>
                <span>Semester {selectedVideo.sem || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Responsive Video Player */}
          <div className="w-full m-auto aspect-video bg-black">
            <video
              key={selectedVideo.video}
              className="w-full h-full object-contain"
              controls
              poster={ selectedVideo.image }
            >
              <source src={selectedVideo.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordedClassPlayer;
