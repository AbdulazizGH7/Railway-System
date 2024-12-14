import React, { useState, useEffect } from "react";
import trainService from '../components/trainService';

const AssignDriverPage = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        setLoading(true);
        const trainsData = await trainService.getAllTrains();
        setTrains(trainsData);
      } catch (err) {
        console.error('Error fetching trains:', err);
        setError('Failed to load trains');
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, []);

  const filteredTrains = trains.filter((train) => {
    if (!train) return false;
    
    const matchesId = searchId === "" || train._id?.toString().includes(searchId);
    const matchesFrom = filterFrom === "" || 
      train.from?.toLowerCase().includes(filterFrom.toLowerCase());
    const matchesTo = filterTo === "" || 
      train.to?.toLowerCase().includes(filterTo.toLowerCase());
    
    return matchesId && matchesFrom && matchesTo;
  });

  const handleAssignClick = (train) => {
    setSelectedTrain(train);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading trains...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Assign Driver or Engineer</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Filter by From Station"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Filter by To Station"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {/* Train Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredTrains.map((train) => (
          <div key={train._id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">
              {train.trainNameEng}
            </h2>
            <h3 className="text-lg text-gray-600 mb-4">
              {train.trainNameAr}
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">From:</span>
                <span>{train.from}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">To:</span>
                <span>{train.to}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Date:</span>
                <span>{train.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Departure:</span>
                <span>{train.departureTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Arrival:</span>
                <span>{train.arrivalTime}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="space-y-2">
                <p className="font-medium">Current Assignments:</p>
                <p className="text-gray-600">Driver: {train.driver?.name || 'Not assigned'}</p>
                <p className="text-gray-600">Engineer: {train.engineer?.name || 'Not assigned'}</p>
              </div>
            </div>

            <button
              onClick={() => handleAssignClick(train)}
              className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {train.driver || train.engineer ? 'Update Assignment' : 'Assign Staff'}
            </button>
          </div>
        ))}
        
        {filteredTrains.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No trains found matching the criteria.
          </p>
        )}
      </div>

      {/* Assignment Modal */}
      {isModalOpen && selectedTrain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              Assign Staff to {selectedTrain.trainNameEng}
            </h2>
            
            {/* Current Assignments */}
            <div className="mb-4 p-2 bg-gray-50 rounded">
              <p className="text-sm">
                <strong>Current Driver:</strong>{' '}
                {selectedTrain.driver?.name || 'Not assigned'}
              </p>
              <p className="text-sm">
                <strong>Current Engineer:</strong>{' '}
                {selectedTrain.engineer?.name || 'Not assigned'}
              </p>
            </div>

            {/* Staff Selection */}
            {/* Add your driver/engineer selection dropdowns here */}

            {/* Modal Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add your assignment logic here
                  setIsModalOpen(false);
                }}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDriverPage;