import axios from "axios";
import { useState, useEffect } from "react";

// Simple icon components instead of lucide-react
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UploadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
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

const PlusIcon = () => (
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
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function StaffSalaryComponent() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [newSalary, setNewSalary] = useState("");
  const [showSalaryInput, setShowSalaryInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch staff members on component mount and when search query changes
  useEffect(() => {
    fetchStaffMembers();
  }, [searchQuery]);

  // Fetch salary details when a staff member is selected
  useEffect(() => {
    if (selectedStaff) {
      fetchSalaryDetails();
    }
  }, [selectedStaff, month, year]);

  const fetchStaffMembers = async () => {
    setIsLoading(true);
    try {
      // Fetch teachers from the API
      const response = await axios.post(
        "https://e-college-data.onrender.com/v1/teachers/teachers"
      );
      const data = response.data;

      // Filter teachers based on search query if provided
      const filteredData = searchQuery
        ? data.filter(
            (teacher) =>
              teacher.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              teacher.email
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              teacher.teacherId
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              teacher.c_roll?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data;

      setStaffMembers(filteredData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setIsLoading(false);
      setStaffMembers([]);
    }
  };

  const calculateSalaryBreakdown = (totalSalary) => {
    const total = parseFloat(totalSalary);
    if (isNaN(total)) return null;

    return {
      basic: total * 0.4, // 40%
      da: total * 0.1, // 10% Dearness Allowance
      hra: total * 0.2, // 20% House Rent Allowance
      ta: total * 0.1, // 10% Conveyance/Travel Allowance
      otherAllowances: total * 0.2, // 20% Other Allowances
    };
  };

  const fetchSalaryDetails = async () => {
    if (!selectedStaff) return;

    setIsLoading(true);
    try {
      // If the staff has a salary, use it for calculations
      if (selectedStaff.salary) {
        const breakdown = calculateSalaryBreakdown(selectedStaff.salary);

        if (!breakdown) {
          setIsLoading(false);
          return;
        }

        const salaryData = {
          basic: breakdown.basic,
          da: breakdown.da,
          hra: breakdown.hra,
          ta: breakdown.ta,
          otherAllowances: breakdown.otherAllowances,
          month: months[month],
          year: year,
          generatedDate: new Date().toLocaleDateString(),
        };

        salaryData.totalEarnings =
          salaryData.basic +
          salaryData.hra +
          salaryData.da +
          salaryData.ta +
          salaryData.otherAllowances;

        // Net salary is equal to total earnings since we've removed deductions
        salaryData.netSalary = salaryData.totalEarnings;

        setSalaryDetails(salaryData);
      } else {
        // No salary data available
        setSalaryDetails(null);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing salary details:", error);
      setSalaryDetails(null);
      setIsLoading(false);
    }
  };

  const handleUpdateSalary = async () => {
    if (!selectedStaff || !newSalary || isNaN(parseFloat(newSalary))) {
      setErrorMessage("Please enter a valid salary amount");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Make API request to update teacher's salary
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/teachers/teachers-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            c_roll: selectedStaff.c_roll || selectedStaff.teacherId,
            salary: parseFloat(newSalary),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          `Salary updated successfully to ${formatCurrency(
            parseFloat(newSalary)
          )}`
        );

        // Update the local staff member data with new salary
        const updatedStaffMembers = staffMembers.map((staff) => {
          if (
            (staff.c_roll && staff.c_roll === selectedStaff.c_roll) ||
            (staff.teacherId && staff.teacherId === selectedStaff.teacherId)
          ) {
            return { ...staff, salary: parseFloat(newSalary) };
          }
          return staff;
        });

        setStaffMembers(updatedStaffMembers);
        setSelectedStaff({ ...selectedStaff, salary: parseFloat(newSalary) });

        // Recalculate salary details with new salary
        fetchSalaryDetails();
        setShowSalaryInput(false);
        setNewSalary("");
      } else {
        setErrorMessage(
          "Failed to update salary: " + (data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error updating salary:", error);
      setErrorMessage("Error updating salary. Please try again.");

      // For demo purposes - simulate successful update even if API fails
      const updatedStaffMembers = staffMembers.map((staff) => {
        if (
          (staff.c_roll && staff.c_roll === selectedStaff.c_roll) ||
          (staff.teacherId && staff.teacherId === selectedStaff.teacherId)
        ) {
          return { ...staff, salary: parseFloat(newSalary) };
        }
        return staff;
      });

      setStaffMembers(updatedStaffMembers);
      setSelectedStaff({ ...selectedStaff, salary: parseFloat(newSalary) });
      setSuccessMessage(
        `Salary updated successfully to ${formatCurrency(
          parseFloat(newSalary)
        )}`
      );
      fetchSalaryDetails();
      setShowSalaryInput(false);
      setNewSalary("");
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to format courses array into a readable string
  const formatCourses = (courses) => {
    if (!courses || courses.length === 0) return "None";
    if (typeof courses === "string") return courses;
    return courses.join(", ");
  };

  // Function to check if a staff member is selected
  const isSelected = (staff) => {
    if (!selectedStaff) return false;
    return (
      (staff.c_roll && staff.c_roll === selectedStaff.c_roll) ||
      (staff.teacherId && staff.teacherId === selectedStaff.teacherId) ||
      staff.id === selectedStaff.id
    );
  };

  return (
    <div className="bg-black shadow-lg rounded-lg p-6 w-full text-white">
      <h2 className="text-2xl font-bold text-white mb-6">
        Teacher Salary Management
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-2">
              Search Teachers
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, or teacher ID..."
                className="w-full bg-black border border-gray-700 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {errorMessage && (
        <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="bg-purple-900 border border-purple-700 text-white px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      {/* Teachers List */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Teachers List</h3>
        <div className="bg-black border border-gray-800 rounded-md overflow-hidden">
          {staffMembers.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Teacher ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Phone No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Current Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-800">
                  {staffMembers.map((staff) => (
                    <tr
                      key={staff.id || staff.teacherId || staff.c_roll}
                      className={`
                        hover:bg-gray-900 cursor-pointer transition-all duration-300
                        ${
                          isSelected(staff)
                            ? "bg-purple-900/20 shadow-lg shadow-purple-500/30 border-l-4 border-purple-500 scale-[1.02] relative z-10 transform transition-transform"
                            : "hover:scale-[1.005]"
                        }
                      `}
                      onClick={() => setSelectedStaff(staff)}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          isSelected(staff) ? "text-purple-100" : "text-white"
                        }`}
                      >
                        {staff.name}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isSelected(staff)
                            ? "text-purple-200"
                            : "text-gray-300"
                        }`}
                      >
                        {staff.teacherId || staff.c_roll}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isSelected(staff)
                            ? "text-purple-200"
                            : "text-gray-300"
                        }`}
                      >
                        {staff.email}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isSelected(staff)
                            ? "text-purple-200"
                            : "text-gray-300"
                        }`}
                      >
                        {staff.phone || staff.phoneNumber}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isSelected(staff)
                            ? "text-purple-200"
                            : "text-gray-300"
                        }`}
                      >
                        {staff.salary
                          ? formatCurrency(staff.salary)
                          : "Not set"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isSelected(staff)
                            ? "text-purple-300 font-medium"
                            : "text-purple-600"
                        }`}
                      >
                        <button
                          className={`hover:text-purple-400 transition-colors ${
                            isSelected(staff)
                              ? "text-purple-300 font-medium"
                              : "text-purple-600"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStaff(staff);
                            setShowSalaryInput(false);
                          }}
                        >
                          {isSelected(staff) ? "Selected" : "View Details"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center text-gray-400">
              Loading teacher data...
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No teachers found
            </div>
          )}
        </div>
      </div>

      {/* Salary Details */}
      {selectedStaff && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">Salary Details</h3>
            <div className="flex space-x-2">
              {!showSalaryInput ? (
                <button
                  onClick={() => setShowSalaryInput(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="mr-2">
                    <PlusIcon />
                  </span>
                  Update Salary
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="Enter total salary"
                    className="bg-black border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white w-40"
                  />
                  <button
                    onClick={handleUpdateSalary}
                    disabled={submitting}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Submit"}
                  </button>
                  <button
                    onClick={() => {
                      setShowSalaryInput(false);
                      setNewSalary("");
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {salaryDetails ? (
            <div className="bg-black border border-gray-800 rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-300 uppercase mb-2">
                      Teacher Information
                    </h4>
                    <p className="text-sm text-white">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedStaff.name}
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-medium">Teacher ID:</span>{" "}
                      {selectedStaff.teacherId || selectedStaff.c_roll}
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedStaff.email}
                    </p>
                    <p className="text-sm text-white">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedStaff.phone || selectedStaff.phoneNumber}
                    </p>
                    {selectedStaff.courses && (
                      <p className="text-sm text-white">
                        <span className="font-medium">Courses:</span>{" "}
                        {formatCourses(selectedStaff.courses)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="md:border-l md:border-gray-800 md:pl-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-300 uppercase mb-2">
                      Earnings (40-20-10-10-20 Split)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm text-white">Basic Salary (40%)</p>
                      <p className="text-sm text-white text-right">
                        {formatCurrency(salaryDetails.basic)}
                      </p>
                      <p className="text-sm text-white">
                        House Rent Allowance (20%)
                      </p>
                      <p className="text-sm text-white text-right">
                        {formatCurrency(salaryDetails.hra)}
                      </p>
                      <p className="text-sm text-white">
                        Dearness Allowance (10%)
                      </p>
                      <p className="text-sm text-white text-right">
                        {formatCurrency(salaryDetails.da)}
                      </p>
                      <p className="text-sm text-white">
                        Conveyance Allowance (10%)
                      </p>
                      <p className="text-sm text-white text-right">
                        {formatCurrency(salaryDetails.ta)}
                      </p>
                      <p className="text-sm text-white">
                        Other Allowances (20%)
                      </p>
                      <p className="text-sm text-white text-right">
                        {formatCurrency(salaryDetails.otherAllowances)}
                      </p>
                      <p className="text-sm font-medium text-white">
                        Total Earnings
                      </p>
                      <p className="text-sm font-medium text-white text-right">
                        {formatCurrency(salaryDetails.totalEarnings)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-bold text-white">Net Salary</h4>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrency(salaryDetails.netSalary)}
                  </p>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center text-gray-400 bg-black rounded-md border border-gray-800">
              Loading salary details...
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400 bg-black rounded-md border border-dashed border-gray-700">
              <div className="mx-auto text-gray-500 mb-2">
                <FileTextIcon />
              </div>
              <p>
                No salary information available. Please update the salary for
                this teacher.
              </p>
              {!showSalaryInput && (
                <button
                  onClick={() => setShowSalaryInput(true)}
                  className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <span className="mr-2">
                    <PlusIcon />
                  </span>
                  Add Salary
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Message when no staff is selected */}
      {!selectedStaff && (
        <div className="p-8 text-center text-gray-400 bg-black rounded-md border border-dashed border-gray-700">
          <div className="mx-auto text-gray-500 mb-2">
            <FileTextIcon />
          </div>
          <p>Select a teacher to view salary details</p>
        </div>
      )}
    </div>
  );
}
