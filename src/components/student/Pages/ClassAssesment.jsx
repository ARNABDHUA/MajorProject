// import React, { useEffect, useState } from "react";

// const ClassNameNameAssesment = () => {
//   const [user, setUser] = useState(null);
//   const [formData, setFormData] = useState({
//     email: "",
//     name: "",
//     c_roll: "",
//     paper_code: "",
//     cas: "",
//     course_code: "",
//     sem: "",
//     file: null,
//   });
//   const [showForm, setShowForm] = useState(false); //usestate
//   const [allPaperCode, setAllPaperCode] = useState([]);
//   const [selectPaperCode, setSelectPaperCode] = useState("");
//   const [errors, setErrors] = useState({});
//   const [availablecas, setAvailableCas] = useState([]);

//   const allCa = ["CA1", "CA2", "CA3", "CA4"];

//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("user"));
//     if (data) {
//       setUser(data);
//       setAllPaperCode(data.paper_code);
//       console.log(data.paper_code);
//       setFormData({
//         email: data.email || "",
//         name: data.name || "",
//         c_roll: data.c_roll || "",
//         course_code: data.course_code || "",
//         sem: data.sem || "",
//         file: null, // Keep null for file input
//         cas: "",
//         paper_code: "",
//       });
//     }
//   }, []);

//   console.log("papercode arr", allPaperCode);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePdfChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       if (file.type !== "application/pdf") {
//         showPopup("Please select a valid PDF file", "error");
//         return;
//       }

//       // Validate file size (e.g., max 10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         showPopup("PDF size should be less than 10MB", "error");
//         return;
//       }

//       // Update form data
//       setFormData((prev) => ({ ...prev, pdf: file }));
//       setPreviewPdf(file.name); // Optional: just showing name or use for UI
//     }
//   };

//   const handleShowForm = () => {
//     setShowForm(true);
//   };

//   return (
//     <div>
//       {showForm ? (
//         <div>
//           <div className="grid md:grid-cols-2 gap-6 mb-6 ml-6 mr-6">
//             <div>
//               <label className="block text-gray-600 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={user?.name || ""}
//                 className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                 readOnly
//               />
//             </div>

//             <div>
//               <label className="block text-gray-600 mb-1">Email</label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mb-6 ml-6 mr-6">
//             <div>
//               <label className="block text-gray-600 mb-1">c_roll</label>
//               <input
//                 type="text"
//                 value={formData.c_roll}
//                 className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                 readOnly
//               />
//             </div>
//             <div>
//               <label className="block text-gray-600 mb-1">sem</label>
//               <input
//                 type="text"
//                 value={formData.sem}
//                 className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-4 mb-4 ml-6 mr-6">
//             <div>
//               <label className="block text-gray-600 mb-1">course_code</label>
//               <input
//                 type="text"
//                 value={formData.course_code}
//                 className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
//                 readOnly
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 cas<span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="cas"
//                 value={formData.cas}
//                 onChange={handleChange}
//                 className={`w-full border rounded px-3 py-2 ${
//                   errors.cas ? "border-red-500" : "border-gray-300"
//                 }`}
//               >
//                 <option value="">Select CA</option>
//                 {allCa.map((cas) => (
//                   <option key={cas} value={cas}>
//                     {cas}
//                   </option>
//                 ))}
//               </select>
//               {errors.cas && (
//                 <p className="text-red-500 text-sm">{errors.cas}</p>
//               )}
//             </div>

