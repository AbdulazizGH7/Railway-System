import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClipboardList, FaUserCheck, FaClock, FaTrain } from "react-icons/fa";
import ActiveTrains from "../components/ActiveTrains";
import { useUser } from "../contexts/UserContext"

function HomePage() {
  const { user } = useUser(); 
  const userType = user.role;
  const isAdmin = userType === "admin";
  const navigate = useNavigate();

  const MenuCard = ({ icon: Icon, title, path, color }) => (
    <button
      onClick={() => navigate(path)}
      className={`group relative overflow-hidden ${color} text-white p-6 rounded-2xl shadow-lg 
        transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl
        flex flex-col justify-center items-center`}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="relative z-10 flex flex-col items-center">
        <Icon className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300" />
        <span className="text-2xl font-semibold tracking-wide">{title}</span>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </button>
  );
  // bg-gradient-to-br from-gray-100 to-gray-200
  return (
    <div className="min-h-screen bg-sky-800">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          {/* ActiveTrains Section */}
          <div className="w-full lg:w-4/5 xl:w-2/3">
            <div className="bg-white rounded-xl p-6 shadow-xl backdrop-blur-lg bg-opacity-90">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
                Active Trains Today
              </h2>
              <ActiveTrains />
            </div>
          </div>

          {/* Menu Cards Grid */}
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
              <MenuCard
                icon={FaBook}
                title="Booking"
                path="/booking"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              
              <MenuCard
                icon={FaClipboardList}
                title="Reservation"
                path="/reservations"
                color="bg-gradient-to-br from-green-500 to-green-600"
              />

              {isAdmin && (
                <>
                  <MenuCard
                    icon={FaClock}
                    title="Waitlist"
                    path="/WaitlistPromotion"
                    color="bg-gradient-to-br from-yellow-500 to-yellow-600"
                  />

                  <MenuCard
                    icon={FaUserCheck}
                    title="Assign Staff"
                    path="/AssignDriverPage"
                    color="bg-gradient-to-br from-red-500 to-red-600"
                  />

                  <MenuCard
                    icon={FaTrain}
                    title="Trains"
                    path="/trains"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;