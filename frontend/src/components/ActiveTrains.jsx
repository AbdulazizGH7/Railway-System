import React, { useState } from 'react';
import TrainCard from './TrainCard';

function ActiveTrains() {
  const trains = [
    { trainNumber: 1, departureTime: '06:13', departureStation: 'HAF', arrivalTime: '08:40', arrivalStation: 'RYD', duration: '2h 27m' },
    { trainNumber: 2, departureTime: '07:30', departureStation: 'DAM', arrivalTime: '09:45', arrivalStation: 'RUH', duration: '2h 15m' },
    { trainNumber: 3, departureTime: '08:00', departureStation: 'HAF', arrivalTime: '10:30', arrivalStation: 'JED', duration: '2h 30m' },
    { trainNumber: 4, departureTime: '09:45', departureStation: 'JED', arrivalTime: '12:10', arrivalStation: 'MED', duration: '2h 25m' },
    { trainNumber: 5, departureTime: '11:00', departureStation: 'RUH', arrivalTime: '13:30', arrivalStation: 'DAM', duration: '2h 30m' },
    { trainNumber: 6, departureTime: '12:15', departureStation: 'MED', arrivalTime: '14:45', arrivalStation: 'RUH', duration: '2h 30m' },
  ];

  // State to manage the number of visible trains
  const [visibleCount, setVisibleCount] = useState(2);

  // Handle showing more trains
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 2); // Show 2 more trains each time
  };

  // Handle showing fewer trains
  const handleShowLess = () => {
    setVisibleCount((prevCount) => Math.max(2, prevCount - 2)); // Ensure at least 2 trains are shown
  };

  return (
    <div className="border border-gray-300 rounded-md shadow-md p-4 bg-white max-w-[900px] mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Active Trains Today</h2>
      {trains.length > 0 ? (
        <div className="overflow-hidden">
          <div className="flex flex-col space-y-6 lg:space-y-4">
            {trains.slice(0, visibleCount).map((train) => (
              <TrainCard
                key={train.trainNumber}
                tripId={train.trainNumber}
                departureTime={train.departureTime}
                departureStation={train.departureStation}
                arrivalTime={train.arrivalTime}
                arrivalStation={train.arrivalStation}
                duration={train.duration}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            {visibleCount < trains.length && (
              <button
                onClick={handleShowMore}
                className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Show More
              </button>
            )}
            {visibleCount > 2 && (
              <button
                onClick={handleShowLess}
                className="py-2 px-6 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-xl mb-4 text-gray-800 text-center h-80 p-32">There are no trains today</div>
      )}
    </div>
  );
}

export default ActiveTrains;
