// import React from "react";
// import { IoIosSearch } from "react-icons/io";
// import { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoClose } from "react-icons/io5";
// import logo from "/images/Logo.svg";
// import { FaChevronDown } from "react-icons/fa";
// import { FaUserCircle } from "react-icons/fa";
// import { HiDotsHorizontal } from "react-icons/hi";
// import { NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const Navbar = () => {
//   const [toggle, settoggle] = useState(true);
//   const changeToggle = () => {
//     toggle === true ? settoggle(false) : settoggle(true);
//   };
//   const [toggleAccount, settoggleAccount] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <div className="sticky top-0 z-100 bg-white ">
//       <div className="relative py-5 lg:p-5">
//         {/* desktop view */}
//         <div className="flex justify-between mx-2 items-center">
//           <div>
//             <img src={logo} alt="" className="w-34" />
//           </div>

//           <div className="hidden  md:flex ">
//             <ul className=" hidden  md:flex space-x-3  ">
//               <li className="hover:text-blue-500">
//                 <NavLink to="/">Home</NavLink>
//               </li>

//               <li className="hover:text-blue-500">
//                 {" "}
//                 <NavLink to="/notice">Notice</NavLink>
//               </li>

//               <li className="relative group">
//                 <span className="px-2 cursor-pointer space-x-2 flex justify-center items-center">
//                   <span className="text-blue-500">Accounts</span>
//                   <span>
//                     <FaChevronDown />
//                   </span>
//                 </span>
//                 <ul className="absolute z-10 hidden group-hover:block bg-white text-blue-600  rounded-md">
//                   <li
//                     className=" hover:text-blue-900 text-blue-700 px-4 py-2 cursor-pointer"
//                     onClick={() => navigate("/login")}
//                   >
//                     Student
//                   </li>
//                   <li className="hover:text-blue-900 text-blue-700 px-4 py-2">
//                     Teacher
//                   </li>
//                   <li className="hover:text-blue-900 text-blue-700 px-4 py-2">
//                     Admin
//                   </li>
//                 </ul>
//               </li>

//               <li className="hover:text-blue-500">
//                 <NavLink to="/contact-us">Contact us</NavLink>
//               </li>
//               <li className="hover:text-blue-500">
//                 <NavLink to="/about">About</NavLink>
//               </li>
//             </ul>
//           </div>

//           <div className="relative hidden md:flex space-x-4 ">
//             <input
//               type="text"
//               placeholder="Search"
//               className="pl-2 pr-3 py-2 border rounded md:w-52 lg:w-64 border-gray-400 outline-blue-500"
//             />
//             <IoIosSearch className="absolute right-10 top-3 text-gray-500 text-xl hover:text-blue-500" />
//             <div>
//               <FaUserCircle className="text-3xl text-blue-600" />
//             </div>
//           </div>
//           {/* toggle menu */}

//           <div className=" flex items-center space-x-4 md:hidden justify-center">
//             {toggle ? (
//               <GiHamburgerMenu className="text-2xl" onClick={changeToggle} />
//             ) : (
//               <IoClose className="text-2xl" onClick={changeToggle} />
//             )}
//             <div className="">
//               <FaUserCircle className="text-3xl text-blue-600" />
//             </div>
//           </div>
//         </div>

//         {toggle === false && (
//           <div className="md:hidden flex flex-col justify-center items-center absolute bg-white text-blue-500 w-full z-1">
//             <div className=" w-full">
//               <ul className="flex flex-col space-y-4 mb-8 p-2">
//                 <li className="hover:text-blue-500">
//                   <NavLink to="/">Home</NavLink>
//                 </li>

//                 <li className="hover:text-blue-500">
//                   <NavLink to="/notice">Notice</NavLink>
//                 </li>
//                 <div>
//                   <li className="flex justify-between pr-3">
//                     <span>
//                       <NavLink >Accounts</NavLink>
//                     </span>
//                     <span>
//                       <HiDotsHorizontal
//                         onClick={() => {
//                           settoggleAccount(!toggleAccount);
//                         }}
//                       />
//                     </span>
//                   </li>

//                   {toggleAccount && (
//                     <ul className="flex flex-col space-y-4 py-2 ml-5 text-black bg-white m-3 p-2">
//                       <li onClick={() => navigate("/login")}>Student</li>
//                       <li>Teacher</li>
//                       <li>Admin</li>
//                     </ul>
//                   )}
//                 </div>

//                 <li className="hover:text-blue-500">
//                   <NavLink to="/contact-us">Contact us</NavLink>
//                 </li>
//                 <li className="hover:text-blue-500">
//                   {" "}
//                   <NavLink to="/about">About</NavLink>
//                 </li>
//               </ul>
//             </div>

