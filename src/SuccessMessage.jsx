import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Mock icons since we can't import react-icons directly
const CheckCircleIcon = () => (
  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    className="w-full h-full"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m7 7 5-5 5 5"
    />
  </svg>
);

const SuccessMessage = () => {
  const { orderid } = useParams();
  const [animate, setAnimate] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    setAnimate(true);
    // Generate confetti particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setConfetti(particles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-purple-100 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-20 h-20 bg-green-100 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-28 h-28 bg-pink-100 rounded-full opacity-20 animate-bounce"></div>

        {/* Confetti */}
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-pink-400 transform rotate-45 animate-bounce"
            style={{
              left: `${particle.left}%`,
              top: "-10px",
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              transform: "rotate(45deg)",
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 max-w-2xl mx-auto text-center transform transition-all duration-1000 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Success Icon */}
        <div
          className={`relative mb-8 transform transition-all duration-1000 delay-300 ${
            animate ? "scale-100 rotate-0" : "scale-0 rotate-180"
          }`}
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-20 h-20 text-white animate-pulse">
              <CheckCircleIcon />
            </div>
          </div>
          {/* Ripple Effect */}
          <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
          <div
            className="absolute inset-0 w-40 h-40 mx-auto -m-4 border-2 border-green-300 rounded-full animate-ping opacity-10"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Main Card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-gray-100 transform transition-all duration-1000 delay-500 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Thank you for your purchase. Your payment has been processed
              successfully and your order is confirmed.
            </p>
          </div>

          {/* Order ID Section */}
          <div
            className={`mb-8 transform transition-all duration-1000 delay-700 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-blue-200">
              <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-2">
                Order ID
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 text-blue-500">
                  <ShoppingBagIcon />
                </div>
                <span className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wider">
                  #{orderid || "ORD123456"}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div
            className={`mb-8 transform transition-all duration-1000 delay-900 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Status</p>
                <p className="font-semibold text-green-600">Confirmed</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                <p className="font-semibold text-gray-800">Card Payment</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500 text-sm mb-1">Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div
        className="absolute top-1/4 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/3 right-12 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-16 w-5 h-5 bg-blue-400 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-1/3 right-8 w-3 h-3 bg-green-400 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default SuccessMessage;
