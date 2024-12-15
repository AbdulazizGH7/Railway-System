import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClipboardList, FaUserCheck, FaClock } from "react-icons/fa";
import ActiveTrains from "../components/ActiveTrains";
import { useUser } from "../contexts/UserContext"

function HomePage() {
  
  const { user } = useUser(); 
  const userType=user.role;
  const isAdmin = userType === "admin";

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-7xl mx-auto my-6 px-4">
        {/* Flex container for layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* ActiveTrains Section on the Left */}
          <div className="w-full lg:w-4/5 xl:w-2/3">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-center">Active Trains Today</h2>
              <ActiveTrains />
            </div>
          </div>

          {/* Right Side (Cards in 2x2 Grid) */}
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <div className="grid grid-cols-2 gap-6">
              {/* Booking Card */}
              <button
                className="flex flex-col justify-center items-center bg-blue-500 text-white py-10 px-6 rounded-2xl shadow-lg hover:scale-105 transform transition ease-in-out duration-300"
                onClick={() => navigate("/booking")}
              >
                <FaBook className="text-5xl mb-4" />
                <span className="text-2xl font-semibold">Booking</span>
              </button>

              {/* Reservation Card */}
              <button
                className="flex flex-col justify-center items-center bg-green-500 text-white py-10 px-6 rounded-2xl shadow-lg hover:scale-105 transform transition ease-in-out duration-300"
                onClick={() => navigate("/reservations")}
              >
                <FaClipboardList className="text-5xl mb-4" />
                <span className="text-2xl font-semibold">Reservation</span>
              </button>

              {/* Waitlist Card (Admin Only) */}
              {isAdmin && (
                <button
                  className="flex flex-col justify-center items-center bg-yellow-500 text-white py-10 px-6 rounded-2xl shadow-lg hover:scale-105 transform transition ease-in-out duration-300"
                  onClick={() => navigate("/WaitlistPromotion")}
                >
                  <FaClock className="text-5xl mb-4" />
                  <span className="text-2xl font-semibold">Waitlist</span>
                </button>
              )}

              {/* Assign Staff Card (Admin Only) */}
              {isAdmin && (
                <button
                  className="flex flex-col justify-center items-center bg-red-500 text-white py-10 px-6 rounded-2xl shadow-lg hover:scale-105 transform transition ease-in-out duration-300"
                  onClick={() => navigate("/AssignDriverPage")}
                >
                  <FaUserCheck className="text-5xl mb-4" />
                  <span className="text-2xl font-semibold">Assign Staff</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
