import { useState, useEffect } from "react";
import { ChevronDown, Search, RefreshCw, Download } from "lucide-react";

export default function NewRegisterStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courseCode, setCourseCode] = useState("101");
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "https://e-college-data.onrender.com/v1/adminroutine/course-all-id"
        );
        const Data = await response.json();
        console.log("Got courses data:", Data);
        setCourses(Data);
      } catch (error) {
        console.error("Error in fetching Courses:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [courseCode]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://e-college-data.onrender.com/v1/students/student-verifylist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_code: courseCode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      } else {
        console.error("Failed to fetch students:", result.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="bg-black rounded-lg shadow p-6 text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">New Register Students</h2>
        {/* <p className="text-gray-400">
          Students who have applied, are verified but haven't made payment yet
        </p> */}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full pl-10 p-2.5"
            placeholder="Search by name, email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <select
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5 appearance-none"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            >
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_id}({course.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={fetchStudents}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <button className="flex items-center gap-2 bg-purple-900 hover:bg-purple-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-300 uppercase bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Rank
              </th>
              <th scope="col" className="px-6 py-3">
                10th Marks
              </th>
              <th scope="col" className="px-6 py-3">
                12th Marks
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                    <span className="text-gray-400">
                      Loading student data...
                    </span>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <p className="text-gray-400">
                    No students found for the selected criteria
                  </p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {student.name}
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.phoneNumber}</td>
                  <td className="px-6 py-4">{student.rank}</td>
                  <td className="px-6 py-4">{student.tenth_marks}%</td>
                  <td className="px-6 py-4">{student.twelfth_marks}%</td>
                  <td className="px-6 py-4">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                      Assign Roll
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        {!loading &&
          `Showing ${filteredStudents.length} out of ${students.length} students`}
      </div>
    </div>
  );
}
