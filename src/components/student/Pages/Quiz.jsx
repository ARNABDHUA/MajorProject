import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiUser,
  FiHash,
  FiMail,
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiAward,
} from "react-icons/fi";

// Sample quiz questions with more dummy questions added
const quizQuestions = [
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Primary Unit",
      "Control Power Unit",
      "Central Power Unit",
    ],
    answer: "Central Processing Unit",
  },
  {
    question: "Which one is a programming language?",
    options: ["HTML", "CSS", "Python", "SQL"],
    answer: "Python",
  },
  {
    question: "What is the primary function of an operating system?",
    options: [
      "Run applications",
      "Manage hardware resources",
      "Provide internet access",
      "Store data permanently",
    ],
    answer: "Manage hardware resources",
  },
  {
    question: "Which of the following is not a JavaScript framework?",
    options: ["React", "Angular", "Django", "Vue"],
    answer: "Django",
  },
  {
    question: "What does HTTP stand for?",
    options: [
      "Hyper Text Transfer Protocol",
      "Hyper Transfer Text Protocol",
      "High Tech Transfer Protocol",
      "Hyperlink Text Transfer Protocol",
    ],
    answer: "Hyper Text Transfer Protocol",
  },
  {
    question: "Which data structure operates on a LIFO principle?",
    options: ["Queue", "Stack", "Linked List", "Array"],
    answer: "Stack",
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    answer: "O(log n)",
  },
];

const Quiz = () => {
  const [step, setStep] = useState("form"); // form | quiz | result
  const [studentInfo, setStudentInfo] = useState({
    quiz_id: "QUIZ001", // Static quiz ID for now
    name: "John Doe",
    c_roll: "CSE2023001",
    email: "john.doe@example.com",
    course_id: "CS101",
    paper_code: "CSE1001",
    sem: "3",
    paper: "Computer Fundamentals",
    exam_number: "MID2025",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState([]);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    try {
      const udata = JSON.parse(localStorage.getItem("user") || "[]");
      console.log("Quiz", udata);
      setUserData(udata);
    } catch (err) {
      console.error("Error parsing user data", err);
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
      }
    }

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, currentQuestion, step]);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { quiz_id } = studentInfo;

    if (quiz_id) {
      setStep("quiz");
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

  const q = quizQuestions[currentQuestion];
  const score = calculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Form Section */}
      {step === "form" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10"
        >
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">
            Start Your Quiz
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="w-full p-2 border rounded bg-gray-50">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Quiz ID
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={studentInfo.quiz_id}
                disabled
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg w-full font-medium shadow-md"
            >
              Start Quiz
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Quiz Section */}
      {step === "quiz" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-800">
              Question {currentQuestion + 1} / {quizQuestions.length}
            </h2>

            <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
              <FiClock className="text-indigo-600 mr-2" />
              <span
                className={`font-mono font-medium ${
                  timeLeft < 10 ? "text-red-600" : "text-indigo-800"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <p className="mb-2 text-md text-gray-600 italic">
            Quiz ID: {studentInfo.quiz_id}
          </p>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            key={currentQuestion}
            className="mb-6"
          >
            <p className="text-lg font-medium mb-4 p-3 bg-indigo-50 rounded-lg">
              {q.question}
            </p>

            <div className="space-y-3 mb-6">
              {q.options.map((opt) => (
                <motion.button
                  key={opt}
                  onClick={() => handleOptionClick(opt)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${
                    selectedAnswers[currentQuestion] === opt
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-800 border-gray-300 hover:bg-indigo-50"
                  } transition-colors duration-200`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-between">
            <motion.button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center"
            >
              <FiChevronLeft className="mr-1" /> Previous
            </motion.button>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
            >
              {currentQuestion === quizQuestions.length - 1 ? "Submit" : "Next"}{" "}
              <FiChevronRight className="ml-1" />
            </motion.button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {quizQuestions.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
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
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Result Section */}
      {step === "result" && showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">
            Quiz Result
          </h2>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mb-8 p-6 bg-indigo-50 rounded-xl"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1 }}
                className="relative w-32 h-32 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: score / quizQuestions.length }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    background: `conic-gradient(#4f46e5 ${
                      (score / quizQuestions.length) * 100
                    }%, transparent 0)`,
                  }}
                  className="absolute inset-0 rounded-full"
                ></motion.div>
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                  <p className="text-2xl font-bold text-indigo-800">
                    {score}/{quizQuestions.length}
                  </p>
                </div>
              </motion.div>
            </div>

            <p className="text-center text-lg font-medium text-indigo-800">
              {score === quizQuestions.length
                ? "Perfect Score! Excellent work! 🎉"
                : score >= quizQuestions.length * 0.7
                ? "Great job! Well done! 👏"
                : score >= quizQuestions.length * 0.5
                ? "Good effort! Keep practicing! 👍"
                : "Keep learning and try again! 💪"}
            </p>
          </motion.div>

          {/* Student Info */}
          <div className="mb-6 grid grid-cols-2 gap-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiUser className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Name:</span> {studentInfo.name}
              </p>
            </div>
            <div className="flex items-center">
              <FiHash className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Roll No:</span>{" "}
                {studentInfo.c_roll}
              </p>
            </div>
            <div className="flex items-center">
              <FiMail className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {studentInfo.email}
              </p>
            </div>
            <div className="flex items-center">
              <FiBookOpen className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Course:</span>{" "}
                {studentInfo.course_id}
              </p>
            </div>
            <div className="flex items-center">
              <FiFileText className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Paper Code:</span>{" "}
                {studentInfo.paper_code}
              </p>
            </div>
            <div className="flex items-center">
              <FiCalendar className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Semester:</span>{" "}
                {studentInfo.sem}
              </p>
            </div>
            <div className="flex items-center">
              <FiBookOpen className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Paper:</span>{" "}
                {studentInfo.paper}
              </p>
            </div>
            <div className="flex items-center">
              <FiAward className="mr-2 text-indigo-600" />
              <p>
                <span className="font-semibold">Exam:</span>{" "}
                {studentInfo.exam_number}
              </p>
            </div>
          </div>

          {/* Only Wrong Answers */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">
              {score === quizQuestions.length
                ? "All Answers Correct!"
                : "Incorrect Answers:"}
            </h3>

            {quizQuestions.map((question, idx) => {
              const userAnswer = selectedAnswers[idx];
              if (userAnswer !== question.answer) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="mb-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
                  >
                    <p className="font-semibold text-gray-800">
                      Q{idx + 1}: {question.question}
                    </p>
                    <p className="text-sm flex items-center text-red-600 mt-2">
                      <FiX className="mr-1" /> Your Answer:{" "}
                      {userAnswer || "Not Attempted"}
                    </p>
                    <p className="text-sm flex items-center text-green-600 mt-1">
                      <FiCheck className="mr-1" /> Correct Answer:{" "}
                      {question.answer}
                    </p>
                  </motion.div>
                );
              }
              return null;
            })}

            {/* If all correct */}
            {Object.keys(selectedAnswers).length === quizQuestions.length &&
              score === quizQuestions.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-green-100 rounded-lg text-center mt-4 text-green-700 font-semibold border border-green-300"
                >
                  <FiCheck className="inline-block mr-2 text-2xl" />
                  Congratulations! 🎉 You got all questions correct!
                </motion.div>
              )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setStep("form");
              setCurrentQuestion(0);
              setSelectedAnswers({});
              setShowResults(false);
            }}
            className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
          >
            Start New Quiz
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