//             <div>
//               <div>
//                 <label className="block text-gray-700 font-medium mb-1">
//                   Select Paper code<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   name="paper_code"
//                   value={formData.paper_code}
//                   onChange={handleChange}
//                   className={`w-full border rounded px-3 py-2 ${
//                     errors.paper_code ? "border-red-500" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Paper_code</option>
//                   {allPaperCode.map((paper_code) => (
//                     <option key={paper_code} value={paper_code}>
//                       {paper_code}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.paper_code && (
//                   <p className="text-red-500 text-sm">{errors.paper_code}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <input
//                 type="file"
//                 id="pdf-upload"
//                 name="pdf"
//                 accept="application/pdf"
//                 onChange={handlePdfChange}
//                 className="block w-full text-sm text-gray-500
//     file:mr-4 file:py-2 file:px-4
//     file:rounded file:border-0
//     file:text-sm file:font-semibold
//     file:bg-green-50 file:text-green-700
//     hover:file:bg-green-100 ml-6"
//               />
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto p-4">
//           <div className="bg-blue-600 text-white text-xl font-semibold p-4 rounded-t-lg">
//             CA Marks's Details
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-200 text-sm">
//               <thead className="bg-gray-100 text-gray-700 uppercase  text-xs">
//                 <tr>
//                   <th className="px-4 py-4 border">Paper Code</th>
//                   <th className="px-4 py-4 border">Paper Name</th>
//                   <th className="px-4 py-4 border">CA 1</th>
//                   <th className="px-4 py-4 border">CA 2</th>
//                   <th className="px-4 py-4 border">CA 3</th>
//                   <th className="px-4 py-4 border">CA 4</th>
//                   <th className="px-4 py-4 border">Teacher</th>
//                   <th className="px-4 py-4 border">Submit</th>
//                 </tr>
//               </thead>
//               <tbody className="text-gray-800">
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">MCAN-301(3879)</td>
//                   <td className="px-4 py-2 border">ml</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">9</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">shreya</td>
//                   <td className="px-4 py-2 border">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded "
//                       onClick={() => {
//                         handleShowForm();
//                       }}
//                     >
//                       Upload
//                     </button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">MCAN-302(3880)</td>
//                   <td className="px-4 py-2 border">Ai</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">22</td>
//                   <td className="px-4 py-2 border"></td>
//                   <td className="px-4 py-2 border">24</td>
//                   <td className="px-4 py-2 border">arnab</td>
//                   <td className="px-4 py-2 border">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                       onClick={() => {
//                         handleShowForm();
//                       }}
//                     >
//                       Upload
//                     </button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">MCAN-303(3881)</td>
//                   <td className="px-4 py-2 border">Daa</td>
//                   <td className="px-4 py-2 border">25</td>
//                   <td className="px-4 py-2 border">25</td>
//                   <td className="px-4 py-2 border">16</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">parbat</td>
//                   <td className="px-4 py-2 border">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                       onClick={() => {
//                         handleShowForm();
//                       }}
//                     >
//                       Upload
//                     </button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">MCAN-E304F(3887)</td>
//                   <td className="px-4 py-2 border">ds</td>
//                   <td className="px-4 py-2 border">25</td>
//                   <td className="px-4 py-2 border">25</td>
//                   <td className="px-4 py-2 border">17</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">farhan</td>
//                   <td className="px-4 py-2 border">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                       onClick={() => {
//                         handleShowForm();
//                       }}
//                     >
//                       Upload
//                     </button>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="px-4 py-2 border">MCAN-E305G(3894)</td>
//                   <td className="px-4 py-2 border">cs</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">21</td>
//                   <td className="px-4 py-2 border">9</td>
//                   <td className="px-4 py-2 border">20</td>
//                   <td className="px-4 py-2 border">sourin</td>
//                   <td className="px-4 py-2 border">
//                     <button
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                       onClick={() => {
//                         handleShowForm();
//                       }}
//                     >
//                       Upload
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassNameNameAssesment;






import React, { useEffect, useState } from "react";
import { FaUpload, FaUser, FaEnvelope, FaIdCard, FaBook, FaCalendarAlt, FaFileAlt, FaCode, FaPaperPlane } from "react-icons/fa";
import { HiAcademicCap, HiDocumentText } from "react-icons/hi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdError } from "react-icons/md";

const ClassAssesment = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    c_roll: "",
    paper_code: "",
    cas: "",
    course_code: "",
    sem: "",
    file: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [allPaperCode, setAllPaperCode] = useState([]);
  const [selectPaperCode, setSelectPaperCode] = useState("");
  const [errors, setErrors] = useState({});
  const [availablecas, setAvailableCas] = useState([]);
  const [previewPdf, setPreviewPdf] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const allCa = ["CA1", "CA2", "CA3", "CA4"];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
      setAllPaperCode(data.paper_code || []);
      setFormData({
        email: data.email || "",
        name: data.name || "",
        c_roll: data.c_roll || "",
        course_code: data.course_code || "",
        sem: data.sem || "",
        file: null,
        cas: "",
        paper_code: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        showPopup("Please select a valid PDF file", "error");
        return;
      }

      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showPopup("PDF size should be less than 10MB", "error");
        return;
      }

      // Update form data
      setFormData((prev) => ({ ...prev, pdf: file }));
      setPreviewPdf(file.name);
    }
  };

  const handleShowForm = (paperCode = "") => {
    setShowForm(true);
    if (paperCode) {
      setFormData(prev => ({ ...prev, paper_code: paperCode }));
    }
  };

  const showPopup = (message, type) => {
    setSubmitStatus({ message, type });
    setTimeout(() => {
      setSubmitStatus(null);
    }, 3000);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cas) newErrors.cas = "Please select a CA";
    if (!formData.paper_code) newErrors.paper_code = "Please select a paper code";
    if (!formData.pdf) newErrors.pdf = "Please upload a PDF file";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // This would eventually connect to your API
      showPopup("Assessment submitted successfully!", "success");
      setTimeout(() => {
        setShowForm(false);
        setFormData(prev => ({
          ...prev,
          cas: "",
          paper_code: "",
          pdf: null
        }));
        setPreviewPdf("");
      }, 2000);
    } else {
      showPopup("Please fill all required fields", "error");
    }
  };

  const goBack = () => {
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {submitStatus && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
          submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {submitStatus.type === "success" ? 
            <IoMdCheckmarkCircleOutline className="text-xl mr-2" /> : 
            <MdError className="text-xl mr-2" />}
          {submitStatus.message}
        </div>
      )}
      
      {showForm ? (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <HiDocumentText className="text-2xl mr-2" /> 
                  CA Assessment Upload
                </h2>
                <button 
                  onClick={goBack}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm transition-colors duration-200"
                >
                  Back to List
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaUser className="mr-2 text-blue-500" /> Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaIdCard className="mr-2 text-blue-500" /> College Roll
                  </label>
                  <input
                    type="text"
                    value={formData.c_roll}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> Semester
                  </label>
                  <input
                    type="text"
                    value={formData.sem}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaBook className="mr-2 text-blue-500" /> Course Code
                  </label>
                  <input
                    type="text"
                    value={formData.course_code}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <HiAcademicCap className="mr-2 text-blue-500" /> 
                    Assessment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cas"
                    value={formData.cas}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cas ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select CA</option>
                    {allCa.map((cas) => (
                      <option key={cas} value={cas}>
                        {cas}
                      </option>
                    ))}
                  </select>
                  {errors.cas && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <MdError className="mr-1" /> {errors.cas}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaCode className="mr-2 text-blue-500" /> 
                    Paper Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paper_code"
                    value={formData.paper_code}
                    onChange={handleChange}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.paper_code ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Paper Code</option>
                    {allPaperCode.map((paper_code) => (
                      <option key={paper_code} value={paper_code}>
                        {paper_code}
                      </option>
                    ))}
                  </select>
                  {errors.paper_code && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <MdError className="mr-1" /> {errors.paper_code}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <FaFileAlt className="mr-2 text-blue-500" /> 
                    Upload PDF <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border ${errors.pdf ? "border-red-500" : "border-gray-300"} rounded-md`}>
                    <input
                      type="file"
                      id="pdf-upload"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center px-4 py-2">
                      <FaUpload className="text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        {previewPdf || "Choose PDF file"}
                      </span>
                    </div>
                  </div>
                  {errors.pdf && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <MdError className="mr-1" /> {errors.pdf}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
                >
                  <FaPaperPlane className="mr-2" />
                  Submit Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center">
              <HiAcademicCap className="text-2xl mr-2" />
              <h2 className="text-xl font-bold">CA Marks Details</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs border-b">
                    <th className="px-4 py-3 text-left">Paper Code</th>
                    <th className="px-4 py-3 text-left">Paper Name</th>
                    <th className="px-4 py-3 text-center">CA 1</th>
                    <th className="px-4 py-3 text-center">CA 2</th>
                    <th className="px-4 py-3 text-center">CA 3</th>
                    <th className="px-4 py-3 text-center">CA 4</th>
                    <th className="px-4 py-3 text-left">Teacher</th>
                    <th className="px-4 py-3 text-center">Submit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800 divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3">MCAN-301(3879)</td>
                    <td className="px-4 py-3 font-medium">Machine Learning</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium">9</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3">Prof. Shreya</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center mx-auto transition-colors duration-200"
                        onClick={() => handleShowForm("MCAN-301(3879)")}
                      >
                        <FaUpload className="mr-1" /> Upload
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3">MCAN-302(3880)</td>
                    <td className="px-4 py-3 font-medium">Artificial Intelligence</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">22</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-gray-100 text-gray-500 rounded-full px-2 py-1 text-xs font-medium">-</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">24</span>
                    </td>
                    <td className="px-4 py-3">Prof. Arnab</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center mx-auto transition-colors duration-200"
                        onClick={() => handleShowForm("MCAN-302(3880)")}
                      >
                        <FaUpload className="mr-1" /> Upload
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3">MCAN-303(3881)</td>
                    <td className="px-4 py-3 font-medium">Design and Analysis of Algorithms</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">25</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">25</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">16</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3">Prof. Parbat</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center mx-auto transition-colors duration-200"
                        onClick={() => handleShowForm("MCAN-303(3881)")}
                      >
                        <FaUpload className="mr-1" /> Upload
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3">MCAN-E304F(3887)</td>
                    <td className="px-4 py-3 font-medium">Data Science</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">25</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">25</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">17</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3">Prof. Farhan</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center mx-auto transition-colors duration-200"
                        onClick={() => handleShowForm("MCAN-E304F(3887)")}
                      >
                        <FaUpload className="mr-1" /> Upload
                      </button>
                    </td>
                  </tr>
                  
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-3">MCAN-E305G(3894)</td>
                    <td className="px-4 py-3 font-medium">Computer Security</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">21</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium">9</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-medium">20</span>
                    </td>
                    <td className="px-4 py-3">Prof. Sourin</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center mx-auto transition-colors duration-200"
                        onClick={() => handleShowForm("MCAN-E305G(3894)")}
                      >
                        <FaUpload className="mr-1" /> Upload
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassAssesment;
