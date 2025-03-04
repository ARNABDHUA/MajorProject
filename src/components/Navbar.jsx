import React from "react";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import logo from "/images/Logo.svg";
import { FaChevronDown } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [toggle, settoggle] = useState(true);
  const changeToggle = () => {
    toggle === true ? settoggle(false) : settoggle(true);
  };
  const [toggleAccount, settoggleAccount] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-100 bg-white ">
      <div className="relative py-5 lg:p-5">
        {/* desktop view */}
        <div className="flex justify-between mx-2 items-center">
          <div>
            <img src={logo} alt="" className="w-34" />
          </div>

          <div className="hidden  md:flex ">
            <ul className=" hidden  md:flex space-x-3  ">
              <li className="hover:text-blue-500">
                <NavLink to="/">Home</NavLink>
              </li>

              <li className="hover:text-blue-500">Notice</li>

              <li className="relative group">
                <span className="px-2 cursor-pointer space-x-2 flex justify-center items-center">
                  <span className="text-blue-500">Accounts</span>
                  <span>
                    <FaChevronDown />
                  </span>
                </span>
                <ul className="absolute z-10 hidden group-hover:block bg-white text-blue-600  rounded-md">
                  <li
                    className=" hover:text-blue-900 text-blue-700 px-4 py-2 cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Student
                  </li>
                  <li className="hover:text-blue-900 text-blue-700 px-4 py-2">
                    Teacher
                  </li>
                  <li className="hover:text-blue-900 text-blue-700 px-4 py-2">
                    Admin
                  </li>
                </ul>
              </li>

              <li className="hover:text-blue-500">
                <NavLink to="/contact-us">Contact us</NavLink>
              </li>
              <li className="hover:text-blue-500">
                <NavLink to="/about">About</NavLink>
              </li>
            </ul>
          </div>

          <div className="relative hidden md:flex space-x-4 ">
            <input
              type="text"
              placeholder="Search"
              className="pl-2 pr-3 py-2 border rounded md:w-52 lg:w-64 border-gray-400 outline-blue-500"
            />
            <IoIosSearch className="absolute right-10 top-3 text-gray-500 text-xl hover:text-blue-500" />
            <div>
              <FaUserCircle className="text-3xl text-blue-600" />
            </div>
          </div>
          {/* toggle menu */}

          <div className=" flex items-center space-x-4 md:hidden justify-center">
            {toggle ? (
              <GiHamburgerMenu className="text-2xl" onClick={changeToggle} />
            ) : (
              <IoClose className="text-2xl" onClick={changeToggle} />
            )}
            <div className="">
              <FaUserCircle className="text-3xl text-blue-600" />
            </div>
          </div>
        </div>

        {toggle === false && (
          <div className="md:hidden flex flex-col justify-center items-center absolute bg-white text-blue-500 w-full z-1">
            <div className=" w-full">
              <ul className="flex flex-col space-y-4 mb-8 p-2">
                <li className="hover:text-blue-500">
                  <NavLink to="/">Home</NavLink>
                </li>

                <li className="hover:text-blue-500">Notice</li>
                <div>
                  <li className="flex justify-between pr-3">
                    <span>Accounts</span>
                    <span>
                      <HiDotsHorizontal
                        onClick={() => {
                          settoggleAccount(!toggleAccount);
                        }}
                      />
                    </span>
                  </li>

                  {toggleAccount && (
                    <ul className="flex flex-col space-y-4 py-2 ml-5 text-black bg-white m-3 p-2">
                      <li onClick={() => navigate("/login")}>Student</li>
                      <li>Teacher</li>
                      <li>Admin</li>
                    </ul>
                  )}
                </div>

                <li className="hover:text-blue-500">
                  <NavLink to="/contact-us">Contact us</NavLink>
                </li>
                <li className="hover:text-blue-500">About</li>
              </ul>
            </div>

            <div className="relative flex flex-col justify-center items-center space-y-2">
              <input
                type="text"
                placeholder="Search"
                className="pl-2 pr-3 py-2 border rounded w-48  outline-blue-500 border-gray-500"
              />
              <IoIosSearch className="absolute right-2 top-2 text-gray-500 text-xl hover:text-blue-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
