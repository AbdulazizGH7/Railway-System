import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";

import { useUser } from "../contexts/UserContext"

function BookingPage() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser(); // Get user from context

  const [numSeats, setNumSeats] = useState(1);
  const [dependents, setDependents] = useState([{ firstName: "", lastName: "" }]);
  const [errors, setErrors] = useState({});
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const updatedDependents = Array.from({ length: numSeats - 1 }, () => ({
      firstName: "",
      lastName: "",
    }));
    setDependents(updatedDependents);
  }, [numSeats]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate dependents if seats > 1
    if (numSeats > 1) {
      dependents.forEach((dep, index) => {
        if (!dep.firstName || !dep.lastName) {
          newErrors[`dependent${index + 2}`] = "Both first and last names are required.";
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBookingStatus("Processing your reservation...");

    try {
      // Create reservation payload matching API requirements
      const reservationData = {
        user: user, // Send authenticated user
        trainId,
        seatsNum: numSeats,
        dependents: numSeats > 1 ? dependents : [] // Only send dependents if more than 1 seat
      };

      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Reservation failed');
      }

      // Handle different reservation statuses
      if (data.reservation.status === 'waitlisted') {
        setBookingStatus("Your reservation has been waitlisted.");
        alert("All seats are currently taken. Your reservation has been added to the waitlist.");
      } else if (data.reservation.status === 'pending') {
        setBookingStatus("Your reservation is pending confirmation.");
        alert("Your reservation is pending confirmation.");
      }

      // Navigate to reservations page after short delay
      setTimeout(() => {
        navigate("/reservations");
      }, 2000);
      
    } catch (error) {
      console.error('Reservation error:', error);
      setBookingStatus(error.message || "Reservation failed. Please try again.");
    }
  };

  const handleDependentChange = (index, field, value) => {
    const updatedDependents = [...dependents];
    updatedDependents[index][field] = value;
    setDependents(updatedDependents);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-2xl transition-all transform hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Make Your Reservation
        </h2>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          {/* Number of Seats */}
          <div className="space-y-2">
            <label htmlFor="numSeats" className="block text-lg font-medium text-gray-700">
              <FiUsers className="inline-block mr-2 text-blue-600" /> Number of Seats
            </label>
            <input
              type="number"
              id="numSeats"
              value={numSeats}
              onChange={(e) => setNumSeats(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              required
              className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
            />
            {errors.numSeats && <p className="text-red-500 text-sm mt-1">{errors.numSeats}</p>}
          </div>

          {/* Dependents Information */}
          {numSeats > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Additional Passengers</h3>
              {dependents.map((dependent, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={dependent.firstName}
                      onChange={(e) => handleDependentChange(index, "firstName", e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={dependent.lastName}
                      onChange={(e) => handleDependentChange(index, "lastName", e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none transform hover:scale-105 duration-200"
                    />
                  </div>
                  {errors[`dependent${index + 2}`] && (
                    <p className="text-red-500 text-sm">{errors[`dependent${index + 2}`]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 duration-200"
          >
            Submit Reservation
          </button>
        </form>

        {/* Booking Status Message */}
        {bookingStatus && (
          <div className="mt-6 text-center text-lg font-medium text-gray-800">
            {bookingStatus}
          </div>
        )}
      </div>
    </div></>
  );
}

export default BookingPage;