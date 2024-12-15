
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTrain, 
  FaClock, 
  FaCalendarAlt, 
  FaChair,
  FaChartLine 
} from 'react-icons/fa';
import { MdOutlineSwapHoriz } from 'react-icons/md';
import moment from 'moment';
import { useUser } from "../contexts/UserContext";

const TripCard = ({ trip, onReserve }) => {
console.log('Trip data:', {
  totalSeats: trip.totalSeats,
  availableSeats: trip.availableSeats,
  type: {
    totalSeats: typeof trip.totalSeats,
    availableSeats: typeof trip.availableSeats
  }
});
    const { user } = useUser();
    const navigate = useNavigate();
    
    const duration = moment.duration(
      moment(trip.arrivalTime, 'HH:mm').diff(moment(trip.departureTime, 'HH:mm'))
    );
console.log(trip.totalSeats)
console.log(trip.availableSeats)

    // Calculate load factor
    // Add a check to prevent NaN
const loadFactor = trip.totalSeats && trip.availableSeats !== undefined
? ((trip.totalSeats - trip.availableSeats) / trip.totalSeats * 100).toFixed(1)
: 0;
    
    const handleReserveClick = () => {
      console.log('Trip object:', trip);
      
      if (!trip._id) {
        console.error('No train ID found:', trip);
        return;
      }
      
      navigate(`/reserve/${trip._id}`);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FaTrain className="text-2xl text-blue-500" />
            <span className="font-semibold text-gray-700">{trip.trainNameEng}</span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {`${duration.hours()}h ${duration.minutes()}m`}
          </span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between relative">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full z-10"></div>
                <div className="mt-2 text-center">
                  <p className="font-bold text-gray-800">{trip.from}</p>
                  <p className="text-sm text-gray-500">{trip.departureTime}</p>
                </div>
              </div>
            
              <div className="absolute left-0 right-0 top-2 h-0.5 bg-gray-300" style={{ zIndex: 1 }}>
                <MdOutlineSwapHoriz className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 text-2xl text-blue-500 bg-white" />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full z-10"></div>
                <div className="mt-2 text-center">
                  <p className="font-bold text-gray-800">{trip.to}</p>
                  <p className="text-sm text-gray-500">{trip.arrivalTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-400" />
              <span className="text-sm text-gray-600">{trip.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaClock className="text-gray-400" />
              <span className="text-sm text-gray-600">{`${duration.hours()}h ${duration.minutes()}m`}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaChair className="text-gray-400" />
              <span className={`text-sm ${
                trip.availableSeats === 0 ? 'text-red-600' : 
                trip.availableSeats <= 5 ? 'text-red-600' : 
                trip.availableSeats <= 10 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {trip.availableSeats <= 0 ? 'No seats available' : `${trip.availableSeats} seats`}
              </span>
            </div>
            
            {/* Load Factor for Admin Users */}
            {user?.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <FaChartLine className="text-gray-400" />
                <span className={`text-sm ${
                  loadFactor > 90 ? 'text-red-600' :
                  loadFactor > 70 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {`${loadFactor}% occupied`}
                </span>
              </div>
            )}
          </div>

          <button 
            onClick={handleReserveClick}
            className={`px-6 py-2 ${
              trip.availableSeats <= 0 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-md transition-colors duration-200 text-sm font-medium flex items-center`}
          >
            {trip.availableSeats <= 0 ? 'Join Wait List' : 'Reserve'}
          </button>
        </div>
      </div>
    );
};

export default TripCard;