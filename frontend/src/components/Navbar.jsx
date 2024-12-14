import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrain, FaSignOutAlt, FaBars } from 'react-icons/fa';
import {useUser} from '../contexts/UserContext'

function Navbar() {
  const {logout} = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // State for managing mobile menu
  const navigate = useNavigate();  // Using the navigate hook

  const handleLogout = () => {
    navigate("/login");
    logout()  // Navigates to the login page
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);  // Toggle the menu visibility on small screens
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 flex justify-between items-center shadow-lg">
      {/* Logo with icon and text */}
      <Link to="/home" className="flex items-center gap-3 text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
        <FaTrain className="text-3xl" /> {/* Train icon */}
        Saudi Railway
      </Link>

      {/* Hamburger Icon for Mobile */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="text-white text-3xl">
          <FaBars />  {/* Hamburger icon */}
        </button>
      </div>

      {/* Navigation Links */}
      <ul className={`lg:flex lg:gap-8 text-lg text-white gap-8 ${isMenuOpen ? "flex" : "hidden"} flex-col lg:flex-row`}>
        <li>
          <Link to={"/home"} className="hover:text-gray-200 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to={"/booking"} className="hover:text-gray-200 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Booking</Link>
        </li>
        <li>
          <Link to={"/reservations"} className="hover:text-gray-200 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>Reservation</Link>
        </li>
        <li>
          <button 
            onClick={handleLogout}  // Adding the onClick event to handle logout
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-300"
          >
            <FaSignOutAlt className="text-2xl" /> {/* Logout icon */}
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
