import { useState, useEffect } from "react";
import {
  ShieldAlert,
  LockKeyhole,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  Database,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedAccessPage() {
  const [glitch, setGlitch] = useState(false);
  const [scanLines, setScanLines] = useState(true);
  const [codeLines, setCodeLines] = useState([]);
  const [warningOpacity, setWarningOpacity] = useState(0);
  const [lockState, setLockState] = useState(0);

  // Simulate server error codes
  useEffect(() => {
    const errorCodes = [
      "ERR_AUTH_401_UNAUTHORIZED",
      "ERR_ACCESS_DENIED",
      "ERR_SECURITY_BREACH_DETECTED",
      "ERR_CLEARANCE_REQUIRED",
      "ERR_BIOMETRIC_VALIDATION_FAILED",
      "ERR_ADMIN_PRIVILEGES_REQUIRED",
      "ERR_SYSTEM_LOCKDOWN_ACTIVE",
      "ERR_SECURITY_PROTOCOL_7592_ENGAGED",
    ];

    // Generate random code lines
    const newLines = [];
    for (let i = 0; i < 8; i++) {
      newLines.push({
        id: i,
        text: errorCodes[Math.floor(Math.random() * errorCodes.length)],
        delay: Math.random() * 0.5,
      });
    }
    setCodeLines(newLines);

    // Animation sequence
    const timer1 = setTimeout(() => setWarningOpacity(1), 800);
    const timer2 = setTimeout(() => setGlitch(true), 1500);
    const timer3 = setTimeout(() => setGlitch(false), 2000);
    const timer4 = setTimeout(() => setLockState(1), 2500);
    const timer5 = setTimeout(() => setLockState(2), 3000);

    // Lock state animation loop
    const interval = setInterval(() => {
      setLockState((prev) => (prev === 2 ? 1 : 2));
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-black text-red-500 overflow-hidden font-mono">
      {/* Background grid */}
      <div
        className="absolute inset-0 bg-grid opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, .3) 25%, rgba(255, 0, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .3) 75%, rgba(255, 0, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, .3) 25%, rgba(255, 0, 0, .3) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .3) 75%, rgba(255, 0, 0, .3) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scan lines overlay */}
      {scanLines && (
        <div
          className="absolute inset-0 bg-scan-lines pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      )}

      {/* Main content */}
      <div
        className={`relative w-full max-w-3xl mx-auto px-8 py-12 border-2 border-red-500 bg-black bg-opacity-80 z-10 ${
          glitch ? "animate-glitch" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-red-800 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-red-500">SYSTEM SECURITY</h1>
          </div>
          <div className="flex items-center space-x-4">
            <WifiOff className="w-6 h-6 text-red-500 animate-pulse" />
            <Database className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Warning message */}
        <div
          className="relative flex flex-col items-center text-center mb-8"
          style={{
            opacity: warningOpacity,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <div className="absolute -top-12 left-0 right-0 flex justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-red-500 flex items-center justify-center animate-pulse">
              <LockKeyhole
                className={`w-12 h-12 transition-all duration-300 ${
                  lockState === 0 ? "text-gray-500" : "text-red-500"
                }`}
              />
            </div>
          </div>

          <AlertTriangle
            className={`w-16 h-16 mb-4 ${glitch ? "animate-ping" : ""}`}
          />
          <h2 className="text-3xl font-bold mb-2 text-red-500">
            UNAUTHORIZED ACCESS
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <XCircle className="w-6 h-6" />
            <p className="text-xl uppercase tracking-widest">Access Denied</p>
            <XCircle className="w-6 h-6" />
          </div>

          <p className="max-w-lg text-red-300 mb-6">
            This administrative area requires elevated permissions. Your
            credentials have been logged and security has been notified.
          </p>

          <div className="w-full max-w-md border border-red-800 bg-red-900 bg-opacity-20 p-4 rounded mb-8">
            <div className="text-xs text-left font-mono text-red-400">
              <p>• Security protocol engaged</p>
              <p>• Biometric verification required</p>
              <p>• IP address logged: 192.168.0.XXX</p>
              <p>• Access attempt recorded: {new Date().toISOString()}</p>
            </div>
          </div>
        </div>

        {/* Error code display */}
        <div className="mb-8 overflow-hidden h-32 border border-red-800 bg-black p-4 text-xs">
          {codeLines.map((line) => (
            <div
              key={line.id}
              className="text-red-400"
              style={{
                animation: "fadeIn 0.5s ease-in-out forwards",
                animationDelay: `${line.delay}s`,
                opacity: 0,
              }}
            >
              &gt; {line.text}
            </div>
          ))}
        </div>

        {/* Return button */}
        <div className="flex justify-center">
          <button className="flex items-center space-x-2 bg-red-900 hover:bg-red-800 text-white px-6 py-3 rounded transition-all duration-300 border border-red-500">
            <ChevronLeft className="w-5 h-5" />

            <Link to="/">Return to Safe Zone</Link>
          </button>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-5px, 5px);
          }
          40% {
            transform: translate(-5px, -5px);
          }
          60% {
            transform: translate(5px, 5px);
          }
          80% {
            transform: translate(5px, -5px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-glitch {
          animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
    </div>
  );
}
