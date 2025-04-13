import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
} from "lucide-react";

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        console.log("userdata", userData);
        const token = localStorage.getItem("token");

        if (!userData || !token) {
          throw new Error("Authentication data not found");
        }

        // Verify if it's a student account
        if (userData.role !== "student") {
          throw new Error("Not a student account");
        }

        // Try to fetch additional student data from API
        try {
          // Fixed axios request - properly structure headers and use GET method

          // Combine stored user data with any additional data from API
          setProfileData({
            ...userData,
          });
        } catch (apiError) {
          console.warn("API request failed, using local data only:", apiError);
          // Continue with just the userData if API call fails
          setProfileData(userData);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-3xl">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-center p-4">No profile data available</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with background */}
        <div className="bg-blue-600 h-32 relative"></div>

        {/* Profile picture section */}
        <div className="relative px-6">
          <div className="absolute -top-16 flex justify-center items-center">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
              <img
                src={
                  profileData.pic ||
                  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                }
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile information */}
        <div className="pt-20 px-6 pb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {profileData.name}
          </h1>
          <div className="flex items-center mt-1">
            <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-gray-600">
              Student ID: {profileData.c_roll}
            </span>
          </div>

          {profileData.e_roll && (
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-600">
                Exam Roll: {profileData.e_roll}
              </span>
            </div>
          )}

          {profileData.course_code && (
            <div className="flex items-center mt-1">
              <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-600">
                Course Code: {profileData.course_code}
              </span>
            </div>
          )}

          <div className="flex items-center mt-1">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-gray-600">
              Payment Status: {profileData.payment ? "Paid" : "Pending"}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Personal Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800">{profileData.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-gray-800">
                      {profileData.gender
                        ? profileData.gender.charAt(0).toUpperCase() +
                          profileData.gender.slice(1)
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800">{profileData.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Address
              </h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Street Address</p>
                    <p className="text-gray-800">{profileData.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-800">{profileData.city}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-gray-800">{profileData.state}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Pincode</p>
                    <p className="text-gray-800">{profileData.pincode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