//             <div className="relative flex flex-col justify-center items-center space-y-2">
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-2 pr-3 py-2 border rounded w-48  outline-blue-500 border-gray-500"
//               />
//               <IoIosSearch className="absolute right-2 top-2 text-gray-500 text-xl hover:text-blue-500" />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSearch } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import logo from "/images/Logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccounts = () => setAccountsOpen(!accountsOpen);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const accountsVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const hoverVariants = {
    hover: { scale: 1.05, color: "#3B82F6", transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hover: { color: "#3B82F6", transition: { duration: 0.2 } },
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-md">
      <div className="relative py-4 px-4 lg:px-8">
        {/* Desktop view */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={logo} alt="Logo" className="w-36 h-auto" />
          </motion.div>

          <div className="hidden md:flex">
            <ul className="flex space-x-6 items-center">
              <motion.li variants={linkVariants} whileHover="hover">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-medium" : "text-gray-700"
                  }
                >
                  Home
                </NavLink>
              </motion.li>

              <motion.li variants={linkVariants} whileHover="hover">
                <NavLink
                  to="/notice"
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-medium" : "text-gray-700"
                  }
                >
                  Notice
                </NavLink>
              </motion.li>

              <motion.li
                className="relative"
                variants={hoverVariants}
                whileHover="hover"
              >
                <motion.div
                  className="flex items-center space-x-1 cursor-pointer px-2 py-1 rounded-md"
                  onClick={() => setAccountsOpen(!accountsOpen)}
                >
                  <span
                    className={accountsOpen ? "text-blue-500" : "text-gray-700"}
                  >
                    Accounts
                  </span>
                  <motion.span
                    animate={{ rotate: accountsOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-xs" />
                  </motion.span>
                </motion.div>

                <AnimatePresence>
                  {accountsOpen && (
                    <motion.ul
                      className="absolute z-10 bg-white shadow-lg rounded-md w-40 overflow-hidden mt-2"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={accountsVariants}
                    >
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        onClick={() => navigate("/login")}
                        whileHover={{
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        Student
                      </motion.li>
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        whileHover={{
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        Teacher
                      </motion.li>
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        whileHover={{
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        Admin
                      </motion.li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>

              <motion.li variants={linkVariants} whileHover="hover">
                <NavLink
                  to="/contact-us"
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-medium" : "text-gray-700"
                  }
                >
                  Contact us
                </NavLink>
              </motion.li>

              <motion.li variants={linkVariants} whileHover="hover">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-medium" : "text-gray-700"
                  }
                >
                  About
                </NavLink>
              </motion.li>
            </ul>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              className="relative"
              animate={{ width: searchFocus ? "16rem" : "14rem" }}
              transition={{ duration: 0.3 }}
            >
              <motion.input
                type="text"
                placeholder="Search"
                className="pl-3 pr-10 py-2 border rounded-full w-full border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                animate={{
                  boxShadow: searchFocus
                    ? "0 0 0 3px rgba(59, 130, 246, 0.2)"
                    : "none",
                }}
              />
              <motion.div
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                whileHover={{ scale: 1.1, color: "#3B82F6" }}
              >
                <IoIosSearch className="text-xl" />
              </motion.div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaUserCircle className="text-3xl text-blue-600 cursor-pointer" />
            </motion.div>
          </div>

          {/* Toggle menu button for mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
            >
              {isOpen ? (
                <IoClose className="text-2xl text-blue-600" />
              ) : (
                <GiHamburgerMenu className="text-2xl text-blue-600" />
              )}
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaUserCircle className="text-3xl text-blue-600" />
            </motion.div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden absolute bg-white w-full left-0 shadow-md border-t border-gray-100 z-50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
            >
              <div className="flex flex-col p-4">
                <motion.ul className="space-y-4 mb-6">
                  <motion.li
                    whileHover={{ x: 5, color: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? "text-blue-600 font-medium" : "text-gray-700"
                      }
                    >
                      Home
                    </NavLink>
                  </motion.li>

                  <motion.li
                    whileHover={{ x: 5, color: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to="/notice"
                      className={({ isActive }) =>
                        isActive ? "text-blue-600 font-medium" : "text-gray-700"
                      }
                    >
                      Notice
                    </NavLink>
                  </motion.li>

                  <div>
                    <motion.div
                      className="flex justify-between items-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      onClick={toggleAccounts}
                    >
                      <span
                        className={
                          accountsOpen ? "text-blue-500" : "text-gray-700"
                        }
                      >
                        Accounts
                      </span>
                      <motion.span
                        animate={{ rotate: accountsOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown className="text-xs mr-1" />
                      </motion.span>
                    </motion.div>

                    <AnimatePresence>
                      {accountsOpen && (
                        <motion.ul
                          className="ml-5 mt-2 space-y-3 border-l-2 border-blue-200 pl-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.li
                            className="text-gray-600 cursor-pointer"
                            whileHover={{ color: "#3B82F6" }}
                            onClick={() => navigate("/login")}
                          >
                            Student
                          </motion.li>
                          <motion.li
                            className="text-gray-600 cursor-pointer"
                            whileHover={{ color: "#3B82F6" }}
                          >
                            Teacher
                          </motion.li>
                          <motion.li
                            className="text-gray-600 cursor-pointer"
                            whileHover={{ color: "#3B82F6" }}
                          >
                            Admin
                          </motion.li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.li
                    whileHover={{ x: 5, color: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to="/contact-us"
                      className={({ isActive }) =>
                        isActive ? "text-blue-600 font-medium" : "text-gray-700"
                      }
                    >
                      Contact us
                    </NavLink>
                  </motion.li>

                  <motion.li
                    whileHover={{ x: 5, color: "#3B82F6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to="/about"
                      className={({ isActive }) =>
                        isActive ? "text-blue-600 font-medium" : "text-gray-700"
                      }
                    >
                      About
                    </NavLink>
                  </motion.li>
                </motion.ul>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-3 pr-10 py-2 border rounded-full w-full border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <motion.div
                    className="absolute right-3 top-2.5 text-gray-500"
                    whileHover={{ scale: 1.1, color: "#3B82F6" }}
                  >
                    <IoIosSearch className="text-xl" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
