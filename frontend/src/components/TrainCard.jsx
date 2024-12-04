import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrainCard({tripId ,departureTime, departureStation, arrivalTime, arrivalStation, duration }) {

    const navigate = useNavigate()

    return (
        <div className="border border-gray-300 rounded-md shadow-md p-4 w-full max-w-lg bg-white flex items-center hover:bg-gray-200 transition-all duration-300 ease-in-out cursor-pointer" onClick={() => navigate(`/reserve/${tripId}`)}>
        {/* Departure and Arrival Details */}
        <div className="flex-1">
            <div className="flex justify-between items-center">
            {/* Departure */}
            <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{departureTime}</span>
                <span className="block text-sm text-gray-500">{departureStation}</span>
            </div>

            {/* Line */}
            <div className="text-center flex-1 mt-6">
                <hr className="border-dotted border-teal-600 w-11/12 mx-4 border-2" />
            </div>

            {/* Arrival */}
            <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">{arrivalTime}</span>
                <span className="block text-sm text-gray-500">{arrivalStation}</span>
            </div>
            </div>

            {/* Duration */}
            <div className="text-center mt-1">
            <span className="text-sm text-gray-500">
                <i className="fas fa-clock mr-1"></i>{duration}
            </span>
            </div>
        </div>
        </div>
    );
}

export default TrainCard;
