import { useEffect, useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { ChatState } from "../context/ChatProvider";
import { Navigate, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState();
  const [id, setId] = useState();
  const [phone, setPhone] = useState();
  const { email, setEmail, courseCode, setCourseCode } = ChatState();

  const generateUniqueId = () => {
    return "101" + Date.now() + "9" + Math.floor(Math.random() * 10000);
  };

  useEffect(() => {
    // Check if payment is already done
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Payment status", user.payment);
    if (user.payment === true) {
      navigate("/student-profile");
      return;
    }

    // Get user data from localStorage safely
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userEmail = storedUser.email;
    setEmail(userEmail);
    // const cCode = storedUser.course_code;
    // setCourseCode(cCode);
    const uName = storedUser.name;
    setName(uName);
    const uPhone = storedUser.phoneNumber;
    setPhone(uPhone);

    console.log(storedUser);

    setId(generateUniqueId());
  }, []);

  useEffect(() => {
    console.log("Updated name:", name);
    console.log("Updated email:", email);
    console.log("Updated phone:", phone);
    console.log("Updated id:", id);
  }, [name, email, phone, id]);

  // Initialize cashfree SDK
  let cashfree;
  const initializeSDK = async () => {
    try {
      cashfree = await load({
        mode: "sandbox", // Use "production" for live
      });
    } catch (error) {
      console.error("Failed to initialize Cashfree SDK:", error);
    }
  };

  // Call initialization immediately
  initializeSDK();

  const rollNumberGenerate = async () => {
    try {
      const res = await axios.post(
        `https://e-college-data.onrender.com/v1/students/student-rollgenerate`,
        {
          course_code: courseCode,
          email: email,
        }
      );
      if (res.data) {
        const studentChat = await axios.post(
          "https://e-college-data.onrender.com/v1/chat/chat-isstudent",
          {
            email: email,
          }
        );
        if (studentChat.data) {
          const chatData = studentChat.data;
          localStorage.setItem("userInfo", JSON.stringify(chatData));
        }

        const newData = res.data;
        const userData = { ...newData, role: "student" };
        localStorage.setItem("user", JSON.stringify(userData));
        // Set payment status to true in local storage
        localStorage.setItem("payment", JSON.stringify(true));
        setTimeout(() => navigate("/student-profile"), 2500);
      }
    } catch (error) {
      setMessage("Error generating Roll Number");
      console.error("Error Generating roll:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async () => {
    setIsLoading(true);
    setMessage("Creating order...");

    try {
      const res = await axios.post(
        "https://e-college-data.onrender.com/payment",
        {
          userId: id,
          name: name,
          email: email,
          phone: phone,
          amount: 99000,
        }
      );

      if (res.data && res.data.payment_session_id) {
        console.log("Order created:", res.data);
        setOrderId(res.data.order_id);
        setMessage("Order created successfully!");
        return res.data.payment_session_id;
      } else {
        setMessage("Failed to get payment session ID");
        console.error("Invalid response:", res.data);
        return null;
      }
    } catch (error) {
      setMessage("Error creating order");
      console.error("Error creating order:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (orderIdToVerify) => {
    setIsLoading(true);
    setMessage("Verifying payment...");

    try {
      const orderId = orderIdToVerify || orderId;
      const res = await axios.post(
        "https://e-college-data.onrender.com/verify",
        {
          orderId: orderId,
        }
      );

      if (res && res.data) {
        console.log("Payment verified:", res.data);
        setMessage("Payment verified successfully!");
        return true;
      }
      return false;
    } catch (error) {
      setMessage("Error verifying payment");
      console.error("Error verifying payment:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayNow = async (e) => {
    e.preventDefault();

    try {
      const sessionId = await getOrderDetails();

      if (!sessionId) {
        setMessage("Failed to get payment session ID");
        return;
      }

      setMessage("Initializing payment...");

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal", // Opens payment in modal
      };

      cashfree
        .checkout(checkoutOptions)
        .then(function (result) {
          console.log("Payment result:", result);
          if (result.error) {
            setMessage(
              `Payment error: ${result.error.message || "Unknown error"}`
            );
          } else {
            setMessage("Payment initiated successfully!");
            setTimeout(() => {
              verifyPayment(result.order.orderId || orderId);
            }, 2000);
            setTimeout(() => {
              rollNumberGenerate();
            }, 2000);
          }
        })
        .catch(function (error) {
          console.error("Payment initialization error:", error);
          setMessage(
            `Payment initialization error: ${error.message || "Unknown error"}`
          );
        });
    } catch (error) {
      console.error("Error during payment process:", error);
      setMessage(`Error: ${error.message || "Unknown error during payment"}`);
    }
  };

  return (
    <div className="container text-center max-w-[600px] p-14 mx-auto ">
      <h1 className="text-2xl font-bold mb-4"> Payment Page</h1>
      <div>
        <div className="max-w-sm mx-auto p-6 bg-blue-950 text-white rounded-2xl shadow-md space-y-4 flex flex-col items-start">
          <h2 className="text-xl font-semibold ">User Information</h2>
          <div className="">
            <span className="font-medium ">Name:</span> {name}
          </div>
          <div className="">
            <span className="font-medium ">Phone Number:</span> {phone}
          </div>
          <div className="">
            <span className="font-medium">Email Address:</span> {email}
          </div>
        </div>
      </div>
      {message && (
        <div
          className={`my-5 p-4 rounded text-sm ${
            message.toLowerCase().includes("error") ||
            message.toLowerCase().includes("failed")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <div className="card mt-8">
        <button
          onClick={handlePayNow}
          disabled={isLoading}
          className={`px-6 py-3 text-white rounded text-base ${
            isLoading
              ? "bg-blue-500 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {orderId && (
        <div className="mt-5 text-sm text-gray-600">Order ID: {orderId}</div>
      )}
    </div>
  );
};

export default Payment;
