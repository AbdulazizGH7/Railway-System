import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrain, FaSignOutAlt } from 'react-icons/fa'; // Importing the SignOut icon

function Navbar() {
  const navigate = useNavigate();  // Using the navigate hook

  const handleLogout = () => {
    // You can add any logout logic here, like clearing the session or token.
    navigate("/login");  // Navigates to the login page
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 flex justify-between items-center shadow-lg">
      {/* Logo with icon and text */}
      <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
        <FaTrain className="text-3xl" /> {/* Train icon */}
        Saudi Railway
      </Link>

      {/* Navigation Links */}
      <ul className="flex text-lg text-white gap-8">
        <li>
          <Link to={"/"} className="hover:text-gray-200 transition-colors duration-300">Home</Link>
        </li>
        <li>
          <Link to={"/booking"} className="hover:text-gray-200 transition-colors duration-300">Booking</Link>
        </li>
        <li>
          <Link to={"/reservations"} className="hover:text-gray-200 transition-colors duration-300">Reservation</Link>
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
