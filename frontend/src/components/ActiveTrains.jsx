import React, { useState, useEffect } from 'react';
import axios from 'axios'
import TrainCard from './TrainCard';
import Spinner from './Spinner';

function ActiveTrains() {

  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() =>{
    try{
      axios.get("http://localhost:8000/api/trains/today")
      .then((response) =>{
        setTrains(response.data)
      })
    }
    catch(err){
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  }, [])

  // Handle showing more trains
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 2); // Show 2 more trains each time
  };

  // Handle showing fewer trains
  const handleShowLess = () => {
    setVisibleCount((prevCount) => Math.max(2, prevCount - 2)); // Ensure at least 2 trains are shown
  };

  return (
    <>
    <button className='bg-black p-60' onClick={() => console.log(trains)}>ff</button>
    <Spinner loading={loading}/>
    <div className="border border-gray-300 rounded-md shadow-md p-4 bg-white max-w-[900px] mx-auto">
      
      {trains.length > 0 ? (
        <div className="overflow-hidden">
          <div className="flex flex-col space-y-6 lg:space-y-4">
            {trains.slice(0, visibleCount).map((train) => (
              <TrainCard
                key={train._id}
                tripId={train._id}
                departureTime={train.departure}
                departureStation={train.from}
                arrivalTime={train.arrival}
                arrivalStation={train.to}
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
    </>
  );
}

export default ActiveTrains;
