import React, { useState, useEffect } from "react";
import { FaImage, FaVideo } from "react-icons/fa";
import axios from "axios";

const UploadRecordedClass = () => {
  const [formData, setFormData] = useState({
    course_code: "",
    topic_name: "",
    paper_name: "",
    sem: "",
    paper_code: "",
  });

  const [teacherInfo, setTeacherInfo] = useState({
    teacher_id: "",
    teacher_name: "",
    teacher_course: [],
  });

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setTeacherInfo({
        teacher_id: user.c_roll || "",
        teacher_name: user.name || "",
        teacher_course: Array.isArray(user.teacher_course) ? user.teacher_course : [],
      });

      // If teacher_course has values, set the first one as default
      if (user.teacher_course && user.teacher_course.length > 0) {
        setFormData((prev) => ({
          ...prev,
          paper_code: user.teacher_course[0],
        }));
      }
    }
  }, []);

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

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    data.append("teacher_id", teacherInfo.teacher_id);
    data.append("teacher_name", teacherInfo.teacher_name);

    if (image) data.append("image", image);
    if (video) data.append("video", video);

    try {
      await axios.post("https://e-college-data.onrender.com/v1/video/course-video", data);
      setMessage("Lecture uploaded successfully!");
      setError(false);
      setFormData({
        course_code: "",
        topic_name: "",
        paper_name: "",
        sem: "",
        paper_code: teacherInfo.teacher_course[0] || "",
      });
      setImage(null);
      setVideo(null);
      setImagePreview(null);
      setVideoUploaded(false);
    } catch (err) {
      console.error("Upload error:", err.message);
      setMessage("Error uploading lecture.");
      setError(true);
    }
  };

  return (
    <div className="m-auto p-6 md:ml-64">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Lecture</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paper Code Dropdown */}
          <div>
            <label className="block font-medium mb-1">Paper Code *</label>
            <select
              name="paper_code"
              value={formData.paper_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              required
            >
              {teacherInfo.teacher_course.map((code, idx) => (
                <option key={idx} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          {/* Text Inputs */}
          {["course_code", "topic_name", "paper_name"].map((field) => (
            <div key={field}>
              <label className="block font-medium mb-1 capitalize">
                {field.replace("_", " ")} *
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                required
              />
            </div>
          ))}

          {/* Semester Dropdown */}
          <div>
            <label className="block font-medium mb-1">Semester *</label>
            <select
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              required
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{`${i + 1}`}</option>
              ))}
            </select>
          </div>

          {/* File Uploads */}
          <div className="md:col-span-2">
            <label className="block font-medium mb-2">Upload Files *</label>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center bg-gray-50">
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
                      className="h-full object-contain"
                    />
                  ) : (
                    <FaImage className="text-3xl text-gray-400" />
                  )}
                </div>
                <p className="text-center mt-1 text-sm text-gray-500">Image</p>
              </div>

              {/* Video */}
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center bg-gray-50">
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  />
                  <FaVideo
                    className={`text-3xl ${videoUploaded ? "text-blue-600" : "text-gray-400"}`}
                  />
                </div>
                <p className="text-center mt-1 text-sm text-gray-500">Video</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Lecture
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadRecordedClass;
