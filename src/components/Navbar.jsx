import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSearch } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";
import Swal from "sweetalert2";
// import logo from "/images/Logo.svg";
import logo from "/images/Ecollgelogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set loading state
    setIsLoading(true);

    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserProfile(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }

    // Simulate network delay for demonstration purposes
    // In a real app, this would be the actual loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleAccounts = () => setAccountsOpen(!accountsOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  // Animation variants
  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const hoverVariants = {
    hover: { scale: 1.05, color: "#3B82F6", transition: { duration: 0.2 } },
  };

  const linkVariants = {
    hover: { color: "#3B82F6", transition: { duration: 0.2 } },
  };

  const logoVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  // Loading animation for profile spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const handleSignOut = () => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear local storage
        localStorage.removeItem("user");
        setUserProfile(null);

        // Show success message
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect to home or login page
        navigate("/");
        // Close the dropdown
        setUserMenuOpen(false);
      }
    });
  };

  const handleDashboard = () => {
    if (userProfile && userProfile.role === "student") {
      navigate("/student-profile");
    }
    setUserMenuOpen(false);
  };

  const renderProfileImage = () => {
    // Show loading spinner while loading
    if (isLoading) {
      return (
        <motion.div
          className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
          variants={spinnerVariants}
          animate="animate"
        >
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </motion.div>
      );
    }

    // Show user profile after loading
    if (userProfile && userProfile.pic) {
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer relative"
          onClick={toggleUserMenu}
        >
          <img
            src={userProfile.pic}
            alt={userProfile.name || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />

          {/* User dropdown menu */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-1000"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={dropdownVariants}
              >
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">
                    {userProfile.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {userProfile.email}
                  </p>
                </div>

                <div className="py-2">
                  <motion.div
                    className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer"
                    onClick={handleDashboard}
                    whileHover={{
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                    }}
                  >
                    <MdDashboard className="mr-3 text-lg" />
                    <span>Dashboard</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer"
                    onClick={handleSignOut}
                    whileHover={{
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                    }}
                  >
                    <MdLogout className="mr-3 text-lg" />
                    <span>Sign out</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    } else {
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login", { replace: true })}
        >
          <FaUserCircle className="text-3xl text-blue-600 cursor-pointer" />
        </motion.div>
      );
    }
  };

  return (
    <div className="sticky top-0  bg-white shadow-md z-1000">
      <div className="relative py-2 px-4 lg:px-8">
        {/* Desktop view */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={logoVariants.hover}
            className="flex items-center"
            onClick={() => navigate("/")}
          >
            <div className="flex-shrink-0 cursor-pointer overflow-hidden">
              {/* Responsive logo sizing */}
              <img
                src={logo}
                alt="ECollege Logo"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain rounded-full"
              />
            </div>
          </motion.div>

          <div className="hidden md:flex flex-1 justify-center">
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
                      variants={dropdownVariants}
                    >
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        onClick={() => {
                          navigate("/login");
                          toggleAccounts();
                        }}
                        whileHover={{
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        Student
                      </motion.li>
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        onClick={() => {
                          navigate("/teacher-login");
                          toggleAccounts();
                        }}
                        whileHover={{
                          backgroundColor: "#EFF6FF",
                          color: "#2563EB",
                        }}
                      >
                        Teacher
                      </motion.li>
                      <motion.li
                        className="px-4 py-3 hover:bg-blue-50 text-gray-700 cursor-pointer"
                        onClick={() => {
                          navigate("/admin-login");
                          toggleAccounts();
                        }}
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
            {renderProfileImage()}
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
            {renderProfileImage()}
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
                    onClick={() => {
                      toggleMenu();
                    }}
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
                    onClick={() => {
                      toggleMenu();
                    }}
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
                            onClick={() => {
                              toggleAccounts();
                              toggleMenu();
                              navigate("/login");
                            }}
                          >
                            Student
                          </motion.li>
                          <motion.li
                            className="text-gray-600 cursor-pointer"
                            onClick={() => {
                              toggleAccounts();
                              toggleMenu();
                              navigate("/teacher-login");
                            }}
                            whileHover={{ color: "#3B82F6" }}
                          >
                            Teacher
                          </motion.li>
                          <motion.li
                            className="text-gray-600 cursor-pointer"
                            onClick={() => {
                              toggleAccounts();
                              toggleMenu();
                              navigate("/admin-login");
                            }}
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
                    onClick={() => {
                      toggleMenu();
                    }}
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
                    onClick={() => {
                      toggleMenu();
                    }}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
