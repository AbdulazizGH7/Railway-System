import React, { useState, useEffect } from "react";
import axios from 'axios';
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
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [staffList, setStaffList] = useState({ drivers: [], engineers: [] });

  const fetchStaff = async () => {
    try {
        console.log('Fetching staff...');
        const response = await axios.get("http://localhost:8000/api/users/staff");
        console.log('Staff response:', response.data);
      
        if (!response.data.success) {
            throw new Error('Failed to fetch staff data');
        }
      
        const processedStaffList = {
            drivers: response.data.drivers || [],
            engineers: response.data.engineers || []
        };
      
        console.log('Processed staff list:', processedStaffList);
      
        if (processedStaffList.drivers.length === 0 && processedStaffList.engineers.length === 0) {
            console.warn('No staff members found');
        }
      
        setStaffList(processedStaffList);
        setError(null);
    } catch (error) {
        console.error('Detailed error in fetchStaff:', error);
        console.error('Error response:', error.response?.data);
        setError(`Failed to load staff members: ${error.message}`);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          trainService.getAllTrains().then(data => setTrains(data)),
          fetchStaff()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignment = async () => {
    try {
        const response = await axios.put(
            `http://localhost:8000/api/trains/assign-staff/${selectedTrain._id}`,
            {
                driverId: selectedDriver || undefined,
                engineerId: selectedEngineer || undefined
            }
        );

        if (response.data.success) {
            // Fetch updated trains data to ensure we have the latest information
            const updatedTrainsData = await trainService.getAllTrains();
            setTrains(updatedTrainsData);
            
            setIsModalOpen(false);
            setSelectedDriver("");
            setSelectedEngineer("");
            setError(null); // Clear any existing errors
        }
    } catch (error) {
        console.error('Error assigning staff:', error);
        setError('Failed to assign staff');
    }
};

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

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Assign Driver or Engineer</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Train ID</label>
              <input
                type="text"
                placeholder="Search by ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Station</label>
              <input
                type="text"
                placeholder="Filter by From Station"
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Station</label>
              <input
                type="text"
                placeholder="Filter by To Station"
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Train Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrains.map((train) => (
            <div key={train._id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{train.trainNameEng}</h2>
                  <h3 className="text-lg text-gray-600">{train.trainNameAr}</h3>
                </div>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100">
                  ID: {train._id.slice(-6)}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{train.from}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{train.to}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(train.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">{train.departureTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Arrival:</span>
                  <span className="font-medium">{train.arrivalTime}</span>
                </div>
              </div>
{/* Current Staff Display */}
<div className="mt-4 space-y-2">
    <h3 className="font-medium text-gray-700">Current Staff</h3>
    <div className="text-sm">
        <p>Driver: {
            train.assignedStaff?.driver 
                ? `${train.assignedStaff.driver.firstName} ${train.assignedStaff.driver.lastName}`
                : 'Not assigned'
        }</p>
        <p>Engineer: {
            train.assignedStaff?.engineer 
                ? `${train.assignedStaff.engineer.firstName} ${train.assignedStaff.engineer.lastName}`
                : 'Not assigned'
        }</p>
    </div>
</div>

              <button
                onClick={() => handleAssignClick(train)}
                className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                          transition duration-200 ease-in-out focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:ring-opacity-50"
              >
                {train.assignedStaff?.driver || train.assignedStaff?.engineer ? 
                  'Update Assignment' : 'Assign Staff'}
              </button>
            </div>
          ))}

          {filteredTrains.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No trains found matching the criteria.</p>
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {isModalOpen && selectedTrain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-4">
                Assign Staff to Train
              </h2>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Train Details</h3>
                <p className="text-sm text-gray-600">ID: {selectedTrain._id}</p>
                <p className="text-sm text-gray-600">Name: {selectedTrain.trainNameEng}</p>
                <p className="text-sm text-gray-600">Route: {selectedTrain.from} → {selectedTrain.to}</p>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current Assignments</h3>
                <p className="text-sm text-gray-600">
                  <strong>Driver:</strong>{' '}
                  {selectedTrain.assignedStaff?.driver ? 
                    `${selectedTrain.assignedStaff.driver.firstName} ${selectedTrain.assignedStaff.driver.lastName}` : 
                    'Not assigned'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Engineer:</strong>{' '}
                  {selectedTrain.assignedStaff?.engineer ? 
                    `${selectedTrain.assignedStaff.engineer.firstName} ${selectedTrain.assignedStaff.engineer.lastName}` : 
                    'Not assigned'}
                </p>
              </div>

              {/* Driver Selection */}
<div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Driver
    </label>
    <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
    >
        <option value="">-- Select Driver --</option>
        {staffList.drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
                {driver.firstName} {driver.lastName}
            </option>
        ))}
    </select>
</div>

{/* Engineer Selection */}
<div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Engineer
    </label>
    <select
        value={selectedEngineer}
        onChange={(e) => setSelectedEngineer(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
    >
        <option value="">-- Select Engineer --</option>
        {staffList.engineers.map((engineer) => (
            <option key={engineer._id} value={engineer._id}>
                {engineer.firstName} {engineer.lastName}
            </option>
        ))}
    </select>
</div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedDriver("");
                    setSelectedEngineer("");
                  }}
                  className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 
                            transition duration-200 ease-in-out focus:outline-none focus:ring-2 
                            focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignment}
                  disabled={!selectedDriver && !selectedEngineer}
                  className={`py-2 px-4 text-white rounded-lg transition duration-200 ease-in-out 
                            focus:outline-none focus:ring-2 focus:ring-opacity-50 
                            ${(!selectedDriver && !selectedEngineer)
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}`}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignDriverPage;