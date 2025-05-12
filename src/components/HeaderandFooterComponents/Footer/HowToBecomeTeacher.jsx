import { useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  User,
  UserCheck,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowToBecomeTeacher = () => {
  const navigate = useNavigate();
  const handleApplyClick = () => {
    navigate("/check-status");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">
            Become a Teacher
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our passionate community of educators and make a difference in
            students' lives. Follow these simple steps to start your teaching
            journey with us.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Step 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="bg-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold">Check Eligibility</h3>
              </div>
              <CheckCircle className="text-white h-6 w-6" />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-3">
                Submit your basic information to check if you qualify.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <User className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Full Name</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Email Address</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Phone Number</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="bg-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold">
                  Complete Application
                </h3>
              </div>
              <FileText className="text-white h-6 w-6" />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-3">
                If eligible, fill out our comprehensive application form.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <UserCheck className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Qualifications</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Resume Upload</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Subject Expertise</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="bg-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold">Interview Process</h3>
              </div>
              <Calendar className="text-white h-6 w-6" />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-3">
                Shortlisted candidates will receive an interview call.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Initial Phone Screening</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <User className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>In-person Interview</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Demo Teaching</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
            <div className="bg-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <h3 className="text-white font-semibold">Onboarding</h3>
              </div>
              <CheckCircle className="text-white h-6 w-6" />
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-3">
                Congratulations! You are now a teacher with us.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Contract Signing</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <UserCheck className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Training Session</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  <span>Class Assignment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Application Progress
              </h3>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                Ready to Start
              </span>
            </div>
            <div className="overflow-hidden mb-4">
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleApplyClick}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                Go to Apply Page
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBecomeTeacher;
