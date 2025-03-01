import React from "react";
import image from "/images/contact.webp";
import bgimg from "/images/ContactusBackground.svg";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoLogoPinterest } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data, e) => {
    e.preventDefault();
    e.target.submit(data);
  };

  const items = [
    {
      title: "Customer Support",
      address: "Chicago HQ Estica Cop. Macomb, MI 48042",
      phone: "(423) 733-8222",
      email: "example@email.com",
      bg: "bg-[#066ac9] text-white",
    },
    {
      title: "Contact Address",
      address: "2492 Centennial NW, Acworth, GA, 30102",
      phone: "+896-789-546",
      email: "example@email.com",
      bg: "bg-white shadow-md",
    },
    {
      title: "Main Office Address",
      address: "2002 Horton Ford Rd, Eidson, TN, 37731",
      phone: "(678) 324-1251",
      email: "example@email.com",
      bg: "bg-white shadow-md",
    },
  ];
  return (
    <div className="flex flex-col lg:my-8 justify-center items-center w-full space-y-8 px-4 md:px-10 lg:px-20 ">
      {/* Banner Section */}
      <div className="h-[750px] lg:h-full">
        <div className="w-full relative overflow-hiddene">
          <img
            src={bgimg}
            alt="Background"
            className="w-full  md:w-[90rem] mx-2 md:mx-20"
          />
          <div className="absolute top-[50%] sm:top-72 md:top-20 left-1/2 transform -translate-x-1/2 w-full text-center">
            <h1 className="text-blue-500 text-lg md:text-xl font-bold text-center">
              Contact Us
            </h1>
            <h3 className="text-2xl md:text-5xl font-bold text-center">
              We're here to help!
            </h3>
          </div>
          <div className="flex gap-4 md:gap-8 flex-col md:flex-row justify-center items-center absolute md:top-52 w-full px-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} px-4 md:px-8 py-6 md:py-9 rounded-xl shadow-xl ring-2 ring-gray-100 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`}
              >
                <div className="w-full flex flex-col space-y-4 justify-center items-center text-center">
                  <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                    {item.title}
                  </h1>
                  <div className="flex justify-center items-center space-x-2 text-xs sm:text-sm md:text-base">
                    <FaLocationDot className="mx-1" />
                    {item.address}
                  </div>
                  <h3 className="flex justify-center items-center space-x-2 text-xs sm:text-sm md:text-base">
                    <FaPhoneAlt className="mx-1" />
                    {item.phone}
                  </h3>
                  <h4 className="flex justify-center items-center space-x-2 text-xs sm:text-sm md:text-base">
                    <MdOutlineEmail className="mx-1" />
                    {item.email}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Image + Form) */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-screen-lg space-y-12 md:space-y-0">
        {/* Image & Social Media */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <img
            src={image}
            alt="Contact"
            className="w-[80%] md:w-[90%] lg:w-[25rem]"
          />
          <div className="flex flex-col items-center justify-center mt-4">
            <h6 className="text-lg md:text-xl font-bold">Follow us on:</h6>
            <div className="flex justify-center items-center space-x-5 mt-2">
              <FaFacebook className="text-2xl text-blue-600" />
              <FaInstagram className="text-2xl text-pink-500" />
              <FaSquareXTwitter className="text-2xl text-black" />
              <FaLinkedin className="text-2xl text-blue-800" />
              <IoLogoPinterest className="text-2xl text-red-500" />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-1/2 px-4 md:px-0 pt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
            Let's Talk
          </h1>
          <h6 className="text-gray-500 text-center md:text-left max-w-md mt-2">
            To request a quote or meet up for coffee, contact us directly or
            fill out the form, and we will get back to you promptly.
          </h6>
          <form
            action="https://formspree.io/f/xnnqyjnj"
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            className="flex flex-col space-y-4 mt-4"
          >
            {/* Name Field */}
            <div>
              <label className="text-gray-600">Your Name *</label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/i,
                    message: "Numbers are not allowed",
                  },
                })}
                type="text"
                autoComplete="off"
                className={`p-3 w-full rounded-md focus:ring-2 ${
                  errors.username
                    ? "border-red-600 bg-red-50 ring-red-600"
                    : "bg-gray-100 ring-blue-400"
                }`}
              />
              {errors.username && (
                <p className="text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="text-gray-600">Email Address *</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[A-Za-z][A-Za-z0-9._%+-]*@(gmail\.com|yahoo\.com|hotmail\.com)$/,
                    message: "Enter a valid email",
                  },
                })}
                type="email"
                autoComplete="off"
                className={`p-3 w-full rounded-md focus:ring-2 ${
                  errors.email
                    ? "border-red-600 bg-red-50 ring-red-600"
                    : "bg-gray-100 ring-blue-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label className="text-gray-600">Message *</label>
              <textarea
                {...register("textarea", { required: "Message is required" })}
                rows="3"
                placeholder="Enter your message..."
                className={`p-3 w-full rounded-md focus:ring-2 ${
                  errors.textarea
                    ? "border-red-600 bg-red-50 ring-red-600"
                    : "bg-gray-100 ring-blue-400"
                }`}
              ></textarea>
              {errors.textarea && (
                <p className="text-red-600">{errors.textarea.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <input
              type="submit"
              value="Send Message"
              className="bg-blue-500 w-full text-white px-4 py-3 rounded-md font-bold hover:bg-blue-700 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
