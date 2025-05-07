import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from "@react-pdf/renderer";

// Create styles with consistent and improved layout
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 0,
  },
  idCard: {
    width: "100%",
    height: "100%",
    border: "2pt solid #2563eb",
    borderRadius: "5pt",
    overflow: "hidden",
    position: "relative",
  },
  header: {
    backgroundColor: "#2563eb",
    padding: "8pt",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: "20pt",
    height: "20pt",
    marginRight: "5pt",
  },
  collegeName: {
    color: "white",
    fontSize: "14pt",
    fontWeight: "bold",
  },
  idTitle: {
    backgroundColor: "#bfdbfe",
    padding: "5pt",
    fontSize: "10pt",
    textAlign: "center",
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    padding: "10pt",
  },
  photo: {
    width: "30mm",
    height: "35mm",
    border: "1pt solid #e2e8f0",
    marginRight: "10pt",
  },
  details: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: "5pt",
  },
  label: {
    fontSize: "9pt",
    fontWeight: "bold",
    width: "45pt",
    color: "#475569",
  },
  value: {
    fontSize: "9pt",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2563eb",
    padding: "5pt",
    fontSize: "7pt",
    color: "white",
    textAlign: "center",
  },
  idNumber: {
    fontSize: "9pt",
    color: "white",
    fontWeight: "bold",
  },
  validThrough: {
    fontSize: "8pt",
    textAlign: "center",
    marginTop: "5pt",
    color: "#475569",
    fontWeight: "bold",
  },
  signature: {
    width: "30mm",
    height: "12mm",
    marginTop: "5pt",
    marginLeft: "auto",
    marginRight: "auto",
    borderTop: "0.5pt solid black",
    textAlign: "center",
    fontSize: "7pt",
    paddingTop: "3pt",
  },
  backgroundWatermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    opacity: 0.05,
    fontSize: "36pt",
    color: "#2563eb",
    fontWeight: "bold",
  },
  backPage: {
    width: "100%",
    height: "100%",
    border: "2pt solid #2563eb",
    borderRadius: "5pt",
    padding: "12pt",
    display: "flex",
    flexDirection: "column",
  },
  backTitle: {
    fontSize: "11pt",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "8pt",
    color: "#2563eb",
    borderBottom: "1pt solid #2563eb",
    paddingBottom: "4pt",
  },
  instruction: {
    fontSize: "8pt",
    marginBottom: "5pt",
    lineHeight: 1.4,
  },
  contactInfo: {
    fontSize: "8pt",
    marginTop: "8pt",
    textAlign: "center",
    fontWeight: "bold",
  },
  addressBlock: {
    fontSize: "8pt",
    marginTop: "5pt",
    textAlign: "center",
    borderTop: "0.5pt solid #e2e8f0",
    paddingTop: "5pt",
  },
  emergencyContact: {
    fontSize: "8pt",
    marginTop: "8pt",
    padding: "6pt",
    backgroundColor: "#f8fafc",
    borderRadius: "3pt",
  },
  emergencyTitle: {
    fontSize: "8pt",
    fontWeight: "bold",
    marginBottom: "3pt",
    marginTop: "3pt",
    padding: "3pt",
  },
});

