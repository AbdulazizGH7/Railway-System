import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import trainService from '../components/trainService';

const EditReservationModal = ({ reservation, onClose, onSave }) => {
  const [editedReservation, setEditedReservation] = useState({
    ...reservation,
  });
  const [trains, setTrains] = useState([]);
  const [dependents, setDependents] = useState([]);

  useEffect(() => {
    // Fetch all trains when the modal is opened
    const fetchTrains = async () => {
      try {
        const fetchedTrains = await trainService.getAllTrains();
        setTrains(fetchedTrains);
      } catch (error) {
        console.error("Error fetching trains:", error);
      }
    };
    fetchTrains();

    // Update dependents when seatsNum changes
    setDependents(
      Array.from({ length: editedReservation.seatsNum - 1 }, (_, index) => ({
        firstName: '',
        lastName: '',
      }))
    );
  }, [editedReservation.seatsNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSeatsChange = (e) => {
    const { value } = e.target;
    setEditedReservation((prev) => ({
      ...prev,
      seatsNum: value,
    }));
  };

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    const newDependents = [...dependents];
    newDependents[index][name] = value;
    setDependents(newDependents);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save the updated reservation
    onSave(editedReservation, dependents);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Reservation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Train</label>
            <select
              name="trainId"
              value={editedReservation.trainId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a Train</option>
              {trains.map((train) => (
                <option key={train.id} value={train.id}>
                  {train.trainNameEng} ({train.trainNameAr})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Seats Number</label>
            <input
              type="number"
              name="seatsNum"
              value={editedReservation.seatsNum}
              onChange={handleSeatsChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Show dependents' information if more than 1 seat is selected */}
          {editedReservation.seatsNum > 1 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Dependents</h3>
              {dependents.map((dependent, index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="text"
                    name="firstName"
                    value={dependent.firstName}
                    placeholder="First Name"
                    onChange={(e) => handleDependentChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={dependent.lastName}
                    placeholder="Last Name"
                    onChange={(e) => handleDependentChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;
