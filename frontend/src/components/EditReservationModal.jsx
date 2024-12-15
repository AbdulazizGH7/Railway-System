import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import trainService from '../components/trainService';

const EditReservationModal = ({ reservation, onClose, onSave }) => {
  const [editedReservation, setEditedReservation] = useState({
    ...reservation,
    trainId: reservation.train?._id || reservation.trainId
  });
  const [trains, setTrains] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const fetchedTrains = await trainService.getAllTrains();
        setTrains(fetchedTrains);
      } catch (error) {
        setError("Failed to fetch trains");
        console.error("Error fetching trains:", error);
      }
    };
    fetchTrains();

    // Initialize dependents from existing reservation data
    if (reservation.dependents) {
      setDependents(reservation.dependents);
    } else {
      setDependents(
        Array.from({ length: editedReservation.seatsNum - 1 }, () => ({
          firstName: '',
          lastName: '',
        }))
      );
    }
  }, []);

  useEffect(() => {
    if (editedReservation.seatsNum > 1) {
      setDependents(prev => {
        const newDependents = Array.from({ length: editedReservation.seatsNum - 1 }, (_, index) => {
          return prev[index] || { firstName: '', lastName: '' };
        });
        return newDependents;
      });
    } else {
      setDependents([]);
    }
  }, [editedReservation.seatsNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    setDependents(prev => {
      const newDependents = [...prev];
      newDependents[index] = {
        ...newDependents[index],
        [name]: value,
      };
      return newDependents;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updateData = {
        trainId: editedReservation.trainId,
        seatsNum: parseInt(editedReservation.seatsNum),
        dependents: dependents
      };

      const updatedReservation = await trainService.updateReservation(
        reservation.reservationId,
        updateData
      );

      onSave(updatedReservation);
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update reservation');
      console.error('Error updating reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Reservation</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Train</label>
            <select
              name="trainId"
              value={editedReservation.trainId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Select a Train</option>
              {trains.map((train) => (
                <option key={train._id} value={train._id}>
                  {train.trainNameEng} ({train.trainNameAr}) - {train.from} to {train.to}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Seats Number (Available: {
                trains.find(t => t._id === editedReservation.trainId)?.availableSeats || 0
              })
            </label>
            <input
              type="number"
              name="seatsNum"
              value={editedReservation.seatsNum}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {editedReservation.seatsNum > 1 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Dependents</h3>
              {dependents.map((dependent, index) => (
                <div key={index} className="space-y-2 mt-2 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Dependent {index + 1}</div>
                  <input
                    type="text"
                    name="firstName"
                    value={dependent.firstName}
                    placeholder="First Name"
                    onChange={(e) => handleDependentChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={dependent.lastName}
                    placeholder="Last Name"
                    onChange={(e) => handleDependentChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !editedReservation.trainId || editedReservation.seatsNum < 1}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservationModal;