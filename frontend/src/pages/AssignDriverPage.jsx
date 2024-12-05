import React, { useState } from "react";

const AssignDriverPage = () => {
  // Sample train data
  const initialTrains = [
    { id: "101", from: "HAF", to: "RYD", date: "2023-12-05", departureTime: "06:13", arrivalTime: "08:40", driverAssigned: false },
    { id: "102", from: "DAM", to: "RUH", date: "2023-12-05", departureTime: "07:30", arrivalTime: "09:45", driverAssigned: false },
    { id: "103", from: "HAF", to: "JED", date: "2023-12-05", departureTime: "08:00", arrivalTime: "10:30", driverAssigned: false },
    { id: "104", from: "JED", to: "MED", date: "2023-12-05", departureTime: "09:45", arrivalTime: "12:10", driverAssigned: false },
    { id: "105", from: "RUH", to: "DAM", date: "2023-12-05", departureTime: "11:00", arrivalTime: "13:30", driverAssigned: false },
  ];

  // Driver/Engineer options (can be dynamically fetched from an API in a real-world app)
  const drivers = [
    { id: "D1", name: "John Doe" },
    { id: "D2", name: "Jane Smith" },
    { id: "D3", name: "Robert Johnson" },
  ];

  const [searchId, setSearchId] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [selectedTrain, setSelectedTrain] = useState(null); // Train for which driver/engineer is being assigned
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [selectedDriver, setSelectedDriver] = useState(null); // Selected driver/engineer
  const [trains, setTrains] = useState(initialTrains); // Stores train data and manages assignments

  // Filtered trains based on search and filters
  const filteredTrains = trains.filter(
    (train) =>
      (searchId === "" || train.id.includes(searchId)) &&
      (filterFrom === "" || train.from === filterFrom) &&
      (filterTo === "" || train.to === filterTo)
  );

  // Handle open modal
  const handleAssignClick = (train) => {
    setSelectedTrain(train);
    setIsModalOpen(true);
  };

  // Handle assigning driver
  const handleAssignDriver = () => {
    if (selectedDriver) {
      alert(`Driver/Engineer ${selectedDriver.name} assigned to Train ${selectedTrain.id}`);
      
      // Mark the train as having a driver assigned
      setTrains(prevTrains =>
        prevTrains.map(train =>
          train.id === selectedTrain.id ? { ...train, driverAssigned: true } : train
        )
      );

      // Close modal and reset selected driver
      setIsModalOpen(false);
      setSelectedDriver(null);
    } else {
      alert("Please select a driver/engineer");
    }
  };

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

      {/* Train Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredTrains
          .filter((train) => !train.driverAssigned) // Only show trains that have no driver assigned
          .map((train) => (
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
              </div>
              <button
                onClick={() => handleAssignClick(train)}
                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Assign Driver/Engineer
              </button>
            </div>
          ))}
        {filteredTrains.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No trains match the criteria.</p>
        )}
      </div>

      {/* Modal for Assigning Driver/Engineer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Assign Driver/Engineer to Train {selectedTrain.id}</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Select Driver/Engineer:</label>
              <select
                value={selectedDriver ? selectedDriver.id : ""}
                onChange={(e) => setSelectedDriver(drivers.find((driver) => driver.id === e.target.value))}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select a driver/engineer</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDriver}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignDriverPage;
