import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiPackage, FiUsers } from "react-icons/fi";

function BookingPage() {
  const { state } = useLocation(); // Get the selected trip passed from BookingPage
  const navigate = useNavigate();

  const [numSeats, setNumSeats] = useState(1);
  const [numLuggage, setNumLuggage] = useState(0);
  const [luggageWeight, setLuggageWeight] = useState(0);
  const [errors, setErrors] = useState({});

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate
    if (numSeats < 1 || numSeats > state.trip.availableSeats) {
      newErrors.numSeats = `Select between 1 and ${state.trip.availableSeats} seats.`;
    }
    if (luggageWeight < 0) {
      newErrors.luggageWeight = "Luggage weight can't be negative.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop form submission if errors
    }

    // Submit Booking
    alert(`Booking confirmed! ${numSeats} seat(s) reserved on ${state.trip.trainEng}.`);
    navigate("/");  // Navigate back after booking

  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reserve Your Seats for {state.trip.trainEng}
        </h2>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* Seats */}
          <div className="space-y-2">
            <label htmlFor="numSeats" className="block text-lg font-medium text-gray-700">
              <FiUsers className="inline-block mr-2" /> Number of Seats
            </label>
            <input
              type="number"
              id="numSeats"
              value={numSeats}
              onChange={(e) => setNumSeats(e.target.value)}
              min="1"
              max={state.trip.availableSeats}
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.numSeats && <p className="text-red-500 text-sm">{errors.numSeats}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 duration-200"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
