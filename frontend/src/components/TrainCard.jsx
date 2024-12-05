import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrainCard({tripId ,departureTime, departureStation, arrivalTime, arrivalStation, duration }) {

    const navigate = useNavigate()

    return (<div className="border border-gray-300 rounded-md shadow-md p-4 bg-white flex flex-col items-center justify-center hover:bg-gray-200 transition-all duration-300 ease-in-out cursor-pointer"onClick={() => navigate(`/reserve/${tripId}`)}>
  <div className="flex flex-col space-y-4 w-full text-center">
    <div className="flex justify-between items-center">
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800">{departureTime}</span>
        <span className="block text-sm text-gray-500">{departureStation}</span>
      </div>
      <div className="text-center flex-1 mt-6">
        <hr className="border-dotted border-teal-600 w-11/12 mx-4 border-2" />
      </div>
      <div className="text-center">
        <span className="block text-2xl font-bold text-gray-800">{arrivalTime}</span>
        <span className="block text-sm text-gray-500">{arrivalStation}</span>
      </div>
    </div>
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