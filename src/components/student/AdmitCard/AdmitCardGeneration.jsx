import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Svg,
  Path,
} from "@react-pdf/renderer";
import axios from "axios";
import logo from "/images/Ecollgelogo.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerText: {
    flexGrow: 1,
  },
  collegeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
  },
  collegeAddress: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
  },
  documentTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 15,
    color: "#1e3a8a",
    textTransform: "uppercase",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  column: {
    flexDirection: "column",
    flexGrow: 1,
  },
  studentPhoto: {
    width: 120,
    height: 140,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginLeft: 20,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  label: {
    fontSize: 11,
    width: "30%",
    fontWeight: "bold",
    color: "#475569",
  },
  value: {
    fontSize: 11,
    width: "70%",
    color: "#0f172a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#bfdbfe",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#93c5fd",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableCol1: {
    width: "20%",
    fontSize: 10,
  },
  tableCol2: {
    width: "50%",
    fontSize: 10,
  },
  tableCol3: {
    width: "30%",
    fontSize: 10,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 20,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 10,
    marginBottom: 6,
    textAlign: "justify",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    width: "100%",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#64748b",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
});

// Logo component for React UI (outside of PDF)
const LogoForUI = () => (
  <svg
    className="h-8 w-8"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    //
  >
    <path d="M50 10L10 30L50 50L90 30L50 10Z" fill="#2563eb" />
    <path
      d="M25 35v25l25 15 25-15V35"
      stroke="#2563eb"
      strokeWidth="3"
      fill="none"
    />
    <path d="M90 30v25" stroke="#2563eb" strokeWidth="3" />
    <path d="M35 65h30v10H35z" fill="#1e40af" />
    <path d="M45 70h10M45 75h10M45 80h10" stroke="white" strokeWidth="2" />
  </svg>
);

