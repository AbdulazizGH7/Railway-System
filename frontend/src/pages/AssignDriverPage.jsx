import React, { useState } from "react";

const AssignDriverPage = () => {
  // Sample train data with current driver and engineer fields
  const initialTrains = [
    { 
      id: "101", 
      from: "HAF", 
      to: "RYD", 
      date: "2023-12-05", 
      departureTime: "06:13", 
      arrivalTime: "08:40", 
      driverAssigned: false,
      currentDriver: null,
      currentEngineer: null 
    },
    { 
      id: "102", 
      from: "DAM", 
      to: "RUH", 
      date: "2023-12-05", 
      departureTime: "07:30", 
      arrivalTime: "09:45", 
      driverAssigned: false,
      currentDriver: null,
      currentEngineer: null 
    },
    { 
      id: "103", 
      from: "HAF", 
      to: "JED", 
      date: "2023-12-05", 
      departureTime: "08:00", 
      arrivalTime: "10:30", 
      driverAssigned: false,
      currentDriver: null,
      currentEngineer: null 
    },
    { 
      id: "104", 
      from: "JED", 
      to: "MED", 
      date: "2023-12-05", 
      departureTime: "09:45", 
      arrivalTime: "12:10", 
      driverAssigned: false,
      currentDriver: null,
      currentEngineer: null 
    },
    { 
      id: "105", 
      from: "RUH", 
      to: "DAM", 
      date: "2023-12-05", 
      departureTime: "11:00", 
      arrivalTime: "13:30", 
      driverAssigned: false,
      currentDriver: null,
      currentEngineer: null 
    },
  ];

  // Driver/Engineer options
  const drivers = [
    { id: "D1", name: "Hammad ali" },
    { id: "D2", name: "haya alshaabee" },
    { id: "D3", name: "Mike tyson" },
  ];

  const engineers = [
    { id: "E1", name: "Abdulaziz alghadeer" },
    { id: "E2", name: "Bob Martin" },
    { id: "E3", name: "Charlie Clark" },
  ];

  const notAssignedStyle = "text-red-600 font-medium";

  // State management
  const [searchId, setSearchId] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [trains, setTrains] = useState(initialTrains);

  // Filter trains based on search criteria
  const filteredTrains = trains.filter(
    (train) =>
      (searchId === "" || train.id.includes(searchId)) &&
      (filterFrom === "" || train.from === filterFrom) &&
      (filterTo === "" || train.to === filterTo)
  );

  // Handle opening the assignment modal
  const handleAssignClick = (train) => {
    setSelectedTrain(train);
    setSelectedDriver(train.currentDriver);
    setSelectedEngineer(train.currentEngineer);
    setIsModalOpen(true);
  };

  // Handle the assignment/update of driver and engineer
  const handleAssignDriverEngineer = () => {
    if (selectedDriver || selectedEngineer) {
      setTrains(prevTrains =>
        prevTrains.map(train =>
          train.id === selectedTrain.id 
            ? { 
                ...train, 
                driverAssigned: true,
                currentDriver: selectedDriver || train.currentDriver,
                currentEngineer: selectedEngineer || train.currentEngineer
              } 
            : train
        )
      );

      alert(`Assignment updated for Train ${selectedTrain.id}`);
      setIsModalOpen(false);
      setSelectedDriver(null);
      setSelectedEngineer(null);
    } else {
      alert("Please select at least a driver or engineer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Assign Driver or Engineer</h1>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <select
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Filter by From</option>
            {[...new Set(initialTrains.map((train) => train.from))].map((fromStation) => (
              <option key={fromStation} value={fromStation}>
                {fromStation}
              </option>
            ))}
          </select>
          <select
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Filter by To</option>
            {[...new Set(initialTrains.map((train) => train.to))].map((toStation) => (
              <option key={toStation} value={toStation}>
                {toStation}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Train Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredTrains.map((train) => (
          <div
            key={train.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">Train ID: {train.id}</h2>
              <p className="text-gray-700"><strong>From:</strong> {train.from}</p>
              <p className="text-gray-700"><strong>To:</strong> {train.to}</p>
              <p className="text-gray-700"><strong>Date:</strong> {train.date}</p>
              <p className="text-gray-700"><strong>Departure:</strong> {train.departureTime}</p>
              <p className="text-gray-700"><strong>Arrival:</strong> {train.arrivalTime}</p>
              
              {/* Current Assignments Display */}
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-gray-700">
                  <strong>Current Driver:</strong>{' '}
                  <span className={!train.currentDriver ? notAssignedStyle : ""}>
                    {train.currentDriver ? train.currentDriver.name : 'Not assigned'}
                  </span>
                </p>
                <p className="text-gray-700">
                  <strong>Current Engineer:</strong>{' '}
                  <span className={!train.currentEngineer ? notAssignedStyle : ""}>
                    {train.currentEngineer ? train.currentEngineer.name : 'Not assigned'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAssignClick(train)}
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {train.driverAssigned ? 'Change Assignment' : 'Assign Driver/Engineer'}
            </button>
          </div>
        ))}
        {filteredTrains.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No trains match the criteria.</p>
        )}
      </div>

      {/* Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedTrain.driverAssigned ? 'Update Assignment' : 'Assign Driver/Engineer'}
            </h2>
            
            {/* Current Assignments in Modal */}
            <div className="mb-4 p-2 bg-gray-50 rounded">
              <p className="text-sm">
                <strong>Current Driver:</strong>{' '}
                <span className={!selectedTrain.currentDriver ? notAssignedStyle : ""}>
                  {selectedTrain.currentDriver ? selectedTrain.currentDriver.name : 'Not assigned'}
                </span>
              </p>
              <p className="text-sm">
                <strong>Current Engineer:</strong>{' '}
                <span className={!selectedTrain.currentEngineer ? notAssignedStyle : ""}>
                  {selectedTrain.currentEngineer ? selectedTrain.currentEngineer.name : 'Not assigned'}
                </span>
              </p>
            </div>

            {/* Driver Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Select Driver:</label>
              <select
                value={selectedDriver ? selectedDriver.id : ""}
                onChange={(e) => setSelectedDriver(drivers.find((driver) => driver.id === e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Engineer Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Select Engineer:</label>
              <select
                value={selectedEngineer ? selectedEngineer.id : ""}
                onChange={(e) => setSelectedEngineer(engineers.find((engineer) => engineer.id === e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select an engineer</option>
                {engineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDriverEngineer}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {selectedTrain.driverAssigned ? 'Update' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDriverPage;