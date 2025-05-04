import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaIdBadge,
  FaGraduationCap,
  FaRupeeSign,
  FaDownload,
} from "react-icons/fa";
import { MdSubject } from "react-icons/md";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "1 solid #CCCCCC",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 10,
    color: "#666",
  },
  employeeDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 5,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  detailItem: {
    width: "50%",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  salaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#EFF6FF",
    padding: 5,
    borderRadius: 3,
  },
  salaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 5,
    borderBottom: "0.5 solid #EEEEEE",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    backgroundColor: "#EFF6FF",
    padding: 5,
    borderRadius: 3,
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
    paddingTop: 10,
    borderTop: "1 solid #CCCCCC",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#666",
  },
  footerRight: {
    textAlign: "right",
  },
  footerTitle: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 2,
  },
});

// PDF Document Component
const SalarySlipPDF = ({ userData, salaryComponents, currentDate }) => {
  const formatDate = (date) => {
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>E-College</Text>
          <Text style={styles.subtitle}>Salary Slip</Text>
          <View style={styles.dateRow}>
            <Text>Date: {formatDate(currentDate)}</Text>
            <Text>
              Month: {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </Text>
          </View>
        </View>

        {/* Employee Details */}
        <View style={styles.employeeDetails}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Employee Name</Text>
              <Text style={styles.detailValue}>{userData.name}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Employee ID</Text>
              <Text style={styles.detailValue}>{userData.c_roll}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{userData.email}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{userData.phoneNumber}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={styles.detailValue}>{userData.role}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Courses</Text>
              <Text style={styles.detailValue}>
                {userData.teacher_course?.join(", ") || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Salary Breakup */}
        <View>
          <Text style={styles.salaryTitle}>Salary Breakup</Text>

          <View style={styles.salaryRow}>
            <Text>Basic Pay (40%)</Text>
            <Text>Rs: {salaryComponents.basicPay}</Text>
          </View>

          <View style={styles.salaryRow}>
            <Text>Dearness Allowance (10%)</Text>
            <Text>Rs: {salaryComponents.da}</Text>
          </View>

          <View style={styles.salaryRow}>
            <Text>House Rent Allowance (20%)</Text>
            <Text>Rs: {salaryComponents.hra}</Text>
          </View>

          <View style={styles.salaryRow}>
            <Text>Conveyance Allowance (10%)</Text>
            <Text>Rs: {salaryComponents.conveyance}</Text>
          </View>

          <View style={styles.salaryRow}>
            <Text>Other Allowances (20%)</Text>
            <Text>Rs: {salaryComponents.otherAllowances}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Total Salary</Text>
            <Text>Rs: {salaryComponents.totalSalary}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              Generated on: {formatDate(currentDate)}
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerTitle}>E-College</Text>
            <Text style={styles.footerText}>
              This is a computer-generated document.
            </Text>
            <Text style={styles.footerText}>No signature required.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const SalarySlip = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate] = useState(new Date());
  const [isPdfReady, setIsPdfReady] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      // Small delay to ensure PDF rendering is ready
      const timer = setTimeout(() => {
        setIsPdfReady(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading salary details...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-md">
          <p className="text-lg font-semibold">Error loading user data</p>
          <p>Please make sure you are logged in.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate salary components
  const salaryComponents = {
    basicPay: userData.salary * 0.4,
    da: userData.salary * 0.1,
    hra: userData.salary * 0.2,
    conveyance: userData.salary * 0.1,
    otherAllowances: userData.salary * 0.2,
    totalSalary: userData.salary,
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Download Button */}
      <div className="flex justify-end mb-4">
        {isPdfReady ? (
          <PDFDownloadLink
            document={
              <SalarySlipPDF
                userData={userData}
                salaryComponents={salaryComponents}
                currentDate={currentDate}
              />
            }
            fileName={`salary-slip-${
              userData.name
            }-${currentDate.toLocaleString("default", {
              month: "long",
            })}-${currentDate.getFullYear()}.pdf`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Preparing PDF..."
              ) : (
                <>
                  <FaDownload /> Download PDF
                </>
              )
            }
          </PDFDownloadLink>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
            Preparing PDF...
          </button>
        )}
      </div>

      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          E-College
        </h1>
        <h2 className="text-xl font-semibold text-center mt-2">Salary Slip</h2>
        <div className="flex justify-between mt-4">
          <p className="text-gray-600">
            <FaCalendarAlt className="inline mr-2" />
            Date: {formatDate(currentDate)}
          </p>
          <p className="text-gray-600">
            <FaCalendarAlt className="inline mr-2" />
            Month:{" "}
            {currentDate.toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentDate.getFullYear()}
          </p>
        </div>
      </div>

      {/* Employee Details */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <FaUser className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Employee Name</p>
            <p className="font-medium">{userData.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaIdBadge className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Employee ID</p>
            <p className="font-medium">{userData.c_roll}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{userData.email}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaPhoneAlt className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium">{userData.phoneNumber}</p>
          </div>
        </div>
        <div className="flex items-center">
          <FaGraduationCap className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-medium capitalize">{userData.role}</p>
          </div>
        </div>
        <div className="flex items-center">
          <MdSubject className="text-blue-500 mr-3 text-xl" />
          <div>
            <p className="text-gray-500 text-sm">Courses</p>
            <p className="font-medium">
              {userData.teacher_course?.join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Salary Breakup */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 bg-blue-50 p-2 rounded">
          Salary Breakup
        </h3>
        <div className="border-b border-gray-200 pb-3">
          <div className="flex justify-between items-center py-2 hover:bg-gray-50">
            <div className="flex items-center">
              <FaRupeeSign className="text-blue-500 mr-2" />
              <span>Basic Pay (40%)</span>
            </div>
            <span className="font-medium">
              {formatCurrency(salaryComponents.basicPay)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 hover:bg-gray-50">
            <div className="flex items-center">
              <FaRupeeSign className="text-blue-500 mr-2" />
              <span>Dearness Allowance (10%)</span>
            </div>
            <span className="font-medium">
              {formatCurrency(salaryComponents.da)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 hover:bg-gray-50">
            <div className="flex items-center">
              <FaRupeeSign className="text-blue-500 mr-2" />
              <span>House Rent Allowance (20%)</span>
            </div>
            <span className="font-medium">
              {formatCurrency(salaryComponents.hra)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 hover:bg-gray-50">
            <div className="flex items-center">
              <FaRupeeSign className="text-blue-500 mr-2" />
              <span>Conveyance Allowance (10%)</span>
            </div>
            <span className="font-medium">
              {formatCurrency(salaryComponents.conveyance)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 hover:bg-gray-50">
            <div className="flex items-center">
              <FaRupeeSign className="text-blue-500 mr-2" />
              <span>Other Allowances (20%)</span>
            </div>
            <span className="font-medium">
              {formatCurrency(salaryComponents.otherAllowances)}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center py-3 font-bold text-lg bg-blue-50 mt-2 rounded px-2">
          <span>Total Salary</span>
          <span>{formatCurrency(salaryComponents.totalSalary)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-4 border-t-2 border-gray-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Generated on: {formatDate(currentDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">E-College</p>
            <p className="text-sm text-gray-500">
              This is a computer-generated document.
            </p>
            <p className="text-sm text-gray-500">No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;
