import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [availableCities, setAvailableCities] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const citiesByState = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kadapa", "Tirupati", "Rajahmundry", "Kakinada"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Aalo", "Tezu"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Karimganj"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Arrah", "Begusarai"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Raigarh", "Jagdalpur", "Ambikapur", "Durg"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Canacona"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh"],
    "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Nahan", "Bilaspur", "Hamirpur", "Kullu"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davanagere", "Shimoga"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Chandel", "Senapati", "Tamenglong"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Ampati"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Mamit", "Saiha"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Ravangla", "Singtam", "Rangpo", "Jorethang"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Ambassa", "Khowai", "Teliamura"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Allahabad", "Ghaziabad", "Noida"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Nainital"],
    "West Bengal": ["Bankura","Purulia","Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Baharampur", "Malda"],
    "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Havelock Island", "Neil Island", "Mayabunder", "Diglipur", "Rangat", "Little Andaman"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu", "Amli", "Naroli", "Vapi", "Dunetha"],
    "Delhi": ["New Delhi", "Delhi", "Noida", "Gurgaon", "Faridabad", "Ghaziabad", "Greater Noida"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur", "Sopore", "Poonch"],
    "Ladakh": ["Leh", "Kargil", "Diskit", "Zanskar", "Nubra", "Khaltse", "Drass"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy", "Kiltan", "Kadmat", "Kalpeni"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Villianur", "Ozhukarai", "Thirubhuvanai"]
  };


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (data) {
      setUser(data);
      setFormData({
        email: data.email || "",
        address: data.address || "",
        state: data.state || "",
        city: data.city || "",
        pincode: data.pincode || "",
        image: null, // Keep null for file input
      });
     
      // If user has a profile imageture, show it in preview
      if (data.profileimage) {
        setPreviewImage(data.profileimage);
      }
    }
  }, []);

  useEffect(() => {
    if (formData.state) {
      setAvailableCities(citiesByState[formData.state] || []);
      if (formData.city && !citiesByState[formData.state]?.includes(formData.city)) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showPopup("Please select a valid image file (JPEG, PNG, GIF, WEBP)", "error");
        return;
      }
     
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showPopup("Image size should be less than 5MB", "error");
        return;
      }
     
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const validateStep = () => {
    let newErrors = {};
    const { address, state, city, pincode } = formData;

    if (!address.trim()) newErrors.address = "Address is required";
    if (!state) newErrors.state = "State is required";
    if (!city) newErrors.city = "City is required";
    if (!pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Invalid pincode. Please enter a 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep()) {
      setIsSubmitting(true);
      showPopup("Submitting profile update...", "info");

      try {
        const payload = new FormData();
       
        // Append all form fields to FormData
        payload.append("email", formData.email);
        payload.append("address", formData.address);
        payload.append("state", formData.state);
        payload.append("city", formData.city);
        payload.append("pincode", formData.pincode);
       
        // Only append image if it exists and is a File object
        if (formData.image instanceof File) {
          payload.append("image", formData.image);
        }

        // Log FormData entries for debugging
        // for (let pair of payload.entries()) {
        //   console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
        // }

        const response = await axios.post(
          "https://e-college-data.onrender.com/v1/students/student-update",
          payload
         
        );

        if (response.data) {
          const chatresponse=await axios.post("https://e-college-data.onrender.com/v1/chat/userimageget",{email:formData.email})
          // console.log("Profile update response:", response.data);
         
          // Update local storage with new data
          const updatedUser = {
            ...user,
            address: formData.address,
            state: formData.state,
            city: formData.city,
            pincode: formData.pincode,
            // If the API returns the updated profile image URL, use it
            pic: response.data.student.pic
          };
         
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
         
          showPopup("Profile updated successfully!", "success");
        }
      } catch (error) {
        console.error("Profile update error:", error);
        const errorMessage = error.response?.data?.message || "Profile update failed";
        showPopup(errorMessage, "error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showPopup("Please fix the errors before submitting", "error");
    }
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className=" bg-gray-100  min-h-screen py-8 ">
      {popup.show && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            popup.type === "success"
              ? "bg-green-100 text-green-800"
              : popup.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {popup.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h1 className="block text-black font-medium ml-6 pb-4 text-10">Profile imageture</h1>
         
          {previewImage && (
            <div className="mb-3 ml-6">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="  h-32 w-32 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg"
              />
            </div>
          )}
         
          <input
             type="file"
             id="profile-image"
             name="image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 ml-6"
              
          />
          <p className="text-sm text-gray-400 ml-6 mt-1">Max file size: 5MB. Supported formats: JPEG, PNG, GIF, WEBP</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6 ml-6 mr-6">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              readOnly
            />
          </div>
        </div>

        <div className="mb-4 ml-6 mr-6">
          <label className="block text-gray-700 font-medium mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.address ? "border-red-500" : "border-gray-300"}`}
            rows="3"
          ></textarea>
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4 ml-6 mr-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.state ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select State</option>
              {Object.keys(citiesByState).sort().map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 ${errors.city ? "border-red-500" : "border-gray-300"}`}
              disabled={!formData.state}
            >
              <option value="">Select City</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
        </div>

        <div className="mb-4 ml-6 mr-6">
          <label className="block text-gray-700 font-medium mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pincode"
            maxLength={6}
            value={formData.pincode}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 ${errors.pincode ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter 6-digit pincode"
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto px-6 py-2 ml-6 rounded transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
