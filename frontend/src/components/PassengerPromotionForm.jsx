import React, { useState, useEffect } from 'react';
import { fetchWaitlistedPassengers, promotePassenger } from '../services/api';

const PassengerPromotionForm = ({ trainNumber, classType, onPromotion }) => {
  const [passengers, setPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [loading, setLoading] = useState(false);



  const handlePromotion = async () => {
    if (!selectedPassenger) return;
    try {
      setLoading(true);
      await promotePassenger(selectedPassenger);
      onPromotion(); // Notify parent component of successful promotion.
    } catch (error) {
      console.error('Failed to promote passenger:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Promote Waitlisted Passenger</h2>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Passenger</label>
            <select
              className="w-full border-gray-300 rounded"
              onChange={(e) => setSelectedPassenger(e.target.value)}
              value={selectedPassenger || ''}
            >
              <option value="">-- Select Passenger --</option>
              {passengers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePromotion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedPassenger || loading}
          >
            Promote Passenger
          </button>
        </>
      )}
    </div>
  );
};

export default PassengerPromotionForm;
