import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    pincode: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const validateStep = () => {
    let newErrors = {};
    const { name, email, phoneNumber, password, address, pincode } = formData;

    if (step === 1) {
      if (!/^[A-Za-z ]{3,}$/.test(name)) newErrors.name = "Name must be at least 3 characters long";
      if (!/^\S+@gmail\.com$/.test(email)) newErrors.email = "Email must be a valid @gmail.com address";
    } else if (step === 2) {
      if (!/^[56789]\d{9}$/.test(phoneNumber)) newErrors.phoneNumber = "Invalid phone number";
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) newErrors.password = "Weak password";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    } else if (step === 3) {
      if (!address.trim()) newErrors.address = "Address is required";
      if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Invalid pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => validateStep() && setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      const response = await axios.post("http://localhost:3000/v1/students/student-singup", formData);
      if (response.data) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        showPopup("Signup Successful! Redirecting...", "success");
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      
      if (error.response && error.response.status === 400) {
        showPopup(error.response.data.message || "Signup Failed. Try again!", "error");
      } else {
        showPopup("Something went wrong. Please try again later!", "error");
      }
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 w-full">
      {/* Popup Notification - Centered */}
      {popup.show && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-white text-center rounded-lg shadow-lg transition-opacity duration-300 ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {popup.message}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-100">
          <img src="https://media.giphy.com/media/QpVUMRUJGokfqXyfa1/giphy.gif" alt="Signup Animation" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Sign Up</h2>
          <p className="text-gray-600 text-center mb-6">Create your account</p>

          {step === 1 && (
            <div>
              <label className="block text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" className="w-full p-3 border rounded-lg mb-2" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <label className="block text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" className="w-full p-3 border rounded-lg mb-2" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <button onClick={nextStep} className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">Next</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" className="w-full p-3 border rounded-lg mb-2" />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

              <label className="block text-gray-700">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" className="w-full p-3 border rounded-lg mb-2" />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              <label className="block text-gray-700">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full p-3 border rounded-lg mb-2" />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

              <div className="flex justify-between">
                <button onClick={prevStep} className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">Back</button>
                <button onClick={nextStep} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-gray-700">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" className="w-full p-3 border rounded-lg mb-2" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

              <label className="block text-gray-700">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Enter pincode" className="w-full p-3 border rounded-lg mb-2" />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}

              <div className="flex justify-between">
                <button onClick={prevStep} className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">Back</button>
                <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
