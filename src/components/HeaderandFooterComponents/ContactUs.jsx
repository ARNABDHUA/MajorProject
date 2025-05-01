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
    <div className="flex flex-col lg:my-8 justify-center items-center w-full space-y-8 px-4 md:px-10 lg:px-20 max-w-screen">
      {/* Banner Section - Keeping the original structure but improving responsiveness */}
      <div className="w-full h-[750px] md:h-[650px] lg:h-[500px]  *:">
        <div className="w-full relative">
          <img
            src={bgimg}
            alt="Background"
            className="w-full object-cover h-32 sm:h-48 md:h-64"
          />
          <div className="absolute top-12 sm:top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-full text-center">
            <h1 className="text-blue-500 text-lg md:text-xl font-bold text-center">
              Contact Us
            </h1>
            <h3 className="text-2xl md:text-5xl font-bold text-center">
              We're here to help!
            </h3>
          </div>
          <div className="flex gap-4 md:gap-8 flex-col md:flex-row justify-center items-center absolute top-32 sm:top-40 md:top-52 w-full  px-4">
            {items.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} px-4 md:px-8 py-6 md:py-9 rounded-xl shadow-xl ring-2 ring-gray-100 w-[200%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg `}
              >
                <div className="w-full flex flex-col space-y-4 justify-center items-center text-center">
                  <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                    {item.title}
                  </h1>
                  <div className="flex flex-wrap justify-center items-center gap-1 text-xs sm:text-sm md:text-base">
                    <FaLocationDot className="mx-1 flex-shrink-0" />
                    <span>{item.address}</span>
                  </div>
                  <h3 className="flex flex-wrap justify-center items-center gap-1 text-xs sm:text-sm md:text-base">
                    <FaPhoneAlt className="mx-1 flex-shrink-0" />
                    <span>{item.phone}</span>
                  </h3>
                  <h4 className="flex flex-wrap justify-center items-center gap-1 text-xs sm:text-sm md:text-base">
                    <MdOutlineEmail className="mx-1 flex-shrink-0" />
                    <span>{item.email}</span>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content (Image + Form) */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-screen-lg space-y-12 md:space-y-0 mt-32 md:mt-24 lg:mt-0">
        {/* Image & Social Media */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <img
            src={image}
            alt="Contact"
            className="w-[80%] md:w-[90%] lg:w-[25rem] object-contain"
          />
          <div className="flex flex-col items-center md:items-start mt-4">
            <h6 className="text-lg md:text-xl font-bold">Follow us on:</h6>
            <div className="flex justify-center items-center space-x-5 mt-2">
              <FaFacebook className="text-2xl text-blue-600 hover:opacity-80 cursor-pointer" />
              <FaInstagram className="text-2xl text-pink-500 hover:opacity-80 cursor-pointer" />
              <FaSquareXTwitter className="text-2xl text-black hover:opacity-80 cursor-pointer" />
              <FaLinkedin className="text-2xl text-blue-800 hover:opacity-80 cursor-pointer" />
              <IoLogoPinterest className="text-2xl text-red-500 hover:opacity-80 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-1/2 px-4 md:px-0 pt-8 md:pt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
            Let's Talk
          </h1>
          <h6 className="text-gray-500 text-center md:text-left max-w-md mt-2">
            To request a quote or meet up for coffee, contact us directly or
            fill out the form, and we will get back to you promptly.
          </h6>
          <form
            action="https://formspree.io/f/xnndjeeq"
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
      {/* Google Maps*/}
      <div className="my-8 w-full px-4 sm:px-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.07827328958!2d88.42445437475723!3d22.576175632840286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02751a9d9c9e85%3A0x7fe665c781b10383!2sTechno%20Main%20Salt%20Lake!5e0!3m2!1sen!2sin!4v1741097876757!5m2!1sen!2sin"
          width="100%"
          height="450"
          loading="lazy"
          className="bg-gray-800 rounded-lg"
          style={{ border: 0 }}
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