// Student ID Card Component
const StudentIDCardPDF = ({ studentData }) => {
  // Calculate valid through date (2 years from current date)
  const validThrough = new Date();
  validThrough.setFullYear(validThrough.getFullYear() + 2);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(validThrough);

  if (!studentData) return null;

  return (
    <Document>
      {/* Front of ID Card - Using standard credit card size ratio but larger */}
      <Page size={[440, 210]} style={styles.page}>
        <View style={styles.idCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.collegeName}>E-College</Text>
            </View>
            <Text style={styles.idNumber}>ID: {studentData.c_roll}</Text>
          </View>

          {/* ID Title */}
          <View style={styles.idTitle}>
            <Text>STUDENT IDENTITY CARD</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Photo */}
            <Image src={studentData.pic} style={styles.photo} />

            {/* Details */}
            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{studentData.name}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Roll No:</Text>
                <Text style={styles.value}>{studentData.c_roll}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Course:</Text>
                <Text style={styles.value}>
                  MCA (Code: {studentData.course_code})
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Sem:</Text>
                <Text style={styles.value}>{studentData.sem}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{studentData.email}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{studentData.phoneNumber}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>
                  {studentData.address.trim()}, {studentData.pincode}
                </Text>
              </View>
            </View>
          </View>

          {/* Valid Through */}
          <Text style={styles.validThrough}>
            Valid Through: {formattedDate}
          </Text>

          {/* Signature */}
          <View style={styles.signature}>
            <Text>Principal's Signature</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>
              E-College • 123 Education Street, Learning City, West Bengal -
              700001
            </Text>
          </View>

          {/* Background Watermark */}
          <Text style={styles.backgroundWatermark}>E-College</Text>
        </View>
      </Page>

      {/* Back of ID Card - same size as front */}
      <Page size={[440, 210]} style={styles.page}>
        <View style={styles.backPage}>
          <Text style={styles.backTitle}>TERMS & CONDITIONS</Text>

          <Text style={styles.instruction}>
            1. This card is the property of E-College and must be carried at all
            times while on campus.
          </Text>
          <Text style={styles.instruction}>
            2. This card is non-transferable and cannot be used by anyone other
            than the cardholder.
          </Text>
          <Text style={styles.instruction}>
            3. Loss of this card should be reported immediately to the college
            administration.
          </Text>
          <Text style={styles.instruction}>
            4. A fee will be charged for replacement of lost or damaged cards.
          </Text>
          <Text style={styles.instruction}>
            5. This card must be surrendered upon request by any college
            official or upon termination of enrollment.
          </Text>
          <Text style={styles.instruction}>
            6. The card must be shown for accessing college facilities, library,
            and examinations.
          </Text>

          <View style={styles.emergencyContact}>
            <Text style={styles.emergencyTitle}>EMERGENCY CONTACT</Text>
            <Text style={styles.instruction}>
              Student Affairs Office: 033-2345-6700
            </Text>
            <Text style={styles.instruction}>
              Security Office: 033-2345-6701
            </Text>
          </View>

          <Text style={styles.contactInfo}>If found, please return to:</Text>

          <Text style={styles.addressBlock}>
            E-College • 123 Education Street, Learning City, West Bengal -
            700001
            {"\n"}
            Phone: 033-2345-6789 • Email: info@ecollege.edu
            {"\n"}
            www.ecollege.edu
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Main component remains mostly the same, but with improved preview
const StudentIdentityCard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Get student data from localStorage
      const userData = localStorage.getItem("user");

      if (userData) {
        // Parse the JSON data
        const parsedUserData = JSON.parse(userData);
        setStudentData(parsedUserData);
      } else {
        setError("No student data found in localStorage");
      }
    } catch (err) {
      setError(`Error loading student data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    studentData.c_roll && (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-lg mx-auto">
            <div className="flex items-center border-b-2 border-blue-600 pb-4 mb-6">
              <div className="bg-blue-100 text-blue-800 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Student ID Card
                </h1>
                <p className="text-gray-600 text-sm">
                  E-College Official Identity Card
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
                    Your ID card is ready for download. The card contains your
                    official student information on both front and back sides.
                  </p>
                </div>
              </div>
            </div>

            {/* Improved Card Preview - Better aspect ratio and sizing */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="text-center text-gray-700 mb-3 font-medium">
                Card Preview
              </h3>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                {/* Front side preview - increased size with correct aspect ratio */}
                <div className="relative w-72 h-44 bg-white rounded-lg shadow-md border-2 border-blue-600 overflow-hidden flex flex-col">
                  <div className="bg-blue-600 text-white p-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl mr-1">🎓</span>
                      <span className="font-bold">E-College</span>
                    </div>
                    <span className="text-xs">ID: {studentData.c_roll}</span>
                  </div>
                  <div className="bg-blue-100 py-1 text-center text-xs font-bold">
                    STUDENT IDENTITY CARD
                  </div>
                  <div className="flex p-2">
                    <div className="w-20 h-24 bg-gray-200 mr-2 flex items-center justify-center">
                      <img
                        src={studentData.pic}
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="mb-1">
                        <strong>Name:</strong> {studentData.name}
                      </p>
                      <p className="mb-1">
                        <strong>ID:</strong> {studentData.c_roll}
                      </p>
                      <p className="mb-1">
                        <strong>Course:</strong> MCA
                      </p>
                      <p className="mb-1">
                        <strong>Sem:</strong> {studentData.sem}
                      </p>
                      <p className="mb-1">
                        <strong>Email:</strong> {studentData.email}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong> {studentData.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-center text-xs mt-1">
                    <strong>Valid Through:</strong> May 4, 2027
                  </div>
                  <div className="mt-auto bg-blue-600 text-white text-center text-xs p-1">
                    E-College • West Bengal
                  </div>
                </div>

                {/* Back side preview - same aspect ratio as front */}
                <div className="relative w-72 h-44 bg-white rounded-lg shadow-md border-2 border-blue-600 overflow-hidden flex flex-col p-3">
                  <div className="text-center text-xs font-bold text-blue-600 border-b border-blue-200 pb-1 mb-2">
                    TERMS & CONDITIONS
                  </div>
                  <div className="text-[9px] space-y-1 flex-1">
                    <p>1. This card is the property of E-College...</p>
                    <p>2. This card is non-transferable...</p>
                    <p>3. Loss of this card should be reported...</p>
                    <p>4. A fee will be charged for replacement...</p>
                    <p>5. This card must be surrendered...</p>
                  </div>
                  <div className="bg-blue-50 text-[9px] p-1 mt-2 rounded">
                    <p className="font-bold">EMERGENCY CONTACT</p>
                    <p>Student Affairs: 033-2345-6700</p>
                  </div>
                  <div className="mt-auto text-center text-[9px]">
                    <p className="font-bold">If found, please return to:</p>
                    <p>E-College • 123 Education Street, Learning City</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <PDFDownloadLink
                document={<StudentIDCardPDF studentData={studentData} />}
                fileName={`id-card-${studentData.name.replace(
                  /\s+/g,
                  "-"
                )}.pdf`}
                className="block w-full"
              >
                {({ blob, url, loading, error }) => (
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
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
                        Generating ID Card...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download ID Card (PDF)
                      </span>
                    )}
                  </button>
                )}
              </PDFDownloadLink>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              This ID card contains two pages: front side with your details and
              back side with terms & conditions. Standard ID card size format
              for better printing.
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default StudentIdentityCard;
