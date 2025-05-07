import React, { useEffect, useState } from "react";
import axios from "axios";
// Simple icon components to replace react-icons/fi
const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconChevronLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconHash = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);

const IconMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconBookOpen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconFileText = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconAward = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const IconAlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Quiz = () => {
  const [step, setStep] = useState("form"); // form | loading | quiz | result | error
  const [quizID, setQuizID] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    c_roll: "",
    email: "",
    course_id: "",
    sem: "",
    paper_code: "",
    paper: "",
    exam_number: "",
  });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [timerActive, setTimerActive] = useState(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData) {
        setStudentInfo({
          name: userData.name || "",
          c_roll: userData.c_roll || "",
          email: userData.email || "",
          course_id: userData.course_code || "",
          sem: userData.sem || "",
          paper_code: Array.isArray(userData.paper_code)
            ? userData.paper_code[0]
            : userData.paper_code || "",
          paper: "", // Will be populated from quiz data
          exam_number: "", // Will be populated from quiz data
        });
      }
    } catch (err) {
      console.error("Error parsing user data", err);
      setErrorMessage("Could not load user data. Please log in again.");
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === "quiz") {
      // Auto advance when time is up
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(60); // Reset timer for next question
      } else {
        setShowResults(true);
        setStep("result");
        submitQuizResults();
      }
    }

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, currentQuestion, step, quizQuestions.length]);

  // Set timer active when entering quiz stage
  useEffect(() => {
    if (step === "quiz") {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [step]);

  // Reset timer when changing questions
  useEffect(() => {
    setTimeLeft(60);
  }, [currentQuestion]);

  const checkQuizSubmission = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/check-submit",
        {
          quiz_id: quizID,
          c_roll: studentInfo.c_roll,
        }
      );

      //const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Failed to check quiz submission");
      // }

      if (response.data.hasSubmitted) {
        setErrorMessage("You have already submitted this quiz.");
        setStep("error");
      } else {
        // If not submitted, fetch the quiz questions
        fetchQuizQuestions();
      }
    } catch (error) {
      console.error("Error checking quiz submission:", error);
      setErrorMessage(
        error.message || "Failed to check quiz submission status."
      );
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizQuestions = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/show-questions",
        { quiz_id: quizID }
      );

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Failed to fetch quiz questions");
      // }

      if (
        response.data &&
        response.data.questions &&
        response.data.questions.length > 0
      ) {
        // Store the full quiz data
        setQuizData(response.data);

        // Format questions for our quiz component
        const formattedQuestions = response.data.questions.map((q) => ({
          question: q.question_text,
          options: q.options,
          answer: q.correct_answer,
          _id: q._id,
        }));

        setQuizQuestions(formattedQuestions);

        // Update additional quiz info
        setStudentInfo((prev) => ({
          ...prev,
          paper: response.data.paper_code || prev.paper,
          paper_code: response.data.paper_code || prev.paper_code,
          exam_number: response.data.quiz_title || prev.exam_number,
        }));

        // Start the quiz
        setStep("quiz");
      } else {
        setErrorMessage("No questions found for this quiz.");
        setStep("error");
      }
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setErrorMessage(error.message || "Failed to load quiz questions.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const submitQuizResults = async () => {
    setLoading(true);
    try {
      // Calculate the score
      const score = calculateScore();

      // Prepare the data according to the API requirements
      const submissionData = {
        student: studentInfo.name,
        c_roll: studentInfo.c_roll,
        marks: score.toString(), // Convert score to string as required
        quiz_id: quizID,
        email: studentInfo.email,
        course_code: studentInfo.course_id,
      };

      // Make the API call to submit marks
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/quiz/add-student-marks",
        submissionData
      );

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || "Failed to submit quiz results");
      // }

      console.log("Quiz results submitted successfully:", response.data);
      // You can add a success message here if needed
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      setErrorMessage(error.message || "Failed to submit quiz results.");
      // Even if there's an error in submission, we still show the results
      // but maybe add a note that results weren't saved
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (quizID) {
      setStep("loading");
      checkQuizSubmission();
    } else {
      setErrorMessage("Please enter a Quiz ID");
    }
  };

  const handleOptionClick = (option) => {
    if (selectedAnswers[currentQuestion] === option) {
      // Deselect if same option clicked
      const updatedAnswers = { ...selectedAnswers };
      delete updatedAnswers[currentQuestion];
      setSelectedAnswers(updatedAnswers);
    } else {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: option });
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setStep("result");
      submitQuizResults();
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex justify-center items-start">
      <div className="w-full max-w-3xl">
        {/* Form Section */}
        {step === "form" && (
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              Start Your Quiz
            </h2>
            <div className="space-y-4">
              <div className="w-full p-2 border rounded bg-gray-50">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Quiz ID
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={quizID}
                  onChange={(e) => setQuizID(e.target.value)}
                  placeholder="Enter Quiz ID (e.g. QUIZ-MA9RH0VU-9GH5TF)"
                />
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm py-1">{errorMessage}</div>
              )}

              <button
                onClick={handleFormSubmit}
                className="bg-indigo-600 text-white px-4 py-3 rounded-lg w-full font-medium shadow-md hover:bg-indigo-700"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}

        {/* Loading Section */}
        {step === "loading" && (
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-700">Loading quiz questions...</p>
          </div>
        )}

        {/* Error Section */}
        {step === "error" && (
          <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <IconAlertCircle />
            </div>
            <h3 className="text-xl font-bold text-center mb-3 text-red-600">
              Error
            </h3>
            <p className="text-center mb-6">{errorMessage}</p>
            <button
              onClick={() => {
                setStep("form");
                setErrorMessage("");
              }}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg w-full font-medium shadow-md hover:bg-indigo-700"
            >
              Back to Quiz Form
            </button>
          </div>
        )}

        {/* Quiz Section */}
        {step === "quiz" && quizQuestions.length > 0 && (
          <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg mt-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold text-indigo-800">
                Question {currentQuestion + 1} / {quizQuestions.length}
              </h2>

              <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                <IconClock />
                <span
                  className={`font-mono font-medium ml-2 ${
                    timeLeft < 10 ? "text-red-600" : "text-indigo-800"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <p className="mb-4 text-md text-gray-600 italic">
              Quiz ID: {quizID}
            </p>

            <div className="mb-6">
              <p className="text-lg font-medium mb-4 p-3 bg-indigo-50 rounded-lg">
                {quizQuestions[currentQuestion]?.question}
              </p>

              <div className="space-y-3 mb-6">
                {quizQuestions[currentQuestion]?.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl border ${
                      selectedAnswers[currentQuestion] === opt
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-xl flex items-center ${
                  currentQuestion === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <IconChevronLeft />
                <span className="ml-1">Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
              >
                <span className="mr-1">
                  {currentQuestion === quizQuestions.length - 1
                    ? "Submit"
                    : "Next"}
                </span>
                <IconChevronRight />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-4 sm:grid-cols-7 gap-2">
              {quizQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    idx === currentQuestion
                      ? "bg-indigo-600 text-white"
                      : selectedAnswers[idx] !== undefined
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Section */}
        {step === "result" && showResults && (
          <div className="w-full max-w-xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">
              Quiz Result
            </h2>

            <div className="mb-8 p-6 bg-indigo-50 rounded-xl">
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  <div
                    style={{
                      background: `conic-gradient(#4f46e5 ${
                        (calculateScore() / quizQuestions.length) * 100
                      }%, transparent 0)`,
                    }}
                    className="absolute inset-0 rounded-full"
                  ></div>
                  <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                    <p className="text-2xl font-bold text-indigo-800">
                      {calculateScore()}/{quizQuestions.length}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-lg font-medium text-indigo-800">
                {calculateScore() === quizQuestions.length
                  ? "Perfect Score! Excellent work! 🎉"
                  : calculateScore() >= quizQuestions.length * 0.7
                  ? "Great job! Well done! 👏"
                  : calculateScore() >= quizQuestions.length * 0.5
                  ? "Good effort! Keep practicing! 👍"
                  : "Keep learning and try again! 💪"}
              </p>
            </div>

            {/* Student Info */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <IconUser />
                <p className="truncate ml-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {studentInfo.name}
                </p>
              </div>
              <div className="flex items-center">
                <IconHash />
                <p className="truncate ml-2">
                  <span className="font-semibold">Roll No:</span>{" "}
                  {studentInfo.c_roll}
                </p>
              </div>
              <div className="flex items-center">
                <IconMail />
                <p className="truncate ml-2">
                  <span className="font-semibold">Email:</span>{" "}
                  {studentInfo.email}
                </p>
              </div>
              <div className="flex items-center">
                <IconBookOpen />
                <p className="truncate ml-2">
                  <span className="font-semibold">Course:</span>{" "}
                  {studentInfo.course_id}
                </p>
              </div>
              <div className="flex items-center">
                <IconFileText />
                <p className="truncate ml-2">
                  <span className="font-semibold">Paper Code:</span>{" "}
                  {studentInfo.paper_code}
                </p>
              </div>
              <div className="flex items-center">
                <IconCalendar />
                <p className="truncate ml-2">
                  <span className="font-semibold">Semester:</span>{" "}
                  {studentInfo.sem}
                </p>
              </div>
              <div className="flex items-center">
                <IconBookOpen />
                <p className="truncate ml-2">
                  <span className="font-semibold">Paper:</span>{" "}
                  {studentInfo.paper}
                </p>
              </div>
              <div className="flex items-center">
                <IconAward />
                <p className="truncate ml-2">
                  <span className="font-semibold">Exam:</span>{" "}
                  {quizData?.quiz_title || ""}
                </p>
              </div>
            </div>

            {/* Only Wrong Answers */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-800">
                {calculateScore() === quizQuestions.length
                  ? "All Answers Correct!"
                  : "Incorrect Answers:"}
              </h3>

              {quizQuestions.map((question, idx) => {
                const userAnswer = selectedAnswers[idx];
                if (userAnswer !== question.answer) {
                  return (
                    <div
                      key={idx}
                      className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                    >
                      <p className="font-semibold text-gray-800">
                        Q{idx + 1}: {question.question}
                      </p>
                      <p className="text-sm flex items-center text-red-600 mt-2">
                        <IconX />
                        <span className="ml-1">
                          Your Answer: {userAnswer || "Not Attempted"}
                        </span>
                      </p>
                      <p className="text-sm flex items-center text-green-600 mt-1">
                        <IconCheck />
                        <span className="ml-1">
                          Correct Answer: {question.answer}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              })}

              {/* If all correct */}
              {/* If all correct */}
              {Object.keys(selectedAnswers).length === quizQuestions.length &&
                calculateScore() === quizQuestions.length && (
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 text-center">
                    <p className="text-green-800">
                      Congratulations! You answered all questions correctly.
                    </p>
                  </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setStep("form");
                  setQuizID("");
                  setSelectedAnswers({});
                  setCurrentQuestion(0);
                  setShowResults(false);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