// Create Document Component
const AdmitCardPDF = ({ studentData, coursesData }) => {
  if (!studentData) return null;

  // Create a mapping of paper codes to paper names from the coursesData
  const paperNamesMap = {};
  if (coursesData && coursesData.length > 0) {
    coursesData.forEach((course) => {
      paperNamesMap[course.paper_code] = course.paper_name;
    });
  }

  return (
    <Document>
      {/* Page 1: Student Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            {/* E-College Logo */}

            <Image src="https://res.cloudinary.com/dnwscgmcz/image/upload/v1746374739/students/profile_images/nncier1qfpwleftm2k2c.png" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.collegeName}>E-College</Text>
            <Text style={styles.collegeAddress}>
              123 Education Street, Learning City, West Bengal - 700001
            </Text>
          </View>
        </View>

        <Text style={styles.documentTitle}>Examination Admit Card</Text>

        <View style={styles.row}>
          <View style={styles.column}>
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Student Name:</Text>
              <Text style={styles.value}>{studentData.name}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>College Roll No.:</Text>
              <Text style={styles.value}>{studentData.c_roll}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Course:</Text>
              <Text style={styles.value}>
                MCA (Course Code: {studentData.course_code})
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Semester:</Text>
              <Text style={styles.value}>{studentData.sem}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{studentData.email}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Phone Number:</Text>
              <Text style={styles.value}>{studentData.phoneNumber}</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>
                {studentData.address?.trim()}, {studentData.city},{" "}
                {studentData.state}, {studentData.pincode}
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>
                {studentData.gender.charAt(0).toUpperCase() +
                  studentData.gender.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.studentPhoto}>
            {/* Student photo */}
            {studentData.pic && <Image src={studentData.pic} />}
            {!studentData.pic && (
              <Text
                style={{
                  fontSize: 8,
                  color: "#f44336",
                  textAlign: "center",
                  padding: 10,
                }}
              >
                No photo available
              </Text>
            )}
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableCol1}>Paper Code</Text>
          <Text style={styles.tableCol2}>Paper Name</Text>
          <Text style={styles.tableCol3}>Date & Time</Text>
        </View>

        {studentData.paper_code.map((code, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol1}>{code}</Text>
            <Text style={styles.tableCol2}>
              {paperNamesMap[code] || `Subject ${index + 1}`}
            </Text>
            <Text style={styles.tableCol3}>
              {`${new Date(
                2025,
                4,
                10 + index
              ).toLocaleDateString()} | 10:00 AM`}
            </Text>
          </View>
        ))}

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Student's Signature</Text>
          </View>

          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Controller of Examinations</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            E-College | This is a computer-generated document and does not
            require a physical signature.
          </Text>
        </View>
      </Page>

      {/* Page 2: Exam Instructions */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logo}>
            {/* E-College Logo */}

            <Image src="https://res.cloudinary.com/dnwscgmcz/image/upload/v1746374739/students/profile_images/nncier1qfpwleftm2k2c.png" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.collegeName}>E-College</Text>
            <Text style={styles.collegeAddress}>
              123 Education Street, Learning City, West Bengal - 700001
            </Text>
          </View>
        </View>

        <Text style={styles.documentTitle}>Examination Instructions</Text>

        <View>
          <Text style={styles.instructionTitle}>General Instructions:</Text>

          <Text style={styles.instruction}>
            1. Candidates must bring this Admit Card to the examination hall. No
            candidate will be allowed to enter the examination hall without a
            valid Admit Card.
          </Text>

          <Text style={styles.instruction}>
            2. Candidates should reach the examination center at least 30
            minutes before the commencement of the examination.
          </Text>

          <Text style={styles.instruction}>
            3. Candidates must bring their College ID Card along with this Admit
            Card for verification.
          </Text>

          <Text style={styles.instruction}>
            4. No electronic devices including mobile phones, smart watches,
            tablets, or any other communication devices are allowed in the
            examination hall.
          </Text>

          <Text style={styles.instruction}>
            5. Candidates are allowed to bring only permissible writing
            instruments and materials as specified for each examination.
          </Text>

          <Text style={styles.instruction}>
            6. Candidates must occupy only their allotted seats in the
            examination hall.
          </Text>

          <Text style={styles.instruction}>
            7. Candidates are not permitted to leave the examination hall during
            the first 30 minutes and the last 15 minutes of the examination.
          </Text>

          <Text style={styles.instruction}>
            8. Any form of unfair means or malpractice will lead to disciplinary
            action as per the college rules.
          </Text>

          <Text style={styles.instruction}>
            9. Candidates must submit their answer scripts to the invigilator
            before leaving the examination hall.
          </Text>

          <Text style={styles.instruction}>
            10. In case of any discrepancy in the admit card, please contact the
            Examination Cell immediately.
          </Text>

          <Text style={styles.instructionTitle}>
            COVID-19 Safety Guidelines:
          </Text>

          <Text style={styles.instruction}>
            1. Candidates must wear a face mask at all times inside the
            examination center.
          </Text>

          <Text style={styles.instruction}>
            2. Maintain proper social distancing at all times as per the seating
            arrangement.
          </Text>

          <Text style={styles.instruction}>
            3. Use hand sanitizers provided at the entrance and inside the
            examination hall.
          </Text>

          <Text style={styles.instruction}>
            4. Candidates with fever or symptoms of COVID-19 should report to
            the medical desk at the examination center.
          </Text>

          <Text style={styles.instructionTitle}>
            Important Contact Information:
          </Text>

          <Text style={styles.instruction}>
            • Examination Cell: 033-2345-6789 | examcell@ecollege.edu
          </Text>

          <Text style={styles.instruction}>
            • Controller of Examinations: 033-2345-6790 |
            controller@ecollege.edu
          </Text>

          <Text style={styles.instruction}>
            • Student Helpdesk: 033-2345-6791 | helpdesk@ecollege.edu
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            E-College | This is a computer-generated document and does not
            require a physical signature.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const AdmitCardGeneration = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isAdmit, setIsadmit] = useState(false);
  const [missingPhoto, setMissingPhoto] = useState(false);

  useEffect(() => {
    try {
      // Get student data from localStorage
      const userData = localStorage.getItem("user");

      if (userData) {
        // Parse the JSON data
        const parsedUserData = JSON.parse(userData);
        setIsadmit(parsedUserData.admit);
        setStudentData(parsedUserData);

        // Check if profile picture is missing
        if (!parsedUserData.pic) {
          setMissingPhoto(true);
        }
      } else {
        setError("No student data found in localStorage");
      }
    } catch (err) {
      setError(`Error loading student data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!studentData) return;

      try {
        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/paper-code/get-coursecode",
          {
            course_code: studentData.course_code,
            sem: studentData.sem,
          }
        );
        const allCourses = response.data;
        setCourses(allCourses.data.papers);
      } catch (err) {
        console.log("Error fetching course data:", err);
        setError("Failed to fetch course information. Please try again.");
      }
    };

    if (studentData) {
      fetchCourseData();
    }
  }, [studentData]);
  if (!isAdmit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">
            Admit Card Locked
          </h2>
          <p className="text-gray-700">
            The admit card is not available right now. Please check back later.
          </p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
            Error Loading Data
          </h2>
          <p className="text-gray-600 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-yellow-600 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
            No Student Data
          </h2>
          <p className="text-gray-600 text-center">
            Unable to find your student information. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  // Photo missing alert
  if (missingPhoto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
            Profile Photo Missing
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Your profile photo is not uploaded. Please upload your photo in the
            Edit Profile section before downloading your Admit Card.
          </p>
          <div className="flex flex-col space-y-3">
            <a
              href="/edit-profile"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-center transition duration-300"
            >
              Go to Edit Profile
            </a>
            <button
              onClick={() => setMissingPhoto(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    studentData.c_roll && (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center border-b-2 border-blue-600 pb-4 mb-6">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-full mr-4">
                <LogoForUI />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  E-College Admit Card Generator
                </h1>
                <p className="text-gray-600">
                  Generate and download your examination admit card
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Your admit card is ready for download. Please verify all
                    information before downloading.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Student Information
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{studentData.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Roll Number:</span>
                    <span className="font-medium">{studentData.c_roll}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">MCA</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Semester:</span>
                    <span className="font-medium">{studentData.sem}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm truncate">
                      {studentData.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-center items-center">
                {studentData.pic ? (
                  <img
                    src={studentData.pic}
                    alt="Student Photo"
                    className="w-32 h-36 object-cover border-2 border-gray-300 mb-4"
                  />
                ) : (
                  <div className="w-32 h-36 border-2 border-red-300 flex items-center justify-center bg-gray-100 mb-4">
                    <p className="text-red-500 text-sm text-center px-2">
                      No photo uploaded
                    </p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {studentData.pic ? "Student Photo" : "Photo not available"}
                </p>
                {!studentData.pic && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    Please upload your photo in Edit Profile
                  </p>
                )}
              </div>
            </div>

            {/* Display courses information */}
            {courses && courses.length > 0 && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Course Information
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-blue-100 text-blue-800">
                        <th className="py-2 px-4 text-left">Paper Code</th>
                        <th className="py-2 px-4 text-left">Paper Name</th>
                        <th className="py-2 px-4 text-left">
                          Exam Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, index) => (
                        <tr
                          key={course._id}
                          className="border-b border-gray-200"
                        >
                          <td className="py-2 px-4">{course.paper_code}</td>
                          <td className="py-2 px-4">{course.paper_name}</td>
                          <td className="py-2 px-4">
                            {`${new Date(
                              2025,
                              4,
                              10 + index
                            ).toLocaleDateString()} | 10:00 AM`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-8">
              {studentData.pic ===
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Warning:</strong> No profile photo detected.
                        Your admit card will be generated without a photo. For a
                        complete admit card, please upload your photo in the
                        Edit Profile section.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <PDFDownloadLink
                document={
                  <AdmitCardPDF
                    studentData={studentData}
                    coursesData={courses}
                  />
                }
                fileName={`admit-card-${studentData.name.replace(
                  /\s+/g,
                  "-"
                )}.pdf`}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <button
                      disabled
                      className="w-full bg-blue-400 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating PDF...
                    </button>
                  ) : (
                    //added
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      Download Admit Card
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Important Notes:
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  This admit card must be presented at the examination center
                  along with your College ID Card.
                </li>
                <li>
                  Please verify all your personal and course information before
                  downloading.
                </li>
                <li>
                  In case of any discrepancy, please contact the Examination
                  Cell immediately.
                </li>
                <li>
                  Remember to follow all COVID-19 safety protocols during the
                  examination.
                </li>
              </ul>

              <div className="mt-6 text-sm text-gray-500 bg-gray-100 p-4 rounded-lg">
                <p>
                  <strong>Contact Information:</strong> Examination Cell:
                  033-2345-6789 | examcell@ecollege.edu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AdmitCardGeneration;
