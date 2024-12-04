import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaClipboardList, FaUserCheck, FaClock } from 'react-icons/fa';
import ActiveTrains from '../components/ActiveTrains';

function HomePage({ userType }) {

  const isAdmin = userType === 'Admin';
  const navigate = useNavigate()

  return (
    <div className="flex mx-auto w-11/12 my-5 space-x-6">
      {/* ActiveTrains Section */}
      <div className="max-w-[600px] flex-grow mr-10">
        <ActiveTrains />
      </div>

      {/* Grid Section */}
      <div className="grid 2xl:grid-cols-4 grid-cols-2  gap-4">
        {/* Booking Button */}
        <button className="flex flex-col justify-center items-center bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 w-[400px] h-[400px]"
        onClick={() => navigate("/booking")}>
          <FaBook className="text-2xl mb-2 text-[200px]" /> 
          <span className='text-3xl'>Booking</span>
        </button>

        {/* Reservation Button */}
        <button className="flex flex-col justify-center items-center bg-green-500 text-white py-2 px-4 rounded shadow hover:bg-green-600 w-[400px] h-[400px]"
        onClick={() => navigate("/reservations")}>
          <FaClipboardList className="text-2xl mb-2 text-[200px]" />
          <span className='text-3xl'>Reservation</span>
        </button>

        {/* Waitlist Button */}
        {isAdmin && <button className="flex flex-col justify-center items-center bg-yellow-500 text-white py-2 px-4 rounded shadow hover:bg-yellow-600 w-[400px] h-[400px]"
        onClick={() => navigate("/waitlist")}>
          <FaClock className="text-2xl mb-2 text-[200px]" />
          <span className='text-3xl'>Waitlist</span>
        </button>}

        {/* Assign Staff Button */}
        {isAdmin && <button className="flex flex-col justify-center items-center bg-red-500 text-white py-2 px-4 rounded shadow hover:bg-red-600 w-[400px] h-[400px]"
        onClick={() => navigate("/assignStaff")}>
          <FaUserCheck className="text-2xl mb-2 text-[200px]" />
          <span className='text-3xl'>Assign Staff</span>
        </button>}

      </div>
    </div>
  );
}

export default HomePage;
