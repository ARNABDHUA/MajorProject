import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizCreator() {
  const [currentView, setCurrentView] = useState("allQuizzes"); // 'allQuizzes', 'createQuiz', 'addQuestions', or 'viewMarks'
  const [quizData, setQuizData] = useState(null);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marksLoading, setMarksLoading] = useState(false);
  const [totalQuestions, setTotalQuestion] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteQuizLoading, setDeleteQuizLoading] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    question_text: "",
    options: ["", "", "", ""],
    correct_answer: "",
  });

  const [quizFormData, setQuizFormData] = useState({
    paper_code: "",
    sem: "",
    quiz_title: "",
  });

  // Get user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Fetch all quizzes when user is loaded
        fetchAllQuizzes(parsedUser.c_roll);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Fetch all quizzes for this teacher
  const fetchAllQuizzes = async (c_roll) => {
    if (!c_roll) {
      showNotification("Roll number not found. Please login first.", "error");
      return;
    }

    setQuizzesLoading(true);
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/show-all-quiz",
        {
          c_roll: c_roll,
        }
      );

      if (response.data) {
        setAllQuizzes(response.data);
      } else {
        showNotification(
          "Failed to fetch quizzes: " +
            (response.data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error fetching quizzes: " + error.message, "error");
    } finally {
      setQuizzesLoading(false);
    }
  };

  // Select a quiz to edit
  const selectQuiz = (quiz) => {
    setQuizData(quiz);

    // Load questions from the selected quiz
    if (quiz.questions && quiz.questions.length > 0) {
      setTotalQuestion(quiz.questions.length);
      const formattedQuestions = quiz.questions.map((q) => ({
        ...q,
        questionId: q._id,
      }));
      setQuestions(formattedQuestions);
    } else {
      setQuestions([]);
    }

    setCurrentView("addQuestions");
  };

  const createQuizId = async () => {
    if (!user) {
      showNotification(
        "User data not found in localStorage. Please login first.",
        "error"
      );
      return;
    }

    // Validate quiz form data
    if (!quizFormData.paper_code.trim()) {
      showNotification("Please enter Paper Code", "error");
      return;
    }
    if (!quizFormData.sem.trim()) {
      showNotification("Please enter Semester", "error");
      return;
    }
    if (!quizFormData.quiz_title.trim()) {
      showNotification("Please enter Quiz Title", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/quiz/create-quizid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            c_roll: user.c_roll,
            paper_code: quizFormData.paper_code,
            sem: quizFormData.sem,
            quiz_title: quizFormData.quiz_title,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setQuizData(data);
        setCurrentView("addQuestions");
        showNotification("Quiz ID created successfully!", "success");

        // Refresh the quiz list
        fetchAllQuizzes(user.c_roll);
      } else {
        showNotification(
          "Failed to create quiz ID: " + (data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error creating quiz ID: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async () => {
    // Validate form data
    if (!formData.question_text.trim()) {
      showNotification("Please enter a question", "error");
      return;
    }

    if (formData.options.some((option) => !option.trim())) {
      showNotification("All options must be filled", "error");
      return;
    }

    if (!formData.correct_answer) {
      showNotification("Please select the correct answer", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/add-question",
        {
          quiz_id: quizData.quiz_id,
          question_text: formData.question_text,
          options: formData.options,
          correct_answer: formData.correct_answer,
        }
      );

      if (response.data) {
        // Add the question ID to our stored question data
        const datalength = response.data.questions.length - 1;
        const newdata_id = response.data.questions[datalength]._id;

        const newQuestion = {
          ...formData,
          questionId: newdata_id,
        };
        setQuestions([...questions, newQuestion]);

        // Reset form
        setFormData({
          question_text: "",
          options: ["", "", "", ""],
          correct_answer: "",
        });
        showNotification("Question added successfully!", "success");

        // Refresh the quiz list to update question count
        fetchAllQuizzes(user.c_roll);
      } else {
        showNotification(
          "Failed to add question: " +
            (response.data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error adding question: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (questionId, index) => {
    if (!questionId) {
      showNotification("Missing question ID", "error");
      return;
    }

    if (!quizData || !quizData.quiz_id) {
      showNotification("Missing quiz ID", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/quiz/delete-question",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: questionId,
            quiz_id: quizData.quiz_id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Remove the question from our local state
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
        showNotification("Question deleted successfully!", "success");

        // Refresh the quiz list to update question count
        fetchAllQuizzes(user.c_roll);
      } else {
        showNotification(
          "Failed to delete question: " + (data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error deleting question: " + error.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteQuiz = async (quizId = null) => {
    const targetQuizId = quizId || (quizData ? quizData.quiz_id : null);

    if (!targetQuizId) {
      showNotification("Quiz ID not found", "error");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this entire quiz? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteQuizLoading(true);
    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/quiz/delete-quizid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quiz_id: targetQuizId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Reset all quiz-related state if we were editing this quiz
        if (quizData && quizData.quiz_id === targetQuizId) {
          setQuizData(null);
          setQuestions([]);
          setCurrentView("allQuizzes");
        }

        // Refresh the quiz list
        fetchAllQuizzes(user.c_roll);

        showNotification("Quiz deleted successfully!", "success");
      } else {
        showNotification(
          "Failed to delete quiz: " + (data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification("Error deleting quiz: " + error.message, "error");
    } finally {
      setDeleteQuizLoading(false);
    }
  };

  const fetchStudentMarks = async () => {
    if (!quizData || !quizData.quiz_id) {
      showNotification("Quiz ID not found", "error");
      return;
    }

    setMarksLoading(true);

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/all-student-marks",
        {
          quiz_id: quizData.quiz_id,
        }
      );

      if (response.data) {
        setStudentMarks(response.data || []);
        setCurrentView("viewMarks");
      } else {
        showNotification(
          "Failed to fetch student marks: " +
            (response.data.message || "Unknown error"),
          "error"
        );
      }
    } catch (error) {
      showNotification(
        "Error fetching student marks: " + error.message,
        "error"
      );
    } finally {
      setMarksLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          E-College Quiz Creator
        </h1>

        {notification.show && (
          <div
            className={`mb-4 p-3 rounded ${
              notification.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        {!user && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>User data not found in localStorage. Please login first.</p>
          </div>
        )}

        {/* Navigation Buttons */}
        {user && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentView("allQuizzes")}
              className={`px-4 py-2 rounded font-medium ${
                currentView === "allQuizzes"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
            >
              All Quizzes
            </button>
            <button
              onClick={() => {
                setQuizFormData({ paper_code: "", sem: "", quiz_title: "" });
                setCurrentView("createQuiz");
              }}
              className={`px-4 py-2 rounded font-medium ${
                currentView === "createQuiz"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-700"
              }`}
            >
              Create New Quiz
            </button>
            {quizData && (
              <>
                <button
                  onClick={() => setCurrentView("addQuestions")}
                  className={`px-4 py-2 rounded font-medium ${
                    currentView === "addQuestions"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                  }`}
                >
                  Edit Questions
                </button>
                <button
                  onClick={fetchStudentMarks}
                  disabled={marksLoading}
                  className={`px-4 py-2 rounded font-medium ${
                    currentView === "viewMarks"
                      ? "bg-blue-700 text-white"
                      : marksLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                  }`}
                >
                  {marksLoading ? "Loading..." : "View Results"}
                </button>
              </>
            )}
          </div>
        )}

        {/* All Quizzes View */}
        {currentView === "allQuizzes" && user && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Quizzes</h2>
              <button
                onClick={() => {
                  setQuizFormData({ paper_code: "", sem: "", quiz_title: "" });
                  setCurrentView("createQuiz");
                }}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                Create New Quiz
              </button>
            </div>

            {quizzesLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading quizzes...</p>
              </div>
            ) : allQuizzes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                      <th className="py-3 px-4 font-semibold">Quiz Title</th>
                      <th className="py-3 px-4 font-semibold">Paper Code</th>
                      <th className="py-3 px-4 font-semibold">Semester</th>
                      <th className="py-3 px-4 font-semibold">Questions</th>
                      <th className="py-3 px-4 font-semibold">Created</th>
                      <th className="py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allQuizzes.map((quiz, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{quiz.quiz_title}</td>
                        <td className="py-3 px-4">{quiz.paper_code}</td>
                        <td className="py-3 px-4">{quiz.sem}</td>
                        <td className="py-3 px-4">
                          {quiz.questions ? quiz.questions.length : 0}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(quiz.created_at)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => selectQuiz(quiz)}
                              className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteQuiz(quiz.quiz_id)}
                              disabled={deleteQuizLoading}
                              className={`px-3 py-1 text-sm rounded ${
                                deleteQuizLoading
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  You haven't created any quizzes yet.
                </p>
                <button
                  onClick={() => setCurrentView("createQuiz")}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Your First Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Quiz View */}
        {currentView === "createQuiz" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>

            {user && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Name:</span> {user.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Roll:</span> {user.c_roll}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium">Quiz Information</h3>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Paper Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={quizFormData.paper_code}
                      onChange={(e) =>
                        setQuizFormData({
                          ...quizFormData,
                          paper_code: e.target.value,
                        })
                      }
                      placeholder="e.g. MCA-101"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Semester
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={quizFormData.sem}
                      onChange={(e) =>
                        setQuizFormData({
                          ...quizFormData,
                          sem: e.target.value,
                        })
                      }
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={quizFormData.quiz_title}
                      onChange={(e) =>
                        setQuizFormData({
                          ...quizFormData,
                          quiz_title: e.target.value,
                        })
                      }
                      placeholder="e.g. Introduction to Programming"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentView("allQuizzes")}
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createQuizId}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded font-medium ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isLoading ? "Creating..." : "Create Quiz"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Quiz Info Panel (shown in both Add Questions and View Marks views) */}
        {(currentView === "addQuestions" || currentView === "viewMarks") &&
          quizData && (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Quiz Information
                  </h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Quiz ID:</span>{" "}
                    {quizData.quiz_id}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Title:</span>{" "}
                    {quizData.quiz_title}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Paper Code:</span>{" "}
                    {quizData.paper_code}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Semester:</span>{" "}
                    {quizData.sem}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(quizData.created_at)}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  {currentView === "addQuestions" && (
                    <button
                      onClick={fetchStudentMarks}
                      disabled={marksLoading}
                      className={`px-4 py-2 rounded ${
                        marksLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {marksLoading ? "Loading..." : "View Student Marks"}
                    </button>
                  )}
                  {currentView === "viewMarks" && (
                    <button
                      onClick={() => setCurrentView("addQuestions")}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Back to Questions
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentView("allQuizzes")}
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Back to All Quizzes
                  </button>
                  <button
                    onClick={() => deleteQuiz()}
                    disabled={deleteQuizLoading}
                    className={`px-4 py-2 rounded ${
                      deleteQuizLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {deleteQuizLoading ? "Deleting..." : "Delete Quiz"}
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* Add Questions View */}
        {currentView === "addQuestions" && quizData && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold mb-4">Add New Question</h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Question Text
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={formData.question_text}
                  onChange={(e) =>
                    setFormData({ ...formData, question_text: e.target.value })
                  }
                  placeholder="Enter your question here..."
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Options
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      id={`option-${index}`}
                      className="mr-2"
                      checked={formData.correct_answer === option}
                      onChange={() =>
                        setFormData({ ...formData, correct_answer: option })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-1">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <button
                onClick={addQuestion}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded font-medium ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isLoading ? "Adding..." : "Add Question"}
              </button>
            </div>

            {questions.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Added Questions ({questions.length})
                </h3>

                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium mb-2">
                        Q{qIndex + 1}: {q.question_text}
                      </p>
                      <button
                        onClick={() => deleteQuestion(q.questionId, qIndex)}
                        disabled={deleteLoading}
                        className={`px-3 py-1 text-sm rounded ${
                          deleteLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="pl-4">
                      {q.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`mb-1 ${
                            option === q.correct_answer
                              ? "text-green-700 font-medium"
                              : ""
                          }`}
                        >
                          {String.fromCharCode(65 + oIndex)}: {option}
                          {option === q.correct_answer && " (Correct)"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                  No questions added yet. Use the form above to add your first
                  question.
                </p>
              </div>
            )}
          </>
        )}

        {/* View Marks View */}
        {currentView === "viewMarks" && quizData && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Student Results</h3>
              <button
                onClick={() => setCurrentView("addQuestions")}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Questions
              </button>
            </div>

            {marksLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading student marks...</p>
              </div>
            ) : studentMarks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-left">
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Roll Number</th>
                      <th className="py-3 px-4 font-semibold">Score</th>
                      <th className="py-3 px-4 font-semibold">
                        Total Questions
                      </th>
                      <th className="py-3 px-4 font-semibold">Percentage</th>
                      <th className="py-3 px-4 font-semibold">
                        Submission Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentMarks.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{result.student}</td>
                        <td className="py-3 px-4">{result.c_roll}</td>
                        <td className="py-3 px-4">{result.marks}</td>
                        <td className="py-3 px-4">{totalQuestions}</td>
                        <td className="py-3 px-4">
                          {((result.marks / totalQuestions) * 100).toFixed(2)}%
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(result.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  No student has taken this quiz yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
